'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap'; // Using the standard free GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StoryCanvas = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
        }
      });

      // 1. Fade in the initial title
      tl.from(".story-title", { opacity: 0, duration: 1 });

      // 2. Target all the individual word spans
      const words = gsap.utils.toArray('.story-word');

      // 3. Animate the words pulling apart into lines
      tl.to(words, {
        y: (i) => i * 40,
        x: (i) => i * -20,
        scale: 1.5,
        opacity: 0.5,
        stagger: 0.1,
        duration: 3,
      });

    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={component} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* UPDATED: Each word is now wrapped in its own span */}
      <h2 className="story-title text-5xl md:text-7xl font-bold text-center text-primary dark:text-background">
        <span className="story-word inline-block mr-4">My</span>
        <span className="story-word inline-block mr-4">Story</span>
        <span className="story-word inline-block mr-4">as</span>
        <span className="story-word inline-block mr-4">a</span>
        <span className="story-word inline-block">Developer</span>
      </h2>
    </section>
  );
};

export default StoryCanvas;