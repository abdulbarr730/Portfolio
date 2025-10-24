'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { animateScroll as scroll } from 'react-scroll';
import { usePathname, useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const HAMBURGER_LINKS = [
  { id: 'hero', text: 'Home', type: 'scroll' },
  { id: '/blog', text: 'Blog', type: 'link' },
  { id: 'about', text: 'About Me', type: 'scroll' },
  { id: '/projects', text: 'Projects', type: 'link' },
  { id: '/codecraft', text: 'Code Craft', type: 'link' },
  { id: '/experience', text: 'Experience', type: 'link' },
  { id: 'contact', text: 'Contact', type: 'scroll' },
  { id: 'reviews', text: 'Review', type: 'scroll', cta: "Drop a review if you liked anything about me or my projects" },
];

const Navbar = () => {
  const component = useRef(null);
  const mobileMenuRef = useRef(null);
  const bookRef = useRef(null);
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

  // Animate Book An Appointment
  useLayoutEffect(() => {
    gsap.from(bookRef.current, {
      y: -10,
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex-shrink-0 relative h-12 w-52 flex items-center">
              <Link
                href="/"
                className="full-name-container absolute top-[6px] left-0 flex items-center whitespace-nowrap"
              >
                <span className="name-part-abdul text-xl font-bold text-primary leading-none">Abdul</span>
                <span className="name-part-barr text-xl font-bold text-primary ml-1.5 leading-none ">Barr</span>
              </Link>
              <Link
                href="/"
                className="initial-logo absolute top-[4px] left-0 flex items-center justify-center w-12 h-12 opacity-0"
              >
                <Image src="/logo.png" alt="Logo" width={48} height={48} />
              </Link>
            </div>

            {/* Right section: Book + Hamburger */}
            <div className="flex items-center space-x-4 md:space-x-6 text-primary">
              <Link
                href="/services"
                ref={bookRef}
                className="font-semibold underline text-primary cursor-pointer transform transition-all duration-200 hover:scale-105 hover:underline-offset-4"
              >
                Book An Appointment
              </Link>

              {/* Hamburger */}
              <button
                className="relative inline-flex flex-col justify-center items-center ml-2 z-[999] h-8 w-8"
                aria-label="Toggle Menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span
                  className={`block w-7 h-0.5 bg-primary rounded-full transition-transform duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-[5px]' : ''
                  }`}
                ></span>
                <span
                  className={`block w-7 h-0.5 bg-primary rounded-full transition-opacity duration-300 ${
                    menuOpen ? 'opacity-0' : 'my-1.5'
                  }`}
                ></span>
                <span
                  className={`block w-7 h-0.5 bg-primary rounded-full transition-transform duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-[5px]' : ''
                  }`}
                ></span>

                {!menuOpen && !clickedReviewDot && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full animate-ping"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <aside
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-[999] flex flex-col translate-x-full`}
      >
        <div className="flex justify-between items-center p-5 border-b border-primary/10">
          <Link href="/" className="flex items-center justify-center w-10 h-10">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-4xl text-secondary hover:text-primary transition-colors"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col px-4 py-6 space-y-2 flex-grow overflow-y-auto">
          {HAMBURGER_LINKS.map((item) =>
            item.type === 'scroll' ? (
              <div
                key={item.id}
                className="menu-link block text-lg font-medium cursor-pointer text-primary py-3 px-2 rounded-lg transition-transform duration-200 hover:scale-105 relative group"
                onClick={() => handleScrollLink(item.id)}
              >
                {item.text}
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
                {item.cta && !clickedReviewDot && (
                  <span className="absolute right-0 top-3 w-2 h-2 bg-black rounded-full animate-ping"></span>
                )}
                {item.cta && <p className="text-xs text-secondary mt-1">{item.cta}</p>}
              </div>
            ) : (
              <Link
                key={item.id}
                href={item.id}
                className="menu-link block text-lg font-medium cursor-pointer text-primary py-3 px-2 rounded-lg transition-transform duration-200 hover:scale-105 relative group"
                onClick={() => setMenuOpen(false)}
              >
                {item.text}
                <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          )}
        </nav>

        <div className="menu-link flex justify-center items-center space-x-6 p-6 border-t border-primary/10">
          <Link
            href="https://github.com/abdulbarr730"
            target="_blank"
            className="text-secondary hover:text-primary transition-colors"
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
            href="https://www.linkedin.com/in/abdul-barr-9092a4251"
            target="_blank"
            className="text-secondary hover:text-primary transition-colors"
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
