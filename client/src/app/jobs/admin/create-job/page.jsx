"use client";

import { useState, useEffect } from "react";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateJobPage() {
  const [form, setForm] = useState({
    name: "",
    link: "",
    description: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // --- Check Auth on Load ---
  useEffect(() => {
    const checkAuth = async () => {
      if (!API_BASE_URL) return;
      try {
        // Use any protected route to check for a valid cookie
        const res = await fetch(`${API_BASE_URL}/api/admin/students/pending`, {
          credentials: "include",
        });
        if (res.status === 401) {
          // If not authorized, redirect to admin login
          window.location.href = "/jobs/admin/login";
          return;
        }
      } catch (err) {
        // If the request fails (e.g., server down), also redirect
        window.location.href = "/jobs/admin/login";
      }
    };
    checkAuth();
  }, []); // Runs once on page load

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setMessage("");
    
    if (!API_BASE_URL) {
      setMessage("Configuration error: API_BASE_URL is not set.");
      return;
    }
    
    // --- Frontend validation ---
    if (!form.name || !form.link) {
      setMessage("Job Name and Link are required.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/jobs/create`, {
        method: "POST",
        credentials: "include", // Sends the login cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Job "${data.job.name}" created successfully!`);
        // Clear the form on success
        setForm({ name: "", link: "", description: "" });
      } else if (res.status === 401) {
        // This means the cookie is invalid or expired
        setMessage("Authorization failed. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/jobs/admin/login";
        }, 1500);
      } else {
        setMessage(data.error || "Failed to create job.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error or server is down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed outer wrapper and allow content to align to the top of the layout
    <>
      <h1 className="text-4xl font-bold mb-6">Create New Job</h1>
      
      {/* --- FORM CARD (Moved centering classes here) --- */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg mx-auto"> 
        
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Job Title (e.g., Google SWE Intern)"
            className="w-full p-3 border rounded-md"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="link"
            placeholder="Application Link (https://...)"
            className="w-full p-3 border rounded-md"
            value={form.link}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Short Job Description (Optional)"
            className="w-full p-3 border rounded-md"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 mt-1"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 rounded text-sm text-white bg-black text-center">
            {message}
          </div>
        )}
      </div>
    </>
  );
}