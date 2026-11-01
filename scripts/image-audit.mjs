// Image Rule audit for product photos: white background, same size, bright. Flags everything else.
// node scripts/image-audit.mjs   (needs .image-work/products-dump.json from scripts/dump-products.cjs)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const products = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8'));
const files = new Map(); // path -> [slugs]
const remote = [];
for (const p of products) {
  if (!p.image) continue;
  if (/^https?:/.test(p.image)) { remote.push(p.slug); continue; }
  const f = path.join('public', p.image.replace(/^\//, ''));
  if (!files.has(f)) files.set(f, []);
  files.get(f).push(p.slug);
}
const sizes = new Map();
const rows = [];
for (const [f, slugs] of files) {
  if (!fs.existsSync(f)) { rows.push({ f, slugs, issue: 'file missing' }); continue; }
  const img = sharp(f);
  const meta = await img.metadata();
  const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, c = info.channels;
  let sum = 0, n = 0, white = 0;
  const b = 6;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x >= b && x < w - b && y >= b && y < h - b) continue;
    const i = (y * w + x) * c; const m = (data[i] + data[i + 1] + data[i + 2]) / 3; sum += m; n++; if (m >= 240) white++;
  }
  // overall brightness
  let tot = 0; for (let i = 0; i < data.length; i += c * 7) tot += (data[i] + data[i + 1] + data[i + 2]) / 3;
  const bright = tot / (data.length / (c * 7));
  const key = `${w}x${h}`; sizes.set(key, (sizes.get(key) || 0) + 1);
  rows.push({ f, slugs, w, h, border: Math.round(sum / n), whiteShare: white / n, bright: Math.round(bright) });
}
const common = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0][0];
const bad = [];
for (const r of rows) {
  const why = [];
  if (r.issue) why.push(r.issue);
  else {
    if (`${r.w}x${r.h}` !== common) why.push(`size ${r.w}x${r.h} (standard ${common})`);
    if (r.border < 245 || r.whiteShare < 0.97) why.push(`background not white (border ${r.border}, white ${(r.whiteShare * 100).toFixed(0)}%)`);
    if (r.bright < 140) why.push(`dark image (mean ${r.bright})`);
  }
  if (why.length) bad.push({ file: r.f, slugs: r.slugs, why: why.join('; ') });
}
console.log('product images checked:', rows.length, '| standard size:', common, '| size spread:', JSON.stringify(Object.fromEntries(sizes)));
console.log('remote (external) images, outside the image rule:', remote.length, remote.join(', '));
console.log('local images failing the rule:', bad.length);
bad.forEach((b) => console.log('  ' + b.file + '  [' + b.slugs.join(',') + ']  ' + b.why));
fs.writeFileSync('.image-work/image-audit.json', JSON.stringify({ common, remote, bad }, null, 1));
