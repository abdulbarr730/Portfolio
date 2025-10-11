// src/app/(site)/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RightSidebar from "@/components/RightSidebar"; // Changed from LeftSidebar to RightSidebar

export default function SiteLayout({ children }) {
  return (
    <>
      <RightSidebar /> {/* Updated component name */}
      <Navbar />
      {/* Changed left padding to right padding to make space for the right sidebar */}
      <main className="md:pr-28"> {/* Changed md:pl-28 to md:pr-28 */}
        {children}
      </main>
      <Footer />
      
    </>
  );
}
