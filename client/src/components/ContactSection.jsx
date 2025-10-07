// src/components/ContactSection.jsx
'use client';

import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <motion.section
      id="contact"
      className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold tracking-tight text-primary dark:text-background mb-4">
        Get In Touch
      </h2>
      <p className="max-w-xl mx-auto text-lg text-secondary dark:text-gray-400 mb-8">
        My inbox is always open. Whether you have a question, a project proposal, or just want to say hello, I'll get back to you!
      </p>
      <motion.a
        href="mailto:abdulbarr730@gmail.com"
        className="inline-block bg-primary text-white dark:bg-background dark:text-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Say Hello
      </motion.a>
    </motion.section>
  );
};

export default ContactSection;