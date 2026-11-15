// Resolves a static asset path to Cloudflare R2.
// asset('/profile.png') -> https://pub-xxxx.r2.dev/static/profile.png
// Falls back to the local /public file when NEXT_PUBLIC_ASSET_URL is not set.
const ASSET_BASE = (process.env.NEXT_PUBLIC_ASSET_URL || '').replace(/\/+$/, '');

export const asset = (p) => (ASSET_BASE ? `${ASSET_BASE}/static${p}` : p);
