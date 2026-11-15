// server/scripts/migrateToR2.js
// One-time migration to Cloudflare R2:
//   1. Uploads every file in client/public to R2 under "static/<same path>"
//   2. Copies project snapshots still hosted on Cloudinary into R2 and updates MongoDB
//
// Usage (from server/):
//   node scripts/migrateToR2.js --dry-run   # show what would happen
//   node scripts/migrateToR2.js             # do it
// Safe to re-run: already-migrated records are skipped, static files are overwritten.

require('dotenv').config({ quiet: true });
if (process.env.DNS_SERVERS) require('dns').setServers(process.env.DNS_SERVERS.split(','));

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { r2, uploadToR2 } = require('../config/r2');
const Project = require('../models/project.model');

const DRY_RUN = process.argv.includes('--dry-run');
const PUBLIC_DIR = path.resolve(__dirname, '../../client/public');
const SKIP = new Set(['desktop.ini', '.DS_Store', 'Thumbs.db']);

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
};

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return walk(full);
  return SKIP.has(e.name) ? [] : [full];
});

async function migrateStaticFiles() {
  const files = walk(PUBLIC_DIR);
  console.log(`\n[static] ${files.length} files in client/public`);
  for (const file of files) {
    const rel = path.relative(PUBLIC_DIR, file).split(path.sep).join('/');
    const key = `static/${rel}`;
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    if (!DRY_RUN) {
      await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: fs.readFileSync(file),
        ContentType: type,
        CacheControl: 'public, max-age=31536000',
      }));
    }
    console.log(`  ${DRY_RUN ? 'would upload' : 'uploaded'}  ${key}`);
  }
}

async function migrateProjectSnapshots() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
  const projects = await Project.find({ snapshotUrl: /res\.cloudinary\.com/ });
  console.log(`\n[db] ${projects.length} project(s) with Cloudinary snapshots`);
  for (const p of projects) {
    const oldUrl = p.snapshotUrl;
    if (DRY_RUN) {
      console.log(`  would migrate  "${p.title}"  ${oldUrl}`);
      continue;
    }
    const res = await axios.get(oldUrl, { responseType: 'arraybuffer' });
    const newUrl = await uploadToR2(Buffer.from(res.data), {
      originalname: path.basename(new URL(oldUrl).pathname),
      mimetype: res.headers['content-type'],
    }, 'projects');
    p.snapshotUrl = newUrl;
    await p.save();
    console.log(`  migrated  "${p.title}"\n    ${oldUrl}\n -> ${newUrl}`);
  }
  await mongoose.disconnect();
}

(async () => {
  console.log(DRY_RUN ? '=== DRY RUN (nothing will change) ===' : '=== Migrating to Cloudflare R2 ===');
  await migrateStaticFiles();
  await migrateProjectSnapshots();
  console.log('\nDone.');
})().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
