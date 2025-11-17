"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Admin Card Grid — Applications by Job (Upgraded)
 *
 * - Card grid of jobs
 * - Top stats
 * - Search & filters
 * - Modal with applicants table & job-level export
 * - Export All (Excel)
 * - Added: "View Full Applications" top-right button (links to /jobs/admin/export-view)
 */

// small util: format date nicely
const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

// Export helper: generic rows -> excel file
const exportRowsToExcel = (rows, filename = "export.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};

export default function AdminJobsCardGrid() {
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState([]); // from /applications/by-job (grouped by job)
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedJob, setSelectedJob] = useState(null); // job group object
  const [modalOpen, setModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [withdrawLoadingId, setWithdrawLoadingId] = useState(null);
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, applicants-desc

  // fetch grouped-by-job data on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL not set.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/applications/by-job`, {
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        const data = await res.json();
        // API returns { data: [...] } per your earlier router
        const list = data.data || [];
        if (!mounted) return;
        setJobsData(list);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load applications.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // derive list of branches & years for filters from jobsData -> applications
  const { branches, years } = useMemo(() => {
    const branchSet = new Set();
    const yearSet = new Set();
    jobsData.forEach(j => {
      j.applications.forEach(a => {
        if (a.studentBranch) branchSet.add(a.studentBranch);
        if (a.studentYear) yearSet.add(String(a.studentYear));
      });
    });
    return {
      branches: Array.from(branchSet).sort(),
      years: Array.from(yearSet).sort((a,b) => Number(a) - Number(b)),
    };
  }, [jobsData]);

  // Stats computed from jobsData
  const stats = useMemo(() => {
    const totalJobs = jobsData.length;
    const totalApplications = jobsData.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
    // unique students across all jobs
    const studentIds = new Set();
    jobsData.forEach(j => {
      j.applications.forEach(a => {
        const sid = a.studentEmail || a.studentRoll || `${a.studentName || ""}-${a.appliedAt || ""}`;
        studentIds.add(sid);
      });
    });
    // job with most applicants
    let mostJob = null;
    jobsData.forEach(j => {
      const count = j.applications?.length || 0;
      if (!mostJob || count > mostJob.count) mostJob = { name: j.jobName, count };
    });
    const zeroJobs = jobsData.filter(j => (j.applications?.length || 0) === 0).length;
    return { totalJobs, totalApplications, totalStudents: studentIds.size, mostJob, zeroJobs };
  }, [jobsData]);

  // Filtering and searching on cards
  const filteredJobs = useMemo(() => {
    let list = [...jobsData];

    // Search: check jobName OR any student's name/roll/email
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j => {
        if ((j.jobName || "").toLowerCase().includes(q)) return true;
        // search inside applicants
        if (j.applications?.some(a => {
          return (a.studentName || "").toLowerCase().includes(q) ||
                 (a.studentRoll || "").toLowerCase().includes(q) ||
                 (a.studentEmail || "").toLowerCase().includes(q);
        })) return true;
        return false;
      });
    }

    // Filter by branch
    if (filterBranch !== "all") {
      list = list.filter(j => j.applications?.some(a => (a.studentBranch || "").toLowerCase() === filterBranch.toLowerCase()));
    }

    // Filter by year
    if (filterYear !== "all") {
      list = list.filter(j => j.applications?.some(a => String(a.studentYear) === String(filterYear)));
    }

    // Filter by date range (appliedAt)
    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter(j => j.applications?.some(a => new Date(a.appliedAt) >= from));
    }
    if (dateTo) {
      const to = new Date(dateTo);
      // include the day fully
      to.setHours(23,59,59,999);
      list = list.filter(j => j.applications?.some(a => new Date(a.appliedAt) <= to));
    }

    // Sorting
    if (sortBy === "recent") {
      list.sort((a,b) => new Date(b.jobCreatedAt || b.jobCreatedAt) - new Date(a.jobCreatedAt || a.jobCreatedAt));
    } else if (sortBy === "oldest") {
      list.sort((a,b) => new Date(a.jobCreatedAt || a.jobCreatedAt) - new Date(b.jobCreatedAt || b.jobCreatedAt));
    } else if (sortBy === "applicants-desc") {
      list.sort((a,b) => (b.applications?.length || 0) - (a.applications?.length || 0));
    }

    return list;
  }, [jobsData, search, filterBranch, filterYear, dateFrom, dateTo, sortBy]);

  // Open modal for a job (job object from by-job aggregation)
  const openJobModal = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  // Export job -> excel
  const exportJob = (job) => {
    // rows: each application -> include student details + job info
    const rows = (job.applications || []).map(a => ({
      "Student Name": a.studentName || "",
      "Email": a.studentEmail || "",
      "Roll Number": a.studentRoll || "",
      "Branch": a.studentBranch || "",
      "Year": a.studentYear || "",
      "Job Name": job.jobName || "",
      "Applied On": formatDate(a.appliedAt),
      "Job Link": job.jobLink || "",
    }));
    exportRowsToExcel(rows, `${(job.jobName || "job").replace(/\s+/g,"_")}_applications.xlsx`);
  };

  // Export ALL (Option A visual grouping in table but Excel is flat repeated student rows per job)
  const exportAll = async () => {
    setIsExporting(true);
    try {
      // Build rows: each application -> student + job (repeated student info per job row)
      const rows = [];
      jobsData.forEach(job => {
        (job.applications || []).forEach(app => {
          rows.push({
            "Student Name": app.studentName || "",
            "Email": app.studentEmail || "",
            "Roll Number": app.studentRoll || "",
            "Branch": app.studentBranch || "",
            "Year": app.studentYear || "",
            "Job Name": job.jobName || "",
            "Applied On": formatDate(app.appliedAt),
            "Job Link": job.jobLink || "",
          });
        });
      });
      exportRowsToExcel(rows, `all_applications.xlsx`);
    } catch (e) {
      console.error(e);
      setMessage("Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  // Withdraw handler inside modal (admin can withdraw a student's application)
  const withdrawApplication = async (jobId, studentRollOrEmail, appliedAt) => {
    if (!confirm("Withdraw this student's application? This will delete the application record.")) return;

    setWithdrawLoadingId(studentRollOrEmail + "_" + appliedAt);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/applications/delete`, { // <-- adjust server route if needed
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobLinkOrId: jobId, identifier: studentRollOrEmail, appliedAt }), // adjust body keys per backend
      });

      if (!res.ok) {
        const d = await res.json().catch(()=>({ error: "Failed" }));
        throw new Error(d.error || "Failed to withdraw");
      }

      // on success, remove from local state
      setJobsData(prev => prev.map(j => {
        if (j._id !== jobId && j.jobId !== jobId && j.jobLink !== jobId) return j;
        return { ...j, applications: (j.applications || []).filter(a => !( (a.studentRoll === studentRollOrEmail || a.studentEmail === studentRollOrEmail) && new Date(a.appliedAt).toISOString() === new Date(appliedAt).toISOString())) };
      }));

      setMessage("Application withdrawn.");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to withdraw");
    } finally {
      setWithdrawLoadingId(null);
    }
  };

  // Skeleton while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 bg-white rounded-2xl shadow border" />
            <div className="h-40 bg-white rounded-2xl shadow border" />
            <div className="h-40 bg-white rounded-2xl shadow border" />
            <div className="h-40 bg-white rounded-2xl shadow border" />
            <div className="h-40 bg-white rounded-2xl shadow border" />
            <div className="h-40 bg-white rounded-2xl shadow border" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin — Applications (Card Grid)</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Top row: title + top actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold">Applications — Job Grid</h1>
              <p className="text-gray-600 mt-1">Overview of job postings and applicants. Click a card to view applicants.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Export All */}
              <button onClick={exportAll} disabled={isExporting} className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700">
                {isExporting ? "Exporting..." : "Export All"}
              </button>

              {/* VIEW FULL APPLICATIONS button (added) */}
              <a
                href="/jobs/admin/export-view"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                title="View Full Applications"
              >
                View Full Applications
              </a>

              <a href="/jobs/admin" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Back</a>
            </div>
          </div>

          {/* Statistics bar */}
          <div className="bg-white rounded-xl shadow p-4 mb-6 border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3">
                <div className="text-xs text-gray-500">Total Jobs</div>
                <div className="text-xl font-bold">{stats.totalJobs}</div>
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">Total Students (unique)</div>
                <div className="text-xl font-bold">{stats.totalStudents}</div>
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">Total Applications</div>
                <div className="text-xl font-bold">{stats.totalApplications}</div>
              </div>
              <div className="p-3">
                <div className="text-xs text-gray-500">Jobs with 0 Applicants</div>
                <div className="text-xl font-bold">{stats.zeroJobs}</div>
              </div>
            </div>
            {stats.mostJob && (
              <div className="mt-3 text-sm text-gray-600">
                Most applied job: <strong>{stats.mostJob.name}</strong> ({stats.mostJob.count} applicants)
              </div>
            )}
          </div>

          {/* Filters & search */}
          <div className="bg-white p-4 rounded-xl border shadow mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex items-center gap-3 flex-1">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search job, student name or roll..." className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300" />

              <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="p-3 rounded-xl border">
                <option value="all">All Branches</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-3 rounded-xl border">
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} className="p-2 rounded-xl border" />
              <input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} className="p-2 rounded-xl border" />
              <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="p-3 rounded-xl border">
                <option value="recent">Newest Jobs</option>
                <option value="oldest">Oldest Jobs</option>
                <option value="applicants-desc">Most Applicants</option>
              </select>
            </div>
          </div>

          {/* Grid of job cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full bg-white p-6 rounded-xl text-center text-gray-600">No matching jobs.</div>
            ) : filteredJobs.map(job => (
              <motion.div key={job._id} layout whileHover={{ y: -6 }} className="bg-white rounded-2xl p-5 shadow border">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Posted</div>
                    <div className="text-sm text-gray-700 mb-2">{formatDate(job.jobCreatedAt || job.jobCreatedAt)}</div>

                    <h3 className="text-lg font-semibold">{job.jobName}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.jobLink || ""}</p>

                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">{(job.applications?.length || 0)} applicants</div>
                      <div className="px-3 py-1 rounded-full bg-gray-50 text-gray-700">{job.jobLink ? "External Link" : "No link"}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => openJobModal(job)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">View Applicants</button>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => exportJob(job)} className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">Export</button>
                      <a href={`/jobs/admin/edit-job/${job._id || ""}`} className="px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600">Edit</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message */}
          {message && <div className="mt-6 p-3 bg-yellow-100 text-yellow-800 rounded-md">{message}</div>}
        </div>

        {/* Modal for selected job applicants */}
        <AnimatePresence>
          {modalOpen && selectedJob && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/30" onClick={()=>{ setModalOpen(false); setSelectedJob(null); }} />

              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-50 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedJob.jobName}</h2>
                    <div className="text-sm text-gray-600 mt-1">Applicants: {selectedJob.applications?.length || 0}</div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => exportJob(selectedJob)} className="px-4 py-2 bg-green-600 text-white rounded-md">Export Job</button>
                    <button onClick={() => { window.open(selectedJob.jobLink || "#", "_blank"); }} className="px-4 py-2 bg-blue-600 text-white rounded-md">Open Link</button>
                    <button onClick={() => { setModalOpen(false); setSelectedJob(null); }} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-sm text-gray-500">#</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Student Name</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Email</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Roll</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Branch</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Year</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Applied On</th>
                        <th className="px-3 py-2 text-sm text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedJob.applications || []).map((a, idx) => (
                        <tr key={a.studentEmail + a.appliedAt} className="border-b">
                          <td className="px-3 py-2 text-sm text-gray-700">{idx + 1}</td>
                          <td className="px-3 py-2 text-sm font-medium text-gray-800">{a.studentName}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{a.studentEmail}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{a.studentRoll}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{a.studentBranch}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{a.studentYear}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{formatDate(a.appliedAt)}</td>
                          <td className="px-3 py-2 text-sm">
                            <button
                              onClick={() => withdrawApplication(selectedJob._id || selectedJob.jobId || selectedJob.jobLink, a.studentRoll || a.studentEmail, a.appliedAt)}
                              disabled={withdrawLoadingId === (a.studentRoll || a.studentEmail) + "_" + a.appliedAt}
                              className="text-red-600 hover:underline"
                            >
                              {withdrawLoadingId === (a.studentRoll || a.studentEmail) + "_" + a.appliedAt ? "Processing..." : "Withdraw"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!selectedJob.applications || selectedJob.applications.length === 0) && (
                        <tr>
                          <td colSpan={8} className="px-3 py-4 text-center text-gray-600">No applicants for this job yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
