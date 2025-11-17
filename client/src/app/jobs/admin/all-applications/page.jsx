"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Import the Excel library

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Helper function to format the year ---
const formatYear = (year) => {
  if (year === 1 || year === "1") return "1st Year";
  if (year === 2 || year === "2") return "2nd Year";
  if (year === 3 || year === "3") return "3rd Year";
  if (year === 4 || year === "4") return "4th Year";
  return year;
};

// --- Excel Export Function for a single job ---
const exportJobToExcel = (job) => {
  // 1. Format the data for the sheet
  const dataToExport = job.applications.map(app => ({
    "Student Name": app.studentName,
    "Email": app.studentEmail,
    "Roll Number": app.studentRoll,
    "Branch": app.studentBranch,
    "Year": formatYear(app.studentYear),
    "Applied On": new Date(app.appliedAt).toLocaleDateString(),
    "Job Name": job.jobName, // Add job name to export
    "Job Link": job.jobLink, // Add job link to export
  }));

  // 2. Create worksheet and workbook
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Applications");

  // 3. Trigger the download
  XLSX.writeFile(wb, `${job.jobName.replace(/ /g, "_")}_applications.xlsx`);
};

// --- Accordion Card Component ---
function JobAccordionCard({ job }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Clickable Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition"
      >
        <div>
          <h2 className="text-2xl font-bold">{job.jobName}</h2>
          <p className="text-gray-500">
            {job.applications.length} Student(s) Applied
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className={`w-6 h-6 text-blue-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Collapsible Content (The Table) */}
      {isOpen && (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch & Year</th>
                  {/* --- NEW COLUMNS --- */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {job.applications.map((app) => (
                  <tr key={app.studentEmail}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.studentName}</div>
                      <div className="text-sm text-gray-500">{app.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.studentRoll}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.studentBranch} - {formatYear(app.studentYear)}
                    </td>
                    {/* --- NEW COLUMN DATA --- */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{job.jobName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Link &rarr;
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(app.appliedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Card Footer */}
          <div className="p-4 bg-gray-50 flex justify-end items-center">
            <button
              onClick={() => exportJobToExcel(job)}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Export this Job's Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default function AllApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ... (fetch logic is the same)
    const fetchAllApplications = async () => {
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/applications/by-job`, {
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch application data.");
        }
        const result = await res.json();
        setData(result.data || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplications();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        Loading All Applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Applications by Job</h1>
        <div className="flex gap-4">
          <a
            href="/jobs/admin/export-view"
            className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 text-center"
          >
            View Full List (for Export)
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
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* --- Applications Dashboard (Grouped by Job) --- */}
      <div className="max-w-7xl mx-auto">
        {data.length === 0 ? (
          <p className="text-gray-600 text-center bg-white p-10 rounded-xl shadow">
            No applications found for any job.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Map over each JOB and use the new Card component */}
            {data.map((job) => (
              <JobAccordionCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}