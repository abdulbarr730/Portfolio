'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactSection = () => {
  return (
    <motion.section
      id="contact"
      className="container mx-auto py-20 md:py-24 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="text-center lg:text-left space-y-5">

          <motion.h2 
            className="text-3xl md:text-4xl font-semibold leading-tight"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Collaborate?
          </motion.h2>

          <motion.p 
            className="max-w-lg text-neutral-600 mx-auto lg:mx-0"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Whether you want to discuss a project, need help, or just explore ideas — send a quick message.
          </motion.p>

          {/* subtle divider */}
          <div className="w-16 h-[2px] bg-black/20 mx-auto lg:mx-0"></div>

          {/* secondary line */}
          <p className="text-sm text-neutral-500 max-w-md mx-auto lg:mx-0">
            For full contact details, meeting requests, and appointment booking — use the complete contact page.
          </p>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium"
            >
              Go to Full Contact Page →
            </Link>
          </motion.div>

        </div>

        {/* RIGHT SIDE - MINI FORM */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border border-neutral-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm bg-white"
        >

          <form
            action="https://formspree.io/f/xbdgwppr"
            method="POST"
            className="space-y-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full border border-neutral-200 p-3 rounded-md focus:outline-none focus:border-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full border border-neutral-200 p-3 rounded-md focus:outline-none focus:border-black"
            />

            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              required
              className="w-full border border-neutral-200 p-3 rounded-md focus:outline-none focus:border-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md font-medium hover:opacity-90 transition"
            >
              Send Message
            </button>

          </form>

          {/* DECORATIVE / CTA BLOCK */}
          <div className="pt-4 border-t border-neutral-200 text-center space-y-2">

            <p className="text-sm text-neutral-600">
              Need a meeting or detailed discussion?
            </p>

            <Link
              href="/contact"
              className="inline-block text-black font-medium underline"
            >
              Go to Full Contact Page →
            </Link>

          </div>

        </motion.div>

      </div>
    </motion.section>
  );
};

export default ContactSection;