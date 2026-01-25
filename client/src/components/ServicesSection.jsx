'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Mail, Globe, Wrench, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const servicesData = [
  {
    title: "Website Development",
    icon: Globe,
    description:
      "I design and develop fully responsive, fast, and SEO-optimized websites using modern technologies like Next.js and Tailwind CSS.",
    details: "Whether you need a landing page, a portfolio, or a full business site, I build digital experiences that convert visitors into customers.",
    workflow: [
      "Discovery Call: Understanding your brand, goals, and target audience.",
      "Design & Wireframing: Creating a visual blueprint of the site.",
      "Development: Coding the site using Next.js for speed and SEO.",
      "Review & Refine: Tweaking details based on your feedback.",
      "Launch & Support: Deploying to the live server and ensuring stability."
    ]
  },
  {
    title: "Consultancy",
    icon: Mail,
    description:
      "Get personalized digital consultancy on your online presence, website optimization, or project ideas.",
    details: "Not sure which tech stack to use? Need a code review? Or just want advice on how to start? Let's have a chat.",
    workflow: [
      "Booking: You schedule a time via the Contact page.",
      "Problem Analysis: I review your current situation or questions.",
      "Strategy Session: We discuss actionable solutions (1-on-1 call).",
      "Roadmap: I provide a clear path forward for your project.",
      "Follow-up: Check-ins to ensure you're on the right track."
    ]
  },
  {
    title: "Software Issue Fixing",
    icon: Wrench,
    description:
      "I troubleshoot and resolve software-related issues on laptops and computers, including system errors and slow performance.",
    details: "Don't let a slow computer or weird error messages slow you down. I diagnose specific OS level issues, driver conflicts, and software bugs.",
    workflow: [
      "Diagnosis: You describe the issue (or share screenshots).",
      "Assessment: I identify the root cause (remote or guided).",
      "Troubleshooting: Applying specific fixes to the software/OS.",
      "Optimization: Cleaning up residual files to prevent recurrence.",
      "Verification: Ensuring the system runs smoothly before signing off."
    ]
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);

  // --- 1. GSAP ANIMATIONS ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
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
          duration: 0.8,
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
    <section ref={sectionRef} className="container mx-auto py-32 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-primary mb-4">
          My Services
        </h2>
        <p className="text-secondary max-w-2xl mx-auto text-base mb-6">
          Over the years, I’ve worked with immense focus to create digital solutions that help people.
          Click on any card below to see exactly how I work. I build with a security-first architecture. From encrypted databases to sanitized inputs, every layer of your application is engineered to protect user privacy and maintain absolute data integrity.
        </p>

        {/* Free Line (Top) */}
        <div className="inline-block bg-primary/5 border border-primary/20 rounded-full px-6 py-2">
          <span className="text-primary font-bold text-sm sm:text-base">
            Your first consultancy session is absolutely free.
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {servicesData.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              onClick={() => setSelectedService(service)}
              className="service-card group bg-white rounded-2xl p-8 shadow-lg cursor-pointer border-2 border-transparent hover:border-primary/10 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
              whileHover={{ y: -10 }}
            >
              <div className="mb-4 transition-transform duration-500 service-icon">
                <Icon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                {service.description}
              </p>
              
              <span className="text-primary text-sm font-bold mt-auto group-hover:underline">
                View Process &rarr;
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="mt-24 text-center bg-primary/5 rounded-3xl p-10 border border-primary/10 relative overflow-hidden">
        <h3 className="text-3xl font-bold text-primary mb-3">
          Ready to solve your problem?
        </h3>
        <p className="text-secondary mb-8 max-w-xl mx-auto">
          I’m available on weekends (Saturday & Sunday). 
          Book a slot now and let's get moving.
        </p>

        <Link
          href="/contact"
          className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Book Free Consultancy
        </Link>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // FIXED: Added overflow-hidden to parent and scrollbar-hide logic
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
              >
                <X className="w-5 h-5 text-gray-600" />
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
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="mt-0.5 min-w-[20px]">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-gray-700 font-medium text-sm">{step}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <Link 
                    href="/contact"
                    className="w-full sm:w-auto text-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg"
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