'use client';
// Shared editorial header for inner pages:
//   04 — JOURNAL ─────────────
//   Writing.                         intro paragraph
import { motion } from 'framer-motion';

export default function PageHeader({ index, eyebrow, title, intro, children }) {
  return (
    <header className="page-container pt-32 md:pt-40 pb-12 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent"
      >
        {index && <span className="tabular-nums">{index}</span>}
        {index && <span className="h-px w-6 bg-accent" />}
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-primary/10" />
      </motion.div>

      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="accent-dot md:col-span-7 text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-primary"
        >
          {title}
        </motion.h1>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="md:col-span-5 text-base md:text-lg leading-relaxed text-secondary"
          >
            {intro}
          </motion.p>
        )}
      </div>

      {children && <div className="mt-10">{children}</div>}
    </header>
  );
}
