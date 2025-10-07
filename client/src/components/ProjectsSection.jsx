'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    title: "SIH College Portal",
    description: "A full-stack app to manage college hackathons with JWT-based auth, role control, and team formation.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB", "Supabase"],
    liveUrl: "https://hackathon-college-portal.vercel.app",
    githubUrl: "https://github.com/abdulbarr730"
  },
  {
    title: "AI Meeting Notes Summarizer",
    description: "Uses Groq API with Llama 3 to generate summaries of meeting transcripts based on user prompts.",
    technologies: ["React", "Node.js (Serverless)", "Groq API", "Llama 3", "Vercel"],
    liveUrl: "https://meeting-summarizer-black.vercel.app",
    githubUrl: "https://github.com/abdulbarr730"
  },
  {
    title: "E-commerce Website - Two Good Co.",
    description: "A highly interactive and responsive e-commerce frontend with complex scroll-triggered animations.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Locomotive Scroll"],
    liveUrl: "https://twogood-e-commerce.vercel.app",
    githubUrl: "https://github.com/abdulbarr730"
  },
  {
    title: "GTA-VI Re-imagined Website",
    description: "A responsive, single-page concept website inspired by GTA-VI, built with React and GSAP.",
    technologies: ["ReactJs", "GSAP"],
    liveUrl: "https://gta-vi-imagine.vercel.app",
    githubUrl: "https://github.com/abdulbarr730"
  }
];

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold text-primary dark:text-background mb-2">{project.title}</h3>
        <p className="text-secondary dark:text-gray-400 mb-4 flex-grow">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span key={index} className="bg-background dark:bg-primary/80 dark:text-gray-300 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center space-x-4 mt-auto">
          <Link href={project.liveUrl || '#'} target="_blank" className="text-primary dark:text-background font-bold hover:underline">
            Live Demo
          </Link>
          <Link href={project.githubUrl || '#'} target="_blank" className="text-secondary dark:text-gray-300 hover:underline">
            GitHub
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={component} id="portfolio" className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 bg-background dark:bg-primary">
      <h2 className="text-4xl font-bold tracking-tight text-primary dark:text-background mb-12 text-center">
        My Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <div key={index} className="project-card">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;