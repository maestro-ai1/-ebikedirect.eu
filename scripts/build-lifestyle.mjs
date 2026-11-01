// Colour lifestyle photos (owner-supplied folder "blog pics") for category tiles/banners and blog covers.
// Category images: 1200 x 800 WebP named by keyword; blog covers: 1200 x 675 WebP named by post slug. Same size inside each set.
// node scripts/build-lifestyle.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/claude projects/e bikes for sale/blog pics/';
const CATEGORY = [
  ['e-mountainbike-kaufen', 'e mountain bike.webp'],
  ['trekking-e-bike-kaufen', 'how much are electric bicycles.jpg'],
  ['city-e-bike-kaufen', 'commuter electric bike.webp'],
  ['s-pedelec-kaufen', 'fat tire ebike.webp'],
  ['cargo-e-bike-kaufen', 'e bike cargo.avif'],
  ['falt-e-bike-kaufen', 'folding ebike.jpg'],
  ['e-bike-kaufen', 'best electric bikes australia.webp'],
  ['e-bike-zubehoer-kaufen', 'e bike helmets.jpg'],
  ['kinder-e-bike-kaufen', 'electric bike kids.webp'],
  ['damen-e-bike-kaufen', 'ebikes womens.webp'],
  ['gebrauchtes-e-bike-kaufen', 'second hand electric cycle.webp'],
  ['e-bike-akku-kaufen', 'e bike battery.jpg'],
  ['e-bike-motor-kaufen', 'e bike motor.webp'],
  ['e-bike-nachruestsatz-kaufen', 'e bike kit.jpg'],
  ['e-bike-kindersitz-kaufen', 'electric bike with child seat australia.avif'],
  ['dreirad-e-bike-kaufen', 'best electric tricycle for adults australia.webp'],
  ['cruiser-e-bike-kaufen', 'electric beach cruisers.webp']
];
const BLOG = [
  ['s-pedelec-fuehrerschein-kennzeichen-kosten', 'throttle ebikes.jpg'],
  ['e-bike-fully-ratgeber', 'e mountain bike.webp'],
  ['fahrradtraeger-e-bike-ratgeber', 'second hand electric cycle.webp'],
  ['gravel-e-bike-ratgeber', 'cheap ebike.png'],
  ['e-bike-fahrradhalter-wandhalterung', 'pexels-photo-29575705.avif'],
  ['leichtes-e-bike-ratgeber', 'battery operated bicycle for adults.webp']
];
fs.mkdirSync('public/lifestyle', { recursive: true });
fs.mkdirSync('public/blog/covers', { recursive: true });
const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
let n = 0;
async function make(file, out, w, h, key) {
  const src = path.join(SRC, file);
  if (!fs.existsSync(src)) { console.log('missing', file); return; }
  await sharp(src).rotate().resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(out);
  (sources[key] ||= []).push({ file: path.basename(out), source: 'owner-supplied photo: ' + file, store: 'owner folder blog pics', fetched: '2026-11-01' });
  n++;
}
for (const [name, file] of CATEGORY) await make(file, `public/lifestyle/${name}.webp`, 1200, 800, 'lifestyle/' + name);
for (const [slug, file] of BLOG) await make(file, `public/blog/covers/${slug}.webp`, 1200, 675, 'blog/' + slug);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('images written:', n);
