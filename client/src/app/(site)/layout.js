// src/app/(site)/layout.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingDock from "@/components/FloatingDock";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main >
        {children}
      </main>
      <FloatingDock />
      <Footer />
    </>
  );
}