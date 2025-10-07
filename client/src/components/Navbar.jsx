'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Link as ScrollLink } from 'react-scroll';
import ThemeToggle from './ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const fullName = component.current.querySelector(".full-name");
      const logo = component.current.querySelector(".initial-logo");
      const abdul = component.current.querySelector(".name-abdul");
      const barr = component.current.querySelector(".name-barr");

      const heroSection = document.querySelector("#hero"); // hero section
      if (!heroSection) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "bottom center", // halfway through hero
          end: "bottom top", // when hero exits view
          scrub: true,
          toggleActions: "play reverse play reverse",
        },
        defaults: { duration: 1.2, ease: "power2.inOut" },
      });

      // 1. Shrink the spacing between Abdul and Barr, slide Barr left toward Abdul
      tl.to(barr, {
        x: () => -(barr.offsetLeft - abdul.offsetLeft - abdul.firstChild.offsetWidth),
      });

      // 2. Shrink both to merge visually into the logo position
      tl.to([abdul, barr], {
        scale: 0.55,
        xPercent: -20,
        yPercent: -10,
      }, "<");

      // 3. Bring in the logo AB at the same position
      tl.to(logo, { opacity: 1, scale: 1, duration: 0.5 }, "<");

      // 4. Hide the full name (opacity 0 just at the end)
      tl.to(fullName, { opacity: 0, duration: 0.3 }, ">-0.3");
    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={component}
      className="fixed top-0 left-0 w-full z-50 bg-background/80 dark:bg-primary/90 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 md:pl-32">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Name */}
          <div className="flex-shrink-0 relative h-10 w-48 flex items-center">
            {/* AB Logo */}
            <Link
              href="/"
              className="initial-logo absolute top-0 left-0 flex items-center justify-center w-10 h-10 bg-primary dark:bg-background rounded-md opacity-0 scale-0"
            >
              <span className="logo-a font-bold text-lg text-background dark:text-primary">A</span>
              <span className="logo-b font-bold text-lg text-background dark:text-primary">B</span>
            </Link>

            {/* Full Name */}
            <div className="full-name absolute top-0 left-0 h-10 flex items-center whitespace-nowrap text-xl font-bold text-primary dark:text-background">
              <span className="name-abdul inline-flex">
                <span>A</span>
                <span className="overflow-hidden">bdul</span>
              </span>
              <span className="name-barr inline-flex ml-1.5">
                <span>B</span>
                <span className="overflow-hidden">arr</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4 md:space-x-8 text-primary dark:text-background">
            <nav className="hidden md:flex items-center space-x-8">
              <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-50}
                className="cursor-pointer text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                About Me
              </ScrollLink>
              <ScrollLink
                to="portfolio"
                smooth={true}
                duration={500}
                offset={-50}
                className="cursor-pointer text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors"
              >
                Portfolio
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                className="cursor-pointer font-semibold text-primary dark:text-background border border-primary/20 dark:border-background/20 px-4 py-2 rounded-md hover:bg-primary/5 dark:hover:bg-background/10 transition-colors"
              >
                Book A Call
              </ScrollLink>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
