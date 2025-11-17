"use client";

import { useState, useEffect } from "react";
// We cannot remove this import, but we can prevent compilation failure
import { useSearchParams } from "next/navigation"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Helper functions ---
const formatYear = (year) => {
  if (year === 1 || year === "1") return "1st Year";
  if (year === 2 || year === "2") return "2nd Year";
  if (year === 3 || year === "3") return "3rd Year";
  if (year === 4 || year === "4") return "4th Year";
  return year;
};

// --- Password Reset Modal Component ---
function ResetModal({ student, API_BASE_URL, onClose, onPasswordChange }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/password/${student._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password.");
      }
      
      onPasswordChange(student._id);
      setMessage("✅ Password reset successfully!");
    } catch (err) {
      setMessage(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Reset Password for {student.name}</h3>
        
        <input
          type="password"
          placeholder="Enter New Password (min 6 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border rounded-md mb-4"
        />

        {message && <div className="p-3 bg-gray-100 text-sm rounded mb-4">{message}</div>}

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-md hover:bg-gray-300"
            disabled={loading}
          >
            Close
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            disabled={loading || newPassword.length < 6}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ManageStudentsPage() {
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [modalStudent, setModalStudent] = useState(null);

  // --- FILTER STATES ---
  // We use searchParams.get('status') which is safe because the hook is imported
  const initialStatus = searchParams.get('status') || "All"; 
  const [filterCourse, setFilterCourse] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterStatus, setFilterStatus] = useState(initialStatus);

  // --- BULK ACTION STATE ---
  const [selectedStudents, setSelectedStudents] = useState(new Set());


  // --- Core Fetch Function (same) ---
  const fetchStudents = async () => {
    // ... (fetch logic remains the same)
    if (!API_BASE_URL) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/all`, { credentials: "include" });

      if (res.status === 401) {
        window.location.href = "/jobs/admin/login";
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch student list.");
      }
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Bulk Selection Handlers (same) ---
  const handleToggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set()); // Deselect all
    } else {
      // Select all currently filtered students
      const allIds = filteredStudents.map(s => s._id);
      setSelectedStudents(new Set(allIds));
    }
  };

  const handleToggleStudent = (studentId) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  // --- Single Approval Handler (same) ---
  const handleApproval = async (studentId, approveStatus) => {
    const action = approveStatus ? "approve" : "unapprove";
    if (!confirm(`Are you sure you want to ${action} this student?`)) {
      return;
    }

    try {
      const studentToUpdate = students.find(s => s._id === studentId);

      const res = await fetch(`${API_BASE_URL}/api/admin/students/approve`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: studentToUpdate.rollNumber,
          approve: approveStatus,
        }),
      });

      if (!res.ok) throw new Error("Update failed.");

      setMessage(`Student ${studentToUpdate.rollNumber} ${action}d.`);
      // Update local state
      setStudents(students.map(s => s._id === studentId ? { ...s, approved: approveStatus, registered: true } : s));

    } catch (err) {
      setMessage(err.message || `Failed to ${action} student.`);
    }
  };

  // --- Single Delete Handler (same) ---
  const handleDelete = async (studentId, studentName) => {
    if (!confirm(`WARNING: Are you sure you want to permanently DELETE ${studentName} and all their application data?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Deletion failed.");

      setMessage(`Student ${studentName} deleted successfully.`);
      // Remove from list
      setStudents(students.filter(s => s._id !== studentId));

    } catch (err) {
      setMessage(err.message || "Failed to delete student.");
    }
  };
  
  const handlePasswordChangeComplete = (studentId) => {
    setModalStudent(null);
    setMessage(`Password for Student ID ${studentId.substring(0, 5)}... has been reset.`);
  };

  // --- NEW: Bulk Action Handler (same) ---
  const handleBulkAction = async (actionType) => {
    if (selectedStudents.size === 0) {
      setMessage("Select at least one student to perform a bulk action.");
      return;
    }

    const rollNumbers = students
      .filter(s => selectedStudents.has(s._id))
      .map(s => s.rollNumber);
      
    if (actionType === 'delete') {
      if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${selectedStudents.size} selected students?`)) return;
    } else {
      if (!confirm(`Are you sure you want to BULK ${actionType.toUpperCase()} ${selectedStudents.size} selected students?`)) return;
    }

    setLoading(true);
    setMessage("");

    try {
      let endpoint = '';
      let method = 'PUT';
      let body = {};
      
      // Determine API endpoint and payload
      if (actionType === 'verify') {
        endpoint = '/api/admin/students/bulk-approve';
        body = { rollNumbers, approve: true };
      } else if (actionType === 'unverify') {
        endpoint = '/api/admin/students/bulk-approve';
        body = { rollNumbers, approve: false };
      } else if (actionType === 'delete') {
        endpoint = '/api/admin/students/bulk-delete';
        method = 'POST';
        // DELETE endpoint only needs the list of roll numbers
        body = { rollNumbers }; 
      }
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Bulk ${actionType} failed on the server.`);
      }

      setMessage(`${selectedStudents.size} student(s) successfully ${actionType}d.`);
      setSelectedStudents(new Set()); // Clear selection

      // Re-fetch data to reflect changes in the database accurately
      await fetchStudents(); 

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- Filtering Logic (same) ---
  const filteredStudents = students.filter(student => {
    // Search filter
    const searchMatch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                        student.email.toLowerCase().includes(search.toLowerCase()) ||
                        student.rollNumber.toLowerCase().includes(search.toLowerCase());
    
    if (!searchMatch) return false;

    // Course filter
    if (filterCourse !== "All" && student.course !== filterCourse) return false;
    
    // Branch filter
    if (filterBranch !== "All" && student.branch !== filterBranch) return false;
    
    // Year filter
    if (filterYear !== "All" && String(student.year) !== filterYear) return false;
    
    // Status filter
    if (filterStatus === "Approved" && !student.approved) return false;
    if (filterStatus === "Pending" && student.approved) return false;
    
    return true;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading Student Records...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Manage All Students</h1>
      
      {message && <div className="mb-4 p-3 bg-black text-white rounded-lg text-center">{message}</div>}

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        
        {/* Search Bar and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <input
            type="text"
            placeholder="Search Name, Email, or Roll Number..."
            className="w-full sm:w-80 p-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        {/* --- FILTER DROPDOWNS --- */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <select
                className="p-2 border rounded-md"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
            >
                <option value="All">All Courses</option>
                <option value="B.Tech">B.Tech</option>
            </select>
            <select
                className="p-2 border rounded-md"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
            >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
            </select>
            <select
                className="p-2 border rounded-md"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
            >
                <option value="All">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
            </select>
            <select
                className="p-2 border rounded-md col-span-2 md:col-span-1"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="All">All Statuses ({students.length})</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
            </select>
            <p className="text-sm text-gray-500 flex items-center justify-end col-span-2 md:col-span-1">
                Showing {filteredStudents.length} of {students.length} students.
            </p>
        </div>
        
        {/* --- BULK ACTION BAR --- */}
        {selectedStudents.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex flex-wrap gap-3 items-center">
            <span className="font-semibold text-blue-800">{selectedStudents.size} Selected:</span>
            <button 
              onClick={() => handleBulkAction('verify')} 
              className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
              disabled={loading}
            >
              Bulk Verify
            </button>
            <button 
              onClick={() => handleBulkAction('unverify')} 
              className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700"
              disabled={loading}
            >
              Bulk Unverify
            </button>
            <button 
              onClick={() => handleBulkAction('delete')} 
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
              disabled={loading}
            >
              Bulk Delete
            </button>
          </div>
        )}

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Checkbox Header */}
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded text-blue-600"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  
                  {/* Selection Checkbox */}
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student._id)}
                      onChange={() => handleToggleStudent(student._id)}
                      className="rounded text-blue-600"
                    />
                  </td>

                  {/* Name & Email */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </td>
                  {/* Roll Number */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{student.rollNumber}</td>
                  {/* Course */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{student.course}</td>
                  {/* Branch */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{student.branch}</td>
                  {/* Year */}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700">{formatYear(student.year)}</td>
                  
                  {/* Status Cell */}
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${student.approved ? 'bg-green-100 text-green-800' : 
                         student.registered ? 'bg-yellow-100 text-yellow-800' : 
                         'bg-gray-100 text-gray-800'}`
                      }
                    >
                      {student.approved ? 'Approved' : student.registered ? 'Pending' : 'Unregistered'}
                    </span>
                  </td>
                  
                  {/* Actions Cell */}
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3">
                      {/* VERIFY / UNVERIFY BUTTONS */}
                      {student.approved ? (
                        <button
                          onClick={() => handleApproval(student._id, false)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Unverify
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproval(student._id, true)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </button>
                      )}

                      {/* PASSWORD RESET BUTTON */}
                      <button
                        onClick={() => setModalStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Reset Password
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(student._id, student.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Password Reset Modal */}
      {modalStudent && (
        <ResetModal 
          student={modalStudent}
          API_BASE_URL={API_BASE_URL}
          onClose={() => setModalStudent(null)}
          onPasswordChange={handlePasswordChangeComplete}
        />
      )}
    </>
  );
}