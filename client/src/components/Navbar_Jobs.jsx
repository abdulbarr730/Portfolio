"use client";

import { useState, useEffect, useRef } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar_Jobs() {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (!API_BASE_URL) return;

    fetch(`${API_BASE_URL}/api/student/me`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        setStudent(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/student/logout`, {
      method: "GET",
      credentials: "include",
    });
    window.location.href = "/jobs/login";
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-md px-6 py-3 sticky top-0 z-[100] transition-all border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-5">
            <a
              href="/jobs"
              className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              BBDIT
            </a>

            {/* DESKTOP NAV LINKS */}
            {student && (
              <div className="hidden sm:flex items-center gap-6">
                <a
                  href="/jobs"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Jobs
                </a>

                <a
                  href="/jobs/my-applications"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  My Applications
                </a>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            ) : student ? (
              <>
                {/* Name */}
                <span className="font-medium text-gray-700 hidden sm:block">
                  Hi,{" "}
                  <span className="font-semibold text-blue-700">
                    {student.name?.split(" ")[0]}
                  </span>
                </span>

                {/* Profile icon */}
                <a
                  href="/jobs/updateprofile"
                  className="text-gray-600 hover:text-blue-600 transition"
                  aria-label="Profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </a>

                {/* Logout Button with premium look */}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
                >
                  Logout
                </button>

                {/* MOBILE HAMBURGER */}
                <button
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="sm:hidden text-gray-700 ml-1"
                  aria-label="Toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <a
                href="/jobs/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Login
              </a>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && student && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden absolute left-0 right-0 mt-3 mx-4 p-5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl border border-gray-200 z-[200] animate-fadeIn"
          >
            <div className="flex flex-col gap-4">
              <a
                href="/jobs"
                className="text-gray-800 font-medium hover:text-blue-600 transition"
              >
                Jobs
              </a>

              <a
                href="/jobs/my-applications"
                className="text-gray-800 font-medium hover:text-blue-600 transition"
              >
                My Applications
              </a>

              <hr className="border-gray-300" />

              <span className="font-semibold text-gray-700">
                Hi, {student.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* Small fade animation */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
