'use client';
// macOS-style floating dock. Icons smoothly magnify near the cursor (spring
// physics), items come from the admin panel (Dock tab).
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, ArrowUp, ArrowDown, Briefcase, Code, Linkedin, Github, FileText, Mail, BookOpen, User, Calendar, Star, Phone,
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSettings } from '@/lib/content';

export const DOCK_ICONS = { Home, ArrowUp, ArrowDown, Briefcase, Code, Linkedin, Github, FileText, Mail, BookOpen, User, Calendar, Star, Phone };

const BASE = 40; // px
const MAX = 60; // px when the cursor is right on it
const RANGE = 130; // px of influence either side

function DockIcon({ item, mouseX, active }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const Icon = DOCK_ICONS[item.icon] || Home;

  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - (b.left + b.width / 2) : Infinity;
  });
  const sizeTarget = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
  const size = useSpring(sizeTarget, { mass: 0.15, stiffness: 180, damping: 14 });
  const iconSize = useTransform(size, [BASE, MAX], [18, 26]);

  const scrollTo = (where) =>
    window.scrollTo({ top: where === 'top' ? 0 : document.body.scrollHeight, behavior: 'smooth' });

  const inner = (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className={`relative grid place-items-center rounded-full transition-colors duration-200 ${
        hover ? 'bg-accent text-white' : active ? 'bg-accent/10 text-accent' : 'bg-muted/50 text-primary'
      }`}
    >
      <motion.span style={{ width: iconSize, height: iconSize }} className="grid place-items-center">
        <Icon className="h-full w-full" strokeWidth={1.8} />
      </motion.span>

      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-background shadow-md"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {active && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-accent" />}
    </motion.div>
  );

  if (item.action === 'top' || item.action === 'bottom') {
    return (
      <button type="button" aria-label={item.label} onClick={() => scrollTo(item.action)}>
        {inner}
      </button>
    );
  }
  const href = item.href || '/';
  if (item.newTab || /^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={item.label}>
      {inner}
    </Link>
  );
}

export default function FloatingDock() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(Infinity);

  const items = (settings.dock || []).filter((d) => !d.hidden);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > 300 && window.scrollY < max - 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!items.length) return null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 flex justify-center"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-[60px] items-end gap-2.5 rounded-2xl border border-primary/10 bg-surface/70 px-3 pb-2.5 shadow-[0_12px_40px_-12px_rgba(34,34,34,0.25)] backdrop-blur-xl"
      >
        {items.map((item, i) =>
          item.action === 'divider' ? (
            <span key={`d${i}`} className="mx-0.5 mb-2 h-6 w-px self-end bg-primary/15" />
          ) : (
            <DockIcon
              key={`${item.label}-${i}`}
              item={item}
              mouseX={mouseX}
              active={item.action === 'link' && item.href === pathname}
            />
          )
        )}
      </div>
    </motion.div>
  );
}
