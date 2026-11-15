'use client';
// Extra home page sections: Selected work, What I do, Latest writing.
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProjects, useServices } from '@/lib/content';
import SectionHeader, { Reveal } from '@/components/SectionHeader';

const Arrow = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
);

/* ---------------- SELECTED WORK ---------------- */
const clip = (text = '', max = 180) => (text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text);

function WorkCard({ project, index, large = false }) {
  const techs = (project.technologies || []).slice(0, large ? 6 : 3);
  return (
    <div className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <Link href="/projects" aria-label={`View ${project.title}`} className="absolute inset-0 z-0" />
      <div className={`relative w-full overflow-hidden bg-muted ${large ? 'aspect-[16/9]' : 'aspect-[16/9]'}`}>
        {project.snapshotUrl && (
          <Image
            src={project.snapshotUrl}
            alt={`${project.title} preview`}
            fill
            sizes={large ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 40vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-primary opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:bg-accent group-hover:text-white">
          <Arrow className="h-4 w-4" />
        </span>
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-6 md:p-7">
        <p className="eyebrow flex items-center gap-2">
          <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span className="h-px w-4 bg-accent" />
          <span className="truncate">{project.category || 'Project'}</span>
        </p>
        <h3 className={`mt-3 font-bold tracking-tight text-primary transition-colors group-hover:text-accent ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {project.title}
        </h3>
        <p className={`mt-2 leading-relaxed text-secondary ${large ? '' : 'line-clamp-2 text-sm'}`}>
          {project.description || clip(project.detailedDescription, 140)}
        </p>

        {large && project.problemSolved && (
          <div className="mt-6 border-l-2 border-accent/60 pl-4">
            <p className="eyebrow">The problem</p>
            <p className="mt-2 leading-relaxed text-secondary">{clip(project.problemSolved, 220)}</p>
          </div>
        )}
        {large && project.detailedDescription && (
          <div className="mt-5 border-l-2 border-primary/15 pl-4">
            <p className="eyebrow text-secondary">What I built</p>
            <p className="mt-2 leading-relaxed text-secondary">{clip(project.detailedDescription, 220)}</p>
          </div>
        )}

        {techs.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <span key={t} className="rounded-full border border-primary/15 px-2.5 py-0.5 text-xs font-medium text-secondary">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          {project.impact?.metric ? (
            <p className="text-sm text-secondary">
              <span className={`font-bold text-primary ${large ? 'text-3xl' : 'text-lg'}`}>{project.impact.metric}</span>{' '}
              {project.impact.label}
            </p>
          ) : (
            <span />
          )}
          {large && (
            <div className="pointer-events-auto flex items-center gap-4 text-sm font-semibold">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="group/l inline-flex items-center gap-1 text-primary hover:text-accent">
                  <span className="underline decoration-accent/60 underline-offset-4">Live site</span>
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="group/s inline-flex items-center gap-1 text-secondary hover:text-accent">
                  Source
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover/s:-translate-y-0.5 group-hover/s:translate-x-0.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SelectedWork({ index = '03' }) {
  const { projects } = useProjects();
  const featured = projects.filter((p) => p.featured);
  const picks = (featured.length >= 3 ? featured : [...featured, ...projects.filter((p) => !p.featured)]).slice(0, 3);
  if (!picks.length) return null;
  const [first, ...others] = picks;

  return (
    <section className="page-container pb-24 md:pb-32">
      <SectionHeader
        index={index}
        eyebrow="Selected work"
        title="Recent projects"
        intro="A few systems I've designed and shipped end to end."
        link="/projects"
        linkLabel={`All ${projects.length} projects`}
      />
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <WorkCard project={first} index={projects.indexOf(first)} large />
        </Reveal>
        <div className="grid gap-6 lg:col-span-5">
          {others.map((p, i) => (
            <Reveal key={p._id || p.title} delay={0.08 * (i + 1)}>
              <WorkCard project={p} index={projects.indexOf(p)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 04 WHAT I DO ---------------- */
export function WhatIDo({ index = '04' }) {
  const { services } = useServices();
  if (!services.length) return null;
  return (
    <section className="page-container pb-24 md:pb-32">
      <SectionHeader
        index={index}
        eyebrow="Services"
        title="What I do"
        intro="Everything is built in your accounts, documented and handed over. The first consultation is free."
        link="/services"
        linkLabel="See the process"
      />
      <div className="border-t border-primary/10">
        {services.map((s, i) => (
          <Reveal key={s._id || s.title} delay={0.03 * i}>
            <Link
              href="/services"
              className="group grid items-center gap-2 border-b border-primary/10 py-6 transition-colors md:grid-cols-12 md:gap-6 md:py-7"
            >
              <span className="text-sm font-semibold tabular-nums text-accent md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-primary transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent md:col-span-5">
                {s.title}
              </h3>
              <p className="text-secondary md:col-span-5">{s.description}</p>
              <span className="hidden justify-self-end md:col-span-1 md:block">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-primary transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  <Arrow className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 07 LATEST WRITING ---------------- */
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export function LatestWriting({ index = '07' }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium`)
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => setPosts([]));
  }, []);
  if (!posts.length) return null;

  return (
    <section className="page-container pb-24 md:pb-32">
      <SectionHeader index={index} eyebrow="Journal" title="Latest writing" link="/blog" linkLabel="All articles" />
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.link} delay={0.08 * i}>
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="card card-hover group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {p.image && (
                  <Image src={p.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                {p.image && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />}
                <span className={`absolute bottom-4 left-5 text-6xl font-bold leading-none tracking-tighter ${p.image ? 'text-white' : 'text-accent/80'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-secondary">
                  {fmt(p.pubDate)}
                  {p.readingTime ? <span className="mx-2 text-accent">•</span> : null}
                  {p.readingTime ? `${p.readingTime} min read` : null}
                </p>
                <h3 className="mt-3 text-lg font-bold leading-snug text-primary transition-colors group-hover:text-accent">{p.title}</h3>
                <span className="mt-auto pt-5 text-sm font-semibold text-primary">
                  Read on Medium <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
