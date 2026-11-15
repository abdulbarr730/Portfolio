'use client';
// Renders the landing page sections in the order chosen in admin → Home,
// skipping hidden ones and numbering the visible ones 01, 02, 03…
import { useSettings } from '@/lib/content';
import { siteDefaults } from '@/app/data/siteDefaults';
import { AboutIntro, Journey, Toolkit, Certifications } from '@/components/AboutSection';
import { SelectedWork, WhatIDo, LatestWriting } from '@/components/HomeSections';
import ReviewsSection from '@/components/ReviewsSection';
import ContactSection from '@/components/ContactSection';

export const HOME_SECTIONS = {
  about: { label: 'About me', Component: AboutIntro },
  journey: { label: 'Journey (milestones)', Component: Journey },
  work: { label: 'Selected work (projects)', Component: SelectedWork },
  services: { label: 'What I do (services)', Component: WhatIDo },
  toolkit: { label: 'Toolkit (tech logos)', Component: Toolkit },
  certifications: { label: 'Certifications', Component: Certifications },
  writing: { label: 'Latest writing (blog)', Component: LatestWriting },
  testimonials: { label: 'Testimonials (reviews)', Component: ReviewsSection },
  contact: { label: 'Contact', Component: ContactSection },
};

export default function HomeContent() {
  const { settings } = useSettings();
  const saved = Array.isArray(settings.homeSections) && settings.homeSections.length ? settings.homeSections : siteDefaults.homeSections;

  // keep saved order, then append any sections added in code later
  const keys = saved.map((s) => s.key).filter((k) => HOME_SECTIONS[k]);
  for (const k of Object.keys(HOME_SECTIONS)) if (!keys.includes(k)) keys.push(k);
  const hidden = new Set(saved.filter((s) => s.hidden).map((s) => s.key));
  const visible = keys.filter((k) => !hidden.has(k));

  return (
    <div className="bg-background">
      {/* anchors used by the slide-out menu, even if a section is hidden */}
      {hidden.has('about') && <span id="about" />}
      {visible.map((key, i) => {
        const { Component } = HOME_SECTIONS[key];
        return <Component key={key} index={String(i + 1).padStart(2, '0')} />;
      })}
      {hidden.has('testimonials') && <span id="reviews" />}
      {hidden.has('contact') && <span id="contact" />}
    </div>
  );
}
