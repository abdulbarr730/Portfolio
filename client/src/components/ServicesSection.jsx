'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Mail, Globe, Wrench, Server, Database, Cloud, Layers, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const servicesData = [
  {
    title: "Website Development",
    icon: Globe,
    description:
      "High-performance, SEO-optimized websites built with complete ownership, security, and scalability in mind.",
    details:
      "I deliver production-ready websites where you fully own the code, hosting, and infrastructure. No lock-in, no dependency on my accounts.",
    workflow: [
      "NDA Signing: Before discussing any project details, we sign a non-disclosure agreement to protect your idea and data.",
      "Requirement Discussion: We define goals, target audience, features, and expected outcomes.",
      "Proposal: You receive a structured proposal including scope, timeline, deliverables, and pricing.",
      "Contract Agreement: Covers ownership, deliverables, payment terms, timeline, and confidentiality clauses.",
      "Account Setup: Domain, hosting, Vercel/AWS, and email services are created in YOUR name and YOUR email.",
      "Development Setup: Codebase initialized in your GitHub (or preferred repo). No personal accounts used.",
      "UI + Frontend Development: Responsive, fast, SEO-friendly interface using modern frameworks.",
      "Backend Integration (if needed): APIs, forms, database, and authentication setup.",
      "Security Implementation: Input validation, environment protection, and best practices applied.",
      "Testing Phase: Cross-device testing, performance optimization, SEO checks.",
      "Deployment: Production deployment in your infrastructure.",
      "Documentation: Complete explanation of structure, APIs, and usage.",
      "Handover: Full access, credentials, and source code transferred.",
      "Post-Completion: Code removed from my local systems after delivery.",
      "Final Invoice + Closure: Payment confirmation and optional NDA continuation."
    ]
  },

  {
    title: "SaaS Development",
    icon: Layers,
    description:
      "Complete SaaS platforms with authentication, dashboards, multi-tenant systems, and scalable architecture.",
    details:
      "From idea to production SaaS — including backend architecture, frontend, auth, and deployment under your ownership.",
    workflow: [
      "NDA Signing before idea discussion.",
      "Product Discovery: Define user roles, features, and business model.",
      "System Architecture Design: Database, API structure, and scalability planning.",
      "Proposal + Pricing Breakdown.",
      "Contract Agreement (includes IP ownership and licensing clarity).",
      "Infrastructure Setup: Database, storage, hosting — all in your account.",
      "Auth System: Login, roles, permissions, and session handling.",
      "Core Development: Backend services, APIs, dashboards, admin panels.",
      "Security Layer: Authentication, authorization, data protection.",
      "Testing: Multi-user testing, edge cases, performance checks.",
      "Deployment: Production setup with monitoring.",
      "Documentation: APIs, architecture, and workflows explained.",
      "Handover: Full code + credentials + infrastructure control.",
      "Post-Completion: No code retention on my side.",
      "Final Closure: Invoice + optional maintenance plan."
    ]
  },

  {
    title: "Web App Development",
    icon: Globe,
    description:
      "Custom web applications tailored to your exact business logic and workflows.",
    details:
      "I build full-stack applications with structured architecture and long-term maintainability.",
    workflow: [
      "NDA + Requirement Gathering.",
      "Feature Mapping + User Flow Design.",
      "Proposal with scope and cost.",
      "Contract finalization.",
      "Environment Setup (your GitHub + hosting).",
      "Frontend + Backend Development in modular structure.",
      "API integrations and real-time features (if required).",
      "Testing cycles and iterative improvements.",
      "Deployment in your infrastructure.",
      "Documentation + handover."
    ]
  },

  {
    title: "Backend & API Development",
    icon: Database,
    description:
      "Secure, scalable backend systems with clean architecture and well-documented APIs.",
    details:
      "Backend systems designed for performance, security, and scalability with clear documentation.",
    workflow: [
      "NDA before discussing architecture.",
      "Requirement Analysis (data flow, load expectations).",
      "Database Schema Design.",
      "API Planning and structure definition.",
      "Proposal + Contract.",
      "Backend Development (modular architecture).",
      "Security Implementation (auth, validation, rate limiting).",
      "API Documentation (Postman / Swagger).",
      "Testing and performance tuning.",
      "Deployment in your environment.",
      "Full code + documentation handover."
    ]
  },

  {
    title: "Hosting & Deployment",
    icon: Cloud,
    description:
      "Production-ready deployment using modern cloud platforms with full ownership and control.",
    details:
      "Your application is deployed securely and optimized, fully under your control — not mine.",
    workflow: [
      "Project assessment and hosting requirement analysis.",
      "Cloud account setup (AWS / Vercel / etc in your name).",
      "Environment configuration (variables, secrets).",
      "CI/CD pipeline setup.",
      "Domain + SSL configuration.",
      "Performance optimization.",
      "Monitoring and logging setup.",
      "Deployment verification.",
      "Access transfer and documentation."
    ]
  },

  {
    title: "Email Configuration",
    icon: Mail,
    description:
      "Professional email systems with domain-based emails and high deliverability.",
    details:
      "Complete email setup for business communication and transactional systems.",
    workflow: [
      "Domain verification.",
      "Business email setup (Google Workspace / SMTP).",
      "DNS configuration (SPF, DKIM, DMARC).",
      "Transactional email setup (Resend, etc).",
      "Testing deliverability.",
      "Spam prevention optimization.",
      "Documentation and access handover."
    ]
  },

  {
    title: "Consultancy",
    icon: Mail,
    description:
      "Direct, practical advice on architecture, product, and technical decisions.",
    details:
      "Focused sessions with clear outcomes — no vague theory.",
    workflow: [
      "Optional NDA.",
      "Problem discussion.",
      "Deep analysis.",
      "Solution strategy.",
      "Actionable roadmap.",
      "Follow-up support."
    ]
  },

  {
    title: "Software Issue Fixing",
    icon: Wrench,
    description:
      "Debugging and fixing system issues, performance problems, and software errors.",
    details:
      "Fast diagnosis and precise fixes for real-world issues.",
    workflow: [
      "Issue reporting.",
      "Diagnosis.",
      "Root cause analysis.",
      "Fix implementation.",
      "System optimization.",
      "Verification and testing."
    ]
  }
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
    <section
      ref={sectionRef}
      className="w-full px-4 sm:px-8 lg:px-16 py-20 md:py-24 relative"
    >
      
      {/* Heading */}
      <div className="text-center mb-16 space-y-6">
        <h2 className="text-6xl md:text-7xl font-bold text-black tracking-tighter">
          My Services
        </h2>

        <div className="max-w-1xl mx-auto space-y-6">
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            Over the years, I’ve focused on building digital solutions that are reliable, secure, and scalable.
          </p>

          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            Each service reflects a structured approach—from planning and development to deployment and ownership—so you get 
            systems that are built to last, not just to launch.
          </p>
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