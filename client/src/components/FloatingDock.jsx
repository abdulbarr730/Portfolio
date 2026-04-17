'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Home, ArrowUp, ArrowDown, Briefcase, Code, Linkedin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingDock() {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.body.scrollHeight;
      const viewport = window.innerHeight;

      setVisible(scrollY > 300 && scrollY < height - viewport - 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 MAGNETIC SYSTEM
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;

    const handleMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const mouseX = e.clientX;

        itemRefs.current.forEach((el) => {
          if (!el) return;

          const rect = el.getBoundingClientRect();
          const center = rect.left + rect.width / 2;

          const distance = Math.abs(mouseX - center);

          const maxScale = 1.6;
          const range = 140;

          let scale = 1;

          if (distance < range) {
            scale = 1 + (maxScale - 1) * (1 - distance / range);
          }

          el.style.transform = `scale(${scale}) translateY(${-(scale - 1) * 10}px)`;
        });
      });
    };

    const reset = () => {
      itemRefs.current.forEach((el) => {
        if (el) {
          el.style.transform = 'scale(1) translateY(0)';
        }
      });
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', reset);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', reset);
    };
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  const Item = ({ children, label, onClick, href, index }) => {
    return (
      <div className="relative group flex flex-col items-center">

        {/* Tooltip */}
        <span className="
          absolute -top-9
          text-[11px]
          px-2 py-1
          rounded-md
          bg-black text-white
          opacity-0
          translate-y-1
          group-hover:opacity-100
          group-hover:translate-y-0
          transition-all duration-200
          whitespace-nowrap
          pointer-events-none
        ">
          {label}
        </span>

        <div
          ref={(el) => (itemRefs.current[index] = el)}
          className="will-change-transform transition-transform duration-200"
        >
          {href ? (
            href.startsWith('http') ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-lg block"
              >
                {children}
              </a>
            ) : (
              <Link
                href={href}
                className="p-2 sm:p-2.5 rounded-lg block"
              >
                {children}
              </Link>
            )
          ) : (
            <button
              onClick={onClick}
              className="p-2 sm:p-2.5 rounded-lg"
            >
              {children}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 60,
          scale: visible ? 1 : 0.95,
          pointerEvents: visible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 sm:bottom-6 inset-x-0 flex justify-center z-50"
      >
        <div className="pointer-events-auto">

          <div
            ref={containerRef}
            className="
              flex items-end gap-2 sm:gap-3
              px-3 sm:px-4
              py-1.5 sm:py-2
              rounded-xl sm:rounded-2xl
              backdrop-blur-xl
              bg-white/60
              border border-black/10
              shadow-[0_6px_20px_rgba(0,0,0,0.06)] sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            "
          >

            <Item label="Home" href="/" index={0}>
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <Item label="Top" onClick={scrollTop} index={1}>
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <Item label="Bottom" onClick={scrollBottom} index={2}>
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <div className="w-px h-5 bg-black/10 mx-1" />

            <Item label="Projects" href="/projects" index={3}>
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <Item label="Services" href="/services" index={4}>
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <Item
              label="LinkedIn"
              href="https://www.linkedin.com/in/abdul-barr-9092a4251/"
              index={5}
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

            <Item
              label="Resume"
              href="https://drive.google.com/file/d/1vnZADDPLb2hbOnx8Fi3W0m8LEesof_z6/view?usp=drive_link"
              index={6}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </Item>

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}