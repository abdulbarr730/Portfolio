"use client";

import { useState, useEffect } from "react";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  
  // New state for your cards
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, totalJobs: 0 });

  // --- 1. Fetch ALL Dashboard Data on Load ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.

      setLoading(true);
      setMessage("");
      try {
        // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
        const [statsRes, studentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/students/stats`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/admin/students/pending`, { credentials: "include" })
        ]);

        // Check auth status
        if (statsRes.status === 401 || studentsRes.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        if (!statsRes.ok || !studentsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const statsData = await statsRes.json();
        const studentsData = await studentsRes.json();

        setStats(statsData.stats);
        setStudents(studentsData.students || []);
        
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []); // Run on page load

  // --- 2. Function to Approve a Student ---
  const handleApprove = async (rollNumber) => {
    if (!confirm(`Are you sure you want to approve roll number: ${rollNumber}?`)) {
      return;
    }

    setMessage("");
    try {
      // ✅ FIX: Uses relative path
      const res = await fetch(`${API_BASE_URL}/api/admin/students/approve`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: rollNumber,
          approve: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Approval failed");
      }
      
      setMessage(`Student ${rollNumber} approved successfully!`);
      
      // Update UI instantly
      setStudents(students.filter(s => s.rollNumber !== rollNumber));
      setStats(prevStats => ({
        ...prevStats,
        verified: prevStats.verified + 1,
        pending: prevStats.pending - 1,
      }));

    } catch (err) {
      setMessage(err.message);
    }
  };

  // --- 3. NEW: Function to Reject/Delete a Student ---
  const handleReject = async (studentId, studentName) => {
    if (!confirm(`WARNING: Are you sure you want to permanently REJECT and DELETE ${studentName}? This action cannot be undone.`)) {
      return;
    }
    setMessage("");
    try {
      // ✅ FIX: Uses relative path
      const res = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Deletion failed.");

      setMessage(`Student ${studentName} rejected and deleted successfully.`);
      
      // Update UI instantly
      setStudents(students.filter(s => s._id !== studentId));
      setStats(prevStats => ({
        ...prevStats,
        total: prevStats.total - 1, // Total count goes down since the record is deleted
        pending: prevStats.pending - 1,
      }));

    } catch (err) {
      setMessage(err.message || "Failed to delete student.");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {message && (
        <div className="mb-6 p-4 bg-ink text-white rounded-lg text-center">
          {message}
        </div>
      )}

      {/* --- Stats Cards (All Clickable) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Jobs Card (Already Clickable) */}
        <a 
          href="/jobs/admin/manage-jobs"
          className="block bg-surface rounded-2xl shadow-lg p-6 transition-transform hover:scale-105"
        >
          <p className="text-secondary">Total Jobs</p>
          <p className="text-4xl font-bold text-accent">{stats.totalJobs}</p>
        </a>

        {/* Total Students Card (Clickable) */}
        <a 
          href="/jobs/admin/manage-students"
          className="block bg-surface rounded-2xl shadow-lg p-6 transition-transform hover:scale-105"
        >
          <p className="text-secondary">Total Students</p>
          <p className="text-4xl font-bold text-accent">{stats.total}</p>
        </a>
        
        {/* Verified Students Card (Clickable) */}
        <a 
          href="/jobs/admin/manage-students?status=Approved"
          className="block bg-surface rounded-2xl shadow-lg p-6 transition-transform hover:scale-105"
        >
          <p className="text-secondary">Verified</p>
          <p className="text-4xl font-bold text-green-600">{stats.verified}</p>
        </a>
        
        {/* Pending Students Card (Clickable) */}
        <a 
          href="/jobs/admin/manage-students?status=Pending"
          className="block bg-surface rounded-2xl shadow-lg p-6 transition-transform hover:scale-105"
        >
          <p className="text-secondary">Pending</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </a>
        
      </div>

      {/* --- Pending Students List --- */}
      <div className="bg-surface rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-4">Pending Student Approvals</h2>
        
        {students.length === 0 ? (
          <p className="text-secondary">No pending student approvals found. ✅</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border rounded-md"
              >
                <div className="mb-3 sm:mb-0">
                  <p className="font-bold text-lg">{student.name}</p>
                  <p className="text-secondary text-sm">{student.email}</p>

                  <p className="text-secondary text-sm">
                    Roll: {student.rollNumber} | Branch: {student.branch} | Year: {student.year}
                  </p>
                </div>
                
                {/* --- ACTIONS --- */}
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleApprove(student.rollNumber)}
                      className="w-1/2 sm:w-auto bg-accent text-white px-4 py-2 rounded-md hover:bg-primary"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(student._id, student.name)}
                      className="w-1/2 sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Reject
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