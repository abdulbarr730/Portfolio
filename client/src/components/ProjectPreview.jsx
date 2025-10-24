'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    title: "SIH College Portal",
    description: "A full-stack app to manage college hackathons.",
    liveUrl: "https://hackathon-college-portal.vercel.app",
    snapshotUrl: "/snapshots/sih-portal.png"
  },
  {
    title: "AI Meeting Notes Summarizer",
    description: "Uses Groq API with Llama 3 to generate summaries.",
    liveUrl: "https://meeting-summarizer-black.vercel.app",
    snapshotUrl: "/snapshots/ai-summarizer.png"
  },
  {
    title: "GTA-VI Re-imagined Website",
    description: "A visually bold React concept inspired by GTA-VI with advanced GSAP-driven animations.",
    technologies: ["ReactJs", "GSAP"],
    liveUrl: "https://gta-vi-imagine.vercel.app",
    snapshotUrl: "/snapshots/gta-vi.png"
  }
];

const ProjectPreview = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // NEW: Image Stretch Animation for each project snapshot
      gsap.utils.toArray('.project-snapshot-image').forEach(image => {
        gsap.fromTo(image, 
          { scale: 1.4, y: '-10%' }, // Start zoomed in
          {
            scale: 1, // Animate to normal size
            y: '0%',
            ease: "power2.out",
            scrollTrigger: {
              trigger: image.closest('.project-card-wrapper'), // Trigger on the parent card
              start: "top 85%",
              end: "bottom center",
              scrub: 1,
            }
          }
        );
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={component} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <Link href={project.liveUrl || '#'} key={index} target="_blank" className="block group project-card-wrapper">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
              <div className="w-full h-48 relative overflow-hidden">
                {/* Placeholder background */}
                <div className="absolute inset-0 bg-muted "></div>
                {/* The image now has a class for GSAP to target */}
                <Image src={project.snapshotUrl} alt={project.title} fill className="object-cover project-snapshot-image" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                <p className="text-secondary text-sm">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;