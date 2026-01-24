'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactSection = () => {
  return (
    <motion.section
      id="contact"
      className="container mx-auto py-32 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col items-center text-center">
        
        <motion.h2 
          className="text-4xl font-bold tracking-tight text-primary mb-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Collaborate?
        </motion.h2>

        <motion.p 
          className="max-w-xl mx-auto text-lg text-secondary mb-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Whether you want to discuss a project, schedule a call, or just say hello, I have a dedicated space for us to connect.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/contact"
            className="inline-block bg-primary text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Get in Touch &rarr;
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default ContactSection;