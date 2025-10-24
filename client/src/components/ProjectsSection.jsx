'use client';

import { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// --- UPDATED allProjectsData with new detailed fields ---

const allProjectsData = [
  {
    title: "SIH College Portal",
    description: "A full-stack app to manage college hackathons.",
    detailedDescription:
      "The SIH College Portal was built with immense focus and passion as a full-fledged system to streamline Smart India Hackathon processes at the college level. Every feature — from secure JWT authentication to mentor assignment and team management — was crafted through careful planning and testing. It wasn’t just about writing code, but understanding how different user roles interact within an academic ecosystem. Building this project taught me the importance of scalability, clean architecture, and attention to user experience. This project truly represents my ability to take an abstract problem and translate it into a working, real-world digital platform.",
    problemSolved:
      "On the official SIH portal, only the college SPOC can view registered teams, leaving students completely in the dark. I got the idea after the hack2skill geni hackathon—my platform solves this by creating an internal, authenticated portal where students can finally see, join, and manage their own teams. For students trying to form teams, it's a massive visibility boost... like a godsend.",
    challengesFaced:
      "Several hurdles emerged. First, the email verification service I built with SMTP failed because free-tier hosting (Vercel, Render) blocks SMTP ports to prevent spam. This forced a pivot to a third-party API like Resend. Second, I had to devise a system to automatically scrape new notifications from the official SIH portal to keep our users updated. Finally, I had to add a feature for students who didn't have an ID card, allowing them to submit alternative documents for verification.",
    futureScope:
      "The architecture is ready to be scaled into a full-fledged multitenant SaaS, allowing any college to sign up and manage their own internal hackathons (not just SIH) under one platform.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB", "Supabase"],
    liveUrl: "https://hackathon-college-portal.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/sih-portal.png"
  },
  {
    title: "AI Meeting Notes Summarizer",
    description: "An intelligent app using Groq API and Llama 3 to summarize meeting transcripts.",
    detailedDescription:
      "This project was born out of curiosity and discipline — a desire to explore how AI can simplify daily workflows. I built the AI Meeting Notes Summarizer with patience, testing prompt variations and optimizing Llama 3’s summarization output to achieve clarity and consistency. The app allows users to upload transcripts and instantly get tailored summaries, saving hours of manual note-taking. It reflects my deep interest in combining frontend elegance with backend intelligence. Every line of code here was written after multiple iterations, proving that persistence and precision go hand in hand when creating something truly useful.",
    problemSolved:
      "Professionals and students spend hours manually re-listening to meetings and summarizing notes. This tool automates that process, using the high-speed Groq API to provide instant, accurate summaries from uploaded transcript files.",
    challengesFaced:
      "The primary challenge was prompt engineering. Getting Llama 3 to consistently produce summaries that were not just accurate but also concise, well-structured, and capable of extracting key action items required significant testing and iteration of the system prompts.",
    futureScope:
      "Future plans include adding real-time audio input (transcription via AssemblyAI) and the ability to upload various file formats (like .mp3 or .m4a), making it an all-in-one meeting solution.",
    technologies: ["React", "Node.js (Serverless)", "Groq API", "Llama 3", "Vercel"],
    liveUrl: "https://meeting-summarizer-black.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/ai-summarizer.png"
  },
  {
    title: "E-commerce Website - Two Good Co.",
    description: "An interactive, motion-rich e-commerce frontend with GSAP and Locomotive animations.",
    detailedDescription:
      "Two Good Co. was crafted pixel by pixel, with a clear goal — to make every scroll, hover, and transition feel alive. I spent days fine-tuning GSAP animations and Locomotive Scroll effects until the site moved as smoothly as a story unfolding. This project required immense patience and precision — aligning performance with creativity. The end result was a visual experience that captures the essence of premium digital storytelling. It’s not just an e-commerce frontend; it’s a showcase of how motion and minimalism can coexist beautifully when approached with focus and persistence.",
    problemSolved:
      "Many e-commerce sites are static and fail to create an engaging brand experience. This project aimed to solve that by creating a 'story-driven' shopping interface where the product and the brand's narrative are woven together through motion.",
    challengesFaced:
      "Performance was the biggest challenge. Synchronizing complex GSAP timelines with Locomotive Scroll for a 'buttery smooth' experience on all devices, without layout jank or high CPU usage, required meticulous optimization and testing.",
    futureScope:
      "The next step is to integrate a headless e-commerce backend (like Shopify's Storefront API or Medusa.js) to turn this from a 'lookbook' into a fully functional, high-performance online store.",
    technologies: ["HTML5", "CSS3", "JavaScript", "GSAP", "Locomotive Scroll"],
    liveUrl: "https://twogood-e-commerce.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/two-good.png"
  },
  {
    title: "GTA-VI Re-imagined Website",
    description: "A visually bold React concept inspired by GTA-VI with advanced GSAP-driven animations.",
    detailedDescription:
      "The GTA-VI Reimagined website is one of my most passionate creative experiments — a fusion of gaming aesthetics and interactive web motion. I spent long hours experimenting with different animation timings and scroll triggers to recreate a cinematic feel on the web. It’s a love letter to creativity, built with deep focus and commitment to detail. Every section was animated, restructured, and refined until it truly reflected the intensity of the GTA universe. This project represents how technical mastery and artistic vision can blend seamlessly when approached with patience and dedication.",
    problemSolved:
      "This was a personal challenge to push the boundaries of web animation. Official game websites are often informational. I wanted to create a concept that *feels* like the game—an immersive, cinematic web experience that builds hype through interaction.",
    challengesFaced:
      "Managing complex, overlapping GSAP animations on scroll. Creating a 'video-like' scrubbing effect that feels responsive and not 'laggy' was technically demanding and required deep knowledge of GSAP's ScrollTrigger.",
    futureScope:
      "I plan to add more interactive 'easter eggs' and WebGL-powered 3D elements (using Three.js) to make the environment even more immersive and reactive to user input.",
    technologies: ["ReactJs", "GSAP"],
    liveUrl: "https://gta-vi-imagine.vercel.app",
    githubUrl: "https://github.com/abdulbarr730",
    snapshotUrl: "/snapshots/gta-vi.png"
  },
  {
    title: "Weather Project",
    description: "A simple yet elegant weather forecasting app powered by the OpenWeather API.",
    detailedDescription:
      "The Weather Project was my way of combining design, data, and detail. I poured a lot of attention into making it intuitive — fetching real-time weather data, handling API responses, and presenting it in a clear, friendly interface. It’s more than just a utility; it’s a reflection of how careful structuring and thoughtful UI can make even raw data feel alive. Every animation, every color gradient, and every refresh function was refined with focus until it felt just right. It’s a project that taught me patience and precision, especially in aligning technical accuracy with aesthetic appeal.",
    problemSolved:
      "While many weather apps exist, they are often cluttered. The goal was to build a simple, clean, and fast-loading weather app that does one thing perfectly: provide the essential forecast at a glance, powered by a reliable API.",
    challengesFaced:
      "The main technical challenge was handling the asynchronous nature of the OpenWeather API gracefully. This included managing loading states, error handling (e.g., city not found, API key limits), and ensuring the UI updated seamlessly.",
    futureScope:
      "Future improvements include adding geolocation to automatically fetch the user's local weather and a 5-day forecast view with animated weather icons.",
    technologies: ["HTML", "CSS", "JavaScript", "OpenWeather API"],
    liveUrl: "https://weather-project-chi-two.vercel.app/",
    githubUrl: "https://github.com/abdulbarr730/Weather-Project",
    snapshotUrl: "/snapshots/weather.png"
  }
];

const ProjectCard = ({ project, onClick }) => (
  <div
    className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col group cursor-pointer"
    onClick={onClick}
  >
    <div className="w-full h-48 relative overflow-hidden">
      {project.snapshotUrl ? (
        <Image
          src={project.snapshotUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-secondary text-sm">No Image</p>
        </div>
      )}
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold text-primary mb-2">{project.title}</h3>
      <p className="text-secondary mb-4 flex-grow text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, i) => (
          <span
            key={i}
            className="bg-background text-secondary text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// --- UPDATED ProjectModal to display the new fields ---

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);

  useLayoutEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );

    document.body.style.overflow = 'hidden';
    return () => {
      gsap.to(modalRef.current, { opacity: 0, scale: 0.95, duration: 0.3 });
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    // FIX: Changed z-50 to z-[1000] to ensure modal appears on top of the navbar (which is z-[999])
    <div className="fixed inset-0 backdrop-blur-lg bg-black/70 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-10 overflow-hidden flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-400 hover:text-red-400 transition-all z-10"
        >
          ✕
        </button>

        <div className="overflow-y-auto max-h-[85vh] p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-400 ">
          <h3 className="text-3xl font-bold text-primary ">{project.title}</h3>

          <Image
            src={project.snapshotUrl}
            alt={project.title}
            width={800}
            height={400}
            className="rounded-xl object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* New Sections Added Here */}
          <h4 className="text-xl font-semibold text-primary mt-4">Problem Solved</h4>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{project.problemSolved}</p>

          <h4 className="text-xl font-semibold text-primary mt-4">Challenges Faced</h4>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{project.challengesFaced}</p>

          <h4 className="text-xl font-semibold text-primary mt-4">Future Scope</h4>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{project.futureScope}</p>

          <h4 className="text-xl font-semibold text-primary mt-4">My Process</h4>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{project.detailedDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="bg-gray-200 text-secondary text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex justify-end space-x-6 pb-2">
            <Link href={project.liveUrl} target="_blank" className="relative text-primary font-semibold group">
              Live Demo
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href={project.githubUrl} target="_blank" className="relative text-secondary group">
              GitHub
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const component = useRef(null);
  const buttonRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".project-card", {
        opacity: 0,
        y: 100,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      gsap.from(".service-cta-card", {
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: component.current,
          start: "top 90%",
        }
      });

      // Pulsing floating button
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          duration: 1,
          ease: "power1.inOut"
        });
      }
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={component} id="portfolio" className="container mx-auto py-32 px-4 sm:px-6 lg:px-8 relative">
      <h2 className="text-4xl font-bold tracking-tight text-primary mb-4 text-center">
        All Projects
      </h2>
      <p className="text-secondary max-w-2xl mx-auto text-center mb-12">
        Over the years, each project has been built with immense focus, attention to detail, and dedication. Click on any project to view its full description, technologies used, and live links.
      </p>

      {/* CTA Card below heading */}
      <div className="service-cta-card mb-12">
        <Link
          href="/services"
          className="block bg-primary/10 border border-primary rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-2">
            Book a Service / Learn More
          </h3>
          <p className="text-secondary text-sm sm:text-base">
            Explore the services I offer — website development, software issue fixing, and consultancy. First consultancy is free!
          </p>
        </Link>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjectsData.map((project, index) => (
          <div key={index} className="project-card">
            <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
          </div>
        ))}
      </div>

      {/* Floating Book Service Button */}
      <Link
        href="/services"
        ref={buttonRef}
        className="fixed bottom-8 right-8 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        Book a Service
      </Link>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsSection;