// src/app/layout.js

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}