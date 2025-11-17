"use client";

// We use useParams to get the ID from the URL
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams(); // Gets the URL parameters
  const { id } = params; // This is the job ID from the URL

  const [form, setForm] = useState({
    name: "",
    link: "",
    description: "",
  });
  
  const [loading, setLoading] = useState(true); // Start true to fetch data
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // --- 1. Fetch Job Details on Page Load ---
  useEffect(() => {
    if (!id) return; // Wait for the id to be available

    const fetchJobDetails = async () => {
      if (!API_BASE_URL) {
        setMessage("Configuration error: API_BASE_URL is not set.");
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
          credentials: "include", // Sends the admin login cookie
        });

        if (res.status === 401) {
          window.location.href = "/jobs/admin/login";
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch job details.");
        }
        
        const data = await res.json();
        // Load the fetched data into the form
        setForm({
          name: data.job.name,
          link: data.job.link,
          description: data.job.description || "",
        });
        
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]); // Re-run if the id changes

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // --- 2. Handle the Update (Save) ---
  const handleUpdate = async () => {
    setMessage("");
    if (!form.name || !form.link) {
      setMessage("Job Name and Link are required.");
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/jobs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Job updated successfully!");
        // Redirect back to the manage page
        setTimeout(() => {
          router.push("/jobs/admin/manage-jobs");
        }, 1000);
      } else if (res.status === 401) {
        window.location.href = "/jobs/admin/login";
      } else {
        setMessage(data.error || "Failed to update job.");
      }
    } catch (err) {
      setMessage("Network error or server is down.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading Job Details...
      </div>
    );
  }

  return (
    // --- FIX: Removed min-h-screen and conflicting centering classes ---
    <div className="max-w-lg mx-auto"> 
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Job</h1>
        <a 
          href="/jobs/admin/manage-jobs"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Manage Jobs
        </a>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full"> {/* Card container */}

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
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 mt-1"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-3 rounded text-sm text-white bg-black text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}