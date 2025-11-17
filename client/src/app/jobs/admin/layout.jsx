"use client";
import { useState } from "react";
import JobsAdminSidebar from "@/components/JobsAdminSidebar";

// --- New Mobile Header Component ---
function MobileHeader({ onMenuClick }) {
  return (
    <header className="lg:hidden bg-gray-100 border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Menu</h1>
        <button
          onClick={onMenuClick}
          className="text-gray-800"
          aria-label="Open menu"
        >
          {/* Hamburger Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* --- SIDEBAR --- */}
      {/* It now receives props to control its mobile state */}
      <JobsAdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* --- MOBILE-ONLY HEADER --- */}
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Your page content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}