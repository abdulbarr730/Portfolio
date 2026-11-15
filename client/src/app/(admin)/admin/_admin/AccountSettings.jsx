'use client';
// Change the admin login (email/username) and password. Always asks for the current password.
import { useEffect, useState } from 'react';
import { adminFetch } from './api';
import { Card } from './fields';

const inputCls =
  'w-full rounded-lg border border-primary/15 bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent';

function Labeled({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-secondary">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-secondary/80">{hint}</span>}
    </label>
  );
}

export default function AccountSettings({ onAuthError, notify }) {
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ newUsername: '', newPassword: '', confirm: '', currentPassword: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/api/users/me')
      .then((me) => setCurrent(me.username))
      .catch((e) => (/session expired/i.test(e.message) ? onAuthError(e.message) : setCurrent('')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => {
    setError('');
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.newUsername.trim() && !form.newPassword) return setError('Enter a new login or a new password.');
    if (form.newPassword && form.newPassword.length < 10) return setError('New password must be at least 10 characters.');
    if (form.newPassword !== form.confirm) return setError('The new passwords don’t match.');
    if (!form.currentPassword) return setError('Enter your current password to confirm.');

    setBusy(true);
    try {
      const out = await adminFetch('/api/users/me', {
        method: 'PUT',
        body: {
          currentPassword: form.currentPassword,
          newUsername: form.newUsername.trim() || undefined,
          newPassword: form.newPassword || undefined,
        },
      });
      setCurrent(out.username);
      setForm({ newUsername: '', newPassword: '', confirm: '', currentPassword: '' });
      notify(out.changed.includes('password') ? 'Login details updated' : 'Login name updated');
    } catch (ex) {
      if (/session expired/i.test(ex.message)) onAuthError(ex.message);
      else setError(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Admin account" description="The login you use at /admin/login.">
      <div className="rounded-xl bg-background px-4 py-3 text-sm">
        <span className="text-secondary">Signed in as </span>
        <span className="font-semibold text-primary">{current === null ? '…' : current || 'unknown'}</span>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Labeled label="New login email or username" hint="Leave empty to keep the current one.">
          <input className={inputCls} type="text" autoComplete="username" placeholder="you@example.com" value={form.newUsername} onChange={set('newUsername')} />
        </Labeled>

        <div className="grid gap-5 md:grid-cols-2">
          <Labeled label="New password" hint="At least 10 characters. Leave empty to keep the current one.">
            <input className={inputCls} type={show ? 'text' : 'password'} autoComplete="new-password" value={form.newPassword} onChange={set('newPassword')} />
          </Labeled>
          <Labeled label="Confirm new password">
            <input className={inputCls} type={show ? 'text' : 'password'} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
          </Labeled>
        </div>

        <label className="flex items-center gap-2 text-sm text-secondary">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-[rgb(var(--accent-rgb))]" />
          Show passwords
        </label>

        <div className="border-t border-primary/10 pt-5">
          <Labeled label="Current password" hint="Required to confirm any change.">
            <input className={inputCls} type="password" autoComplete="current-password" value={form.currentPassword} onChange={set('currentPassword')} />
          </Labeled>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-accent disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Update login'}
        </button>
      </form>
    </Card>
  );
}
