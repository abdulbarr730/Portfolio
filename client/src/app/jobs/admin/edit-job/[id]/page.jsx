"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [form, setForm] = useState({
    name: "",
    link: "",
    description: "",
    type: "internship",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // ✅ FIX: Uses relative path /api/... because API_BASE_URL is empty
        const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
          credentials: "include",
        });
        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        const data = await res.json();
        if (data.job) {
          setForm({
            name: data.job.name || "",
            link: data.job.link || "",
            description: data.job.description || "",
            type: data.job.type || "internship",
            location: data.job.location || "",
          });
        } else {
          setMessage("Job not found.");
        }
      } catch (err) {
        setMessage("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setMessage("");
    if (!form.name || !form.link) {
      setMessage("Job Name and Link are required.");
      return;
    }

    setSaving(true);
    try {
      // ✅ FIX: Uses relative path /api/...
      const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Job updated successfully!");
        setTimeout(() => router.push("/jobs/admin/manage-jobs"), 900);
      } else if (res.status === 401) {
        window.location.href = "/jobs/admin/login";
      } else {
        setMessage(data.error || "Failed to update job.");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center">Loading job details...</div>;
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">Edit Job</h1>
        <a href="/jobs/admin/manage-jobs" className="text-sm text-blue-600 hover:underline">← Back</a>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Job Title" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300" />
          <input name="link" value={form.link} onChange={handleChange} placeholder="Application Link" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300" />
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Short Job Description" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location (City, Remote, etc.)" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-300" />

          <select name="type" value={form.type} onChange={handleChange} className="w-full p-3 rounded-xl border bg-white">
            <option value="internship">Internship</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="remote">Remote</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
          </select>

          <button onClick={handleUpdate} disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && <div className="mt-4 text-center p-3 rounded-xl bg-black text-white">{message}</div>}
      </div>
    </div>
  );
}