'use client';

import { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { allProjectsData } from '@/app/data/projectData';

gsap.registerPlugin(ScrollTrigger);

// -----------------------------------------
// ✅ Stat Counter (Same as before)
// -----------------------------------------
const StatCounter = ({ metric, label }) => {
  const numberRef = useRef(null);
  const containerRef = useRef(null);
  
  const finalValue = parseInt(metric);
  const isNumber = !isNaN(finalValue);
  const metricSuffix = isNumber ? metric.replace(finalValue.toString(), '') : '';

  useEffect(() => {
    const el = numberRef.current;
    const box = containerRef.current;
    if (!el || !box || !isNumber) return;

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
        gsap.to(box, {
          scale: 1.05,
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
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
  }, [finalValue, metricSuffix, isNumber]);

  return (
    <div
      ref={containerRef}
      className="mt-5 text-center bg-primary/5 rounded-lg py-3 px-4 border border-primary/10 transition-all duration-300"
    >
      <h3 ref={numberRef} className="text-3xl font-extrabold text-primary">
        {isNumber ? `0${metricSuffix}` : metric}
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

  // 1. Get the first 3 projects only
  const recentProjects = allProjectsData.slice(0, 3);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Image Zoom Animation
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

      // Card Entrance
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
        {recentProjects.map((project, index) => (
          <Link
            href="/projects" // ✅ UPDATED: Goes to the main Projects Page
            key={index}
            className="block group project-card-wrapper"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col border border-gray-100">
              {/* Image Section */}
              <div className="w-full h-52 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-100" />
                {project.snapshotUrl ? (
                  <Image
                    src={project.snapshotUrl}
                    alt={project.title}
                    fill
                    className="object-cover project-snapshot-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/90 text-primary rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                    <svg
                      className="w-6 h-6"
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
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {project.detailedDescription} {/* Use detailedDescription for better context */}
                  </p>
                </div>

                {/* Metric / Impact Section */}
                {project.impact && (
                  <div className="mt-4">
                    <StatCounter
                      metric={project.impact.metric}
                      label={project.impact.label}
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