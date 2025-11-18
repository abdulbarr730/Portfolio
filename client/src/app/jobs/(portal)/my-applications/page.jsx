"use client";

import { useEffect, useState } from "react";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function MyApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  // Search + Filter
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    async function fetchApplications() {
      // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.

      try {
        // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
        const res = await fetch(`${API_BASE_URL}/api/jobs/my-applications`, {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/jobs/login";
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  // Withdraw
  const handleWithdraw = async (jobId, jobName) => {
    if (!confirm(`Withdraw your application for "${jobName}"?`)) return;

    setMessage("");

    try {
      // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
      const res = await fetch(`${API_BASE_URL}/api/jobs/withdraw`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to withdraw");

      setMessage("Application withdrawn successfully.");

      setApplications((prev) =>
        prev.filter((a) => a.jobId?._id !== jobId)
      );
    } catch (err) {
      setMessage(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filtering + Search Logic
  const filteredApps = applications.filter((app) => {
    const job = app.jobId;
    if (!job) return false;

    const matchesSearch =
      job.name.toLowerCase().includes(search.toLowerCase());

    const type = job.type || "not-specified";

    const matchesType =
      filterType === "all" || filterType === type;

    return matchesSearch && matchesType;
  });

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading your applications...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-600 text-lg">
          View and manage all the jobs you've applied for.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-5xl mx-auto mb-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* Search + Filter */}
      <div className="max-w-5xl mx-auto bg-white p-5 rounded-2xl shadow mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-gray-200">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search job titles..."
          className="w-full md:w-2/3 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 rounded-xl border border-gray-300"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="not-specified">Not Specified</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="max-w-5xl mx-auto">
        {filteredApps.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-700 text-lg">
              No applications match your filters.
            </p>
            <a
              href="/jobs"
              className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApps.map((app, index) => {
              const job = app.jobId;
              const type = job.type || "Not Specified";

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl shadow-lg p-6 transition border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                      {/* Numbering */}
                      <div className="text-gray-400 text-sm font-semibold mb-1">
                        #{index + 1}
                      </div>

                      <h3 className="text-2xl font-bold">{job.name}</h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Applied on: {formatDate(app.appliedAt)}
                      </p>

                      <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {type}
                      </span>
                    </div>

                    <div className="flex-shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
                      <a
                        href={job.link}
                        className="text-blue-600 underline font-medium text-center sm:text-right"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job →
                      </a>

                      <button
                        onClick={() =>
                          handleWithdraw(job._id, job.name)
                        }
                        className="text-red-600 text-center sm:text-right text-sm font-medium hover:underline"
                      >
                        Withdraw Application
                      </button>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-gray-600 mt-3 pt-3 border-t">
                      {job.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}