"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const formatYear = (year) => {
  if (year === 1 || year === "1") return "1st Year";
  if (year === 2 || year === "2") return "2nd Year";
  if (year === 3 || year === "3") return "3rd Year";
  if (year === 4 || year === "4") return "4th Year";
  return year ?? "";
};

export default function ExportViewPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllApplications = async () => {
      // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.

      try {
        // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
        const res = await fetch(`${API_BASE_URL}/api/admin/applications/all`, {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch application data.");

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        setMessage(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplications();
  }, []);

  // Group by studentId / rollNumber (one row per student)
  const grouped = applications.reduce((acc, app) => {
    const student = app.student;
    const job = app.job;
    if (!student || !job) return acc;

    const id = student.rollNumber || student.email || student._id;
    if (!acc[id]) {
      acc[id] = { student, jobs: [] };
    }
    acc[id].jobs.push({ name: job.name, link: job.link, date: app.appliedAt });
    return acc;
  }, {});

  const groupedArray = Object.values(grouped);

  // Build export that spreads jobs into multiple columns:
  const exportAllToExcel = () => {
    if (groupedArray.length === 0) {
      setMessage("No data to export.");
      return;
    }

    const maxJobs = groupedArray.reduce((mx, g) => Math.max(mx, g.jobs.length), 0);

    const rows = groupedArray.map((g) => {
      const base = {
        "Student Name": g.student.name || "",
        "Email": g.student.email || "",
        "Phone Number": g.student.phoneNumber || "",
        "Roll Number": g.student.rollNumber || "",
        "Branch": g.student.branch || "",
        "Year": formatYear(g.student.year),
      };

      for (let i = 0; i < maxJobs; i++) {
        const idx = i + 1;
        const job = g.jobs[i];
        base[`Job ${idx}`] = job ? job.name : "";
        base[`Job ${idx} Date`] = job ? new Date(job.date).toLocaleDateString() : "";
        base[`Job ${idx} Link`] = job ? job.link : "";
      }

      return base;
    });

    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
    
    const defaultCols = [
      { wch: 28 }, // Student Name
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 14 }, // Roll
      { wch: 14 }, // Branch
      { wch: 10 }, // Year
    ];
    const jobCols = new Array(maxJobs * 3).fill({ wch: 32 });
    ws["!cols"] = [...defaultCols, ...jobCols];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Applications");

    XLSX.writeFile(wb, "all_student_applications_by_student.xlsx");
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/60 flex justify-center items-center">
        Loading Full Application List...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/60 px-4 sm:px-6 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Full Application List (Grouped)</h1>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={exportAllToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 text-sm"
          >
            Export All (one row per student)
          </button>

          <a
            href="/jobs/admin/all-applications"
            className="bg-accent text-white px-4 py-2 rounded-md shadow hover:bg-primary text-sm"
          >
            Back to Grid →
          </a>

          <a
            href="/jobs/admin"
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary text-sm"
          >
            Back
          </a>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-ink text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* TABLE CONTAINER: ✅ Fixed height + Scrollable */}
      <div className="max-w-7xl mx-auto bg-surface rounded-2xl shadow-lg p-6 h-[80vh] flex flex-col">
        {groupedArray.length === 0 ? (
          <p className="text-secondary text-center p-10">No applications found.</p>
        ) : (
          <div className="overflow-auto flex-1 border rounded-lg">
            <table className="min-w-full divide-y divide-primary/20 relative">
              
              {/* Sticky Header */}
              <thead className="bg-muted/60 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase bg-muted/60">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase bg-muted/60">Roll</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase bg-muted/60">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase bg-muted/60">Branch & Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase bg-muted/60">Jobs Applied</th>
                </tr>
              </thead>

              <tbody className="bg-surface divide-y divide-primary/15">
                {groupedArray.map((entry) => (
                  <tr key={entry.student.rollNumber || entry.student._id} className="hover:bg-background transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-primary">{entry.student.name}</div>
                      <div className="text-sm text-secondary">{entry.student.email}</div>
                    </td>

                    <td className="px-4 py-4 text-secondary align-top">{entry.student.rollNumber}</td>

                    <td className="px-4 py-4 text-secondary align-top">{entry.student.phoneNumber || "N/A"}</td>

                    <td className="px-4 py-4 text-secondary align-top">
                      {entry.student.branch} — {formatYear(entry.student.year)}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <ul className="space-y-2">
                        {entry.jobs.map((job, i) => (
                          <li key={i} className="text-sm border-b pb-2 last:border-0 last:pb-0 border-primary/10">
                            <span className="font-medium text-primary">{job.name}</span>
                            <span className="text-secondary ml-1 text-xs">({formatDate(job.date)})</span>
                            <br />
                            {job.link && (
                              <a href={job.link} target="_blank" rel="noreferrer" className="text-accent text-xs hover:underline">
                                Open Link →
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}   