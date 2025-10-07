'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const LeftSidebar = () => {
  const sidebarRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the sidebar to fade and move left on scroll
      gsap.to(sidebarRef.current, {
        opacity: 0,
        x: '-100%',
        ease: 'power2.in',
        scrollTrigger: {
          start: 'top top',
          // The animation will now complete when the center of the screen reaches the top
          end: 'center top', 
          scrub: true,
        },
      });
    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sidebarRef} className="hidden md:flex flex-col items-center fixed top-10 left-0 h-screen w-28 py-8">
      
      {/* Professional Title */}
      <div className="pt-8 [writing-mode:vertical-rl] rotate-180 text-secondary dark:text-gray-400 tracking-widest uppercase text-xs font-semibold">
        Full-Stack & ML Developer
      </div>

      {/* The Correct Connecting Line */}
      <div className="flex-grow w-px my-8 bg-secondary/20 dark:bg-secondary/40"></div>

      {/* Social Icons */}
      <div className="pb-8 flex flex-col items-center space-y-6">
        <Link href="https://github.com/abdulbarr730" target="_blank" className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
        </Link>
        <Link href="https://www.linkedin.com/in/abdul-barr-9092a4251" target="_blank" className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;