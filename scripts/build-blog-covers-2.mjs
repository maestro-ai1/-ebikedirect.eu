// Colour covers (owner-supplied folder "blog pics") for the four rebuilt posts: 1200 x 675 WebP named by post slug.
import fs from 'node:fs';
import sharp from 'sharp';
const SRC = 'C:/claude projects/e bikes for sale/blog pics/';
const MAP = [
  ['e-bike-leasing-jobrad-steuervorteile-gehaltsumwandlung', 'how much are electric bicycles.jpg'],
  ['e-bike-reichweiten-guide-2026-bosch-shimano-specialized', 'e bike battery.jpg'],
  ['e-bike-wartung-tipps-fuer-den-winter', 'best electric bikes australia.webp'],
  ['bosch-performance-cx-vs-shimano-ep801-vergleich', 'e bike motor.webp']
];
const sources = JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8'));
for (const [slug, file] of MAP) {
  const buf = fs.readFileSync(SRC + file);
  await sharp(buf).rotate().resize(1200, 675, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(`public/blog/covers/${slug}.webp`);
  sources['blog/' + slug] = [{ file: slug + '.webp', source: 'owner-supplied photo: ' + file, store: 'owner folder blog pics', fetched: '2026-11-05' }];
}
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('covers written', MAP.length);
