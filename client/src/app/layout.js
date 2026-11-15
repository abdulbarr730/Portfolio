// src/app/layout.js

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import AccentColor from "@/components/AccentColor";
import TopLoader from "@/components/TopLoader";
import { Suspense } from "react";
import { hexToRgbTriplet } from "@/lib/color";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // 1. TITLE: Positions you as an expert immediately
  title: "Abdul Barr | Full-Stack AI & Automation Engineer",
  
  // 2. DESCRIPTION: A strong hook focused on value and specific technologies
  description: "Portfolio of Abdul Barr. Specializing in AI-driven automation, LLM integrations, web scraping, and production-ready Full-Stack applications using Next.js and the MERN stack.",
  
  // 3. KEYWORDS: Highly targeted terms that recruiters and ATS bots actually search for
  keywords: [
    'Abdul Barr', 
    'AI Automation Engineer',
    'Full-Stack Developer',
    'LLM Integration',
    'Agentic Workflows',
    'Web Scraping',
    'Process Automation',
    'Next.js Developer',
    'MERN Stack',
    'Django Developer',
    'Cloudflare R2',
    'Software Engineer India'
  ],

  // 4. OPEN GRAPH: Standardized for global sharing on LinkedIn and Twitter
  openGraph: {
    title: 'Abdul Barr | Full-Stack AI & Automation Engineer',
    description: 'Specializing in AI-driven automation, LLM integrations, and production-ready Full-Stack applications.',
    url: 'https://abdulbarr.in', 
    siteName: 'Abdul Barr Portfolio',
    locale: 'en_US',
    type: 'website',
  },
};

// Fetch the admin-chosen accent colour on the server so the very first paint
// already uses it (no flash of the default colour). Cached for 60 seconds.
async function getAccentRgb() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const settings = await res.json();
    return hexToRgbTriplet(settings?.accentColor);
  } catch {
    return null;
  }
}

// Fallback when the server couldn't reach the API: reuse the colour from the
// visitor's last visit (saved by components/AccentColor.jsx) before first paint.
const ACCENT_FALLBACK_SCRIPT = `try{var c=localStorage.getItem('accent-rgb');if(c)document.documentElement.style.setProperty('--accent-rgb',c)}catch(e){}`;

export default async function RootLayout({ children }) {
  const accentRgb = await getAccentRgb();
  return (
    <html lang="en" suppressHydrationWarning style={accentRgb ? { '--accent-rgb': accentRgb } : undefined}>
      <head>
        {!accentRgb && <script dangerouslySetInnerHTML={{ __html: ACCENT_FALLBACK_SCRIPT }} />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-primary antialiased`}
      >
        <AccentColor />
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}