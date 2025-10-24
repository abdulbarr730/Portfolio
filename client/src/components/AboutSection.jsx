'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import ProjectPreview from './ProjectPreview';

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
  { year: '2023+', text: 'Secured internships annually, gaining hands-on experience in both Full-Stack and Machine Learning environments.' }
];

const certifications = [
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
  const photoCardImageRef = useRef(null); // Ref for the photo card's image container

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Your existing section fade-in animation
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

      // Your existing arrow animation
      gsap.utils.toArray('.connecting-arrow').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 + i * 0.08 });
        gsap.to(el, { y: '+=6', repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.8, delay: 1.2 + i * 0.1, });
      });

      // NEW: Image Stretch Animation for the main photo card
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

        {/* Column 1: About Me */}
        <div className="about-item order-1 text-center lg:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-primary mb-5">
            About Me
          </h2>
          <p className="max-w-xl mx-auto lg:mx-0 text-lg text-secondary leading-relaxed">
            A Computer Science Engineering student specializing in Full Stack (MERN) Development and Machine Learning. My expertise is strengthened by achievements like a <b>Google certification in Generative AI</b> and advanced training in <b>Low-Level Design (LLD) from Scaler</b>.
          </p>
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
            <h3 className="text-5xl font-bold text-primary mb-2">6+</h3>
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

        {/* ===== Desktop arrow: positioned relative to the grid (visible on lg and above) ===== */}
        <div className="about-item hidden lg:block absolute top-[68%] left-[27%] w-48 h-24 pointer-events-none z-20">
          <Image
            src="/arrows.png"
            alt="Connecting arrow"
            width={192}
            height={96}
            className="connecting-arrow"
          />
        </div>
      </div>

      {/* Featured Projects */}
      <div className="about-item text-center mt-24 overflow-hidden">
        <h3 className="text-3xl font-bold text-primary mb-12">Featured Projects</h3>
        <ProjectPreview />

        {/* UPDATED: "View All Projects" link text changed as requested */}
        <div className="mt-8">
          <Link
            href="/projects" // Assuming '/projects' is your dedicated projects page
            className="inline-flex items-center text-primary font-bold hover:underline group"
          >
            To view details and to see all projects, click here
            <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>


        {/* NEW CTA: Book a Service */}
        <div className="mt-12">
          <Link
            href="/services"
            ref={(el) => {
              if (el) {
                gsap.fromTo(
                  el,
                  { scale: 1 },
                  {
                    scale: 1.05,
                    repeat: -1,
                    yoyo: true,
                    duration: 1.2,
                    ease: 'power1.inOut',
                  }
                );
              }
            }}
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-300"
          >
            Book a Service / Learn More
          </Link>
        </div>
      </div>


      {/* NEW: Connecting Arrow and Text added as requested */}
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
      <div className="relative py-20 px-6 bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-50 rounded-3xl">
      <h3 className="text-4xl font-bold text-primary text-center mb-14 tracking-tight">
        Certifications & Achievements
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="relative group bg-zinc-100 border border-zinc-200 rounded-2xl p-6 transition-all duration-300
                         hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)] hover:-translate-y-1 overflow-hidden"
          >
            {/* ✨ Ripple pulse effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent animate-pulse rounded-2xl"></div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600/10 text-indigo-600 ">
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

              <div>
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lg text-primary group-hover:text-indigo-500 transition-colors duration-200"
                  >
                    {cert.name}
                  </a>
                ) : (
                  <p className="font-semibold text-lg text-primary ">
                    {cert.name}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Issued by {cert.issuer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default AboutSection;