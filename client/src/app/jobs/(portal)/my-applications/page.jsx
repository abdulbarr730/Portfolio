"use client";

import { useEffect, useState } from "react";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      // ... (existing fetchApplications logic is correct) ...
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/my-applications`, {
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.href = "/jobs/login";
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch applications");
        }
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

  // --- NEW: Handle Withdraw ---
  const handleWithdraw = async (jobId, jobName) => {
    if (!confirm(`Are you sure you want to withdraw your application for "${jobName}"?`)) {
      return;
    }
    
    setMessage(""); // Clear old messages
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/withdraw`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to withdraw");
      }

      setMessage("Application withdrawn successfully.");
      // Instantly remove it from the list
      setApplications(applications.filter(app => app.jobId?._id !== jobId));

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

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading your applications...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-600 text-lg">
          Here is a history of all the jobs you have applied to.
        </p>
      </div>

      {/* ERROR/SUCCESS MESSAGE */}
      {message && (
        <div className="max-w-5xl mx-auto mb-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* APPLICATIONS LIST */}
      <div className="max-w-5xl mx-auto">
        {applications.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-700 text-lg">
              You have not applied to any jobs yet.
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
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-lg p-6 transition"
              >
                {app.jobId ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-bold">{app.jobId.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Applied on: {formatDate(app.appliedAt)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
                        <a
                          href={app.jobId.link}
                          className="text-blue-600 underline font-medium text-center sm:text-right"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Job →
                        </a>
                        {/* --- NEW WITHDRAW BUTTON --- */}
                        <button
                          onClick={() => handleWithdraw(app.jobId._id, app.jobId.name)}
                          className="text-red-600 text-center sm:text-right text-sm font-medium hover:underline"
                        >
                          Withdraw Application
                        </button>
                      </div>
                    </div>
                    {app.jobId.description && (
                      <p className="text-gray-600 mt-3 pt-3 border-t">
                        {app.jobId.description}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">
                    This job is no longer listed. (Applied on: {formatDate(app.appliedAt)})
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}