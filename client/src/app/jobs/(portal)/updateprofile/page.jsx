"use client";

import { useEffect, useState } from "react";
// Removed Next.js imports
// import { useRouter } from "next/navigation";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UpdateProfilePage() {
  // const router = useRouter(); // Removed router
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    course: "",
    branch: "",
    year: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState(false); // For show/hide

  useEffect(() => {
    async function fetchProfile() {
      // --- Add URL Check ---
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        return;
      }
      try {
        // --- Use absolute URL ---
        const res = await fetch(`${API_BASE_URL}/api/student/me`, { credentials: "include" });
        if (res.status === 401) {
          // --- Use standard navigation ---
          window.location.href = "/jobs/login";
          return;
        }
        const j = await res.json();
        setForm({
          name: j.name || "",
          email: j.email || "",
          rollNumber: j.rollNumber || "",
          course: j.course || "",
          branch: j.branch || "",
          year: j.year || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setMessage("");
    if (!API_BASE_URL) {
      setMessage("Configuration error: API_BASE_URL is not set.");
      return;
    }
    setSaving(true);
    try {
      // --- Use absolute URL ---
      const res = await fetch(`${API_BASE_URL}/api/student/update-profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email, // <-- CRITICAL BUG FIX: Added missing email
          course: form.course,
          branch: form.branch,
          year: form.year,
        }),
      });
      const j = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(j.error || "Failed to update");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setMessage("");
    if (!API_BASE_URL) {
      setMessage("Configuration error: API_BASE_URL is not set.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage("New passwords do not match");
      return;
    }
    setPwLoading(true);
    try {
      // --- Use absolute URL ---
      const res = await fetch(`${API_BASE_URL}/api/student/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwords.currentPassword, // <-- FIX: Renamed from currentPassword
          newPassword: passwords.newPassword,
        }),
      });
      const j = await res.json();
      if (res.ok) {
        setMessage("Password changed successfully");
        setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        setMessage(j.error || "Failed to change password");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Update Profile</h1>

        <div className="space-y-3">
          <label className="text-sm font-medium">Name</label>
          <input className="w-full p-3 border rounded-md" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />

          <label className="text-sm font-medium">Email</label>
          <input className="w-full p-3 border rounded-md" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />

          <label className="text-sm font-medium">Roll Number (read-only)</label>
          <input className="w-full p-3 border rounded-md bg-gray-100" value={form.rollNumber} readOnly />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Course</label>
              <select
                className="w-full p-3 border rounded-md bg-white"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
              >
                <option value="">Select Course</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Branch</label>
              <select
                className="w-full p-3 border rounded-md bg-white"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Comm. (ECE)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="CE">Civil Engineering (CE)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <label className="text-sm font-medium">Year</label>
          <select
            className="w-full p-3 border rounded-md bg-white"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>

        <hr className="my-6" />

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Change Password</h2>
          
          {/* --- UPDATED BUTTON (ICON INSTEAD OF TEXT) --- */}
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
          >
            {showPasswords ? (
              // Eye-slash icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0012 6c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-1.13 0-2.197-.2-3.172-.547m-2.286-2.286A10.452 10.452 0 013.98 8.223z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            ) : (
              // Eye icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
          {/* --- END OF UPDATED BUTTON --- */}

        </div>
        
        <div className="space-y-3">
          {/* --- ALL INPUTS UPDATED TO TOGGLE TYPE --- */}
          <input type={showPasswords ? "text" : "password"} placeholder="Current password" className="w-full p-3 border rounded-md" value={passwords.currentPassword} onChange={(e)=>setPasswords({...passwords, currentPassword: e.target.value})} />
          <input type={showPasswords ? "text" : "password"} placeholder="New password" className="w-full p-3 border rounded-md" value={passwords.newPassword} onChange={(e)=>setPasswords({...passwords, newPassword: e.target.value})} />
          <input type={showPasswords ? "text" : "password"} placeholder="Confirm new password" className="w-full p-3 border rounded-md" value={passwords.confirmNewPassword} onChange={(e)=>setPasswords({...passwords, confirmNewPassword: e.target.value})} />

          <button onClick={handleChangePassword} disabled={pwLoading} className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700">
            {pwLoading ? "Updating..." : "Change password"}
          </button>
        </div>

        {message && <div className="mt-4 p-3 rounded text-sm bg-black text-white text-center">{message}</div>}
      </div>
    </div>
  );
}