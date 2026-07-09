import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const videoPath = resolve(root, 'videos/thiago-calisto.mp4');

if (!existsSync(videoPath)) {
  console.error('Video not found:', videoPath);
  process.exit(1);
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN. Create a Blob store in Vercel, then run:');
  console.error('  export BLOB_READ_WRITE_TOKEN="your-token"');
  console.error('  npm run upload:video');
  process.exit(1);
}

const video = readFileSync(videoPath);
const blob = await put('videos/hero.mp4', video, {
  access: 'public',
  token,
  contentType: 'video/mp4',
  allowOverwrite: true,
});

const config = `window.HERO_VIDEO_URL = ${JSON.stringify(blob.url)};\n`;
writeFileSync(resolve(root, 'video-url.js'), config);

console.log('Uploaded to Vercel Blob:', blob.url);
console.log('Wrote video-url.js');
