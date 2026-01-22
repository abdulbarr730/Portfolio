'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import RightSidebar from '@/components/RightSidebar';
import { allProjectsData } from '@/app/data/projectData';

const HeroSection = () => {
  // --- WATERMARK ---
  if (typeof window !== 'undefined' && window.location.hostname !== 'abdulbarr.in') {
    if (window.console) console.debug('%c Auth-Trace: AB-730-PRV ', 'color: transparent;');
  }

  const component = useRef(null);
  const sidebarRef = useRef(null);
  const marqueeRef = useRef(null);
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

      // Animate all hero content except mobile avatar (to prevent flashing)
      gsap.set('.hero-content-layer', { y: 35, opacity: 0, willChange: 'transform, opacity' });

      // Mobile avatar initial state (off-screen left)
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

      /**
       * MOBILE AVATAR: CURVE ENTRY (NO BOUNCE)
       * We fake a curve using keyframes:
       * - first it comes in fast + goes slightly up
       * - then settles down into final position
       */
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

      // Sidebar scroll exit
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

      // Marquee loop
      if (marqueeRef.current) {
        marqueeTween.current = gsap.to('.marquee-track', {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: 'linear',
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
    };
  }, []);

  const handleMarqueeEnter = () => {
    if (marqueeTween.current) gsap.to(marqueeTween.current, { timeScale: 0, duration: 0.3 });
  };

  const handleMarqueeLeave = () => {
    if (marqueeTween.current) gsap.to(marqueeTween.current, { timeScale: 1, duration: 0.3 });
  };

  return (
    <section ref={component} className="relative w-full h-screen overflow-hidden bg-background">
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
      <div className="hero-container relative w-full h-full">
        <RightSidebar ref={sidebarRef} />

        <div className="relative z-10 w-full h-screen overflow-hidden">
          {/* MOBILE */}
          <div className="md:hidden flex flex-col items-center justify-center h-full px-4 pb-40 pt-10">
            {/* Mobile avatar (curved entry) */}
            <div className="mobile-avatar image-container mb-6 relative z-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/10">
                <Image
                  src="/profile.png"
                  alt="Abdul Barr"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex justify-center space-x-12 mb-8 relative z-20">
              <Link
                href="/experience"
                className="hero-content-layer stat-item text-center cursor-pointer active:scale-95 transition-transform"
              >
                <h3 className="text-4xl font-bold text-primary">2+</h3>
                <p className="text-secondary text-sm font-medium">
                  Years of <br />
                  Experience
                </p>
              </Link>

              <Link
                href="/projects"
                className="hero-content-layer stat-item text-center cursor-pointer active:scale-95 transition-transform"
              >
                <h3 className="text-4xl font-bold text-primary">{allProjectsData.length}+</h3>
                <p className="text-secondary text-sm font-medium">
                  Projects <br />
                  Completed
                </p>
              </Link>
            </div>

            <div className="text-center relative z-10">
              <h1 className="hero-content-layer text-6xl font-thin tracking-tighter text-primary mb-4">
                Hello
              </h1>

              <div className="hero-content-layer bio-line text-lg text-secondary mb-4 min-h-[30px]">
                — I&apos;m a{' '}
                <TypeAnimation
                  sequence={['Full-Stack Developer', 2000, 'System Architect', 2000, 'Problem Solver', 2000, 'ML Enthusiast', 2000]}
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
                  sequence={['Full-Stack Developer', 2000, 'System Architect', 2000, 'Problem Solver', 2000, 'ML Enthusiast', 2000]}
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
          </div>

          {/* MARQUEE */}
          <Link
            href="/projects"
            className="absolute bottom-0 w-full h-24 bg-primary/5 border-t border-primary/10 z-40 overflow-hidden cursor-pointer backdrop-blur-sm group"
            onMouseEnter={handleMarqueeEnter}
            onMouseLeave={handleMarqueeLeave}
            ref={marqueeRef}
          >
            <div className="marquee-track absolute flex whitespace-nowrap w-max opacity-40 group-hover:opacity-70 transition-opacity duration-300 z-0">
              {[...allProjectsData, ...allProjectsData].map((project, i) => (
                <div key={i} className="flex items-center mx-8">
                  <span className="text-xl md:text-2xl font-black text-primary/80 uppercase tracking-widest">
                    {project.title}
                  </span>
                  <span className="ml-8 text-secondary/30 text-xl">•</span>
                </div>
              ))}
            </div>

            <div
              ref={slamTextRef}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-primary text-background px-6 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest shadow-xl border border-background/20 opacity-0 whitespace-nowrap"
            >
              View All Projects &rarr;
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
