'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import RightSidebar from '@/components/RightSidebar';
import { useSettings, useProjects } from '@/lib/content';
import { heroThemeVars } from '@/lib/heroTheme';

gsap.registerPlugin(ScrollTrigger);

// Spotlight mask: the outlined name is only visible inside a soft circle
// whose centre (--mx/--my) and radius (--r) are driven from JS.
const SPOTLIGHT = 'radial-gradient(circle var(--r) at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)';
const spotlightStyle = {
  '--r': '1px',
  '--mx': '50%',
  '--my': '50%',
  WebkitMaskImage: SPOTLIGHT,
  maskImage: SPOTLIGHT,
};

// "Years of Experience" -> ["Years of", "Experience"] (break before the last word)
const splitLabel = (label = '') => {
  const i = label.trim().lastIndexOf(' ');
  return i === -1 ? [label, ''] : [label.slice(0, i), label.slice(i + 1)];
};

const AvailabilityBadge = ({ text, className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border border-primary/10 bg-surface/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary whitespace-nowrap ${className}`}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
    </span>
    {text}
  </span>
);

// "3+" -> 3 in black, "+" in orange
const StatValue = ({ value }) => {
  const m = /^(.*?)([^0-9a-z\s]*)$/i.exec(String(value));
  return (
    <>
      {m ? m[1] : value}
      {m && m[2] && <span className="text-accent">{m[2]}</span>}
    </>
  );
};

const HeroSection = () => {
  const { settings } = useSettings();
  const { projects } = useProjects();
  const hero = settings.hero;
  const heroVars = heroThemeVars(settings.heroTheme, settings.accentColor);
  const availability = settings.availability;
  const stats = hero.stats.map((st) => ({ ...st, value: st.value || `${projects.length}+` }));
  const nameWords = String(hero.outlineName || '').trim().split(/\s+/);
  // --- WATERMARK ---
  if (typeof window !== 'undefined' && window.location.hostname !== 'abdulbarr.in') {
    if (window.console) console.debug('%c Auth-Trace: AB-730-PRV ', 'color: transparent;');
  }

  const component = useRef(null);
  const sidebarRef = useRef(null);

  const marqueeTween = useRef(null);
  const desktopSlamTextRef = useRef(null);

  useLayoutEffect(() => {
    let removeMouseMove = null;
    let removeSpotlight = null;

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

      // Giant outlined name: slides in from the side
      tl.fromTo(
        '.hero-outline-name',
        { xPercent: -8, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
        '-=0.7'
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

      // ✅ SLAM BUTTON ANIMATION (For both Desktop & Mobile)
      const slamTargets = [desktopSlamTextRef.current].filter(Boolean);
      
      if (slamTargets.length > 0) {
        tl.fromTo(
          slamTargets,
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
      // NAME SPOTLIGHT
      // =========================
      const isDesktop = window.innerWidth > 768;
      const reveal = gsap.utils
        .toArray('.hero-name-reveal')
        .find((el) => el.offsetParent !== null);

      if (reveal) {
        const light = { x: 0, y: 0, r: 1 };
        const paint = () => {
          reveal.style.setProperty('--mx', `${light.x}px`);
          reveal.style.setProperty('--my', `${light.y}px`);
          reveal.style.setProperty('--r', `${Math.max(light.r, 1)}px`);
        };

        if (isDesktop && component.current) {
          // Desktop: the light follows the cursor and fades in/out
          const xTo = gsap.quickTo(light, 'x', { duration: 0.45, ease: 'power3.out', onUpdate: paint });
          const yTo = gsap.quickTo(light, 'y', { duration: 0.45, ease: 'power3.out', onUpdate: paint });
          const heroEl = component.current;

          const onMove = (e) => {
            const rect = reveal.getBoundingClientRect();
            xTo(e.clientX - rect.left);
            yTo(e.clientY - rect.top);
            gsap.to(light, { r: 260, duration: 0.5, ease: 'power2.out', overwrite: 'auto', onUpdate: paint });
          };
          const onLeave = () =>
            gsap.to(light, { r: 1, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto', onUpdate: paint });

          heroEl.addEventListener('mousemove', onMove);
          heroEl.addEventListener('mouseleave', onLeave);
          removeSpotlight = () => {
            heroEl.removeEventListener('mousemove', onMove);
            heroEl.removeEventListener('mouseleave', onLeave);
          };
        } else {
          // Mobile: no cursor, so the light slowly sweeps across the name
          light.y = reveal.offsetHeight / 2;
          light.r = 130;
          light.x = -60;
          paint();
          gsap.to(light, {
            x: reveal.offsetWidth + 60,
            duration: 3.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1.2,
            onUpdate: paint,
          });
        }
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
      if (removeSpotlight) removeSpotlight();
      ctx.revert();
      if (marqueeTween.current) marqueeTween.current.kill();
    };
  }, []);

  return (
    <section ref={component} style={heroVars} className="relative w-full bg-background text-primary overflow-hidden min-h-[100svh]">
      {/* 10% accent spotlight behind the portrait (dark hero only) */}
      {heroVars && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-[8%] bottom-[-20%] h-[85%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.22),transparent)] blur-2xl md:left-[5%]" />
          <div className="absolute right-[-10%] top-[-25%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-rgb)/0.08),transparent)] blur-2xl" />
        </div>
      )}
      {/* INTRO OVERLAY */}
      <div className="intro-svg-container fixed inset-0 z-[9999] bg-ink flex items-center justify-center pointer-events-auto">
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
        <div className="relative z-10 w-full min-h-[100svh] md:pb-20">
          {/* MOBILE */}
          <div className="md:hidden relative flex flex-col items-center justify-center min-h-[100svh] px-5 pt-16 pb-20">
            {/* Arch portrait with outlined name behind */}
            <div className="relative w-full flex justify-center mb-6">
              <div
                aria-hidden="true"
                className="hero-name-reveal pointer-events-none select-none absolute inset-x-0 top-0 h-[80%] flex items-center justify-center"
                style={spotlightStyle}
              >
                <span className="hero-outline-name text-center text-[25vw] font-black uppercase leading-[0.85] tracking-tighter text-accent/[0.08] [-webkit-text-stroke:1.5px_rgb(var(--accent-rgb)/0.85)] [filter:drop-shadow(0_0_18px_rgb(var(--accent-rgb)/0.45))]">
                  {nameWords.map((w, i) => (
                    <span key={i} className="block">{w}</span>
                  ))}
                </span>
              </div>

              <div className="mobile-avatar image-container relative z-10 w-40 h-52 rounded-t-full overflow-hidden bg-muted border border-primary/10">
                <Image
                  src={hero.photoUrl}
                  alt="Abdul Barr"
                  width={352}
                  height={448}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              {availability.enabled && (
                <AvailabilityBadge
                  text={availability.text}
                  className="hero-content-layer absolute z-20 left-1/2 -translate-x-1/2 -bottom-3 shadow-sm"
                />
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-14 mt-3 mb-6 relative z-20">
              {stats.map((st, i) => {
                const [l1, l2] = splitLabel(st.label);
                return (
                  <Link
                    key={i}
                    href={st.href || '#'}
                    className="hero-content-layer stat-item text-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <h3 className="text-3xl font-bold text-primary"><StatValue value={st.value} /></h3>
                    <p className="text-secondary text-sm font-medium leading-tight">
                      {l1} <br />
                      {l2}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Greeting */}
            <div className="text-center relative z-10 w-full">
              <h1 className="hero-content-layer accent-dot text-6xl font-thin tracking-tighter text-primary leading-none">
                {hero.greeting}
              </h1>

              <div className="hero-content-layer bio-line text-lg text-secondary mt-3 min-h-[3.5rem]">
                — I&apos;m a{' '}
                <TypeAnimation
                  key={hero.rolesMobile.join('|')}
                  sequence={hero.rolesMobile.flatMap((r) => [r, 2000])}
                  wrapper="span"
                  speed={50}
                  className="text-accent font-bold"
                  repeat={Infinity}
                />
              </div>

              <p className="hero-content-layer bio-line text-sm text-secondary max-w-[19rem] mx-auto leading-relaxed">
                {hero.tagline}
              </p>

              <div className="hero-content-layer mt-6">
                <Link
                  href={hero.ctaHref}
                  className={
                    heroVars
                      ? 'inline-flex items-center gap-2 rounded-full bg-accent text-ink px-6 py-3 text-sm font-semibold shadow-[0_0_30px_-6px_rgb(var(--accent-rgb)/0.7)] active:scale-95 hover:bg-primary transition-all'
                      : 'inline-flex items-center gap-2 rounded-full bg-primary text-background px-6 py-3 text-sm font-semibold active:scale-95 hover:bg-accent active:bg-accent transition-all'
                  }
                >
                  {hero.ctaTextMobile} &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block">
            <div
              aria-hidden="true"
              className="hero-name-reveal pointer-events-none select-none absolute inset-x-0 top-0 h-[88%] flex items-center justify-center"
              style={spotlightStyle}
            >
              <span className="hero-outline-name whitespace-nowrap text-[12.5vw] font-black uppercase leading-none tracking-tighter text-accent/[0.08] [-webkit-text-stroke:2px_rgb(var(--accent-rgb)/0.9)] [filter:drop-shadow(0_0_28px_rgb(var(--accent-rgb)/0.5))]">
                {hero.outlineName}
              </span>
            </div>

            <div
              className="hero-content-layer parallax-layer image-container absolute bottom-24 left-10 w-[50%] lg:w-[55%]"
              data-speed="1"
            >
              <Image
                src={hero.photoUrl}
                alt="Abdul Barr"
                width={1080}
                height={1350}
                className="w-full h-auto"
                priority
              />
            </div>

            {stats.slice(0, 2).map((st, i) => {
              const [l1, l2] = splitLabel(st.label);
              return (
                <Link
                  key={i}
                  href={st.href || '#'}
                  className={`hero-content-layer parallax-layer stat-item absolute top-[20%] ${i === 0 ? 'left-[10%]' : 'right-[10%]'} text-left cursor-pointer hover:scale-105 transition-transform`}
                  data-speed="1.8"
                >
                  <h3 className="text-6xl font-bold text-primary"><StatValue value={st.value} /></h3>
                  <p className="text-secondary leading-tight">
                    {l1} <br />
                    {l2}
                  </p>
                </Link>
              );
            })}

            <div
              className="hero-content-layer parallax-layer absolute top-1/2 right-28 lg:right-40 transform -translate-y-1/2"
              data-speed="2.5"
            >
              {availability.enabled && <AvailabilityBadge text={availability.text} className="mb-5" />}

              <h1 className="accent-dot text-9xl font-thin tracking-tighter text-primary">{hero.greeting}</h1>

              <div className="bio-line mt-4 text-lg text-secondary">
                — I&apos;m a{' '}
                <TypeAnimation
                  key={hero.rolesDesktop.join('|')}
                  sequence={hero.rolesDesktop.flatMap((r) => [r, 2000])}
                  wrapper="span"
                  speed={50}
                  className="text-accent font-semibold"
                  repeat={Infinity}
                />
              </div>

              <p className="bio-line mt-2 text-sm text-secondary/80 max-w-md">{hero.tagline}</p>

              <div className="bio-line mt-8">
                <Link
                  href={hero.ctaHref}
                  className={
                    heroVars
                      ? 'inline-flex items-center gap-2 rounded-full bg-accent text-ink px-6 py-3 font-semibold shadow-[0_0_34px_-6px_rgb(var(--accent-rgb)/0.75)] transition-all hover:-translate-y-0.5 hover:bg-primary'
                      : 'font-semibold text-primary border-b-2 border-accent/60 hover:border-accent transition-colors'
                  }
                >
                  {hero.ctaTextDesktop} &rarr;
                </Link>
              </div>
            </div>

            {/* Scroll indicator */}
            <div
              aria-hidden="true"
              className="hero-content-layer absolute bottom-32 left-5 z-20 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-secondary"
            >
              <span className="[writing-mode:vertical-rl] rotate-180">Scroll</span>
              <span className="relative block h-14 w-px overflow-hidden bg-primary/15">
                <span className="absolute left-0 top-0 h-1/2 w-px bg-accent animate-[scrollLine_1.8s_ease-in-out_infinite]" />
              </span>
            </div>
          </div>

          {/* Projects marquee (same on mobile & desktop) */}
          <Link
            href="/projects"
            className="absolute bottom-0 left-0 w-full h-16 md:h-20 bg-primary/5 border-t-2 border-accent z-30 overflow-hidden cursor-pointer backdrop-blur-sm group m-0"
          >
            <div className="marquee-track absolute left-0 top-1/2 -translate-y-1/2 flex whitespace-nowrap w-max opacity-40 group-hover:opacity-70 transition-opacity duration-300">
              {[...projects, ...projects].map((project, i) => (
                <div key={i} className="flex items-center mx-8">
                  <span className="text-base md:text-xl font-black text-primary/80 uppercase tracking-widest transition-colors group-hover:text-accent">
                    {project.title}
                  </span>
                  <span className="ml-8 text-accent text-xl">✦</span>
                </div>
              ))}
            </div>

            <div
              ref={desktopSlamTextRef}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-accent text-ink px-6 py-2 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl border border-background/20 opacity-0 whitespace-nowrap"
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