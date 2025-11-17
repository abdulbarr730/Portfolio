"use client";

import { useState, useEffect } from "react";

// --- Use the Environment Variable ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar_Jobs() { 
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- State for mobile menu

  useEffect(() => {
    // Fetch student info to show name in navbar
    if (!API_BASE_URL) {
      console.error("Navbar: API_BASE_URL is not set.");
      setIsLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/api/student/me`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          setIsLoading(false);
          return; // user not logged in
        }
        const data = await res.json();
        setStudent(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    if (!API_BASE_URL) {
      console.error("Navbar: API_BASE_URL is not set.");
      return;
    }
    await fetch(`${API_BASE_URL}/api/student/logout`, {
      method: "GET",
      credentials: "include",
    });
    // Use window.location.href for navigation
    window.location.href = "/jobs/login";
  };

  return (
    // Add relative positioning for the dropdown menu
    <nav className="bg-white shadow-md px-6 py-4 relative">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <a href="/jobs" className="font-bold text-xl text-blue-700">
            BBDIT
          </a>
          {/* Show links only if logged in (DESKTOP) */}
          {student && (
            <div className="hidden sm:flex items-center gap-4">
              <a href="/jobs" className="text-gray-700 font-medium hover:text-blue-600">
                Jobs
              </a>
              <a href="/jobs/my-applications" className="text-gray-700 font-medium hover:text-blue-600">
                My Applications
              </a>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // Placeholder while loading
            <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          ) : student ? (
            // --- Logged-in State ---
            <>
              <span className="font-medium text-gray-700 hidden sm:block">
                Hi, {student.name?.split(" ")[0]}
              </span>
              
              <a href="/jobs/updateprofile" className="text-gray-600 hover:text-blue-600" aria-label="Profile">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>

              {/* --- HAMBURGER MENU BUTTON --- */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden text-gray-700" // Only shows on mobile
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </>
          ) : (
            // --- Logged-out State ---
            <a href="/jobs/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </a>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && student && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 p-4">
          <div className="flex flex-col gap-4">
            <a href="/jobs" className="text-gray-700 font-medium hover:text-blue-600">
              Jobs
            </a>
            <a href="/jobs/my-applications" className="text-gray-700 font-medium hover:text-blue-600">
              My Applications
            </a>
            
            <hr />
            <span className="font-medium text-gray-700">
              Hi, {student.name?.split(" ")[0]}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}