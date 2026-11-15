'use client';
// Section heading used across the home page:
//   01 — ABOUT ──────────────────────          (link →)
//   Big title.                    intro text
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SectionHeader({ index, eyebrow, title, intro, link, linkLabel }) {
  return (
    <div className="mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent"
      >
        {index && <span className="tabular-nums">{index}</span>}
        {index && <span className="h-px w-6 bg-accent" />}
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-primary/10" />
        {link && (
          <Link
            href={link}
            className="group hidden items-center gap-1 normal-case tracking-normal text-sm font-semibold text-primary hover:text-accent sm:inline-flex"
          >
            {linkLabel || 'View all'}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        )}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="accent-dot md:col-span-7 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-primary"
        >
          {title}
        </motion.h2>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-5 text-base md:text-lg leading-relaxed text-secondary"
          >
            {intro}
          </motion.p>
        )}
      </div>

      {link && (
        <Link href={link} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent sm:hidden">
          {linkLabel || 'View all'} &rarr;
        </Link>
      )}
    </div>
  );
}

// Fade-up wrapper for blocks inside sections
export const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
    className={className}
  >
    {children}
  </motion.div>
);
