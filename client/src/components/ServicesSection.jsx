'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Mail, Globe, Wrench, Server, Database, Cloud, Layers, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServices } from '@/lib/content';
import PageHeader from '@/components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const STEPS = [
  { title: 'NDA first', text: 'Your idea is protected before we talk details.' },
  { title: 'Clear proposal', text: 'Scope, timeline and price, in writing.' },
  { title: 'Built in your accounts', text: 'Hosting, repo and domains in your name.' },
  { title: 'Full handover', text: 'Code, docs and access, then I delete my copy.' },
];

// Admin stores icon names as strings; map them to lucide components here.
const ICONS = { Mail, Globe, Wrench, Server, Database, Cloud, Layers };

export default function ServicesSection() {
  const { services } = useServices();
  const servicesData = services.map((s) => ({ ...s, icon: ICONS[s.icon] || Globe }));
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);

  // --- 1. GSAP ANIMATIONS ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: -10,
          stagger: 0.5,
          duration: 0.9,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 100%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      gsap.utils.toArray('.service-icon').forEach((icon) => {
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.2, rotate: 10, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        });
        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power1.inOut' });
        });
      });

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- 2. SCROLL LOCK EFFECT ---
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedService]);

  return (
    <section ref={sectionRef} className="relative w-full pb-24">
      <PageHeader
        index="05"
        eyebrow="What I offer"
        title="Services"
        intro="Reliable, secure, scalable builds with a structured process from planning to deployment, so you get systems built to last, not just to launch."
      />

      {/* How I work */}
      <div className="page-container mb-14">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-primary/10 bg-primary/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-background p-6">
              <p className="eyebrow tabular-nums">Step {String(i + 1).padStart(2, '0')}</p>
              <p className="mt-3 font-bold text-primary">{step.title}</p>
              <p className="mt-1 text-sm text-secondary">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="page-container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {servicesData.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              onClick={() => setSelectedService(service)}
              className="service-card card card-hover group relative flex cursor-pointer flex-col p-7"
              whileHover={{ y: -4 }}
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="service-icon grid h-12 w-12 place-items-center rounded-xl bg-muted/60 text-primary transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold tabular-nums text-secondary/70">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-primary">{service.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-secondary">{service.description}</p>
              <span className="mt-auto text-sm font-semibold text-primary">
                View process <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* CTA band */}
      <div ref={ctaRef} className="page-container mt-20">
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-primary p-8 md:flex-row md:items-center md:p-12">
          <span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <p className="eyebrow">Weekends only</p>
            <h3 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-background">Ready to solve your problem?</h3>
            <p className="mt-2 max-w-xl text-background/70">I take calls on Saturdays and Sundays. Book a slot and let&apos;s get moving.</p>
          </div>
          <Link
            href="/contact"
            className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:translate-x-1"
          >
            Book free consultation &rarr;
          </Link>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 pt-12 sm:pt-0">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // FIXED: Added overflow-hidden to parent and scrollbar-hide logic
              className="relative bg-surface w-full max-w-xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col border border-primary/15 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 bg-muted/60 rounded-full hover:bg-muted transition-colors z-20"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>

              {/* Scrollable Area - Hiding Scrollbar for clean look */}
              <div className="overflow-y-auto p-8 pt-10 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <selectedService.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary leading-tight">{selectedService.title}</h3>
                </div>

                <p className="text-secondary leading-relaxed mb-8 border-l-4 border-primary/30 pl-4 text-sm sm:text-base">
                  {selectedService.details}
                </p>

                <h4 className="text-lg font-bold text-primary mb-4 uppercase tracking-wider text-xs">The Workflow</h4>
                
                <div className="space-y-3">
                  {selectedService.workflow.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background border border-primary/10"
                    >
                      <div className="mt-0.5 min-w-[20px]">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-secondary font-medium text-sm">{step}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-primary/10 flex justify-end">
                  <Link 
                    href="/contact"
                    className="w-full sm:w-auto text-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-accent transition-colors shadow-lg"
                  >
                    Book This Service
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}