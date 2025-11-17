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

export default function ExportViewPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
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
        const res = await fetch(`${API_BASE_URL}/api/admin/applications/all`, {
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
        setApplications(result.applications || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplications();
  }, []);

  // --- NEW: Excel Export Function for ALL applications ---
  const exportAllToExcel = () => {
    // 1. Format the data
    const dataToExport = applications.map(app => ({
      "Student Name": app.studentId.name,
      "Email": app.studentId.email,
      "Roll Number": app.studentId.rollNumber,
      "Branch": app.studentId.branch,
      "Year": formatYear(app.studentId.year),
      "Job Applied For": app.jobId.name,
      "Job Link": app.jobId.link, // Keep link in Excel, as it's useful data
      "Applied On": new Date(app.appliedAt).toLocaleDateString(),
    }));

    // 2. Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Applications");

    // 3. Trigger the download
    XLSX.writeFile(wb, "all_student_applications.xlsx");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        Loading Full Application List...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-10">
      
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Full Application List</h1>
        <div className="flex gap-4">
          <button
            onClick={exportAllToExcel}
            className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 text-center"
            disabled={applications.length === 0}
          >
            Export All to Excel
          </button>
          <a
            href="/jobs/admin/all-applications"
            className="bg-gray-600 text-white px-5 py-2 rounded-md font-medium hover:bg-gray-700 text-center"
          >
            &larr; Back to Grouped View
          </a>
        </div>
      </div>

      {message && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* --- UPDATED: Flat Table --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg">
        {applications.length === 0 ? (
          <p className="text-gray-600 text-center p-10">
            No applications found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch & Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Applied For</th>
                  {/* --- Job Link Column REMOVED --- */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app._id}>
                    
                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.studentId.name}</div>
                      <div className="text-sm text-gray-500">{app.studentId.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.studentId.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.studentId.branch} - {formatYear(app.studentId.year)}
                    </td>
                    
                    {/* Job Info (Link moved back under name) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.jobId.name}</div>
                      <a
                        href={app.jobId.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Job Link &rarr;
                      </a>
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(app.appliedAt)}</td>
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