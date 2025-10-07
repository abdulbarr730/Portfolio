'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experienceData = [
  {
    type: 'professional',
    duration: 'Jun 2025 - Aug 2025',
    role: 'Full Stack Developer Intern',
    company: 'AI-DROM GLOBAL PVT. LTD., Noida, UP',
    description: [
      'Contributed to full-stack web applications using the MERN stack.',
      'Developed and integrated RESTful APIs for seamless data communication.',
      'Collaborated with the team to troubleshoot bugs and implement new features.'
    ]
  },
  {
    type: 'professional',
    duration: 'Jul 2024 - Nov 2024',
    role: 'Full Stack Web Developer Intern',
    company: 'Softpro India',
    description: [
      'Developed and deployed a full-stack web application using the MERN stack.',
      'Contributed to both the interactive React.js frontend and the robust Node.js backend.'
    ]
  },
  {
    type: 'professional',
    duration: 'Aug 2023 - Oct 2023',
    role: 'Machine Learning & Data Science Intern',
    company: 'YBI Foundation',
    description: [
      'Engineered complete machine learning pipelines, from data preprocessing to model development.',
      'Utilized Pandas for data manipulation and Scikit-Learn for model implementation.'
    ]
  },
  {
    type: 'education',
    duration: 'Sep 2022 - Oct 2026',
    role: 'Bachelor of Technology - Computer Science',
    company: 'Babu Banarsi Das Institute of Technology, Ghaziabad',
    description: []
  },
  {
    type: 'education',
    duration: 'Apr 2021 - May 2022',
    role: 'Class XII (CBSE Board)',
    company: 'KC Mount Fort School, Muzaffarpur',
    description: ['Percentage: 71.4%']
  }
];

const TimelineItem = ({ item }) => (
  <div className="timeline-item relative pl-8 sm:pl-12 py-6 group">
    <div className="absolute top-8 left-[-5px] w-3 h-3 rounded-full bg-secondary dark:bg-gray-600 group-hover:bg-primary dark:group-hover:bg-background transition-colors duration-300"></div>
    <p className="text-sm font-medium text-secondary dark:text-gray-400">{item.duration}</p>
    <h3 className="mt-2 text-xl font-bold text-primary dark:text-background">{item.role}</h3>
    <p className="mt-1 text-md text-secondary dark:text-gray-400">{item.company}</p>
    <div className="mt-4 space-y-2">
      {item.description.map((desc, index) => (
        <p key={index} className="text-secondary/80 dark:text-gray-500 list-item ml-4">{desc}</p>
      ))}
    </div>
  </div>
);

const ExperienceTimeline = () => {
  const component = useRef(null);

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

  const professionalExperience = experienceData.filter(item => item.type === 'professional');
  const education = experienceData.filter(item => item.type === 'education');

  return (
    <section ref={component} id="experience" className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 bg-background dark:bg-primary">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-primary dark:text-background mb-12">Work Experience</h2>
        <div className="relative border-l border-secondary/20 dark:border-secondary/40">
          {professionalExperience.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
      <div className="mt-20">
        <h2 className="text-4xl font-bold tracking-tight text-primary dark:text-background mb-12">Education</h2>
        <div className="relative border-l border-secondary/20 dark:border-secondary/40">
          {education.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;