'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { useSettings } from '@/lib/content';

const SocialLink = ({ href, label, tilt, children }) => (
  <Link
    href={href}
    target="_blank"
    aria-label={label}
    className={`group relative grid h-11 w-11 place-items-center rounded-full text-secondary transition-all duration-300 hover:text-white hover:scale-110 ${tilt}`}
  >
    {/* orange fill that grows from the centre on hover */}
    <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-300 ease-out group-hover:scale-100" />
    {/* soft orange glow ring */}
    <span className="absolute -inset-1 rounded-full bg-accent/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
    <span className="relative">{children}</span>
  </Link>
);

const RightSidebar = forwardRef((props, ref) => {
  const { settings } = useSettings();
  const { socials } = settings;
  const label = settings.hero.sidebarText || 'Full-Stack & ML Developer';

  return (
    <div
      ref={ref}
      className="hidden lg:flex flex-col items-center fixed top-10 right-0 w-28 py-8 z-50 h-[calc(100vh-96px)]"
    >
      {/* Accent dot + vertical label with an orange shimmer running through it */}
      <span className="mt-6 mb-4 h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent-rgb)/0.8)]" />
      <div className="sidebar-shimmer [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase text-xs font-semibold">
        {label}
      </div>

      {/* Line with an orange spark travelling down it */}
      <div className="relative flex-grow w-px my-8 bg-secondary/20 overflow-hidden">
        <span className="absolute left-0 top-0 h-16 w-px bg-gradient-to-b from-transparent via-accent to-transparent animate-[sidebarSpark_3.2s_ease-in-out_infinite]" />
      </div>

      <div className="pb-8 flex flex-col items-center gap-4">
        <SocialLink href={socials.github} label="GitHub" tilt="hover:-rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          </svg>
        </SocialLink>

        <SocialLink href={socials.linkedin} label="LinkedIn" tilt="hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </SocialLink>
      </div>
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';
export default RightSidebar;
