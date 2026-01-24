'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import RightSidebar from '@/components/RightSidebar';
import { allProjectsData } from '@/app/data/projectData';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  // --- WATERMARK ---
  if (typeof window !== 'undefined' && window.location.hostname !== 'abdulbarr.in') {
    if (window.console) console.debug('%c Auth-Trace: AB-730-PRV ', 'color: transparent;');
  }

  const component = useRef(null);
  const sidebarRef = useRef(null);

  const marqueeTween = useRef(null);
  const slamTextRef = useRef(null);

  useLayoutEffect(() => {
    let removeMouseMove = null;

    const ctx = gsap.context(() => {
      // =========================
      // INITIAL STATES
      // =========================
      gsap.set('.intro-svg-container', { opacity: 1, willChange: 'transform, opacity' });
      gsap.set('.intro-mask-group', { scale: 1, transformOrigin: '50% 50%', willChange: 'transform' });

      gsap.set('.hero-container', {
        opacity: 1,
        scale: 1.25,
        rotate: -4,
        transformOrigin: 'center center',
        willChange: 'transform',
      });

      gsap.set('.hero-content-layer', { y: 35, opacity: 0, willChange: 'transform, opacity' });

      // Mobile avatar initial state
      gsap.set('.mobile-avatar', {
        x: '-60vw',
        y: 120,
        rotate: -12,
        scale: 0.9,
        opacity: 1,
        transformOrigin: '50% 50%',
        willChange: 'transform',
      });

      // =========================
      // MASTER TIMELINE
      // =========================
      const tl = gsap.timeline();

      // INTRO: AB flies away fast
      tl.to('.intro-mask-group', {
        scale: 18,
        y: -120,
        rotate: 8,
        duration: 0.55,
        ease: 'power4.in',
      });

      tl.to(
        '.intro-svg-container',
        {
          opacity: 0,
          duration: 0.18,
          ease: 'power2.out',
          onComplete: () => {
            const el = document.querySelector('.intro-svg-container');
            if (el) el.style.pointerEvents = 'none';
          },
        },
        '-=0.12'
      );

      // HERO landing
      tl.to(
        '.hero-container',
        {
          scale: 1,
          rotate: 0,
          duration: 0.85,
          ease: 'expo.out',
        },
        '>-0.02'
      );

      // MOBILE AVATAR: CURVE ENTRY (NO BOUNCE)
      tl.to(
        '.mobile-avatar',
        {
          keyframes: [
            { x: '-15vw', y: -30, rotate: 6, scale: 1.02, duration: 0.45, ease: 'power3.out' },
            { x: 0, y: 0, rotate: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
          ],
        },
        '-=0.55'
      );

      // Main content fade-in
      tl.to(
        '.hero-content-layer',
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
        },
        '-=0.65'
      );

      // Slam button
      if (slamTextRef.current) {
        tl.fromTo(
          slamTextRef.current,
          { y: '-25vh', scale: 8, rotate: 10, opacity: 0 },
          { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
          '-=0.25'
        );
      }

      // Sidebar scroll exit (guarded)
      if (sidebarRef.current && component.current) {
        gsap.to(sidebarRef.current, {
          x: '100%',
          opacity: 0,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: component.current,
            start: 'bottom 80%',
            end: 'bottom 50%',
            scrub: 1,
          },
        });
      }

      // Marquee loop
      marqueeTween.current = gsap.to('.marquee-track', {
        xPercent: -50,
        repeat: -1,
        duration: 28,
        ease: 'linear',
      });

      // =========================
      // MOBILE MARQUEE: HIDE AFTER HERO SCROLL
      // =========================
      const mobileMarquee = document.querySelector('.mobile-marquee');
      if (mobileMarquee && component.current) {
        gsap.set(mobileMarquee, { y: 0, opacity: 1 });

        ScrollTrigger.create({
          trigger: component.current,
          start: 'bottom bottom', // when hero ends
          onEnter: () => gsap.to(mobileMarquee, { y: 30, opacity: 0, duration: 0.25, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(mobileMarquee, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }),
        });
      }

      // Parallax
      if (typeof window !== 'undefined' && window.innerWidth > 768) {
        const componentEl = component.current;
        const layers = gsap.utils.toArray('.parallax-layer');

        const enableParallax = () => {
          if (!componentEl) return;

          const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = clientX / innerWidth - 0.5;
            const yPercent = clientY / innerHeight - 0.5;

            layers.forEach((layer) => {
              const speed = Number(layer.dataset.speed || 1);
              gsap.to(layer, {
                x: xPercent * 40 * speed,
                y: yPercent * 30 * speed,
                ease: 'power2.out',
                duration: 0.8,
              });
            });
          };

          componentEl.addEventListener('mousemove', handleMouseMove);
          removeMouseMove = () => componentEl.removeEventListener('mousemove', handleMouseMove);
        };

        tl.call(enableParallax);
      }
    }, component);

    return () => {
      if (removeMouseMove) removeMouseMove();
      ctx.revert();
      if (marqueeTween.current) marqueeTween.current.kill();
    };
  }, []);

  return (
    <section ref={component} className="relative w-full bg-background overflow-hidden min-h-[100svh]">
      {/* INTRO OVERLAY */}
      <div className="intro-svg-container fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-auto">
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="abMask">
              <rect width="100%" height="100%" fill="black" />
              <text
                x="50%"
                y="50%"
                fontSize="200"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontFamily="Arial Black, sans-serif"
                fontWeight="900"
                className="intro-mask-group"
              >
                AB
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="white" mask="url(#abMask)" />
        </svg>
      </div>

      {/* MAIN CONTENT */}
      <div className="hero-container relative w-full min-h-[100svh]">
        <RightSidebar ref={sidebarRef} />

        {/* content area */}
        <div className="relative z-10 w-full min-h-[100svh] pb-24 md:pb-20">
          {/* MOBILE */}
          <div className="md:hidden flex flex-col items-center justify-center min-h-[100svh] px-4 pt-10 pb-20">
            {/* Bigger avatar */}
            <div className="mobile-avatar image-container mb-6 relative z-10">
              <div className="w-60 h-60 rounded-full overflow-hidden border-4 border-primary/10">
                <Image
                  src="/profile.png"
                  alt="Abdul Barr"
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bigger stats */}
            <div className="flex justify-center space-x-14 mb-8 relative z-20">
              <Link
                href="/experience"
                className="hero-content-layer stat-item text-center cursor-pointer active:scale-95 transition-transform"
              >
                <h3 className="text-5xl font-bold text-primary">2+</h3>
                <p className="text-secondary text-sm font-medium leading-tight">
                  Years of <br />
                  Experience
                </p>
              </Link>

              <Link
                href="/projects"
                className="hero-content-layer stat-item text-center cursor-pointer active:scale-95 transition-transform"
              >
                <h3 className="text-5xl font-bold text-primary">{allProjectsData.length}+</h3>
                <p className="text-secondary text-sm font-medium leading-tight">
                  Projects <br />
                  Completed
                </p>
              </Link>
            </div>

            <div className="text-center relative z-10">
              <h1 className="hero-content-layer text-7xl font-thin tracking-tighter text-primary mb-4">
                Hello
              </h1>

              <div className="hero-content-layer bio-line text-xl text-secondary mb-4 min-h-[34px]">
                — I&apos;m a{' '}
                <TypeAnimation
                  sequence={[
                    'Full-Stack Developer',
                    2000,
                    'System Architect',
                    2000,
                    'Problem Solver',
                    2000,
                    'Machine Learning Enthusiast',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-primary font-bold"
                  repeat={Infinity}
                />
              </div>

              <p className="hero-content-layer bio-line text-sm text-secondary/80 max-w-xs mx-auto leading-relaxed">
                More than an ordinary developer; I don&apos;t just build features, I engineer solutions that
                last.
              </p>

              <div className="hero-content-layer bio-line mt-6">
                <Link
                  href="/codecraft"
                  className="font-semibold text-primary border-b-2 border-primary/50 hover:border-primary transition-colors"
                >
                  Wanna know how?? Tap tap &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block">
            <div
              className="hero-content-layer parallax-layer image-container absolute bottom-24 left-10 w-[50%] lg:w-[55%]"
              data-speed="1"
            >
              <Image
                src="/profile.png"
                alt="Abdul Barr"
                width={1080}
                height={1350}
                className="w-full h-auto"
                priority
              />
            </div>

            <Link
              href="/experience"
              className="hero-content-layer parallax-layer stat-item absolute top-[20%] left-[10%] text-left cursor-pointer hover:scale-105 transition-transform"
              data-speed="1.8"
            >
              <h3 className="text-6xl font-bold text-primary">2+</h3>
              <p className="text-secondary leading-tight">
                Years of <br />
                Experience
              </p>
            </Link>

            <Link
              href="/projects"
              className="hero-content-layer parallax-layer stat-item absolute top-[20%] right-[10%] text-left cursor-pointer hover:scale-105 transition-transform"
              data-speed="1.8"
            >
              <h3 className="text-6xl font-bold text-primary">{allProjectsData.length}+</h3>
              <p className="text-secondary leading-tight">
                Projects <br />
                Completed
              </p>
            </Link>

            <div
              className="hero-content-layer parallax-layer absolute top-1/2 right-28 lg:right-40 transform -translate-y-1/2"
              data-speed="2.5"
            >
              <h1 className="text-9xl font-thin tracking-tighter text-primary">Hello</h1>

              <div className="bio-line mt-4 text-lg text-secondary">
                — I&apos;m a{' '}
                <TypeAnimation
                  sequence={[
                    'Full-Stack Developer',
                    2000,
                    'System Architect',
                    2000,
                    'Problem Solver',
                    2000,
                    'Machine Learning Enthusiast',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  className="text-primary font-semibold"
                  repeat={Infinity}
                />
              </div>

              <p className="bio-line mt-2 text-sm text-secondary/80 max-w-md">
                More than an ordinary developer; I don&apos;t just build features, I engineer solutions that
                last.
              </p>

              <div className="bio-line mt-8">
                <Link
                  href="/codecraft"
                  className="font-semibold text-primary border-b-2 border-primary/50 hover:border-primary transition-colors"
                >
                  Wanna know how?? Click click &rarr;
                </Link>
              </div>
            </div>

            {/* Desktop marquee inside hero */}
            <Link
              href="/projects"
              className="absolute bottom-4 left-0 w-full h-16 md:h-20 bg-primary/5 border-t border-primary/10 z-30 overflow-hidden cursor-pointer backdrop-blur-sm group m-0"
            >
              <div className="marquee-track absolute left-0 top-1/2 -translate-y-1/2 flex whitespace-nowrap w-max opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                {[...allProjectsData, ...allProjectsData].map((project, i) => (
                  <div key={i} className="flex items-center mx-8">
                    <span className="text-base md:text-xl font-black text-primary/80 uppercase tracking-widest">
                      {project.title}
                    </span>
                    <span className="ml-8 text-secondary/30 text-xl">•</span>
                  </div>
                ))}
              </div>

              <div
                ref={slamTextRef}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-primary text-background px-6 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl border border-background/20 opacity-0 whitespace-nowrap"
              >
                View All Projects &rarr;
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE MARQUEE FIXED (PERFECT BOTTOM) + HIDES AFTER HERO */}
      <Link
        href="/projects"
        className="
          mobile-marquee
          md:hidden
          fixed left-0 w-full
          h-16
          bg-primary/5 border-t border-primary/10
          overflow-hidden cursor-pointer backdrop-blur-sm group
          z-[500]
        "
        style={{
          bottom: `calc(env(safe-area-inset-bottom) + 0px)`,
        }}
      >
        <div className="marquee-track absolute left-0 top-1/2 -translate-y-1/2 flex whitespace-nowrap w-max opacity-40 group-hover:opacity-70 transition-opacity duration-300">
          {[...allProjectsData, ...allProjectsData].map((project, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-base font-black text-primary/80 uppercase tracking-widest">
                {project.title}
              </span>
              <span className="ml-8 text-secondary/30 text-xl">•</span>
            </div>
          ))}
        </div>

        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-primary text-background px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl border border-background/20 whitespace-nowrap">
          View All Projects &rarr;
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;
