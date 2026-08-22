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
  // 1. TITLE: Simplified as requested
  title: "Abdul Barr | Portfolio",
  
  // 2. DESCRIPTION: Generalized for professional content
  description: "Official Portfolio Website of Abdul Barr. Showcasing production-ready Full Stack applications, projects, and professional work.",
  
  // 3. KEYWORDS: Broadened for global and professional search
  keywords: [
    'Abdul Barr', 
    'Portfolio', 
    'Developer',
    'Web Development',
    'Professional Portfolio', 
    'Full Stack',
    'Projects'
  ],

  // 4. OPEN GRAPH: Standardized for global sharing
  openGraph: {
    title: 'Abdul Barr | Portfolio',
    description: 'Official Portfolio Website of Abdul Barr, showcasing projects and professional work.',
    url: 'https://abdulbarr.in', 
    siteName: 'Abdul Barr Portfolio',
    locale: 'en_US', // Standard locale for worldwide audience
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