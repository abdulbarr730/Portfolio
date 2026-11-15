'use client';
// Applies the admin-chosen accent colour to the whole site via --accent-rgb.
import { useEffect } from 'react';
import { useSettings, hexToRgbTriplet } from '@/lib/content';

export default function AccentColor() {
  const { settings } = useSettings();
  useEffect(() => {
    const rgb = hexToRgbTriplet(settings.accentColor);
    if (rgb) document.documentElement.style.setProperty('--accent-rgb', rgb);
  }, [settings.accentColor]);
  return null;
}
