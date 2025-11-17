"use client";

import { useEffect, useState } from "react";
import Head from 'next/head'; // Added for the page title

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [message, setMessage] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  
  // --- NEW STATE FOR BUTTON FEEDBACK ---
  const [isApplying, setIsApplying] = useState(false); 

  // Fetch student details and job list
  useEffect(() => {
    async function fetchData() {
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        window.location.href = "/jobs/login";
        return;
      }

      try {
        const [meRes, jobsRes, appliedRes, myAppsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/student/me`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/jobs/all`),
          fetch(`${API_BASE_URL}/api/jobs/applied-count`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/jobs/my-applications`, { credentials: "include" })
        ]);

        if (meRes.status === 401 || appliedRes.status === 401 || myAppsRes.status === 401) {
          window.location.href = "/jobs/login";
          return;
        }

        if (!meRes.ok || !jobsRes.ok || !appliedRes.ok || !myAppsRes.ok) {
            throw new Error("One or more required API calls failed.");
        }
        
        // Parse and process data
        const [meData, jobsData, appliedData, myAppsData] = await Promise.all([
            meRes.json(),
            jobsRes.json(),
            appliedRes.json(),
            myAppsRes.json(),
        ]);

        const appliedIds = myAppsData.applications 
          ? new Set(myAppsData.applications.map(app => app.jobId?._id).filter(Boolean))
          : new Set();

        setStudent(meData);
        setJobs(jobsData.jobs || []);
        setAppliedCount(appliedData.count || 0);
        setAppliedJobIds(appliedIds);

      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setMessage(err.message || "Failed to load dashboard data.");
        setTimeout(() => window.location.href = "/jobs/login", 2000); 
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []); 

  // Apply handler
  const handleApply = async (jobId) => {
    setMessage("");
    setIsApplying(true); // <-- START LOADING
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Job marked as applied ✔️");
        setAppliedCount(prevCount => prevCount + 1);
        setAppliedJobIds(prevIds => new Set(prevIds).add(jobId)); 
      } else {
        throw new Error(data.error || "Failed to apply ❌");
      }
    } catch (err) {
      setMessage(err.message || "Failed to apply ❌");
    } finally {
        setIsApplying(false); // <-- STOP LOADING
    }
  };

  // Handle Withdraw
  const handleWithdraw = async (jobId) => {
    setMessage("");
    setIsApplying(true); // <-- START LOADING
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

      setMessage("Application withdrawn.");
      setAppliedCount(prevCount => prevCount - 1);
      setAppliedJobIds(prevIds => {
        const newIds = new Set(prevIds);
        newIds.delete(jobId);
        return newIds;
      });

    } catch (err) {
      setMessage(err.message || "Failed to withdraw.");
    } finally {
        setIsApplying(false); // <-- STOP LOADING
    }
  };


  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-xl font-semibold bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800">
        <svg className="animate-spin h-8 w-8 mr-3 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Dashboard...
      </div>
    );
  
  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800">
        Preparing dashboard...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Student Job Portal - Dashboard</title>
      </Head>

      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-1/2 focus:-translate-x-1/2 focus:z-50 focus:bg-white focus:text-blue-700 focus:p-3 focus:rounded-b-lg">
        Skip to main content
      </a>

      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative pb-20"> 

        {/* --- Top Gradient Background (Visual Enhancement) --- */}
        <div className="absolute top-0 left-0 w-full h-60 bg-gradient-to-r from-blue-600 to-purple-600 -z-10"></div>

        {/* Main Content Area */}
        <main id="main-content" className="max-w-6xl mx-auto px-4 py-8 relative z-10">

          {/* WELCOME HERO */}
          <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 text-center" role="region" aria-label="Welcome section">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 animate-fade-in">
              Welcome, {student.name?.split(" ")[0]}!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-200">
              Your gateway to exciting career opportunities. Find and apply for jobs tailored for you.
            </p>
          </section>

          {/* SUCCESS / ERROR MESSAGE (Centralized and More Prominent) */}
          {message && (
            <div 
              className={`max-w-xl mx-auto p-4 rounded-lg text-center font-medium mb-6 ${message.includes("✔️") ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`} 
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          {/* QUICK STATS (Clickable Cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8" role="list" aria-label="Quick statistics">
            
            {/* Jobs Applied Card */}
            <a 
              href="/jobs/my-applications" 
              className="group bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
              role="listitem"
              aria-label={`You have applied to ${appliedCount} jobs. Click to view.`}
            >
              <h3 className="text-4xl font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">{appliedCount}</h3>
              <p className="text-gray-700 text-lg mt-1">Jobs Applied</p>
            </a>

            {/* Branch Card */}
            <a 
              href="/jobs/updateprofile" 
              className="group bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-300"
              role="listitem"
              aria-label={`Your registered branch is ${student.branch}. Click to update profile.`}
            >
              <h3 className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300">{student.branch}</h3>
              <p className="text-gray-700 text-lg mt-1">Branch</p>
            </a>

            {/* Year Card */}
            <a 
              href="/jobs/updateprofile" 
              className="group bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-300"
              role="listitem"
              aria-label={`Your registered year is ${student.year}. Click to update profile.`}
            >
              <h3 className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300">{student.year}</h3>
              <p className="text-gray-700 text-lg mt-1">Year</p>
            </a>
          </section>

          {/* HOW IT WORKS (Visually Enhanced Steps) */}
          <section className="bg-white rounded-2xl shadow-md p-8 mb-8" role="region" aria-label="How the portal works">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How This Portal Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-4xl text-blue-500 mb-3">🔍</span>
                <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
                <p className="text-gray-600 text-sm">Explore a curated list of job opportunities.</p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-4xl text-purple-500 mb-3">🔗</span>
                <h3 className="text-xl font-semibold mb-2">Apply Externally</h3>
                <p className="text-gray-600 text-sm">Click the link to apply on the company's website.</p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-4xl text-green-500 mb-3">✅</span>
                <h3 className="text-xl font-semibold mb-2">Mark as Applied</h3>
                <p className="text-gray-600 text-sm">Record your application here for tracking.</p>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-4xl text-yellow-500 mb-3">📊</span>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm">View all your applications and update your profile.</p>
              </div>
            </div>
          </section>

          {/* --- "ALL JOBS" SECTION --- */}
          <section className="mb-8" aria-labelledby="job-listings-heading">
            <h2 id="job-listings-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">All Opportunities</h2>
            
            {/* JOB LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="feed" aria-live="polite">
              {jobs.length === 0 ? (
                <p className="text-gray-700 text-lg col-span-full text-center py-8 bg-white rounded-lg shadow-md">No jobs posted yet. Check back soon!</p>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 ease-in-out focus-within:ring-4 focus-within:ring-blue-200"
                    role="article"
                    aria-label={`Job posting: ${job.name}`}
                    tabIndex="0" // Make the whole card keyboard focusable
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.name}</h3>
                    {job.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                    )}

                    <a
                      href={job.link}
                      className="text-blue-700 hover:text-blue-800 font-semibold underline mt-3 inline-block focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Apply for ${job.name} on company website (opens in new tab)`}
                    >
                      Apply on Company Website <span aria-hidden="true">→</span>
                    </a>

                    {/* Conditional Apply/Withdraw Button */}
                    {appliedJobIds.has(job._id) ? (
                      <button
                        onClick={() => handleWithdraw(job._id)}
                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                        aria-label={`Withdraw application for ${job.name}`}
                        disabled={isApplying} // <-- ADD DISABLE
                      >
                        {isApplying ? "Processing..." : "Withdraw"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
                        aria-label={`Mark ${job.name} as applied`}
                        disabled={isApplying} // <-- ADD DISABLE
                      >
                        {isApplying ? "Processing..." : "Apply"}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>

        {/* --- FLOATING ACTION BUTTON (FAB) --- */}
        <a 
          href="/" 
          className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition transform hover:scale-105 text-sm font-medium"
          title="Visit Abdul Barr's Portfolio"
          aria-label="Visit Abdul Barr's Portfolio"
        >
          Abdul Barr's Portfolio
        </a>
      </div>
    </>
  );
}