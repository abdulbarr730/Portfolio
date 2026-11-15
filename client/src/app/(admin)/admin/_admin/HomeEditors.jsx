'use client';
// Admin editors: landing page sections (order + visibility) and blog cover overrides.
import { useEffect, useState } from 'react';
import { HOME_SECTIONS } from '@/components/HomeContent';
import { siteDefaults } from '@/app/data/siteDefaults';
import { ImageField } from './fields';

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-primary/20'}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

/* ---------------- Landing page sections ---------------- */
export function HomeSectionsEditor({ value, onChange }) {
  const saved = Array.isArray(value) && value.length ? value : siteDefaults.homeSections;
  const items = [...saved.filter((s) => HOME_SECTIONS[s.key])];
  for (const k of Object.keys(HOME_SECTIONS)) if (!items.some((s) => s.key === k)) items.push({ key: k, hidden: false });

  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  let n = 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/15 bg-background px-4 py-3 text-sm text-secondary">
        <span className="font-semibold text-primary">Hero</span> is always shown first.
      </div>
      {items.map((it, i) => {
        const num = it.hidden ? null : String(++n).padStart(2, '0');
        return (
          <div
            key={it.key}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
              it.hidden ? 'border-dashed border-primary/15 bg-background opacity-60' : 'border-primary/10 bg-surface'
            }`}
          >
            <div className="flex flex-col">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="text-secondary hover:text-primary leading-none">▲</button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="text-secondary hover:text-primary leading-none">▼</button>
            </div>
            <span className="w-7 text-sm font-semibold tabular-nums text-accent">{num || '—'}</span>
            <span className="flex-1 font-medium text-primary">{HOME_SECTIONS[it.key].label}</span>
            <label className="flex items-center gap-2 text-sm text-secondary">
              <Switch checked={!it.hidden} onChange={(v) => update(i, { hidden: !v })} label={`Show ${HOME_SECTIONS[it.key].label}`} />
              {it.hidden ? 'Hidden' : 'Shown'}
            </label>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Blog cover overrides ---------------- */
const cleanLink = (l = '') => l.split('?')[0];

export function BlogCoversEditor({ value, onChange }) {
  const covers = Array.isArray(value) ? value : [];
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium`)
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]));
  }, []);

  const setCover = (link, image) => {
    const key = cleanLink(link);
    const rest = covers.filter((c) => cleanLink(c.link) !== key);
    onChange(image ? [...rest, { link: key, image }] : rest);
  };

  if (posts === null) return <p className="text-sm text-secondary">Loading your Medium posts…</p>;
  if (!posts.length) return <p className="text-sm text-secondary">Couldn&apos;t load posts from Medium right now.</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-secondary">
        Medium&apos;s feed only includes images placed inside the article body, and it can take hours to update. Upload a
        cover here to show it on the site straight away. Leave empty to use Medium&apos;s image.
      </p>
      {posts.map((p, i) => {
        const override = covers.find((c) => cleanLink(c.link) === cleanLink(p.link))?.image || '';
        return (
          <div key={p.link} className="flex flex-col gap-4 rounded-xl border border-primary/10 bg-surface p-4 md:flex-row md:items-center">
            <div className="min-w-0 md:w-2/5">
              <p className="text-sm font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</p>
              <p className="font-semibold leading-snug text-primary">{p.title}</p>
              <p className="mt-1 text-xs text-secondary">
                {p.mediumImage ? 'Medium has a cover for this post' : 'No image in Medium’s feed'}
              </p>
            </div>
            <div className="flex-1">
              <ImageField label="Cover image" compact value={override} folder="blog" onChange={(v) => setCover(p.link, v)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
