'use client';
// Home page sections built from admin → About. Each takes its section number
// (`index`) from the page so numbering follows the admin "Home" tab order.
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSettings, useProjects, useLiveNumbers } from '@/lib/content';
import SectionHeader, { Reveal } from '@/components/SectionHeader';

export const ArrowIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const ASPECTS = { portrait: 'aspect-[4/5]', square: 'aspect-square', landscape: 'aspect-[4/3]', tall: 'aspect-[3/4]' };
const POSITIONS = { top: 'object-top', center: 'object-center', bottom: 'object-bottom' };

/* ---------------- ABOUT ---------------- */
export function AboutIntro({ index = '01' }) {
  const { settings } = useSettings();
  const { projects } = useProjects();
  const about = settings.about;
  const { fill } = useLiveNumbers();
  const paragraphs = about.paragraphs.map(fill);
  const highlights = about.highlights.map((h) => ({ ...h, value: fill(h.value), label: fill(h.label) }));
  const { photoUrl } = about;
  const [lead, ...rest] = paragraphs;
  const aspect = ASPECTS[about.photoAspect] || ASPECTS.portrait;
  const position = POSITIONS[about.photoPosition] || POSITIONS.center;
  const fit = about.photoFit === 'contain' ? 'object-contain' : 'object-cover';
  const showBadge = about.photoBadge !== false;

  return (
    <section id="about" className="page-container py-24 md:py-32">
      <SectionHeader index={index} eyebrow="About" title="About me" />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-2xl md:text-3xl font-medium leading-snug tracking-tight text-primary">{lead}</p>
          </Reveal>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-secondary">
            {rest.map((p, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-primary/10 bg-primary/10 md:grid-cols-4">
            {highlights.map((h, i) => (
              <Reveal key={i} delay={0.06 * i} className="bg-background p-5 md:p-6">
                <p className="text-2xl md:text-3xl font-bold tracking-tight text-primary">{h.value}</p>
                <p className="mt-1 text-sm leading-snug text-secondary">{h.label}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-background transition-colors hover:bg-accent"
            >
              Experience &amp; education <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3 font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Work with me
            </Link>
          </div>
        </div>

        {/* Photo card (configurable in admin → About) */}
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="card relative overflow-hidden">
            <div className={`relative w-full bg-muted ${aspect}`}>
              {photoUrl && (
                <Image src={photoUrl} alt="Abdul Barr" fill sizes="(min-width: 1024px) 40vw, 100vw" className={`${fit} ${position}`} />
              )}
              {showBadge && (
                <>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                    <div>
                      <p className="text-5xl font-bold leading-none tracking-tighter">
                        {projects.length}
                        <span className="text-accent">+</span>
                      </p>
                      <p className="mt-1 text-sm text-white/80">Projects shipped</p>
                    </div>
                    <Link
                      href="/projects"
                      aria-label="View projects"
                      className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-accent hover:text-white"
                    >
                      <ArrowIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- JOURNEY ---------------- */
export function Journey({ index = '02' }) {
  const { milestones } = useSettings().settings.about;
  if (!milestones?.length) return null;
  return (
    <section className="page-container pb-24 md:pb-32">
      <SectionHeader index={index} eyebrow="Journey" title="How I got here" link="/experience" linkLabel="Full experience" />
      <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-primary/15 lg:block" />
        {milestones.map((m, i) => (
          <Reveal key={i} delay={0.08 * i} className="relative">
            <span className="relative z-10 mb-5 block h-[15px] w-[15px] rounded-full border-4 border-background bg-accent shadow-[0_0_0_4px_rgb(var(--accent-rgb)/0.15)]" />
            <p className="text-3xl font-bold tracking-tight text-primary">{m.year}</p>
            <p className="mt-2 leading-relaxed text-secondary">{m.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- TOOLKIT ---------------- */
export function Toolkit({ index = '05' }) {
  const { toolkit } = useSettings().settings;
  if (!toolkit?.length) return null;
  return (
    <section className="page-container pb-24 md:pb-32">
      <SectionHeader index={index} eyebrow="Toolkit" title="Tools I use" intro="The stack I reach for to design, build and ship production systems." />
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-primary/10 bg-primary/10 sm:grid-cols-4 lg:grid-cols-6">
        {toolkit.map((tool, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.03 * i }}
            className="group flex flex-col items-center gap-3 bg-background px-3 py-7 transition-colors hover:bg-surface"
          >
            <div className="relative h-11 w-11 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
              {tool.logo && <Image src={tool.logo} alt={tool.name} fill className="object-contain" />}
            </div>
            <p className="text-center text-xs sm:text-sm font-medium text-secondary group-hover:text-primary">{tool.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CERTIFICATIONS ---------------- */
const initials = (s = '') =>
  s
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '•';

export function Certifications({ index = '06' }) {
  const { certifications } = useSettings().settings.about;
  if (!certifications?.length) return null;
  const issuers = new Set(certifications.map((c) => c.issuer).filter(Boolean)).size;

  return (
    <section id="certifications" className="page-container pb-24 md:pb-32 scroll-mt-24">
      <SectionHeader
        index={index}
        eyebrow="Credentials"
        title="Certifications"
        intro={`${certifications.length} courses, badges and recognitions from ${issuers} organisations.`}
      />
      <div className="grid border-t border-primary/10 md:grid-cols-2 md:gap-x-10">
        {certifications.map((c, i) => {
          const Row = c.link ? 'a' : 'div';
          const linkProps = c.link ? { href: c.link, target: '_blank', rel: 'noopener noreferrer' } : {};
          return (
            <Reveal key={i} delay={0.03 * (i % 6)}>
              <Row
                {...linkProps}
                className={`group flex items-center gap-4 border-b border-primary/10 py-5 ${c.link ? 'cursor-pointer' : ''}`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-muted/70 text-sm font-bold tracking-wide text-primary transition-colors group-hover:bg-accent group-hover:text-white">
                  {initials(c.issuer || c.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-primary transition-colors group-hover:text-accent">{c.name}</p>
                  <p className="mt-0.5 text-sm text-secondary">{c.issuer}</p>
                </div>
                {c.link ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/15 px-3 py-1 text-xs font-semibold text-primary transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    Verify <ArrowIcon className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="shrink-0 text-xs font-medium text-secondary/70">No link</span>
                )}
              </Row>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// Back-compat default export
export default function AboutSection({ part = 'intro' }) {
  return part === 'credentials' ? (
    <>
      <Toolkit />
      <Certifications />
    </>
  ) : (
    <>
      <AboutIntro />
      <Journey />
    </>
  );
}
