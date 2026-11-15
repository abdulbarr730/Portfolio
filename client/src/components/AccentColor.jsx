'use client';
// Keeps the accent colour in sync with the admin setting after load, and
// remembers it so the next visit can paint it instantly (see app/layout.js).
import { useEffect } from 'react';
import { useSettings } from '@/lib/content';
import { hexToRgbTriplet } from '@/lib/color';

export default function AccentColor() {
  const { settings, hasData } = useSettings();
  useEffect(() => {
    if (!hasData) return; // only apply the admin's colour, never the bundled default
    const rgb = hexToRgbTriplet(settings.accentColor);
    if (!rgb) return;
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    try {
      localStorage.setItem('accent-rgb', rgb);
    } catch {
      /* storage unavailable (private mode) - fine */
    }
  }, [settings.accentColor, hasData]);
  return null;
}
