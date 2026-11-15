'use client';
// Shared hooks for everything the admin panel manages.
// Each hook returns live data from the API, falling back to the bundled
// defaults while loading or when the API is unreachable.
import useSWR from 'swr';
import { siteDefaults } from '@/app/data/siteDefaults';
import { allProjectsData } from '@/app/data/projectData';
import { experienceData } from '@/app/data/experienceData';
import { servicesData } from '@/app/data/servicesData';

export const API = process.env.NEXT_PUBLIC_API_URL || '';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const swrOptions = { revalidateOnFocus: false, dedupingInterval: 60_000 };

// Deep-merge saved settings over defaults; empty strings/arrays from the DB
// fall back to the default so a half-filled form never blanks the site.
const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
function merge(defaults, saved) {
  if (Array.isArray(defaults)) return isEmpty(saved) ? defaults : saved;
  if (defaults && typeof defaults === 'object') {
    const out = { ...defaults };
    for (const k of Object.keys(saved || {})) {
      out[k] = k in defaults ? merge(defaults[k], saved[k]) : saved[k];
    }
    return out;
  }
  if (typeof defaults === 'boolean') return typeof saved === 'boolean' ? saved : defaults;
  return isEmpty(saved) ? defaults : saved;
}

export function useSettings() {
  const { data, isLoading } = useSWR(`${API}/api/settings`, fetcher, swrOptions);
  return { settings: merge(siteDefaults, data), isLoading };
}

function useList(path, fallback) {
  const { data, isLoading } = useSWR(`${API}${path}`, fetcher, swrOptions);
  return { items: Array.isArray(data) && data.length ? data : fallback, isLoading };
}

export const useProjects = () => {
  const { items, isLoading } = useList('/api/content/projects', allProjectsData);
  return { projects: items, isLoading };
};
export const useExperience = () => {
  const { items, isLoading } = useList('/api/content/experience', experienceData);
  return { experience: items, isLoading };
};
export const useServices = () => {
  const { items, isLoading } = useList('/api/content/services', servicesData);
  return { services: items, isLoading };
};

// "#FF4F1A" -> "255 79 26" for rgb(var(--accent-rgb) / <alpha>)
export function hexToRgbTriplet(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
