// src/components/StoryCanvas.jsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import all the sections that are part of the story
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ExperienceTimeline from './ExperienceTimeline';
import ProjectsSection from './ProjectsSection';

gsap.registerPlugin(ScrollTrigger);

const StoryCanvas = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".story-panel");
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          // base vertical scrolling on how wide the container is so it feels responsive
          end: () => "+=" + component.current.offsetWidth,
        }
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    // The main container that will be pinned
    <div ref={component} className="w-full h-screen flex flex-nowrap overflow-hidden">
      
      {/* Each section is now a "panel" in a horizontal sequence */}
      <div className="story-panel w-screen h-screen flex-shrink-0">
        <HeroSection />
      </div>
      
      <div className="story-panel w-screen h-screen flex-shrink-0">
        <AboutSection />
      </div>

      <div className="story-panel w-screen h-screen flex-shrink-0 overflow-y-auto">
        <ExperienceTimeline />
      </div>

      <div className="story-panel w-screen h-screen flex-shrink-0 overflow-y-auto">
        {/* Using the original ProjectsSection with its vertical grid */}
        <ProjectsSection />
      </div>

    </div>
  );
};

export default StoryCanvas;