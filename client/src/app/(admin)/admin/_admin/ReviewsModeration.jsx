'use client';
import { useEffect, useState } from 'react';
import { adminFetch } from './api';

export default function ReviewsModeration({ onAuthError, notify }) {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const run = async (fn, ok) => {
    try {
      await fn();
      if (ok) notify(ok);
    } catch (e) {
      if (/session expired/i.test(e.message)) onAuthError(e.message);
      else notify(e.message, true);
    }
  };

  const load = () =>
    run(async () => {
      setReviews(await adminFetch('/api/content/reviews'));
      setLoading(false);
    });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (r) =>
    run(async () => {
      await adminFetch(`/api/content/reviews/${r._id}`, { method: 'PATCH', body: { isApproved: !r.isApproved } });
      setReviews((list) => list.map((x) => (x._id === r._id ? { ...x, isApproved: !r.isApproved } : x)));
    }, r.isApproved ? 'Hidden from the site' : 'Shown on the site');

  const remove = (r) => {
    if (!window.confirm(`Delete the review from "${r.name}"? This can't be undone.`)) return;
    run(async () => {
      await adminFetch(`/api/content/reviews/${r._id}`, { method: 'DELETE' });
      setReviews((list) => list.filter((x) => x._id !== r._id));
    }, 'Deleted');
  };

  const shown = reviews.filter((r) => (filter === 'all' ? true : filter === 'visible' ? r.isApproved : !r.isApproved));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'visible', 'hidden'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
              filter === f ? 'bg-primary text-background' : 'border border-primary/15 text-secondary hover:text-primary'
            }`}
          >
            {f} ({reviews.filter((r) => (f === 'all' ? true : f === 'visible' ? r.isApproved : !r.isApproved)).length})
          </button>
        ))}
      </div>
      {loading && <p className="text-sm text-secondary">Loading…</p>}
      <ul className="divide-y divide-primary/10 overflow-hidden rounded-2xl border border-primary/10 bg-surface">
        {shown.map((r) => (
          <li key={r._id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-primary">
                {r.name} <span className="ml-1 text-accent">{'★'.repeat(r.rating)}</span>
                {!r.isApproved && (
                  <span className="ml-2 rounded-full bg-primary/5 px-2 py-0.5 text-xs font-semibold text-secondary">Hidden</span>
                )}
              </p>
              <p className="mt-1 text-sm text-secondary">{r.review}</p>
              <p className="mt-1 text-xs text-secondary/70">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button type="button" onClick={() => toggle(r)} className="text-sm font-semibold text-primary hover:text-accent">
                {r.isApproved ? 'Hide' : 'Show'}
              </button>
              <button type="button" onClick={() => remove(r)} className="text-sm font-semibold text-secondary hover:text-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
