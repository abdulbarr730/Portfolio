'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';

const TOPICS = ['All', 'System design', 'Backend', 'SaaS', 'Automation', 'Career'];
const TOPIC_WORDS = {
  'System design': ['architecture', 'system', 'design', 'scale', 'infrastructure'],
  Backend: ['backend', 'api', 'database', 'server', 'node', 'mongo'],
  SaaS: ['saas', 'crm', 'product', 'platform', 'client'],
  Automation: ['automation', 'automate', 'n8n', 'ai', 'workflow', 'pipeline'],
  Career: ['sih', 'hackathon', 'job', 'internship', 'first', 'learn', 'team'],
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const Meta = ({ post }) => (
  <p className="text-xs font-medium uppercase tracking-wider text-secondary">
    {formatDate(post.pubDate)}
    {post.readingTime ? <span className="mx-2 text-accent">•</span> : null}
    {post.readingTime ? `${post.readingTime} min read` : null}
  </p>
);

// Cover image, or a typographic fallback when the article has none
const Cover = ({ post, number, className = '' }) =>
  post.image ? (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <Image
        src={post.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* number overlay, matching the image-less covers */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent" />
      <span className="absolute bottom-5 left-5 text-7xl font-bold leading-none tracking-tighter text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:-translate-y-1">
        {String(number).padStart(2, '0')}
      </span>
      <span className="absolute right-5 top-5 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur">
        Article
      </span>
    </div>
  ) : (
    <div className={`relative flex items-end overflow-hidden bg-muted p-5 ${className}`}>
      <span className="text-7xl font-bold leading-none tracking-tighter text-accent/80 transition-transform duration-500 group-hover:-translate-y-1">
        {String(number).padStart(2, '0')}
      </span>
      <span className="absolute right-5 top-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
        Article
      </span>
    </div>
  );

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('All');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium`)
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data.map((p, i) => ({ ...p, number: i + 1 })) : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return posts.filter((p) => {
      const hay = `${p.title} ${p.contentSnippet} ${(p.categories || []).join(' ')}`.toLowerCase();
      const matchesSearch = !q || hay.includes(q) || String(p.number) === q;
      const matchesTopic = topic === 'All' || TOPIC_WORDS[topic].some((w) => hay.includes(w));
      return matchesSearch && matchesTopic;
    });
  }, [posts, searchTerm, topic]);

  const showFeatured = !searchTerm && topic === 'All' && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  return (
    <div className="pb-24">
      <PageHeader
        index="04"
        eyebrow="Journal"
        title="Writing"
        intro="Notes from things I've actually built, broken and optimised: system design, backend architecture, SaaS, and the implementation details tutorials usually skip."
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`chip ${topic === t ? 'chip-active' : 'hover:border-accent hover:text-accent'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search articles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-primary/15 bg-surface py-2.5 pl-11 pr-4 text-sm text-primary placeholder:text-secondary/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </PageHeader>

      <div className="page-container">
        {loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[16/10] rounded-t-2xl bg-muted" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-5 w-4/5 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured (latest) */}
        {featured && (
          <motion.a
            href={featured.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="card card-hover group mb-12 grid overflow-hidden md:grid-cols-2"
          >
            <Cover post={featured} number={featured.number} className="aspect-[16/10] md:aspect-auto md:min-h-[340px]" />
            <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Latest article
                </span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-primary transition-colors group-hover:text-accent">
                  {featured.title}
                </h2>
                <p className="mt-4 line-clamp-3 leading-relaxed text-secondary">{featured.contentSnippet}</p>
              </div>
              <div className="flex items-center justify-between">
                <Meta post={featured} />
                <span className="text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                  Read article &rarr;
                </span>
              </div>
            </div>
          </motion.a>
        )}

        {/* Grid */}
        {!loading && rest.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <motion.a
                key={post.link}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: (i % 3) * 0.08 }}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <Cover post={post} number={post.number} className="aspect-[16/10]" />
                <div className="flex flex-1 flex-col p-6">
                  <Meta post={post} />
                  <h3 className="mt-3 text-lg font-bold leading-snug text-primary transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-secondary">{post.contentSnippet}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-primary">
                    Read on Medium <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="card px-6 py-16 text-center">
            <p className="text-lg font-semibold text-primary">No articles match that yet</p>
            <p className="mt-1 text-secondary">Try another word or topic.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setTopic('All');
              }}
              className="chip mt-6 hover:border-accent hover:text-accent"
            >
              Show all articles
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && posts.length > 0 && (
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-primary/10 pt-10 text-center md:flex-row md:text-left">
            <div>
              <p className="eyebrow">Keep reading</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-primary">All {posts.length} articles live on Medium</p>
            </div>
            <a
              href="https://medium.com/@abdulbarr730"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-background transition-colors hover:bg-accent"
            >
              Follow on Medium &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
