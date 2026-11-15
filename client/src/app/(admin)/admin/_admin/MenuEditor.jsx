'use client';
// Admin editor for the slide-out menu: add links, reorder them, hide/show them.
const inputCls =
  'w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

const BLANK = { text: '', id: '', type: 'link', newTab: false, cta: '', hidden: false, navbar: false };
// Same fallback the navbar uses until any link has the switch set
const DEFAULT_TOP = ['/projects', '/services', '/blog', '/experience'];

const SECTIONS = [
  { value: 'hero', label: 'Home (top of page)' },
  { value: 'about', label: 'About section' },
  { value: 'reviews', label: 'Reviews section' },
  { value: 'contact', label: 'Contact section' },
];

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

export default function MenuEditor({ value = [], onChange }) {
  const items = Array.isArray(value) ? value : [];
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const hasTopFlags = items.some((m) => typeof m.navbar === 'boolean');
  const inTopBar = (m) => m.type === 'link' && (hasTopFlags ? !!m.navbar : DEFAULT_TOP.includes(m.id));
  // first toggle: write the current state onto every link so the others don't change
  const setTopBar = (i, v) =>
    onChange(items.map((it, j) => ({ ...it, navbar: j === i ? v : inTopBar(it) })));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => {
    if (!window.confirm(`Remove "${items[i].text || 'this link'}" from the menu?`)) return;
    onChange(items.filter((_, j) => j !== i));
  };

  const visibleCount = items.filter((i) => !i.hidden).length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-secondary">
        {visibleCount} of {items.length} links visible. Use the arrows to reorder; switch off <strong>Show</strong> to hide a
        link without deleting it.
      </p>

      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-xl border p-4 transition-colors ${
            item.hidden ? 'border-dashed border-primary/15 bg-background opacity-70' : 'border-primary/10 bg-surface'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* order */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <span className="text-[11px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="text-secondary hover:text-primary leading-none">▲</button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="text-secondary hover:text-primary leading-none">▼</button>
            </div>

            <div className="grid flex-1 gap-3 md:grid-cols-12">
              <input
                className={`${inputCls} md:col-span-3`}
                placeholder="Label (e.g. Blog)"
                value={item.text || ''}
                onChange={(e) => update(i, { text: e.target.value })}
              />
              <select
                className={`${inputCls} md:col-span-3`}
                value={item.type || 'link'}
                onChange={(e) => update(i, { type: e.target.value, id: e.target.value === 'scroll' ? 'hero' : '' })}
              >
                <option value="link">Page or URL</option>
                <option value="scroll">Section on home page</option>
              </select>
              {item.type === 'scroll' ? (
                <select className={`${inputCls} md:col-span-6`} value={item.id || 'hero'} onChange={(e) => update(i, { id: e.target.value })}>
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={`${inputCls} md:col-span-6`}
                  placeholder="/blog or https://…"
                  value={item.id || ''}
                  onChange={(e) => update(i, { id: e.target.value })}
                />
              )}
              <input
                className={`${inputCls} md:col-span-12`}
                placeholder="Optional note under the link (e.g. Drop a review…)"
                value={item.cta || ''}
                onChange={(e) => update(i, { cta: e.target.value })}
              />
              <div className="flex flex-wrap items-center gap-5 md:col-span-12">
                <label className="flex items-center gap-2 text-sm text-primary">
                  <Switch checked={!item.hidden} onChange={(v) => update(i, { hidden: !v })} label="Show in menu" />
                  Show
                </label>
                {item.type !== 'scroll' && (
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <Switch checked={inTopBar(item)} onChange={(v) => setTopBar(i, v)} label="Show in top bar" />
                    Show in top bar (desktop)
                  </label>
                )}
                {item.type !== 'scroll' && (
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <Switch checked={!!item.newTab} onChange={(v) => update(i, { newTab: v })} label="Open in new tab" />
                    Open in new tab
                  </label>
                )}
                <button type="button" onClick={() => remove(i)} className="ml-auto text-sm font-semibold text-secondary hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, { ...BLANK }])}
        className="w-full rounded-lg border border-dashed border-primary/20 py-2.5 text-sm font-semibold text-secondary hover:border-accent hover:text-accent transition-colors"
      >
        + Add menu link
      </button>
    </div>
  );
}
