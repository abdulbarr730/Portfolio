'use client';

import { useSettings } from '@/lib/content';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { animateScroll as scroll } from 'react-scroll';
import { usePathname, useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const { settings } = useSettings();
  const { socials } = settings;
  // Menu links are managed in the admin panel (Menu tab); hidden ones are skipped
  const HAMBURGER_LINKS = (settings.menu || []).filter((m) => !m.hidden && m.text && m.id);
  // Links shown directly in the top bar on desktop (admin → Menu → "Show in top bar").
  // Until any link has that switch set, fall back to the main pages.
  const DEFAULT_TOP = ['/projects', '/services', '/blog', '/experience'];
  const hasTopFlags = HAMBURGER_LINKS.some((m) => typeof m.navbar === 'boolean');
  const TOP_LINKS = HAMBURGER_LINKS.filter(
    (m) => m.type === 'link' && (hasTopFlags ? m.navbar : DEFAULT_TOP.includes(m.id))
  );
  const component = useRef(null);
  const mobileMenuRef = useRef(null);
  const bookRef = useRef(null);
  const progressRef = useRef(null);
  const pathnameForProgress = usePathname();

  // Orange reading-progress bar under the navbar
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathnameForProgress]);

  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [clickedReviewDot, setClickedReviewDot] = useState(false);

  // Logo animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: '20px top',
          end: '+=150',
          scrub: 1,
        },
      });

      tl.to('.name-part-barr', { x: '-100%', opacity: 0, duration: 1 });
      tl.to('.name-part-abdul', { scale: 0.8, opacity: 0, duration: 1 }, '<');
      tl.fromTo('.initial-logo', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1 }, '<');
    }, component);

    return () => ctx.revert();
  }, []);

  // Hamburger animation
  useEffect(() => {
    if (menuOpen) {
      const tl = gsap.timeline();
      tl.fromTo(
        mobileMenuRef.current,
        { x: '100%', scale: 0.95 },
        { x: '0%', scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      tl.fromTo(
        '.menu-link',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
        '<0.1'
      );
    } else {
      gsap.to(mobileMenuRef.current, { x: '100%', scale: 0.95, duration: 0.4, ease: 'power3.in' });
    }
  }, [menuOpen]);

  // Animate Book CTA
  useLayoutEffect(() => {
    gsap.from(bookRef.current, {
      y: -10,
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, []);

  // Close on outside click or Escape
  useLayoutEffect(() => {
    if (!menuOpen) return;

    function handleClick(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setMenuOpen(false);
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleScrollLink = (id) => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => scroll.scrollTo(document.getElementById(id)?.offsetTop - 50 || 0), 200);
    } else {
      scroll.scrollTo(document.getElementById(id)?.offsetTop - 50 || 0);
    }

    setMenuOpen(false);

    if (id === 'reviews') setClickedReviewDot(true);
  };

  return (
    <>
      <header
        ref={component}
        className="fixed top-0 left-0 w-full z-[999] bg-background/80 backdrop-blur-sm overflow-x-hidden h-14"
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="relative h-12 w-52 flex items-center">
              <Link href="/" className="full-name-container absolute top-[6px] left-0 flex items-center whitespace-nowrap">
                <span className="name-part-abdul text-xl font-bold text-primary leading-none pt-2">Abdul</span>
                <span className="name-part-barr accent-dot text-xl font-bold text-primary ml-1.5 leading-none pt-2">Barr</span>
              </Link>

              <Link href="/" className="initial-logo absolute top-[4px] left-0 flex items-center justify-center w-12 h-12 opacity-0">
                <Image src={asset("/logo.png")} alt="Logo" width={48} height={48} />
              </Link>
            </div>

            {/* Right section: top-bar links (desktop) + Book + Hamburger */}
            <div className="flex items-center flex-shrink-0 space-x-3 sm:space-x-4">
              {TOP_LINKS.length > 0 && (
                <nav aria-label="Main" className="hidden lg:flex items-center gap-1 mr-4">
                  {TOP_LINKS.map((item) => {
                    const active = pathname === item.id || (item.id !== '/' && pathname?.startsWith(`${item.id}/`));
                    return (
                      <Link
                        key={item.id}
                        href={item.id}
                        target={item.newTab ? '_blank' : undefined}
                        rel={item.newTab ? 'noopener noreferrer' : undefined}
                        aria-current={active ? 'page' : undefined}
                        className={`group relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          active ? 'text-accent' : 'text-primary/80 hover:text-primary'
                        }`}
                      >
                        {item.text}
                        <span
                          className={`absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left rounded-full bg-accent transition-transform duration-300 ${
                            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              )}
              {/* DOMINANT CTA BUTTON */}
              <Link
                href="/contact"
                ref={bookRef}
                className="group relative text-sm sm:text-base font-semibold text-primary tracking-wide whitespace-nowrap hover:text-accent"
              >
                Book An Appointment

                {/* Always visible underline */}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-accent" />

                {/* Hover underline animation (top of it) */}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
              {/* Hamburger */}
              <button
                className="relative inline-flex flex-col justify-center items-center z-[999] h-8 w-8"
                aria-label="Toggle Menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span
                  className={`block w-7 h-0.5 bg-primary rounded-full transition-transform duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-[5px]' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 rounded-full transition-all duration-300 ${
                    menuOpen ? 'opacity-0 w-7' : 'my-1.5 w-5 self-end bg-accent'
                  }`}
                ></span>
                <span
                  className={`block w-7 h-0.5 bg-primary rounded-full transition-transform duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                  }`}
                ></span>

                {!menuOpen && !clickedReviewDot && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full animate-ping"></span>
                )}
              </button>
            </div>
          </div>
        </div>
        <span
          ref={progressRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent shadow-[0_0_8px_rgb(var(--accent-rgb)/0.6)]"
        />
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-ink/40 z-[998] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <aside
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-72 bg-background border-l border-primary/10 shadow-2xl z-[999] flex flex-col translate-x-full"
      >
        <div className="flex justify-between items-center p-5 border-b border-primary/10">
          <Link href="/" className="flex items-center justify-center w-10 h-10">
            <Image src={asset("/logo.png")} alt="Logo" width={40} height={40} />
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-4xl text-secondary hover:text-accent transition-colors"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="no-scrollbar flex flex-col px-5 py-5 space-y-0.5 flex-grow overflow-y-auto">
          {HAMBURGER_LINKS.map((item, idx) =>
            item.type === 'scroll' ? (
              <div
                key={item.id}
                className="menu-link block text-lg font-medium cursor-pointer text-primary py-2.5 px-2 rounded-lg transition-all duration-200 hover:translate-x-1 hover:text-accent relative group"
                onClick={() => handleScrollLink(item.id)}
              >
                <span className="mr-3 align-middle text-[11px] font-semibold tabular-nums text-accent">{String(idx + 1).padStart(2, '0')}</span>
                {item.text}
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />

                {item.cta && !clickedReviewDot && (
                  <span className="absolute right-0 top-3 w-2 h-2 bg-accent rounded-full animate-ping"></span>
                )}

                {item.cta && <p className="ml-8 text-xs text-secondary mt-1">{item.cta}</p>}
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.id}
                target={item.newTab ? '_blank' : '_self'}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className={`menu-link block text-lg font-medium cursor-pointer py-2.5 px-2 rounded-lg transition-all duration-200 hover:translate-x-1 hover:text-accent relative group ${
                  pathname === item.id ? 'text-accent' : 'text-primary'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mr-3 align-middle text-[11px] font-semibold tabular-nums text-accent">{String(idx + 1).padStart(2, '0')}</span>
                {item.text}
                <span
                  className={`absolute bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full ${
                    pathname === item.id ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )
          )}
        </nav>

        <div className="menu-link flex justify-center items-center space-x-6 p-6 border-t border-primary/10">
          <Link
            href={socials.github}
            target="_blank"
            className="text-secondary hover:text-accent transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            </svg>
          </Link>

          <Link
            href={socials.linkedin} target="_blank"
            className="text-secondary hover:text-accent transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;