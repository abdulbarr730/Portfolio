"use client";

import { usePathname } from "next/navigation";

// ✅ FIX: Default to empty string so relative paths work with Vercel Rewrites
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Helper component for links
function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
        ${isActive
          ? "bg-blue-600 text-white font-semibold" // Active link
          : "text-gray-700 hover:bg-gray-200 hover:text-black" // Inactive link
        }
      `}
    >
      {children}
    </a>
  );
}

// --- The component now accepts props to control its mobile state ---
export default function JobsAdminSidebar({ isOpen, onClose }) {
  const handleLogout = async () => {
    try {
      // ✅ FIX: Uses relative path /api/... because API_BASE_URL is empty
      await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout request failed, but redirecting.", err);
    } finally {
      window.location.href = "/jobs/admin/login";
    }
  };

  return (
    <>
      {/* --- Mobile Overlay (click to close) --- */}
      <div 
        className={`fixed inset-0 z-10 bg-black/50 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      ></div>

      {/* --- Sidebar --- */}
      <div 
        className={`
          w-64 bg-gray-100 text-gray-800 flex flex-col min-h-screen p-4 border-r border-gray-200 
          fixed z-20 top-0 left-0 transition-transform transform
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Admin Panel</h2>
          <p className="text-sm text-gray-500 text-center">BBDIT Job Portal</p>
        </div>

        {/* --- Main Navigation --- */}
        <nav className="flex-1 space-y-2">
          <NavLink href="/jobs/admin">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3H18M3.75 3v11.25m14.25-5.25v5.25l3 3m0 0l-3 3m3-3l-3-3m-3.75 0H6.75A2.25 2.25 0 014.5 12V6.75a2.25 2.25 0 012.25-2.25h13.5M13.5 3v5.25m0 0l-3 3m3-3l3 3" /></svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink href="/jobs/admin/manage-students"> {/* <-- UPDATED LINK PATH */}
            {/* --- NEW ICON: Users Group --- */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 00-1.74-2.88c-.965-.96-2.14-1.7-3.41-2.12a9.09 9.09 0 00-4.06 0c-1.27.42-2.44 1.16-3.41 2.12A9.09 9.09 0 006 18.72M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12z" /></svg>
            <span>Manage Students</span>
          </NavLink>
            
          <NavLink href="/jobs/admin/create-job">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Create Job</span>
          </NavLink>
          
          <NavLink href="/jobs/admin/manage-jobs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            <span>Manage Jobs</span>
          </NavLink>
          
          <NavLink href="/jobs/admin/all-applications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            <span>Applications</span>
          </NavLink>
        </nav>

        {/* --- Footer Links --- */}
        <div className="mt-auto">
          <a 
            href="/jobs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
            <span>Back to Student Portal</span>
          </a>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}