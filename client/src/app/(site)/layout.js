// src/app/(site)/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {/* FIX: Added `overflow-x-hidden` here. 
        This is the key. It tells the main content wrapper 
        to clip anything that tries to stretch past the screen width. 
        This stops the horizontal scrollbar.
      */}
      <main className="overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}