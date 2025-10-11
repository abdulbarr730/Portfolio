'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TimelineItem = ({ item }) => (
  <div className="timeline-item relative pl-8 sm:pl-12 py-6 group">
    <div className="absolute top-8 left-[-5px] w-3 h-3 rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300"></div>
    <p className="text-sm font-medium text-secondary ">{item.duration}</p>
    <h3 className="mt-2 text-xl font-bold text-primary ">{item.role}</h3>
    <p className="mt-1 text-md text-secondary ">{item.company}</p>
    <div className="mt-4 space-y-2">
      {item.description.map((desc, index) => (
        <p key={index} className="text-secondary/80 list-item ml-4">{desc}</p>
      ))}
    </div>
  </div>
);

// CHANGED: The component now accepts 'experience' as a prop
const ExperienceTimeline = ({ experience }) => {
  const component = useRef(null);

  // REMOVED: The hardcoded experienceData array is no longer needed here.

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
          opacity: 0,
          x: -100,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: "play none none none"
          }
        });
      });
    }, component);
    return () => ctx.revert();
  }, []);

  // CHANGED: Now filters the 'experience' prop
  const professionalExperience = experience.filter(item => item.type === 'professional');
  const education = experience.filter(item => item.type === 'education');

  return (
    <section ref={component} id="experience" className="container mx-auto py-32 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-primary mb-12">Work Experience</h2>
        <div className="relative border-l border-secondary/20 ">
          {professionalExperience.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-4xl font-bold tracking-tight text-primary mb-12">Education</h2>
        <div className="relative border-l border-secondary/20 ">
          {education.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;