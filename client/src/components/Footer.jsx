'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from 'next-themes';
import { animateScroll as scroll, scroller } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const year = new Date().getFullYear();
  const email = "abdulbarr730@gmail.com";

  // Button colors based on theme
  const btnBg = theme === 'dark' ? 'bg-white' : 'bg-black';
  const btnText = theme === 'dark' ? 'text-black' : 'text-white';
  const btnHoverBg = theme === 'dark' ? 'hover:bg-gray-200' : 'hover:bg-gray-800';
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';
  const linkHoverColor = theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900';

  const scrollToSection = (id) => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        scroller.scrollTo(id, {
          duration: 800,
          smooth: "easeInOutQuart",
          offset: -60
        });
      }, 200);
    } else {
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -60
      });
    }
  };

  return (
    <motion.footer
      className={`${bgColor} ${textColor} py-12 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} relative z-40`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Name & Role */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Abdul Barr</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Full Stack Developer & ML Enthusiast
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => scrollToSection("about")}
            className={`relative cursor-pointer transition-colors ${linkHoverColor}`}
          >
            About
          </button>
          <Link href="/projects" className={`relative cursor-pointer transition-colors ${linkHoverColor}`}>Projects</Link>
          <button
            onClick={() => scrollToSection("contact")}
            className={`relative cursor-pointer transition-colors ${linkHoverColor}`}
          >
            Contact
          </button>
        </div>

        {/* Buttons & Email */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <motion.div
            className="inline-block"
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Link
              href="/services"
              className={`inline-block ${btnBg} ${btnText} font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105 ${btnHoverBg}`}
            >
              Book a Service
            </Link>
          </motion.div>

          <motion.a
            href={`mailto:${email}`}
            className="inline-block font-semibold underline hover:opacity-80 transition-transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            {email}
          </motion.a>
        </div>

        {/* Socials */}
        <div className="flex justify-center space-x-6 mt-6">
          <motion.a
            href="https://github.com/abdulbarr730"
            target="_blank"
            whileHover={{ scale: 1.2, y: -4 }}
            className={`transition-transform ${textColor} ${linkHoverColor}`}
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
            </svg>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/abdul-barr-9092a4251"
            target="_blank"
            whileHover={{ scale: 1.2, y: -4 }}
            className={`transition-transform ${textColor} ${linkHoverColor}`}
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </motion.a>
        </div>

        <p className="text-sm mt-4">
          © {year} Abdul Barr. All Rights Reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
