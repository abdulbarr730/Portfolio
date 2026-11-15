'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageHeader from '@/components/PageHeader';

gsap.registerPlugin(ScrollTrigger);

const TimelineItem = ({ item }) => {
  const current = /present/i.test(item.duration || '');
  return (
    <div className="timeline-item group grid gap-4 border-t border-primary/10 py-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-4">
        <p className="text-sm font-semibold tabular-nums text-secondary">{item.duration}</p>
        <p className="mt-1 text-sm text-secondary/80">{item.company}</p>
      </div>
      <div className="md:col-span-8">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-primary transition-colors group-hover:text-accent">
            {item.role}
          </h3>
          {current && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Current
            </span>
          )}
        </div>
        {item.description?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {item.description.map((desc, index) => (
              <li key={index} className="relative pl-5 leading-relaxed text-secondary">
                <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent/60" />
                {desc}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Group = ({ label, title, items }) => (
  <div className="mb-16">
    <div className="mb-2 flex items-baseline justify-between">
      <h2 className="accent-dot text-3xl md:text-4xl font-bold tracking-tight text-primary">{title}</h2>
      <span className="eyebrow">{label}</span>
    </div>
    <div className="border-b border-primary/10">
      {items.map((item, index) => (
        <TimelineItem key={item._id || index} item={item} />
      ))}
    </div>
  </div>
);

const ExperienceTimeline = ({ experience }) => {
  const component = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, component);
    return () => ctx.revert();
  }, []);

  const professionalExperience = experience.filter((item) => item.type === 'professional');
  const education = experience.filter((item) => item.type === 'education');

  return (
    <section ref={component} id="experience" className="pb-24">
      <PageHeader
        index="02"
        eyebrow="Career"
        title="Experience"
        intro="From ML internships to owning two production platforms end to end: architecture, CI/CD and infrastructure for systems serving 4,000+ clients."
      />
      <div className="page-container">
        <Group label={`${professionalExperience.length} roles`} title="Work" items={professionalExperience} />
        <Group label={`${education.length} entries`} title="Education" items={education} />
      </div>
    </section>
  );
};

export default ExperienceTimeline;
