'use client';

import { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// -----------------------------------------
// ✅ Project Data
// -----------------------------------------
const projectsData = [
  {
    title: "SIH College Portal",
    description: "A full-stack app to manage college hackathons and internal Smart India Hackathon processes.",
    metric: { value: "80+", label: "Student Signups" },
    liveUrl: "https://hackathon-college-portal.vercel.app",
    snapshotUrl: "/snapshots/sih-portal.png",
  },
  {
    title: "AI Meeting Notes Summarizer",
    description: "Uses Groq API with Llama 3 to generate structured summaries instantly from transcripts.",
    liveUrl: "https://meeting-summarizer-black.vercel.app",
    snapshotUrl: "/snapshots/ai-summarizer.png",
  },
  {
    title: "GTA-VI Re-imagined Website",
    description: "A visually bold React concept inspired by GTA-VI with cinematic GSAP-driven animations.",
    technologies: ["ReactJs", "GSAP"],
    liveUrl: "https://gta-vi-imagine.vercel.app",
    snapshotUrl: "/snapshots/gta-vi.png",
  },
];

// -----------------------------------------
// ✅ Stat Counter Component with Glow Effect
// -----------------------------------------
const StatCounter = ({ metric, label }) => {
  const numberRef = useRef(null);
  const containerRef = useRef(null);
  const finalValue = parseInt(metric);
  const metricSuffix = metric.replace(finalValue.toString(), '');

  useEffect(() => {
    const el = numberRef.current;
    const box = containerRef.current;
    if (!el || !box) return;

    const counter = { value: 0 };
    const anim = gsap.to(counter, {
      value: finalValue,
      duration: 2,
      ease: 'power3.out',
      paused: true,
      onUpdate: () => {
        el.innerText = Math.round(counter.value) + metricSuffix;
      },
      onComplete: () => {
        // Add subtle pulse & glow when finished counting
        gsap.to(box, {
          scale: 1.08,
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        });
      },
    });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => anim.play(),
      once: true,
    });

    return () => anim.kill();
  }, [finalValue, metricSuffix]);

  return (
    <div
      ref={containerRef}
      className="mt-5 text-center bg-primary/5 rounded-lg py-3 px-4 border border-primary/10 transition-all duration-300"
    >
      <h3 ref={numberRef} className="text-3xl font-extrabold text-primary">
        0{metricSuffix}
      </h3>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  );
};

// -----------------------------------------
// ✅ Main Component
// -----------------------------------------
const ProjectPreview = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Smooth image zoom-out animation on scroll
      gsap.utils.toArray('.project-snapshot-image').forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1.3, y: '-10%' },
          {
            scale: 1,
            y: '0%',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: image.closest('.project-card-wrapper'),
              start: 'top 85%',
              end: 'bottom center',
              scrub: 1,
            },
          }
        );
      });

      // Card entrance animation
      gsap.from('.project-card-wrapper', {
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: component.current,
          start: 'top 90%',
        },
      });
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={component} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <Link
            href={project.liveUrl || '#'}
            key={index}
            target="_blank"
            className="block group project-card-wrapper"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
              {/* Image Section */}
              <div className="w-full h-52 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-100" />
                <Image
                  src={project.snapshotUrl}
                  alt={project.title}
                  fill
                  className="object-cover project-snapshot-image"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 text-left flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Animated Metric (only for SIH) */}
                {project.metric && (
                  <div className="mt-4">
                    <StatCounter
                      metric={project.metric.value}
                      label={project.metric.label}
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;
