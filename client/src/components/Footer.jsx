// src/components/Footer.jsx

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-primary/90 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary dark:text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
            <Link href="https://www.linkedin.com/in/abdul-barr-9092a4251" target="_blank" className="hover:text-primary dark:hover:text-background">LinkedIn</Link>
            <Link href="https://www.github.com/abdulbarr730" target="_blank" className="hover:text-primary dark:hover:text-background">GitHub</Link>
        </div>
        <p>© {new Date().getFullYear()} Abdul Barr. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;