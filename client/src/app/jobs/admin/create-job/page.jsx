"use client";

import { useState, useEffect } from "react";

// ✅ FIX: Default to empty string for Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function CreateJobPage() {
  const [form, setForm] = useState({
    name: "",
    link: "",
    description: "",
    type: "internship",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check auth on mount (optional quick check)
  useEffect(() => {
    // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.
    
    (async () => {
      try {
        // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
        const res = await fetch(`${API_BASE_URL}/api/admin/students/pending`, {
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
        }
      } catch (err) {
        // If server down, still keep page visible for local testing
      }
    })();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage("");

    // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.

    if (!form.name || !form.link) {
      setMessage("Job Name and Link are required.");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
      const res = await fetch(`${API_BASE_URL}/api/admin/jobs/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Job "${data.job.name}" created successfully!`);
        setForm({ name: "", link: "", description: "", type: "internship", location: "" });
      } else if (res.status === 401) {
        setMessage("Authorization failed. Redirecting to login...");
        setTimeout(() => window.location.href = "/jobs/admin/login", 1200);
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
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-3xl font-extrabold mb-6">Create New Job</h1>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Job Title (e.g., Google SWE Intern)"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          />

          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Application Link (https://...)"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Short Job Description (Optional)"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, Remote, etc.)"
            className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border bg-white"
          >
            <option value="internship">Internship</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="remote">Remote</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </div>

        {message && (
          <div className="mt-4 text-center p-3 rounded-xl bg-black text-white">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}