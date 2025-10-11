'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';

const HeroSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();
      tl.from(".hero-animate", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.5);

      // Parallax Animation (Desktop Only)
      if (window.innerWidth > 768) {
        const componentEl = component.current;
        const layers = gsap.utils.toArray('.parallax-layer');
        
        const handleMouseMove = (e) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth) - 0.5;
          const yPercent = (clientY / innerHeight) - 0.5;

          layers.forEach(layer => {
            const speed = layer.dataset.speed || 1;
            const xMove = xPercent * 40 * speed;
            const yMove = yPercent * 30 * speed;
            gsap.to(layer, { x: xMove, y: yMove, ease: "power2.out", duration: 0.8 });
          });
        };
        
        componentEl.addEventListener("mousemove", handleMouseMove);
        return () => componentEl.removeEventListener("mousemove", handleMouseMove);
      }
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={component} className="relative w-full min-h-screen overflow-hidden">
      <div className="relative z-10 w-full h-screen">
        
        {/* MOBILE LAYOUT */}
        <div className="md:hidden flex flex-col items-center justify-center h-full px-4">
          <div className="hero-animate image-container mb-6">
            <div className="w-48 h-48 rounded-full overflow-hidden">
              <Image src="/profile.png" alt="A professional portrait of Abdul Barr" width={192} height={192} className="w-full h-full object-cover" priority />
            </div>
          </div>
          <div className="flex justify-center space-x-12 mb-6">
            <div className="hero-animate stat-item text-center">
              <h3 className="text-5xl font-bold text-primary dark:text-background">1+</h3>
              <p className="text-secondary dark:text-gray-400 text-base font-medium">Years of<br/>Experience</p>
            </div>
            <div className="hero-animate stat-item text-center">
              <h3 className="text-5xl font-bold text-primary dark:text-background">6+</h3>
              <p className="text-secondary dark:text-gray-400 text-base font-medium">Projects<br/>Completed</p>
            </div>
          </div>
          <div className="text-center">
            <h1 className="hero-animate text-7xl font-thin tracking-tighter text-primary dark:text-background overflow-hidden mb-5">Hello</h1>
            <div className="hero-animate bio-line text-xl text-secondary dark:text-gray-400 mb-4">
              — I'm a{' '}
              <TypeAnimation
                sequence={[ 'Full-Stack Developer', 2000, 'Machine Learning Enthusiast', 2000, 'Problem Solver', 2000, ]}
                wrapper="span"
                speed={50}
                className="text-primary dark:text-background font-semibold"
                repeat={Infinity}
              />
            </div>
            <p className="hero-animate bio-line text-base text-secondary/80 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
              More than an ordinary developer; I don't just build features, I engineer solutions that last.
            </p>
            <div className="hero-animate bio-line mt-6">
              <Link href="/projects" className="font-semibold text-primary dark:text-background border-b-2 border-primary/50 dark:border-background/50">
                Wanna know how?? Tap tap &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:block">
          <div className="parallax-layer image-container absolute bottom-0 left-4 md:left-12 w-[55%]" data-speed="1">
            <Image src="/profile.png" alt="A professional portrait of Abdul Barr" width={1080} height={1350} className="w-full h-auto hero-animate" priority />
          </div>
          <div className="parallax-layer stat-item absolute top-[20%] left-[10%] text-left hero-animate" data-speed="1.8">
            <h3 className="text-5xl md:text-6xl font-bold text-primary dark:text-background">1+</h3>
            <p className="text-secondary dark:text-gray-400 leading-tight">Years of <br/>Experience</p>
          </div>
          <div className="parallax-layer stat-item absolute top-[20%] right-[10%] text-left hero-animate" data-speed="1.8">
            <h3 className="text-5xl md:text-6xl font-bold text-primary dark:text-background">6+</h3>
            <p className="text-secondary dark:text-gray-400 leading-tight">Projects <br/>Completed</p>
          </div>
          <div className="parallax-layer absolute top-1/2 right-8 md:right-32 lg:right-40 transform -translate-y-1/2" data-speed="2.5">
            <h1 className="text-7xl md:text-9xl font-thin tracking-tighter text-primary dark:text-background overflow-hidden hero-animate">Hello</h1>
            <div className="bio-line mt-4 text-lg text-secondary dark:text-gray-400 hero-animate">
              — I'm a{' '}
              <TypeAnimation
                sequence={[ 'Full-Stack Developer', 2000, 'Machine Learning Enthusiast', 2000, 'Problem Solver', 2000, ]}
                wrapper="span"
                speed={50}
                className="text-primary dark:text-background font-semibold"
                repeat={Infinity}
              />
            </div>
            <p className="bio-line mt-2 text-sm text-secondary/80 dark:text-gray-500 max-w-md hero-animate">
              More than an ordinary developer; I don't just build features, I engineer solutions that last.
            </p>
            <div className="bio-line mt-8 hero-animate">
              <Link href="/codecraft" className="font-semibold text-primary dark:text-background border-b-2 border-primary/50 dark:border-background/50 hover:border-primary dark:hover:border-background transition-colors">
                Wanna know how?? Click click &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;