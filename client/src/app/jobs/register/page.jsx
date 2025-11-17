"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    phoneNumber: "",     // <-- ADDED
    course: "",
    branch: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [pending, setPending] = useState(false);
  const [pendingInfo, setPendingInfo] = useState(null);

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleRegister = async () => {
    setMessage("");
    setPending(false);
    setPendingInfo(null);

    // validation
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.rollNumber ||
      !form.phoneNumber ||       // <-- ADDED
      !form.course ||
      !form.branch ||
      !form.year
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    if (!API_BASE_URL) {
      setMessage("Configuration error: API_BASE_URL is not set.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- important
        body: JSON.stringify(form),
      });

      // NEW: if unauthorized → redirect to login
      if (res.status === 401) {
        setMessage("Please login to continue.");
        window.location.href = "/jobs/login";
        return;
      }

      const j = await res.json();


      if (res.status === 201) {
        setMessage(
          j.message || "Registered and approved. Redirecting to login..."
        );
        setTimeout(() => (window.location.href = "/jobs/login"), 900);
      } else if (res.status === 202 || j.pending) {
        setPending(true);
        setPendingInfo({
          email: form.email,
          rollNumber: form.rollNumber,
        });
        setMessage(
          j.message || "Registration received. Waiting admin approval."
        );
      } else {
        setMessage(j.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = async () => {
    setCancelMessage("");
    setCancelLoading(true);

    if (!API_BASE_URL) {
      setCancelMessage("Configuration error: API_BASE_URL is not set.");
      setCancelLoading(false);
      return;
    }

    try {
      const payload = {
        email: pendingInfo?.email || form.email,
        rollNumber: pendingInfo?.rollNumber || form.rollNumber,
      };

      const res = await fetch(
        `${API_BASE_URL}/api/student/cancel-registration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const j = await res.json();

      if (res.ok) {
        setCancelMessage(j.message || "Registration cancelled");
        setTimeout(() => (window.location.href = "/jobs/register"), 700);
      } else {
        setCancelMessage(j.error || "Failed to cancel");
      }
    } catch (err) {
      console.error(err);
      setCancelMessage("Network error");
    } finally {
      setCancelLoading(false);
      setShowConfirmCancel(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Student Registration
        </h1>

        {!pending && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-md"
              value={form.name}
              onChange={handleChange("name")}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md"
              value={form.email}
              onChange={handleChange("email")}
            />

            {/* Phone Number */}
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-md"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border rounded-md"
                value={form.password}
                onChange={handleChange("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Roll Number"
              className="w-full p-3 border rounded-md"
              value={form.rollNumber}
              onChange={handleChange("rollNumber")}
            />

            <select
              className="w-full p-3 border rounded-md"
              value={form.course}
              onChange={handleChange("course")}
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
            </select>

            <select
              className="w-full p-3 border rounded-md"
              value={form.branch}
              onChange={handleChange("branch")}
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

            <select
              className="w-full p-3 border rounded-md"
              value={form.year}
              onChange={handleChange("year")}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        )}

        {/* Pending */}
        {pending && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="font-semibold">Registration pending</p>
              <p className="text-sm text-gray-700 mt-1">
                Your registration is waiting for admin approval.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="flex-1 bg-red-500 text-white py-2 rounded-md"
              >
                Cancel registration
              </button>

              <button
                onClick={() => (window.location.href = "/jobs/login")}
                className="flex-1 bg-gray-200 py-2 rounded-md"
              >
                Back to login
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="mt-4 bg-black text-white p-3 rounded text-center">
            {message}
          </div>
        )}

        {cancelMessage && (
          <div className="mt-4 bg-red-600 text-white p-3 rounded text-center">
            {cancelMessage}
          </div>
        )}

        <p className="text-center mt-5 text-gray-700">
          Already have an account?{" "}
          <a href="/jobs/login" className="text-blue-600 underline">
            Login here
          </a>
        </p>
      </div>

      {/* Cancel Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm cancellation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel your pending registration?
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-md"
              >
                {cancelLoading ? "Cancelling..." : "Yes, cancel"}
              </button>

              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 bg-gray-200 py-2 rounded-md"
              >
                No, keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
