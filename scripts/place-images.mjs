// Step 3 of the image pipeline: turn chosen candidates into 1200 and 600 px WebP on pure white,
// named <slug>-<prefix>-<n>.webp. A NEW prefix is used whenever an image changes (one-year immutable cache).
// Usage: node scripts/place-images.mjs <prefix>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
// slug -> candidate file numbers chosen on the contact sheets (white studio shots, no watermark or logo)
const SELECTION = {
  'kalkhoff-endeavour-5-advance-plus': [1],
  'kalkhoff-entice-5-advance-plus': [1],
  'kalkhoff-image-3-advance': [1],
  'haibike-trekking-4-low': [1],
  'tenways-cgo600-pro': [1, 2, 3],
  'riese-mueller-charger5-vario': [1],
};
const manifest = JSON.parse(fs.readFileSync('.image-work/manifest.json', 'utf8'));
const sourcesFile = 'data/image-sources.json';
const sources = fs.existsSync(sourcesFile) ? JSON.parse(fs.readFileSync(sourcesFile, 'utf8')) : {};

for (const [slug, picks] of Object.entries(SELECTION)) {
  const outDir = path.join('public', 'products', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const names = [];
  for (let i = 0; i < picks.length; i++) {
    const cand = fs.readdirSync(path.join('.image-work/cand', slug)).find((f) => parseInt(f) === picks[i]);
    const src = path.join('.image-work/cand', slug, cand);
    for (const size of [1200, 600]) {
      const base = sharp(src).flatten({ background: '#ffffff' }).resize(size, size, { fit: 'contain', background: '#ffffff' });
      const file = path.join(outDir, `${slug}-${prefix}-${i + 1}${size === 600 ? '-600' : ''}.webp`);
      await base.webp({ quality: size === 1200 ? 82 : 78 }).toFile(file);
    }
    names.push(`${slug}-${prefix}-${i + 1}.webp`);
    const meta = manifest[slug].find((m) => m.n === picks[i]);
    (sources[slug] ||= []).push({ file: `${slug}-${prefix}-${i + 1}.webp`, source: meta?.url, fetched: '2026-10-31' });
  }
  const big = names.map((n) => fs.statSync(path.join(outDir, n)).size);
  console.log(slug, names.length, 'images, sizes KB:', big.map((b) => Math.round(b / 1024)).join(', '));
}
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 1));
