// src/app/(site)/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
}