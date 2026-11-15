'use client';
// Admin editor for the floating dock: show/hide, reorder, change icons and links.
import { DOCK_ICONS } from '@/components/FloatingDock';

const inputCls =
  'w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

const ACTIONS = [
  { value: 'link', label: 'Open a page or URL' },
  { value: 'top', label: 'Scroll to top' },
  { value: 'bottom', label: 'Scroll to bottom' },
  { value: 'divider', label: 'Divider line' },
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

export default function DockEditor({ value = [], onChange }) {
  const items = Array.isArray(value) ? value : [];
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i) => {
    if (!window.confirm(`Remove "${items[i].label || 'this button'}" from the dock?`)) return;
    onChange(items.filter((_, j) => j !== i));
  };

  const shown = items.filter((i) => !i.hidden && i.action !== 'divider').length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-secondary">
        {shown} buttons visible. The dock appears once visitors scroll down a page.
      </p>

      {/* live preview */}
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-primary/10 bg-background px-3 py-2.5">
        {items.filter((d) => !d.hidden).map((d, i) => {
          if (d.action === 'divider') return <span key={i} className="mx-0.5 mb-1.5 h-6 w-px bg-primary/15" />;
          const Icon = DOCK_ICONS[d.icon] || DOCK_ICONS.Home;
          return (
            <span key={i} title={d.label} className="grid h-10 w-10 place-items-center rounded-full bg-muted/60 text-primary">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
          );
        })}
        <span className="ml-auto self-center text-xs text-secondary">Preview</span>
      </div>

      {items.map((item, i) => {
        const Icon = DOCK_ICONS[item.icon] || DOCK_ICONS.Home;
        const isDivider = item.action === 'divider';
        return (
          <div
            key={i}
            className={`rounded-xl border p-4 ${item.hidden ? 'border-dashed border-primary/15 bg-background opacity-70' : 'border-primary/10 bg-surface'}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="text-[11px] font-semibold tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>
                <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="text-secondary hover:text-primary leading-none">▲</button>
                <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="text-secondary hover:text-primary leading-none">▼</button>
              </div>

              <div className="grid flex-1 gap-3 md:grid-cols-12">
                {!isDivider && (
                  <div className="flex items-center gap-2 md:col-span-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted/60 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <input className={inputCls} placeholder="Tooltip label" value={item.label || ''} onChange={(e) => update(i, { label: e.target.value })} />
                  </div>
                )}
                {!isDivider && (
                  <select className={`${inputCls} md:col-span-3`} value={item.icon || 'Home'} onChange={(e) => update(i, { icon: e.target.value })}>
                    {Object.keys(DOCK_ICONS).map((name) => (
                      <option key={name} value={name}>
                        Icon: {name}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  className={`${inputCls} ${isDivider ? 'md:col-span-12' : 'md:col-span-5'}`}
                  value={item.action || 'link'}
                  onChange={(e) => update(i, { action: e.target.value })}
                >
                  {ACTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                {item.action === 'link' && (
                  <input
                    className={`${inputCls} md:col-span-12`}
                    placeholder="/projects or https://…"
                    value={item.href || ''}
                    onChange={(e) => update(i, { href: e.target.value })}
                  />
                )}
                <div className="flex flex-wrap items-center gap-5 md:col-span-12">
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <Switch checked={!item.hidden} onChange={(v) => update(i, { hidden: !v })} label="Show in dock" />
                    Show
                  </label>
                  {item.action === 'link' && (
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
        );
      })}

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange([...items, { label: '', icon: 'Home', action: 'link', href: '', newTab: false, hidden: false }])}
          className="rounded-lg border border-dashed border-primary/20 py-2.5 text-sm font-semibold text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          + Add button
        </button>
        <button
          type="button"
          onClick={() => onChange([...items, { label: 'Divider', icon: '', action: 'divider', href: '', newTab: false, hidden: false }])}
          className="rounded-lg border border-dashed border-primary/20 py-2.5 text-sm font-semibold text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          + Add divider
        </button>
      </div>
    </div>
  );
}
