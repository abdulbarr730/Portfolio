// This file will wrap all pages inside the app/jobs/ directory

// Import your new Navbar component
import Navbar_Jobs from "../../../components/Navbar_Jobs";

// Optional: Add metadata for this section of your site
export const metadata = {
  title: "BBDIT Job Portal",
  description: "Job portal for BBDIT students.",
};

export default function JobsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar will be at the top */}
      <Navbar_Jobs />

      {/* Page content (e.g., JobsPage, LoginPage) will be rendered here */}
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}