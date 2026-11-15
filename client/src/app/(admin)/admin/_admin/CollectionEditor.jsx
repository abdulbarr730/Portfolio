'use client';
// Generic list + edit form for a collection (projects, experience, services).
// `schema` = [{ key: 'impact.metric', label, type: 'text'|'textarea'|'list'|'listMultiline'|'image'|'toggle'|'select', options }]
import { useEffect, useState } from 'react';
import { adminFetch } from './api';
import { Text, TextArea, StringList, ImageField, Toggle, Field, Card } from './fields';

const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const setPath = (obj, path, value) => {
  const [k, ...rest] = path.split('.');
  return { ...obj, [k]: rest.length ? setPath(obj?.[k] || {}, rest.join('.'), value) : value };
};

export default function CollectionEditor({ endpoint, schema, titleKey, subtitleKey, emptyItem, folder, onAuthError, notify }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // item being edited (or new)
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const handle = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      if (okMsg) notify(okMsg);
    } catch (e) {
      if (e.name === 'AuthError' || /session expired/i.test(e.message)) onAuthError(e.message);
      else notify(e.message, true);
    } finally {
      setBusy(false);
    }
  };

  const load = () =>
    handle(async () => {
      setItems(await adminFetch(endpoint));
      setLoading(false);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const save = () =>
    handle(async () => {
      if (editing._id) await adminFetch(`${endpoint}/${editing._id}`, { method: 'PUT', body: editing });
      else await adminFetch(endpoint, { method: 'POST', body: { ...editing, order: items.length } });
      setEditing(null);
      await load();
    }, 'Saved');

  const remove = (item) => {
    if (!window.confirm(`Delete "${getPath(item, titleKey)}"? This can't be undone.`)) return;
    handle(async () => {
      await adminFetch(`${endpoint}/${item._id}`, { method: 'DELETE' });
      if (editing?._id === item._id) setEditing(null);
      await load();
    }, 'Deleted');
  };

  const move = (index, d) => {
    const j = index + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    handle(() =>
      adminFetch(`${endpoint}/reorder`, { method: 'PUT', body: next.map((it, i) => ({ _id: it._id, order: i })) })
    );
  };

  const renderField = (f) => {
    const value = getPath(editing, f.key);
    const onChange = (v) => setEditing((e) => setPath(e, f.key, v));
    switch (f.type) {
      case 'textarea':
        return <TextArea key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} rows={f.rows || 4} />;
      case 'list':
        return <StringList key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} />;
      case 'listMultiline':
        return <StringList key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} multiline />;
      case 'image':
        return <ImageField key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} folder={folder} />;
      case 'toggle':
        return <Toggle key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} />;
      case 'select':
        return (
          <Field key={f.key} label={f.label} hint={f.hint}>
            <select
              className="w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        );
      default:
        return <Text key={f.key} label={f.label} hint={f.hint} value={value} onChange={onChange} />;
    }
  };

  if (editing) {
    return (
      <Card title={editing._id ? `Edit: ${getPath(editing, titleKey) || 'Untitled'}` : 'Add new'}>
        <div className="grid gap-5 md:grid-cols-2">
          {schema.map((f) => (
            <div key={f.key} className={f.wide === false ? '' : 'md:col-span-2'}>
              {renderField(f)}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background hover:bg-accent transition-colors disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="rounded-full border border-primary/15 px-6 py-2.5 text-sm font-semibold text-primary hover:border-primary/40"
          >
            Cancel
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">{loading ? 'Loading…' : `${items.length} items · use the arrows to reorder`}</p>
        <button
          type="button"
          onClick={() => setEditing(structuredClone(emptyItem))}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-background hover:bg-accent transition-colors"
        >
          + Add new
        </button>
      </div>
      <ul className="divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/10 bg-surface">
        {items.map((item, i) => (
          <li key={item._id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="text-secondary hover:text-primary leading-none">▲</button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="text-secondary hover:text-primary leading-none">▼</button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-primary">{getPath(item, titleKey) || 'Untitled'}</p>
              {subtitleKey && <p className="truncate text-sm text-secondary">{getPath(item, subtitleKey)}</p>}
            </div>
            <button type="button" onClick={() => setEditing(structuredClone(item))} className="text-sm font-semibold text-primary hover:text-accent">
              Edit
            </button>
            <button type="button" onClick={() => remove(item)} className="text-sm font-semibold text-secondary hover:text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
