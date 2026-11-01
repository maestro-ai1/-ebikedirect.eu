// Contact sheet of every image in a folder: node scripts/folder-sheet.mjs <folder> <out.jpg>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = process.argv[2];
const out = process.argv[3];
const files = fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f)).sort();
const cols = 6, w = 300, h = 220, pad = 8;
const rows = Math.ceil(files.length / cols);
const tiles = [];
for (let i = 0; i < files.length; i++) {
  const buf = await sharp(path.join(dir, files[i])).resize(w, h, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer();
  const label = Buffer.from(`<svg width="${w}" height="22" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="22" fill="white"/><text x="4" y="15" font-size="12" font-family="Arial" fill="#131A22">${files[i].replace(/[<>&]/g, '').slice(0, 44)}</text></svg>`);
  const tile = await sharp({ create: { width: w, height: h + 22, channels: 3, background: '#ffffff' } }).composite([{ input: buf, top: 0, left: 0 }, { input: label, top: h, left: 0 }]).jpeg().toBuffer();
  tiles.push({ input: tile, left: pad + (i % cols) * (w + pad), top: pad + Math.floor(i / cols) * (h + 22 + pad) });
}
await sharp({ create: { width: pad + cols * (w + pad), height: pad + rows * (h + 22 + pad), channels: 3, background: '#f0f0f0' } }).composite(tiles).jpeg({ quality: 82 }).toFile(out);
console.log('sheet written:', out, files.length, 'images');
