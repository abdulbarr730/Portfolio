'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const email = "abdulbarr730@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      id="contact"
      className="container mx-auto py-32 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* Left Column: Email */}
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-secondary mb-2">Email</h3>
          <div className="relative inline-block">
            <button
              onClick={handleCopy}
              className="text-xl font-bold text-primary cursor-pointer hover:text-secondary transition-transform hover:scale-105"
            >
              {email}
            </button>
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md"
                >
                  Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-secondary/70 mt-2">(Click to copy)</p>
        </motion.div>

        {/* Center Column: Main Text and Buttons */}
        <motion.div 
          className="text-center order-first md:order-none flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold tracking-tight text-primary mb-4">
            Get In Touch
          </h2>
          <p className="max-w-xs mx-auto text-lg text-secondary mb-8">
            Have a project in mind or just want to connect? My inbox is always open.
          </p>

          {/* Main CTA */}
          <motion.a
            href={`mailto:${email}`}
            className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform hover:scale-105 mb-4"
            whileTap={{ scale: 0.95 }}
          >
            Say Hello
          </motion.a>

          {/* Book a Service Button with pulse */}
          {/* <motion.div
            className="inline-block"
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Link
              href="/services"
              className="inline-block bg-secondary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-transform hover:scale-105"
            >
              Book a Service
            </Link>
          </motion.div> */}
        </motion.div>

        {/* Right Column: Social Links */}
        <motion.div 
          className="text-center md:text-right"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-secondary mb-2">Socials</h3>
          <div className="flex justify-center md:justify-end items-center space-x-6">
            <motion.a 
              href="https://github.com/abdulbarr730"
              target="_blank" 
              className="text-secondary hover:text-primary transition-transform hover:scale-110"
              whileTap={{ scale: 0.95 }}
              aria-label="GitHub Profile"
            >
              {/* GitHub Logo */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/abdul-barr-9092a4251"
              target="_blank" 
              className="text-secondary hover:text-primary transition-transform hover:scale-110"
              whileTap={{ scale: 0.95 }}
              aria-label="LinkedIn Profile"
            >
              {/* LinkedIn Logo */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default ContactSection;
