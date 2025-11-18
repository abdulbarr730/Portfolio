"use client";

import { useState } from "react";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // 🗑️ REMOVED: The check "if (!API_BASE_URL)" is gone.
    
    setLoading(true);
    setMessage("");
    try {
      // ✅ FIX: Uses relative path /api/... if API_BASE_URL is empty
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",
        credentials: "include", // IMPORTANT for setting the cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success! Redirect to the admin dashboard
        window.location.href = "/jobs/admin";
      } else {
        setMessage(data.error || "Login failed. Check credentials.");
      }
    } catch (err) {
      setMessage("Network error. Server may be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: Changed dark background to light neutral
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10"> 
      {/* FIX: Added border for better separation */}
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Login</h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Admin Email"
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Admin Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg"
              aria-label={showPassword ? "Hide password" : "Show password"} 
            >
              {showPassword ? (
                // Eye-slash icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0012 6c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-1.13 0-2.197-.2-3.172-.547m-2.286-2.286A10.452 10.452 0 013.98 8.223z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {/* FIX: Changed error styling to red-themed alert */}
          {message && (
            <div className="mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-800 border border-red-300 text-center" role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}