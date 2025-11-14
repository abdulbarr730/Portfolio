"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PortalLayout({ children }) {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Fetch student info to show name in navbar
    fetch("/api/student/me", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) return; // user not logged in
        const data = await res.json();
        setStudent(data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/student/logout", {
      method: "GET",
      credentials: "include",
    });
    router.push("/jobs/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-blue-700">BBDIT</span>

          <Link href="/jobs" className="text-gray-700 font-medium hover:text-blue-600">
            Jobs
          </Link>

          <Link href="/jobs/updateprofile" className="text-gray-700 font-medium hover:text-blue-600">
            Profile
          </Link>

          <Link href="/jobs/my-applications" className="text-gray-700 font-medium hover:text-blue-600">
            My Applications
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {student && <span className="font-medium text-gray-700">Hi, {student.name?.split(" ")[0]}</span>}

          {student ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/jobs/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="pt-6">{children}</div>
    </div>
  );
}
