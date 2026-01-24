'use client';

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, X } from "lucide-react";
import { allProjectsData } from '@/app/data/projectData';

gsap.registerPlugin(ScrollTrigger);

// -----------------------------
// 2️⃣ STAT COUNTER
// -----------------------------
const StatCounter = ({ metric, label, animateOnScroll, isModal = false }) => {
  const numberRef = useRef(null);
  
  const parsedValue = parseInt(metric);
  const isNumber = !isNaN(parsedValue);
  const safeMetric = String(metric || "");
  const metricSuffix = isNumber ? safeMetric.replace(parsedValue.toString(), "") : "";

  useEffect(() => {
    const el = numberRef.current;
    if (!el || !isNumber) return;

    const counter = { value: 0 };
    const anim = gsap.to(counter, {
      value: parsedValue,
      duration: 2,
      ease: "power3.out",
      paused: true,
      onUpdate: () => (el.innerText = Math.round(counter.value) + metricSuffix),
    });

    if (animateOnScroll) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => anim.play(),
        once: true,
      });
    } else {
      anim.play();
    }

    return () => anim.kill();
  }, [parsedValue, metricSuffix, animateOnScroll, isNumber]);

  return (
    <div className={isModal ? "text-center bg-gray-50 p-6 rounded-xl my-6 border border-gray-100" : "mb-3"}>
      <h3
        ref={numberRef}
        className={isModal ? "text-5xl font-bold text-primary" : "text-2xl font-bold text-primary"}
      >
        {isNumber ? `0${metricSuffix}` : safeMetric}
      </h3>
      <p className={isModal ? "text-lg text-gray-600 mt-1" : "text-sm text-gray-500"}>
        {label}
      </p>
    </div>
  );
};

// -----------------------------
// 3️⃣ PROJECT CARD
// -----------------------------
const ProjectCard = ({ project, onClick }) => (
  <div
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden h-full flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative"
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={`View details for ${project.title}`}
  >
    <div className="w-full h-64 relative overflow-hidden">
      {project.snapshotUrl ? (
        <Image
          src={project.snapshotUrl}
          alt={`${project.title} preview`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-400 text-sm">No Preview Available</p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </div>

    <div className="p-8 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary/80 transition">
        {project.title}
      </h3>

      <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">
        {project.detailedDescription?.slice(0, 120) || "No description available."}...
      </p>

      {project.impact && (
        <div className="mb-6">
            <StatCounter
            metric={project.impact.metric}
            label={project.impact.label}
            animateOnScroll={true}
            />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-auto mb-6">
        {project.technologies?.map((tech, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm pt-6 border-t border-gray-100">
        {project.liveUrl && (
          <Link
            href={project.liveUrl}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <ExternalLink size={16} /> Live Demo
          </Link>
        )}
        {project.githubUrl && (
          <Link
            href={project.githubUrl}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 font-medium hover:text-black"
          >
            <Github size={16} /> Source Code
          </Link>
        )}
      </div>
    </div>
  </div>
);

// -----------------------------
// 4️⃣ PROJECT MODAL
// -----------------------------
const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useLayoutEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-white z-10">
          <h3 className="text-3xl font-bold text-primary pr-8">{project.title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-gray-100">
             {project.snapshotUrl ? (
                <Image
                src={project.snapshotUrl}
                alt={`${project.title} preview`}
                fill
                className="object-cover"
                priority
                />
             ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
             )}
          </div>

          {project.impact && (
            <StatCounter
              metric={project.impact.metric}
              label={project.impact.label}
              animateOnScroll={false}
              isModal
            />
          )}

          <div className="space-y-8">
            {[
              ["The Problem", project.problemSolved],
              ["The Solution & Process", project.detailedDescription],
              ["Key Challenges", project.challengesFaced],
              ["Future Scope", project.futureScope],
            ].map(([title, text], i) => (
                text ? (
                    <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h4 className="text-xl font-bold text-primary mb-3 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            {title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                            {text}
                        </p>
                    </div>
                ) : null
            ))}
          </div>

          <div className="space-y-4">
             <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technologies Used</h4>
             <div className="flex flex-wrap gap-3">
                {project.technologies?.map((tech, i) => (
                <span
                    key={i}
                    className="bg-white text-primary text-sm font-bold px-4 py-2 rounded-lg border border-primary/20 shadow-sm"
                >
                    {tech}
                </span>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
          {project.githubUrl && (
            <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all shadow-sm"
            >
                <Github size={20} /> Code
            </Link>
          )}
          {project.liveUrl && (
             <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
             >
                <ExternalLink size={20} /> Live Demo
             </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// 5️⃣ MAIN SECTION
// -----------------------------
const ProjectsSection = () => {
  const component = useRef(null);
  const buttonRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
        },
      });

      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          duration: 1,
          ease: "power1.inOut",
        });
      }
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={component}
      id="portfolio"
      // ✅ FULL WIDTH CONTAINER (max-w-7xl)
      className="max-w-7xl mx-auto py-32 px-6 lg:px-12 relative"
    >
      
      {/* HEADER SECTION */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold tracking-tighter text-primary mb-6">
          All Projects
        </h2>
        <div className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto space-y-4 leading-relaxed font-light">
          <p>
            Welcome to my digital workshop. Here lies a collection of my journey through code—ranging from robust 
            full-stack web applications to experimental AI integrations and system architectures.
          </p>
          <p>
            Every project here represents a specific problem I aimed to solve or a new technology I mastered along the way. 
            I believe in building software that isn't just functional, but also intuitive, scalable, and secure. 
            Click on any card to dive deep into the technical details, challenges faced, and the impact of what I've built.
          </p>
        </div>
      </div>

      {/* ✅ FULL WIDTH CTA SECTION */}
      <div className="w-full mb-20">
        <Link
          href="/services"
          className="group block relative w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200 rounded-[2.5rem] p-10 md:p-14 text-center hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
              Need Custom Development?
            </h3>
            <p className="text-lg text-gray-600 group-hover:text-gray-900 transition-colors mb-6">
              Explore my web development, debugging, and consulting services.
            </p>
            <div className="inline-block bg-white border border-primary/20 text-primary px-8 py-3 rounded-full shadow-sm group-hover:shadow-md transition-all">
               <span className="font-bold text-lg"> First consultancy is free!</span>
            </div>
          </div>
        </Link>
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {allProjectsData.map((project, index) => (
          <div key={index} className="project-card h-full">
            <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
          </div>
        ))}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <Link
        href="/services"
        ref={buttonRef}
        className="fixed bottom-8 right-8 bg-primary text-white px-8 py-4 rounded-full shadow-xl hover:bg-primary/90 transition-colors z-40 flex items-center gap-3 font-bold text-lg"
      >
        <span>Book a Service</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </Link>

      {/* MODAL */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default ProjectsSection;