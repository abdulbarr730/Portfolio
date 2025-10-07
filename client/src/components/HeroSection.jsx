'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import ParticleBackground from './ParticleBackground';

const HeroSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate "Hello" letters
      tl.from(".hello-char", {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        ease: "back.out",
        duration: 0.6,
      }, 0.5);

      // Animate the bio and tagline lines
      tl.from(".bio-line", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
      }, "-=0.4");

      // Animate image appearance
      tl.from(".image-container", {
        scale: 1.1,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, 0.2);

    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={component} className="relative w-full min-h-screen">
      <ParticleBackground />
      
      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="w-full md:w-1/2 z-99 flex justify-center md:justify-start md:pl-32 lg:pl-40">
          <div>
            <h1 className="text-7xl md:text-9xl font-thin tracking-tighter text-primary dark:text-background overflow-hidden">
              <span className="hello-char inline-block">H</span>
              <span className="hello-char inline-block">e</span>
              <span className="hello-char inline-block">l</span>
              <span className="hello-char inline-block">l</span>
              <span className="hello-char inline-block">o</span>
            </h1>
            
            {/* Animated Bio Text */}
            <div className="bio-line mt-4 text-lg text-secondary dark:text-gray-400">
              — I'm a{' '}
              <TypeAnimation
                sequence={[
                  'Full-Stack Developer',
                  2000,
                  'Machine Learning Enthusiast',
                  2000,
                  'Problem Solver',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="text-primary dark:text-background font-semibold"
                repeat={Infinity}
              />
            </div>

            {/* Tagline */}
            <p className="bio-line mt-2 text-sm text-secondary/80 dark:text-gray-500">
              Committed to writing clean, secure, and scalable code that adheres to industry best practices.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="image-container absolute bottom-0 right-4 md:right-12 w-2/3 md:w-[55%]">
          <Image
            src="/profile.png"
            alt="A professional portrait of Abdul Barr"
            width={1080}
            height={1350}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
