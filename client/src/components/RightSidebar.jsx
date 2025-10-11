'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const RightSidebar = () => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the sidebar on mount
      gsap.from(sidebarRef.current, {
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate each social icon with stagger
      gsap.from('.social-icon', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        delay: 0.5,
        ease: 'power3.out',
      });
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sidebarRef}
      className="hidden md:flex flex-col items-center fixed top-10 right-0 h-screen w-28 py-8"
    >
      {/* Professional Title */}
      <div className="pt-8 [writing-mode:vertical-rl] rotate-180 text-secondary dark:text-gray-400 tracking-widest uppercase text-xs font-semibold">
        Full-Stack & ML Developer
      </div>

      {/* Connecting Line */}
      <div className="flex-grow w-px my-8 bg-secondary/20 dark:bg-secondary/40"></div>

      {/* Social Icons */}
      <div className="pb-8 flex flex-col items-center space-y-6">
        <Link
          href="https://github.com/abdulbarr730"
          target="_blank"
          className="social-icon text-secondary dark:text-gray-400 transition-transform duration-300 hover:text-primary dark:hover:text-white hover:scale-125 hover:-rotate-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
          </svg>
        </Link>

        <Link
          href="https://www.linkedin.com/in/abdul-barr-9092a4251"
          target="_blank"
          className="social-icon text-secondary dark:text-gray-400 transition-transform duration-300 hover:text-primary dark:hover:text-white hover:scale-125 hover:rotate-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RightSidebar;
