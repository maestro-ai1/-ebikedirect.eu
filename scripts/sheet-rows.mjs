// Contact sheets with one row per product (all candidate photos), several products per sheet.
// Usage: node scripts/sheet-rows.mjs [perSheet=5] [prefixFilter]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const per = Number(process.argv[2] || 5);
const filter = process.argv[3] || '';
const dir = '.image-work/cand';
const out = '.image-work/rows';
fs.mkdirSync(out, { recursive: true });
const T = 230;
const slugs = fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory() && d.includes(filter)).sort();

for (let s = 0; s * per < slugs.length; s++) {
  const group = slugs.slice(s * per, s * per + per);
  const comps = [];
  for (let r = 0; r < group.length; r++) {
    const slug = group[r];
    const files = fs.readdirSync(path.join(dir, slug)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
    const y = r * (T + 26);
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${4 * (T + 4)}" height="24"><rect width="100%" height="24" fill="#131A22"/><text x="8" y="17" font-family="Arial" font-size="14" fill="#fff">${slug}</text></svg>`);
    comps.push({ input: label, left: 0, top: y });
    for (let i = 0; i < Math.min(4, files.length); i++) {
      const buf = await sharp(path.join(dir, slug, files[i])).flatten({ background: '#ffffff' }).resize(T, T, { fit: 'contain', background: '#ffffff' }).jpeg({ quality: 72 }).toBuffer();
      const tag = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="26" height="22"><rect width="26" height="22" fill="#FF5722"/><text x="8" y="16" font-family="Arial" font-size="14" fill="#fff">${parseInt(files[i])}</text></svg>`);
      comps.push({ input: await sharp(buf).composite([{ input: tag }]).jpeg().toBuffer(), left: i * (T + 4), top: y + 24 });
    }
  }
  await sharp({ create: { width: 4 * (T + 4), height: group.length * (T + 26), channels: 3, background: '#d0d4d9' } }).composite(comps).jpeg({ quality: 70 }).toFile(path.join(out, `sheet-${filter || 'all'}-${String(s + 1).padStart(2, '0')}.jpg`));
  console.log('sheet', s + 1, group.join(', '));
}
