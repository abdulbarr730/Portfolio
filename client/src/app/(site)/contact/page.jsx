'use client';

import { useSettings } from '@/lib/content';
import PageHeader from '@/components/PageHeader';

import { useState } from 'react';
import { motion } from 'framer-motion';

// --- CUSTOM ICONS (Black & White Style) ---

const IconEmail = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconLinkedIn = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const IconGitHub = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
  </svg>
);

const IconCalendar = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconForm = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);


export default function ContactPage() {
  const { socials } = useSettings().settings;
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const endpoint = "https://formspree.io/f/xbdgwppr"; 

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        index="06"
        eyebrow="Contact"
        title="Let's talk"
        intro="Whether you need a full-stack overhaul, a quick technical fix, or just advice on where to start, I treat every project with the same focus I put into my own."
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-sm font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              First consultation is free
            </span>
            <span className="text-sm text-secondary">Available weekends · fast replies on weekdays</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://cal.com/abdul-barr/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-[0_10px_30px_-12px_rgb(var(--accent-rgb)/0.8)] transition-colors hover:bg-primary"
            >
              Book 15-min call
              <IconCalendar className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://forms.gle/W5EHuDF57kRi64d76"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-surface px-6 py-3 font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Appointment form
              <IconForm className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </PageHeader>

      <div className="page-container">

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* LEFT: The Email Form */}
          <motion.div 
            className="card p-8 md:p-12 h-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="accent-dot text-3xl font-bold text-primary mb-2">Drop me a line</h2>
              <p className="text-secondary">Prefer email? Fill this out and I'll get back to you within 24 hours.</p>
            </div>
            
            {formStatus === 'success' ? (
              <div className="text-center py-20 bg-background rounded-3xl border border-primary/15">
                <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg">✓</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Received!</h3>
                <p className="text-secondary">I'll check it out and reply shortly.</p>
                <button 
                  onClick={() => setFormStatus('idle')} 
                  className="mt-8 px-8 py-3 bg-surface text-primary rounded-xl font-bold border-2 border-accent hover:bg-accent hover:text-white transition-all"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      required 
                      className="w-full px-5 py-4 rounded-xl bg-background border-2 border-transparent focus:bg-surface focus:border-primary focus:shadow-lg outline-none transition-all duration-300 font-medium placeholder-secondary/60 hover:bg-muted/60"
                      placeholder="e.g. Elon Musk"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Your Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      required 
                      className="w-full px-5 py-4 rounded-xl bg-background border-2 border-transparent focus:bg-surface focus:border-primary focus:shadow-lg outline-none transition-all duration-300 font-medium placeholder-secondary/60 hover:bg-muted/60"
                      placeholder="elon@spacex.com"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">How can I help?</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="6" 
                    required 
                    className="w-full px-5 py-4 rounded-xl bg-background border-2 border-transparent focus:bg-surface focus:border-primary focus:shadow-lg outline-none transition-all duration-300 resize-none font-medium leading-relaxed placeholder-secondary/60 hover:bg-muted/60"
                    placeholder="Tell me a bit about your project goals..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-accent text-white hover:bg-primary shadow-[0_10px_30px_-10px_rgb(var(--accent-rgb)/0.7)] font-bold py-4 rounded-xl text-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending...</span>
                    </>
                  ) : 'Send Message'}
                </button>
                {formStatus === 'error' && <p className="text-red-500 text-sm text-center font-medium">Something went wrong. Please try again.</p>}
              </form>
            )}
          </motion.div>

          {/* RIGHT: Contact Details & Schedule (Bottom Right) */}
          <motion.div 
            className="space-y-8 flex flex-col h-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            
            {/* 1. Direct Channels Card (Monochrome Icons) */}
            <div className="bg-surface p-10 rounded-[2rem] shadow-xl shadow-gray-200/60 border border-primary/15 flex-grow">
              <h3 className="text-2xl font-bold text-primary mb-8">Direct Channels</h3>
              
              <div className="space-y-4">
                {/* Email */}
                <a 
                  href={`mailto:${socials.email}`}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-background border border-transparent hover:bg-surface hover:border-primary transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-surface border border-primary/15 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconEmail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-primary font-bold break-all transition-colors">{socials.email}</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a 
                  href={socials.linkedin} target="_blank"
                  className="flex items-center gap-5 p-4 rounded-2xl bg-background border border-transparent hover:bg-surface hover:border-primary transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-surface border border-primary/15 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconLinkedIn className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-0.5">LinkedIn</p>
                    <p className="text-primary font-bold transition-colors">Connect Professionally</p>
                  </div>
                </a>

                {/* GitHub */}
                <a 
                  href={socials.github} 
                  target="_blank"
                  className="flex items-center gap-5 p-4 rounded-2xl bg-background border border-transparent hover:bg-surface hover:border-primary transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-surface border border-primary/15 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconGitHub className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-0.5">GitHub</p>
                    <p className="text-primary font-bold transition-colors">Check my Code</p>
                  </div>
                </a>
              </div>
            </div>

            {/* 2. Schedule Options (Bottom Right) */}
            <div className="bg-muted/60 p-10 rounded-[2rem] border border-primary/15 shadow-inner">
               <h3 className="text-2xl font-bold text-primary mb-6">Ready to schedule?</h3>
               <div className="space-y-4">
                  {/* Cal.com */}
                  <a 
                    href="https://cal.com/abdul-barr/15min" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-ink text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:bg-accent hover:-translate-y-1 transition-all group"
                  >
                    <span>Book 15-min Call</span>
                    <IconCalendar className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* Google Form */}
                  <a 
                    href="https://forms.gle/W5EHuDF57kRi64d76" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-surface text-primary px-6 py-4 rounded-xl font-bold border-2 border-primary shadow-sm hover:bg-background hover:-translate-y-1 transition-all group"
                  >
                    <span>Fill Appointment Form</span>
                    <IconForm className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
               </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}