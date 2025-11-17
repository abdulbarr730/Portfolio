"use client";

import { useState } from "react";
// Removed Next.js imports that cause errors
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  // const router = useRouter(); // Removed router

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // pending state management (when login indicates pending approval)
  const [pending, setPending] = useState(false);
  const [pendingInfo, setPendingInfo] = useState(null);

  // cancel modal
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");
    setPending(false);
    setPendingInfo(null);
    setLoading(true);

    // Check if the URL is set
    if (!API_BASE_URL) {
      setMessage("Configuration error: API_BASE_URL is not set.");
      setLoading(false);
      return;
    }

    try {
      // --- FIX: Use absolute URL from environment variable ---
      const res = await fetch(`${API_BASE_URL}/api/student/login`, {
        method: "POST",
        credentials: "include", // This is important for cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const j = await res.json().catch(() => ({}));

      if (res.ok) {
        // Logged in — go to jobs landing
        // --- FIX: Use standard window navigation ---
        window.location.href = "/jobs";
        return;
      }

      // --- FIX: Check for 403 (pending) from our updated backend ---
      if (res.status === 403 || j.pending || /pending/i.test(j.error || "")) {
        setPending(true);
        setPendingInfo({ email });
        setMessage(j.error || "Your account is pending admin approval.");
        return;
      }

      // Otherwise show error
      setMessage(j.error || j.message || "Login failed. Check credentials.");
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

    // Check if the URL is set
    if (!API_BASE_URL) {
      setCancelMessage("Configuration error: API_BASE_URL is not set.");
      setCancelLoading(false);
      return;
    }

    try {
      const payload = { email: pendingInfo?.email || email };
      // --- FIX: Use absolute URL from environment variable ---
      const res = await fetch(`${API_BASE_URL}/api/student/cancel-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));

      if (res.ok) {
        setCancelMessage(j.message || "Registration cancelled");
        // Redirect to register after short delay
        // --- FIX: Use standard window navigation ---
        setTimeout(() => (window.location.href = "/jobs/register"), 700);
      } else {
        setCancelMessage(j.error || j.message || "Failed to cancel registration");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Student Login</h1>

        {/* Login form (hidden when in pending state) */}
        {!pending && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 border rounded-md"
            />

            {/* --- PASSWORD INPUT WITH NEW ICONS --- */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // --- NEW Eye-slash icon ---
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0012 6c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-1.13 0-2.197-.2-3.172-.547m-2.286-2.286A10.452 10.452 0 013.98 8.223z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  // --- NEW Eye icon ---
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {/* --- END OF PASSWORD INPUT --- */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              {/* --- FIX: Use standard <a> tag --- */}
              <a href="/jobs/register" className="text-blue-600 underline">
                Register
              </a>
            </p>
          </>
        )}

        {/* Pending UI */}
        {pending && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200">
              <p className="font-semibold">Account pending approval</p>
              <p className="text-sm text-gray-700 mt-1">
                Your registration is waiting for the admin to approve. You cannot log in until approved.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
              >
                Cancel registration
              </button>

              <button
                onClick={() => {
                  setPending(false);
                  setMessage("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
            </div>

            {message && <div className="mt-2 text-sm text-gray-700">{message}</div>}
            {cancelMessage && <div className="mt-2 text-sm text-red-600">{cancelMessage}</div>}
          </div>
        )}

        {/* Generic message */}
        {message && !pending && (
          <div className="mt-4 p-3 rounded text-sm text-white bg-black text-center">{message}</div>
        )}
      </div>

      {/* Confirm cancel modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm cancellation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel your pending registration? This will permanently delete your pending record.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                {cancelLoading ? "Cancelling..." : "Yes, cancel registration"}
              </button>

              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
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