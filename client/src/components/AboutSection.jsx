'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import ProjectPreview from './ProjectPreview';
import { allProjectsData } from '@/app/data/projectData';

gsap.registerPlugin(ScrollTrigger);

const toolkit = [
  { name: 'React', logo: '/logos/react.svg' },
  { name: 'Next.js', logo: '/logos/nextjs.svg' },
  { name: 'Node.js', logo: '/logos/nodejs.svg' },
  { name: 'Express', logo: '/logos/express.svg' },
  { name: 'MongoDB', logo: '/logos/mongodb.svg' },
  { name: 'GSAP', logo: '/logos/gsap.svg' },
  { name: 'Framer Motion', logo: '/logos/framer.svg' },
  { name: 'Python', logo: '/logos/python.svg' },
  { name: 'Scikit-Learn', logo: '/logos/sklearn.svg' },
  { name: 'Docker', logo: '/logos/docker.svg' },
  { name: 'Kubernetes', logo: '/logos/kubernetes.svg' },
  { name: 'Git & GitHub', logo: '/logos/git.svg' },
];

const milestones = [
  { year: '2021', text: 'Started my journey into web development, building foundational projects with React and Node.js.' },
  { year: '2023', text: 'Began taking on freelance work, successfully delivering e-commerce sites and portfolio pages for clients.' },
  { year: '2023+', text: 'Secured internships annually, gaining hands-on experience in both Full-Stack and Machine Learning environments.' },
  { year: '2026', text: 'Joined ProSync Infotech Private Limited as a Software Developer, building production systems used company-wide.' }
];

const certifications = [
  {
    name: 'Building with the Claude API',
    issuer: 'Claude Anthropic',
    link: 'https://verify.skilljar.com/c/rsdbnkasqhb7'
  },
  {
    name: 'Prompt Design in Vertex AI',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17305399'
  },
  {
    name: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17410538'
  },
  {
    name: 'Build Real World AI Applications with Gemini and Imagen',
    issuer: 'Google',
    link: 'https://www.cloudskillsboost.google/public_profiles/709def08-7018-4ba2-ada5-c38085efba66/badges/17343087'
  },
  {
    name: 'Node.js Development',
    issuer: 'Lets Upgrade',
    link: 'https://verify.letsupgrade.in/certificate/LUENJSAPR125467'
  },
  {
    name: 'Low-Level Design (LLD) of Payment Apps',
    issuer: 'Scaler',
    link: 'https://moonshot.scaler.com/s/sl/duGPtR04Jv'
  },
  {
    name: 'Campus Ambassador',
    issuer: 'IIT Delhi Rendezvous \'23',
    link: 'https://drive.google.com/file/d/1u-ILxv45g8aRHnOBVPjTyMqKhrMHkywB/view?usp=drive_link'
  },
  {
    name: 'Event Anchor & Host',
    issuer: 'College Fresher\'s Party',
    link: '' // no link available
  }
];

const AboutSection = () => {
  const component = useRef(null);
  const photoCardImageRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Section Fade In
      gsap.from('.about-item', {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: component.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Arrow Animation
      gsap.utils.toArray('.connecting-arrow').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 + i * 0.08 });
        gsap.to(el, { y: '+=6', repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.8, delay: 1.2 + i * 0.1, });
      });

      // Image Stretch Animation
      if (photoCardImageRef.current) {
        const image = photoCardImageRef.current.querySelector('img');
        gsap.fromTo(image,
          { scale: 1, y: '0%' },
          {
            scale: 1.4,
            y: '-10%',
            ease: "power2.out",
            scrollTrigger: {
              trigger: photoCardImageRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      }

    }, component);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={component}
      id="about"
      className="container mx-auto py-28 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden"
    >
      {/* Grid Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 items-start justify-center">

        <div className="about-item order-1 text-center lg:text-left">

          <h2 className="text-4xl font-bold tracking-tight text-primary mb-6">
            About Me
          </h2>

          {/* MAIN TEXT */}
          <p className="max-w-xl mx-auto lg:mx-0 text-lg text-secondary leading-relaxed">
            I&apos;m a Software Developer at ProSync Infotech Private Limited, and a B.Tech Computer Science Engineering graduate (AKTU), focused on building full-stack systems that solve real operational problems — not just demo projects.
            <br /><br />
            I build SaaS platforms, web applications, and backend systems with a strong focus on structure, scalability, and real-world usability.
          </p>

          {/* 🔥 CREDIBILITY BLOCKS */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0">

            <div className="border border-primary/10 rounded-lg p-4 bg-white">
              <p className="text-2xl font-bold text-primary">4,000+</p>
              <p className="text-sm text-secondary">Client records managed (ProSync CRM)</p>
            </div>

            <div className="border border-primary/10 rounded-lg p-4 bg-white">
              <p className="text-2xl font-bold text-primary">3+</p>
              <p className="text-sm text-secondary">Internships completed</p>
            </div>

            <div className="border border-primary/10 rounded-lg p-4 bg-white">
              <p className="text-2xl font-bold text-primary">2+ yrs</p>
              <p className="text-sm text-secondary">Freelancing experience</p>
            </div>

            <div className="border border-primary/10 rounded-lg p-4 bg-white">
              <p className="text-2xl font-bold text-primary">Full Stack + AI</p>
              <p className="text-sm text-secondary">React, Next.js, Node, MongoDB, RAG, Models</p>
            </div>

          </div>

        </div>

        {/* Journey */}
        <div className="about-item order-2 lg:order-3 text-center lg:text-left">
          <h3 className="text-2xl font-semibold text-primary mb-6">
            My Journey
          </h3>
          <div className="relative border-l-2 border-primary/20 mx-auto lg:mx-0 w-fit text-left">
            {milestones.map((item, index) => (
              <div key={index} className="relative mb-10 ml-10">
                <div className="absolute -left-[49px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background "></div>
                <p className="font-bold text-lg text-primary ">{item.year}</p>
                <p className="text-secondary ">{item.text}</p>
              </div>
            ))}
            <br></br>
            {/* EXPERIENCE CTA */}
            <div className="mt-6 text-center lg:text-left">
              <Link
                href="/experience"
                className="group inline-flex items-center text-primary font-semibold text-sm hover:underline"
              >
                View my work experience & education

                <svg
                  className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Photo Card */}
        <div className="about-item order-3 lg:order-2 md:max-w-sm mx-auto flex flex-col items-center bg-white rounded-lg shadow-xl overflow-hidden">
          <div ref={photoCardImageRef} className="w-full h-96 relative overflow-hidden">
            <Image
              src="/profile2.png"
              alt="Abdul Barr"
              fill
              className="object-cover"
              priority={true}
            />
          </div>
          <div className="w-full p-6 text-center">
            {/* Dynamic Count */}
            <h3 className="text-5xl font-bold text-primary mb-2">{allProjectsData.length}+</h3>
            <p className="text-lg text-secondary mb-4">Projects Completed</p>
            <Link
              href="/projects"
              className="inline-flex items-center text-primary font-bold hover:underline"
            >
              View Projects
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>

        {/* Desktop arrow */}
        {/* <div className="about-item hidden lg:block absolute top-[68%] left-[27%] w-48 h-24 pointer-events-none z-20">
          <Image
            src="/arrows.png"
            alt="Connecting arrow"
            width={192}
            height={96}
            className="connecting-arrow"
          />
        </div> */}
      </div>

      {/* Featured Projects */}
      <div className="about-item text-center mt-24 overflow-hidden">
        <h3 className="text-3xl font-bold text-primary mb-12">Featured Projects</h3>
        <ProjectPreview />

        {/* PROJECT CTA (PRIMARY) */}
        <div className="mt-12 max-w-3xl mx-auto">

          <Link
            href="/projects"
            className="group flex items-center justify-between w-full bg-primary text-white px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <span className="text-left text-sm sm:text-base font-medium leading-relaxed">
              Explore all projects, case studies, and detailed breakdowns of how each system was built
            </span>

            <svg
              className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

        </div>


        {/* SEPARATOR */}
        <div className="mt-10 border-t border-primary/20 max-w-xl mx-auto"></div>


        {/* SERVICES CTA (WITH LOOP — FIXED) */}
        <div className="mt-12 flex justify-center">

          <Link
            href="/services"
            ref={(el) => {
              if (!el) return;

              gsap.to(el, {
                scale: 1.03,            // ↓ reduced from 1.05 (less jumpy)
                duration: 1.8,          // ↑ slower = smoother
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1,
              });
            }}
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.05]"
          >
            Book a Service / Learn More
          </Link>

        </div>
      </div>

      {/* Connecting Arrow */}
      <div className="about-item flex flex-col items-center my-16 text-center">
        <p className="italic text-lg text-secondary mb-4 max-w-md">
          The tech behind the work
        </p>
        <svg
          className="w-8 h-16 text-secondary/50 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Toolkit */}
      <div className="about-item mt-12">
        <h3 className="text-3xl font-bold text-primary mb-12 text-center">My Toolkit</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 justify-items-center">
          {toolkit.map((tool, index) => (
            <div key={index} className="flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 relative">
                <Image src={tool.logo} alt={tool.name} fill className="object-contain" />
              </div>
              <p className="text-sm font-semibold text-secondary ">{tool.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="relative py-20 px-6 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 rounded-3xl mt-12">
        <h3 className="text-4xl font-bold text-primary text-center mb-14 tracking-tight">
          Certifications & Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {certifications.map((cert, index) => {
            // Determine if this card is clickable
            const isLink = !!cert.link;
            const Wrapper = isLink ? 'a' : 'div';
            const wrapperProps = isLink ? {
              href: cert.link,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {};

            return (
              <Wrapper
                key={index}
                {...wrapperProps}
                className={`relative group bg-zinc-100 border border-zinc-200 rounded-2xl p-6 transition-all duration-300
                           hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)] hover:-translate-y-1 overflow-hidden 
                           ${isLink ? 'cursor-pointer' : ''}`}
              >
                {/* ✨ Ripple pulse effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent animate-pulse rounded-2xl"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-lg text-primary group-hover:text-indigo-600 transition-colors duration-200">
                      {cert.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Issued by {cert.issuer}
                    </p>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;