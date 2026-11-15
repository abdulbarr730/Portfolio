// server/config/r2.js
// Cloudflare R2 storage (S3-compatible API)
const crypto = require('crypto');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Uploads a file buffer to R2 and returns its public URL.
 * @param {Buffer} buffer
 * @param {{ originalname?: string, mimetype?: string }} file
 * @param {string} folder
 */
async function uploadToR2(buffer, file = {}, folder = 'uploads') {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error('Cloudflare R2 is not configured. Set the R2_* variables in server/.env');
  }

  const ext = path.extname(file.originalname || '').toLowerCase();
  const key = `${folder}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype || 'application/octet-stream',
  }));

  return `${R2_PUBLIC_URL.replace(/\/+$/, '')}/${key}`;
}

module.exports = { r2, uploadToR2 };
