'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  'Java (DSA)', 'Python (ML)', 'MERN Stack', 'Next.js', 'Django', 'GSAP',
  'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'Framer Motion', 'MongoDB', 
  'Node.js', 'React.js', 'Git & GitHub', 'RESTful APIs', 'Linux (Ubuntu)'
];

const AboutSection = () => {
  const component = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      tl.from(".about-title", { opacity: 0, y: 50, duration: 0.5 })
        .from(".about-p", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".skill-pill", { opacity: 0, y: 20, stagger: 0.05, duration: 0.3 });

    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={component} id="about" className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center bg-background dark:bg-primary">
      <h2 className="about-title text-4xl font-bold tracking-tight text-primary dark:text-background mb-6">
        About Me
      </h2>
      <p className="about-p max-w-3xl mx-auto text-lg text-secondary dark:text-gray-400 leading-relaxed">
        A Computer Science Engineering student specializing in Full Stack (MERN) Development and Machine Learning. I have a proven ability to build, test, and deploy scalable applications, with a passion for leveraging technology to solve complex, real-world problems.
      </p>
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-primary dark:text-background mb-6">
          Technologies I Work With
        </h3>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {skills.map((skill, index) => (
            <div key={index} className="skill-pill bg-white text-secondary dark:bg-primary/80 dark:text-gray-300 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;