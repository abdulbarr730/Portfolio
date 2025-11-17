"use client";

import { useState, useEffect } from "react";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ManageJobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  // --- 1. Fetch All Jobs on Load ---
  useEffect(() => {
    const fetchJobs = async () => {
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/jobs/all`, {
          credentials: "include", // Sends the admin login cookie
        });

        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch jobs.");
        }
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // --- 2. Handle Job Deletion ---
  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }

    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete job.");
      }

      setMessage("Job deleted successfully.");
      // Remove the job from the UI instantly
      setJobs(jobs.filter(job => job._id !== jobId));

    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading Jobs...
      </div>
    );
  }

  return (
    // The main admin layout (layout.jsx) handles the sidebar
    // This component just needs to render its content
    <>
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Manage Jobs</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/jobs/admin/create-job"
            className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 text-center"
          >
            + Create New Job
          </a>
          <a
            href="/jobs/admin"
            className="bg-gray-600 text-white px-5 py-2 rounded-md font-medium hover:bg-gray-700 text-center"
          >
            &larr; Back to Dashboard
          </a>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* --- Jobs List --- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4">All Job Postings ({jobs.length})</h2>
        
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs have been created yet.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-md"
              >
                {/* Job Info */}
                <div className="mb-3 sm:mb-0 max-w-lg"> {/* Added max-width to prevent overflow */}
                  <p className="font-bold text-lg">{job.name}</p>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all" // Added break-all for long links
                  >
                    {job.link}
                  </a>
                </div>
                
                {/* --- UPDATED: Action Buttons (Mobile Friendly) --- */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={`/jobs/admin/edit-job/${job._id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm font-medium text-center"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}