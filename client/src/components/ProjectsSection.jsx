'use client';

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { allProjectsData } from '@/app/data/projectData';

gsap.registerPlugin(ScrollTrigger);

// -----------------------------
// 2️⃣ STAT COUNTER
// -----------------------------
const StatCounter = ({ metric, label, animateOnScroll, isModal = false }) => {
  const numberRef = useRef(null);
  
  // Check if the metric starts with a number (e.g., "80+", "30k")
  const parsedValue = parseInt(metric);
  const isNumber = !isNaN(parsedValue);
  
  // Only calculate suffix if it is a number
  const metricSuffix = isNumber ? metric.replace(parsedValue.toString(), "") : "";

  useEffect(() => {
    const el = numberRef.current;
    if (!el || !isNumber) return; // Skip animation if it's just text (like "Bilingual")

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
    <div className={isModal ? "text-center bg-gray-50 p-6 rounded-xl my-6" : "mb-3"}>
      <h3
        ref={numberRef}
        className={isModal ? "text-5xl font-bold text-primary" : "text-2xl font-bold text-primary"}
      >
        {/* If it's a number, start at 0 (GSAP updates it). If text, just show the text. */}
        {isNumber ? `0${metricSuffix}` : metric}
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
    className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden h-full flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl border border-gray-100"
    onClick={onClick}
  >
    <div className="w-full h-48 relative overflow-hidden">
      {project.snapshotUrl ? (
        <Image
          src={project.snapshotUrl}
          alt={`${project.title} preview`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-400 text-sm">No Image</p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </div>

    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-primary/80 transition">
        {project.title}
      </h3>

      <p className="text-gray-600 mb-3 text-sm line-clamp-3">
        {project.detailedDescription.slice(0, 110)}...
      </p>

      {project.impact && (
        <StatCounter
          metric={project.impact.metric}
          label={project.impact.label}
          animateOnScroll={true}
        />
      )}

      <div className="flex flex-wrap gap-2 mt-auto mb-3">
        {project.technologies.map((tech, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-100">
        <Link
          href={project.liveUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="flex items-center gap-1 text-primary font-semibold hover:underline"
        >
          <ExternalLink size={15} /> Live
        </Link>
        <Link
          href={project.githubUrl}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          className="flex items-center gap-1 text-gray-600 hover:text-black"
        >
          <Github size={15} /> Code
        </Link>
      </div>
    </div>

    {/* UPDATED: ALWAYS VISIBLE ON MOBILE, HOVER ON DESKTOP */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
      <p className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
        View Details
      </p>
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

  useLayoutEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-400 transition-all"
        >
          ✕
        </button>

        <div className="overflow-y-auto max-h-[85vh] p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-400">
          <h3 className="text-3xl font-bold text-primary">{project.title}</h3>

          <Image
            src={project.snapshotUrl}
            alt={`${project.title} preview`}
            width={800}
            height={400}
            className="rounded-xl object-cover"
          />

          {project.impact && (
            <StatCounter
              metric={project.impact.metric}
              label={project.impact.label}
              animateOnScroll={false}
              isModal
            />
          )}

          {[
            ["Problem Solved", project.problemSolved],
            ["Challenges Faced", project.challengesFaced],
            ["Future Scope", project.futureScope],
            ["My Process", project.detailedDescription],
          ].map(([title, text], i) => (
            <div key={i}>
              <h4 className="text-xl font-semibold text-primary mt-4">{title}</h4>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{text}</p>
            </div>
          ))}

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex justify-end space-x-6 pb-2">
            <Link
              href={project.liveUrl}
              target="_blank"
              className="relative text-primary font-semibold group"
            >
              Live Demo
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href={project.githubUrl}
              target="_blank"
              className="relative text-gray-500 group"
            >
              GitHub
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
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
        duration: 0.6,
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
      className="container mx-auto py-32 px-4 sm:px-6 lg:px-8 relative"
    >
      <h2 className="text-4xl font-bold tracking-tight text-primary mb-4 text-center">
        All Projects
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
        Each project was built with focus, care, and intent. Click on any to view details.
      </p>

      <div className="service-cta-card mb-12">
        <Link
          href="/services"
          className="block bg-primary/10 border border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-2">
            Book a Service / Learn More
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore my web development, debugging, and consulting services. First consultancy is free!
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjectsData.map((project, index) => (
          <div key={index} className="project-card">
            <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
          </div>
        ))}
      </div>

      <Link
        href="/services"
        ref={buttonRef}
        className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        Book a Service
      </Link>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default ProjectsSection;