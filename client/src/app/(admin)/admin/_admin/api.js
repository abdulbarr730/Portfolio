'use client';
// Authenticated requests for the admin panel.
export const API = process.env.NEXT_PUBLIC_API_URL || '';

export class AuthError extends Error {}

export async function adminFetch(path, { method = 'GET', body, form } = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { 'x-auth-token': token || '' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: form || (body !== undefined ? JSON.stringify(body) : undefined),
  });

  if (res.status === 401) {
    localStorage.removeItem('token');
    throw new AuthError('Your session expired. Sign in again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.message || `Request failed (${res.status})`);
  return data;
}

export async function uploadImage(file, folder = 'uploads') {
  const form = new FormData();
  form.append('file', file);
  const { url } = await adminFetch(`/api/uploads?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    form,
  });
  return url;
}
