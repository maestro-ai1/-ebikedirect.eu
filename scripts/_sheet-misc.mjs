import fs from 'node:fs'; import sharp from 'sharp';
const items = [];
const OW = 'C:/claude projects/e bikes for sale/blog pics/';
for (const f of ['e bike helmets.jpg','electric bike kids.webp','electric bike with child seat australia.avif','folding ebike.jpg','pexels-photo-29575705.avif','second hand electric cycle.webp']) items.push([OW + f, 'OWN ' + f]);
for (const f of fs.readdirSync('public/lifestyle')) items.push(['public/lifestyle/' + f, 'LIFE ' + f]);
const T = 330, H = 220, cols = 5, rows = Math.ceil(items.length / cols); const comps = [];
for (let i = 0; i < items.length; i++) { const b = await sharp(items[i][0]).resize(T, H, { fit: 'cover', position: 'attention' }).jpeg({ quality: 78 }).toBuffer(); const x = (i % cols) * (T + 4), y = Math.floor(i / cols) * (H + 4); comps.push({ input: b, left: x, top: y }); comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="22"><rect width="${T}" height="22" fill="#000" fill-opacity=".65"/><text x="5" y="16" font-size="12" fill="#fff" font-family="Arial">${i + 1} ${items[i][1].replace(/&/g,'&amp;').slice(0, 42)}</text></svg>`), left: x, top: y }); }
await sharp({ create: { width: cols * (T + 4), height: rows * (H + 4), channels: 3, background: '#fff' } }).composite(comps).jpeg({ quality: 80 }).toFile('.image-work/misc-sheet.jpg');
items.forEach((x, i) => console.log(i + 1, x[1]));
