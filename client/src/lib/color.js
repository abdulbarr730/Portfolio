// Shared colour helpers (safe to use on the server and in the browser).

// "#FF4F1A" -> "255 79 26" for rgb(var(--accent-rgb) / <alpha>)
export function hexToRgbTriplet(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
