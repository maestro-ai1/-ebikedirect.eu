// Colour covers for blog Phase 4 (posts 31 to 40): 1200 x 675 WebP named by post slug.
// Sources: owner folder "blog pics" (helmets) and free-licence Pexels photos (licence: free for commercial use, no attribution needed); every source is logged in data/image-sources.json.
import fs from 'node:fs';
import sharp from 'sharp';
const OWN = 'C:/claude projects/e bikes for sale/blog pics/';
const STOCK = '.image-work/stock/';
fs.mkdirSync(STOCK, { recursive: true });
const MAP = [
  ['fahrradschloss-zahlenschloss-ratgeber', { pexels: 10313685 }],
  ['klickpedale-rennrad-ratgeber', { pexels: 5807833 }],
  ['fahrradkoerbe-klickfix-ratgeber', { pexels: 4175585 }],
  ['fahrrad-korb-ratgeber', { pexels: 5372815 }],
  ['fahrradstaender-hinterrad-ratgeber', { pexels: 39895186 }],
  ['fahrrad-nachruesten-mit-motor-ratgeber', { pexels: 19411350 }],
  ['reifen-fahrrad-spikes-ratgeber', { pexels: 15877970 }],
  ['schaltung-fahrrad-ratgeber', { pexels: 8936923 }],
  ['bremsen-fahrrad-ratgeber', { pexels: 14535187 }],
  ['schutzblech-rennrad-ratgeber', { pexels: 17539269 }]
];
const sources = JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8'));
for (const [slug, src] of MAP) {
  let buf, note;
  if (src.own) { buf = fs.readFileSync(OWN + src.own); note = 'owner-supplied photo: ' + src.own; }
  else {
    const f = STOCK + src.pexels + '.jpg';
    if (!fs.existsSync(f)) {
      const r = await fetch(`https://images.pexels.com/photos/${src.pexels}/pexels-photo-${src.pexels}.jpeg?auto=compress&cs=tinysrgb&w=1800`);
      if (!r.ok) { console.log('FETCH FAIL', src.pexels, r.status); continue; }
      fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    }
    buf = fs.readFileSync(f); note = `Pexels photo ${src.pexels} (free licence): https://www.pexels.com/photo/${src.pexels}/`;
  }
  await sharp(buf).rotate().resize(1200, 675, { fit: 'cover', position: src.pos || 'attention' }).webp({ quality: 82 }).toFile(`public/blog/covers/${slug}.webp`);
  sources['blog/' + slug] = [{ file: slug + '.webp', source: note, store: src.own ? 'owner folder blog pics' : 'pexels.com', fetched: '2026-11-06' }];
}
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
const c = MAP.map(([s], i) => ({ input: `public/blog/covers/${s}.webp`, left: (i % 2) * 1206, top: Math.floor(i / 2) * 681 }));
await sharp({ create: { width: 2406, height: 681 * 5, channels: 3, background: '#fff' } }).composite(c).jpeg({ quality: 74 }).toFile('.image-work/covers-sheet-phase4.jpg');
console.log('covers written', MAP.length);
