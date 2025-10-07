// src/app/(site)/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";

export default function SiteLayout({ children }) {
  return (
    <>
      <LeftSidebar /> {/* Add the sidebar here */}
      <Navbar />
      {/* Add left padding to the main content to make space for the sidebar */}
      <main className="md:pl-28">
        {children}
      </main>
      <Footer />
    </>
  );
}