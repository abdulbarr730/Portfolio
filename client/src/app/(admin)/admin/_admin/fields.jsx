'use client';
// Reusable form controls for the admin panel. All are controlled components:
// they take a `value` and call `onChange(nextValue)`.
import { useState } from 'react';
import { uploadImage } from './api';

const inputCls =
  'w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1.5">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-xs text-secondary/80">{hint}</span>}
    </label>
  );
}

export function Text({ label, hint, value, onChange, placeholder, type = 'text' }) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        className={inputCls}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 4, placeholder }) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        className={`${inputCls} resize-y leading-relaxed`}
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function Toggle({ label, hint, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-primary">{label}</p>
        {hint && <p className="text-xs text-secondary mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-primary/20'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform ${value ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  );
}

export function ColorField({ label, hint, value, onChange, presets = [] }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-10 w-12 cursor-pointer rounded-lg border border-primary/15 bg-surface p-1"
        />
        <input className={`${inputCls} w-32 font-mono`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        {presets.map((p) => (
          <button
            key={p.hex}
            type="button"
            title={p.name}
            onClick={() => onChange(p.hex)}
            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
              (value || '').toUpperCase() === p.hex ? 'border-primary' : 'border-white shadow'
            }`}
            style={{ background: p.hex }}
          />
        ))}
      </div>
    </Field>
  );
}

// List of plain strings
export function StringList({ label, hint, value = [], onChange, placeholder, multiline }) {
  const items = Array.isArray(value) ? value : [];
  const set = (i, v) => onChange(items.map((x, j) => (j === i ? v : x)));
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <textarea className={`${inputCls} resize-y`} rows={3} value={item} onChange={(e) => set(i, e.target.value)} />
            ) : (
              <input className={inputCls} value={item} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
            )}
            <RowButtons items={items} index={i} onChange={onChange} />
          </div>
        ))}
        <AddButton onClick={() => onChange([...items, ''])} />
      </div>
    </Field>
  );
}

// List of objects; `fields` = [{ key, label, placeholder, type: 'text'|'textarea'|'image' }]
export function RowList({ label, hint, value = [], onChange, fields, folder }) {
  const items = Array.isArray(value) ? value : [];
  const set = (i, key, v) => onChange(items.map((x, j) => (j === i ? { ...x, [key]: v } : x)));
  const blank = Object.fromEntries(fields.map((f) => [f.key, '']));
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-xl border border-primary/10 bg-background p-3">
            <div className={`grid flex-1 gap-2 ${fields.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {fields.map((f) =>
                f.type === 'image' ? (
                  <ImageField key={f.key} compact label={f.label} value={item[f.key]} folder={folder} onChange={(v) => set(i, f.key, v)} />
                ) : f.type === 'textarea' ? (
                  <textarea
                    key={f.key}
                    className={`${inputCls} sm:col-span-2 resize-y`}
                    rows={2}
                    placeholder={f.placeholder || f.label}
                    value={item[f.key] ?? ''}
                    onChange={(e) => set(i, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    key={f.key}
                    className={inputCls}
                    placeholder={f.placeholder || f.label}
                    value={item[f.key] ?? ''}
                    onChange={(e) => set(i, f.key, e.target.value)}
                  />
                )
              )}
            </div>
            <RowButtons items={items} index={i} onChange={onChange} />
          </div>
        ))}
        <AddButton onClick={() => onChange([...items, blank])} />
      </div>
    </Field>
  );
}

export function ImageField({ label, hint, value, onChange, folder = 'uploads', compact }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(file, folder));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Field label={compact ? '' : label} hint={hint}>
      <div className="flex items-center gap-3">
        <div className={`${compact ? 'h-10 w-10' : 'h-20 w-20'} shrink-0 overflow-hidden rounded-lg border border-primary/10 bg-muted`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : null}
        </div>
        <div className="flex-1 space-y-1.5">
          <input
            className={inputCls}
            value={value ?? ''}
            placeholder={compact ? label : 'Image URL'}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:text-accent">
            <input type="file" accept="image/*" className="hidden" onChange={pick} disabled={busy} />
            {busy ? 'Uploading…' : 'Upload image'}
          </label>
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
    </Field>
  );
}

function RowButtons({ items, index, onChange }) {
  const move = (d) => {
    const j = index + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };
  const btn = 'h-8 w-8 rounded-lg border border-primary/10 bg-surface text-secondary hover:text-primary hover:border-primary/30 text-sm';
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button type="button" aria-label="Move up" className={btn} onClick={() => move(-1)}>↑</button>
      <button type="button" aria-label="Move down" className={btn} onClick={() => move(1)}>↓</button>
      <button
        type="button"
        aria-label="Remove"
        className={`${btn} hover:!text-red-600 hover:!border-red-200`}
        onClick={() => onChange(items.filter((_, j) => j !== index))}
      >
        ×
      </button>
    </div>
  );
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-dashed border-primary/20 py-2 text-sm font-semibold text-secondary hover:border-accent hover:text-accent transition-colors"
    >
      + Add
    </button>
  );
}

export function Card({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-surface p-5 sm:p-6">
      {title && <h3 className="text-lg font-bold text-primary">{title}</h3>}
      {description && <p className="mt-0.5 text-sm text-secondary">{description}</p>}
      <div className={`${title ? 'mt-5' : ''} space-y-5`}>{children}</div>
    </section>
  );
}
