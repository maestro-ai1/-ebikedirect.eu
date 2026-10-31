// Builds contact sheets of the candidate photos so every image is looked at before use.
// Usage: node scripts/sheet.mjs [dir=.image-work/cand] [outdir=.image-work/sheets]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2] || '.image-work/cand';
const outDir = process.argv[3] || '.image-work/sheets';
fs.mkdirSync(outDir, { recursive: true });
const T = 320;

for (const slug of fs.readdirSync(dir)) {
  const sd = path.join(dir, slug);
  if (!fs.statSync(sd).isDirectory()) continue;
  const files = fs.readdirSync(sd).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
  if (!files.length) continue;
  const cols = Math.min(4, files.length);
  const rows = Math.ceil(files.length / cols);
  const tiles = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(path.join(sd, files[i])).flatten({ background: '#ffffff' }).resize(T, T, { fit: 'contain', background: '#ffffff' }).jpeg({ quality: 80 }).toBuffer();
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}"><rect x="0" y="0" width="64" height="26" fill="#131A22"/><text x="8" y="19" font-family="Arial" font-size="16" fill="#fff">${files[i].split('.')[0]}</text></svg>`);
    tiles.push({ input: await sharp(buf).composite([{ input: label }]).jpeg().toBuffer(), left: (i % cols) * (T + 4), top: Math.floor(i / cols) * (T + 4) });
  }
  await sharp({ create: { width: cols * (T + 4), height: rows * (T + 4), channels: 3, background: '#d0d4d9' } }).composite(tiles).jpeg({ quality: 78 }).toFile(path.join(outDir, `${slug}.jpg`));
  console.log('sheet', slug, files.length);
}
