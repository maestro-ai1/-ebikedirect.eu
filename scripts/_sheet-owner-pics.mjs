// Contact sheet of the owner's "blog pics" folder with numbered tiles: node scripts/_sheet-owner-pics.mjs
import fs from 'node:fs';
import sharp from 'sharp';
const SRC = 'C:/claude projects/e bikes for sale/blog pics/';
const files = fs.readdirSync(SRC).filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f)).sort();
const T = 360, cols = 4, rows = Math.ceil(files.length / cols);
const comps = [];
for (let i = 0; i < files.length; i++) {
  const b = await sharp(SRC + files[i]).rotate().resize(T, Math.round(T * 0.66), { fit: 'cover', position: 'attention' }).jpeg({ quality: 80 }).toBuffer();
  const x = (i % cols) * (T + 6), y = Math.floor(i / cols) * (Math.round(T * 0.66) + 6);
  comps.push({ input: b, left: x, top: y });
  const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="26"><rect width="${T}" height="26" fill="#000" fill-opacity="0.65"/><text x="6" y="18" font-size="14" fill="#fff" font-family="Arial">${i + 1}  ${files[i].replace(/&/g, '&amp;').slice(0, 44)}</text></svg>`);
  comps.push({ input: label, left: x, top: y });
}
const W = cols * (T + 6), H = rows * (Math.round(T * 0.66) + 6);
fs.mkdirSync('.image-work', { recursive: true });
await sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 82 }).toFile('.image-work/owner-pics-sheet.jpg');
console.log('sheet', W, H, files.length);
files.forEach((f, i) => console.log(i + 1, f));
