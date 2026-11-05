// Colour covers (owner-supplied folder "blog pics") for blog Phase 1 new posts 11 to 16: 1200 x 675 WebP named by post slug.
import fs from 'node:fs';
import sharp from 'sharp';
const SRC = 'C:/claude projects/e bikes for sale/blog pics/';
const MAP = [
  ['elektro-bike-bosch-motor-ratgeber', 'ebikes womens.webp'],
  ['lastenrad-hund-ratgeber', 'e bike cargo.avif'],
  ['cube-mountainbike-mtb-ratgeber', 'e mountain bike.webp'],
  ['e-bike-mtb-ratgeber', 'cheap ebike.png'],
  ['bosch-charger-e-bike-ratgeber', 'battery operated bicycle for adults.webp'],
  ['e-bike-electric-motor-ratgeber', 'e bike kit.jpg']
];
const sources = JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8'));
for (const [slug, file] of MAP) {
  const buf = fs.readFileSync(SRC + file);
  await sharp(buf).rotate().resize(1200, 675, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(`public/blog/covers/${slug}.webp`);
  sources['blog/' + slug] = [{ file: slug + '.webp', source: 'owner-supplied photo: ' + file, store: 'owner folder blog pics', fetched: '2026-11-05' }];
}
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('covers written', MAP.length);
