import fs from 'node:fs'; import sharp from 'sharp';
const ids = process.argv.slice(2).map((x) => x.split(':')); const comps = []; let i = 0;
for (const [id, pos] of ids) {
  const f = `.image-work/stock/${id}.jpg`;
  if (!fs.existsSync(f)) { const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`); if (!r.ok) { console.log('FAIL', id); continue; } fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); }
  const b = await sharp(f).rotate().resize(600, 338, { fit: 'cover', position: pos || 'attention' }).jpeg({ quality: 75 }).toBuffer();
  comps.push({ input: b, left: (i % 3) * 606, top: Math.floor(i / 3) * 344 }); comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><rect width="200" height="20" fill="#000" fill-opacity=".7"/><text x="4" y="14" font-size="12" fill="#fff" font-family="Arial">${id} ${pos || ''}</text></svg>`), left: (i % 3) * 606, top: Math.floor(i / 3) * 344 }); i++;
}
await sharp({ create: { width: 1818, height: Math.ceil(i / 3) * 344, channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 78 }).toFile('.image-work/try-stock.jpg'); console.log('ok', i);
