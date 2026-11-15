'use client';
// Home page 09 Contact: dark band with a headline + quick message form (Formspree).
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSettings } from '@/lib/content';

const inputCls =
  'w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-primary placeholder:text-secondary/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export default function ContactSection({ index = '09' }) {
  const { socials } = useSettings().settings;

  return (
    <section id="contact" className="page-container pb-24 md:pb-32">
      <div className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="tabular-nums">{index}</span>
        <span className="h-px w-6 bg-accent" />
        <span>Contact</span>
        <span className="h-px flex-1 bg-primary/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] bg-primary p-8 md:p-14"
      >
        <span aria-hidden="true" className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <span aria-hidden="true" className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left */}
          <div className="lg:col-span-6">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tighter text-background">
              Let&apos;s build
              <br />
              something<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/70">
              Have a project, a bug that won&apos;t die, or just an idea? Send a quick message. The first consultation is free.
            </p>

            <div className="mt-8 space-y-3">
              {socials.email && (
                <a href={`mailto:${socials.email}`} className="group flex items-center gap-3 text-background">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50 w-16">Email</span>
                  <span className="text-lg font-semibold underline decoration-accent/60 underline-offset-4 group-hover:decoration-accent">
                    {socials.email}
                  </span>
                </a>
              )}
              <a href="https://cal.com/abdul-barr/15min" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-background">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50 w-16">Call</span>
                <span className="text-lg font-semibold underline decoration-accent/60 underline-offset-4 group-hover:decoration-accent">
                  Book a 15-min call
                </span>
              </a>
            </div>

            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-background/80 transition-colors hover:text-accent"
            >
              More ways to reach me &rarr;
            </Link>
          </div>

          {/* Right: quick form */}
          <div className="lg:col-span-6">
            <form action="https://formspree.io/f/xbdgwppr" method="POST" className="space-y-4 rounded-2xl bg-surface p-6 md:p-8 shadow-2xl">
              <p className="text-lg font-bold text-primary">Quick message</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" name="name" placeholder="Your name" required autoComplete="name" className={inputCls} />
                <input type="email" name="email" placeholder="you@example.com" required autoComplete="email" className={inputCls} />
              </div>
              <textarea name="message" placeholder="Tell me a bit about your project…" rows={5} required className={`${inputCls} resize-none`} />
              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white shadow-[0_12px_30px_-12px_rgb(var(--accent-rgb)/0.8)] transition-colors hover:bg-primary"
              >
                Send message
              </button>
              <p className="text-center text-xs text-secondary">I usually reply within a day. Weekends for calls.</p>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
