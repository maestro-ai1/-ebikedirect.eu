// Contact sheet of the downloaded logos on white tiles (visual check).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const dir = '.image-work/logos';
const files = fs.readdirSync(dir).filter((f) => /\.(svg|png|jpg)$/i.test(f)).sort();
const W = 260, H = 130, cols = 5;
const comps = [];
for (let i = 0; i < files.length; i++) {
  let buf;
  try {
    buf = await sharp(path.join(dir, files[i]), { density: 300 }).flatten({ background: '#ffffff' }).resize(W - 40, H - 50, { fit: 'inside', background: '#ffffff' }).png().toBuffer();
  } catch (e) { console.log('cannot render', files[i], e.message.slice(0, 50)); continue; }
  const tile = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([{ input: buf, gravity: 'center' }, { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><text x="8" y="${H - 8}" font-family="Arial" font-size="12" fill="#888">${files[i]}</text></svg>`) }])
    .png().toBuffer();
  comps.push({ input: tile, left: (i % cols) * (W + 4), top: Math.floor(i / cols) * (H + 4) });
}
await sharp({ create: { width: cols * (W + 4), height: Math.ceil(files.length / cols) * (H + 4), channels: 3, background: '#c8ccd1' } }).composite(comps).jpeg({ quality: 85 }).toFile('.image-work/logos-sheet.jpg');
console.log('files', files.length);
