'use client';
// Thin accent-coloured progress bar pinned to the top of the window.
// Runs while a page navigation is pending or any fetch() request is in flight.
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const IGNORE = [/\/__nextjs/, /\/_next\/webpack-hmr/, /\/_next\/static/, /hot-update/];

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pending = useRef(0);
  const navigating = useRef(false);
  const trickle = useRef(null);
  const hideTimer = useRef(null);

  // start / finish helpers shared by fetch tracking and navigation
  const api = useRef(null);
  if (!api.current) {
    api.current = {
      start() {
        clearTimeout(hideTimer.current);
        setVisible(true);
        setProgress((p) => (p > 0 && p < 100 ? p : 8));
        if (!trickle.current) {
          trickle.current = setInterval(() => {
            // ease toward 90% while waiting
            setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
          }, 200);
        }
      },
      maybeDone() {
        if (pending.current > 0 || navigating.current) return;
        clearInterval(trickle.current);
        trickle.current = null;
        setProgress(100);
        hideTimer.current = setTimeout(() => {
          setVisible(false);
          setTimeout(() => setProgress(0), 250);
        }, 300);
      },
    };
  }

  // Track every fetch() made by the app
  useEffect(() => {
    if (window.__topLoaderPatched) return;
    window.__topLoaderPatched = true;
    const original = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input?.url || '';
      const tracked = !IGNORE.some((rx) => rx.test(url));
      if (tracked) {
        pending.current += 1;
        api.current.start();
      }
      try {
        return await original(input, init);
      } finally {
        if (tracked) {
          pending.current = Math.max(0, pending.current - 1);
          api.current.maybeDone();
        }
      }
    };
  }, []);

  // Start on internal link clicks, finish when the route actually changes
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      navigating.current = true;
      api.current.start();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (navigating.current) {
      navigating.current = false;
      api.current.maybeDone();
    }
  }, [pathname, searchParams]);

  useEffect(() => () => {
    clearInterval(trickle.current);
    clearTimeout(hideTimer.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100000] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 250ms ease' }}
    >
      <div
        className="h-full bg-accent shadow-[0_0_10px_rgb(var(--accent-rgb)/0.7)]"
        style={{ width: `${progress}%`, transition: 'width 200ms ease-out' }}
      />
    </div>
  );
}
