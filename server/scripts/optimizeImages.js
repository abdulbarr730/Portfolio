// server/scripts/optimizeImages.js
// Shrinks large PNGs in client/public (resize + palette compression) and
// re-uploads them to R2 at the same "static/..." keys, so URLs don't change.
//
//   node scripts/optimizeImages.js --dry-run
//   node scripts/optimizeImages.js
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const sharp = require(path.resolve(__dirname, '../../client/node_modules/sharp'));
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { r2 } = require('../config/r2');

const DRY = process.argv.includes('--dry-run');
const PUBLIC_DIR = path.resolve(__dirname, '../../client/public');
const MIN_BYTES = 400 * 1024; // only touch files bigger than 400 KB
const MAX_WIDTH = 1600;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );

(async () => {
  const files = walk(PUBLIC_DIR).filter((f) => /\.png$/i.test(f) && fs.statSync(f).size > MIN_BYTES);
  for (const file of files) {
    const before = fs.statSync(file).size;
    const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join('/');
    // Portraits: lossless (palette quantisation causes banding on skin tones).
    // Screenshots/logos: 256-colour palette, which they handle well.
    const isPhoto = /^profile/i.test(rel);
    const out = await sharp(file)
      .resize({ width: isPhoto ? 1400 : MAX_WIDTH, withoutEnlargement: true })
      .png(isPhoto ? { compressionLevel: 9, effort: 8 } : { palette: true, quality: 85, compressionLevel: 9, effort: 8 })
      .toBuffer();
    const kb = (n) => `${Math.round(n / 1024)} KB`;
    if (out.length >= before) {
      console.log(`skip     ${rel} (no gain)`);
      continue;
    }
    console.log(`${DRY ? 'would' : 'saved'}    ${rel}: ${kb(before)} -> ${kb(out.length)}`);
    if (DRY) continue;
    fs.writeFileSync(file, out);
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `static/${rel}`,
        Body: out,
        ContentType: 'image/png',
        CacheControl: 'public, max-age=31536000',
      })
    );
  }
  console.log('Done.');
})().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
