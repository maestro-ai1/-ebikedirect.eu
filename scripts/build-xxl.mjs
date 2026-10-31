// Builds lib/catalog-xxl.ts and the photos from every .image-work/xxl-<brand>.json written by import-xxl.mjs.
// node scripts/build-xxl.mjs [v1]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
// Models already in the catalogue from the first tranche (same bike, different page): not added twice.
const SKIP = new Set([
  'kalkhoff-entice-5-advance-plus-belt-800-wh-29-zoll',
  'haibike-trekking-4-600-wh-27-5-zoll',
  'riese-und-mueller-charger5-vario-800-wh-27-5-zoll',
  'specialized-turbo-creo-sl-e5-comp-320-wh-28-zoll', // road/gravel e-bike: no matching category yet
  'brompton-electric-g-line-e-motiq-urban-demo-345-wh-20-zoll', // demo unit
]);
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'Cargo-E-Bike': 'Cargo E-Bike', 'Speed-Pedelec': 'S-Pedelec', 'Falt-E-Bike': 'Klapp E-Bike' };
const slugKey = (s) => s;
const q2 = (n) => Math.round(n * 100) / 100;
const numOf = (s) => { const m = String(s || '').match(/(\d{2,3})\s*Nm/i); return m ? Number(m[1]) : 0; };

const files = fs.readdirSync('.image-work').filter((f) => /^xxl-.*\.json$/.test(f));
let items = files.flatMap((f) => JSON.parse(fs.readFileSync(path.join('.image-work', f), 'utf8')));
items = items.filter((m) => !SKIP.has(m.slug));

const norm = (n) => n.replace(/^Riese und Müller/, 'Riese & Müller').replace(/\s+\+/g, '+').replace(/\s+/g, ' ').trim();
const counts = {};
for (const m of items) counts[norm(m.name)] = (counts[norm(m.name)] || 0) + 1;

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
for (const m of items) {
  const wh = Number((m.parts[1] || '').replace(/[^\d]/g, '')) || 0;
  const zoll = m.parts.find((p) => /Zoll/.test(p)) || '';
  let name = norm(m.name);
  if (counts[name] > 1) name = `${name} ${wh} Wh ${zoll}`.replace(/\s+/g, ' ').trim();
  const brand = m.brand === 'Riese & Müller' ? 'Riese & Müller' : m.brand;
  const cat = m.brand === 'Brompton' ? 'Falt-E-Bike' : m.cat || (/image|entice/i.test(m.name) ? 'E-City' : 'E-Trekking');
  const s = m.specs || {};
  const motor = (s.Motor || '').replace(/Mittelmotor\s*/i, '').replace(/\s*\d+\s*Watt.*$/i, '').trim() || 'Mittelmotor';

  // photo: first studio shot, white background
  const dir = path.join('public', 'products', m.slug);
  fs.mkdirSync(dir, { recursive: true });
  const src = path.join('.image-work/cand', m.slug, '1.jpg');
  if (!fs.existsSync(src)) { console.log('no photo', m.slug); continue; }
  for (const size of [1200, 600]) {
    await sharp(src).flatten({ background: '#ffffff' }).resize(size, size, { fit: 'contain', background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${m.slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${m.slug}/${m.slug}-${prefix}-1.webp`;
  (sources[m.slug] ||= []).push({ file: `${m.slug}-${prefix}-1.webp`, source: m.images[0]?.url, page: m.page, store: 'fahrrad-xxl.de', fetched: '2026-10-31' });

  const specs = {};
  specs['Motor'] = s.Motor || motor;
  if (s.Drehmoment) specs['Drehmoment'] = s.Drehmoment;
  specs['Akku'] = s.Akku || `${wh} Wh`;
  if (s.Display) specs['Display'] = s.Display;
  const gears = s.Schaltung || s['Gänge'];
  if (gears) specs['Schaltung'] = gears;
  const brakes = s['Bremsen vorne'] || s.Bremsen;
  if (brakes) specs['Bremsen'] = brakes;
  if (s.Gabel) specs['Gabel'] = s.Gabel;
  const frame = [s.Rahmenmaterial || s.Rahmen, m.parts.find((p) => /Tiefeinsteiger|Diamant|Trapez|Fully|Compact|Hardtail/i.test(p))].filter(Boolean).join(', ');
  if (frame) specs['Rahmen'] = frame;
  if (s['Reifen (vorne)']) specs['Reifen'] = s['Reifen (vorne)'];
  if (zoll) specs['Laufradgröße'] = zoll;
  const kg = Number(String(s['Gewicht in kg'] || '').replace(',', '.'));
  const catDe = CAT_DE[cat] || 'E-Bike';
  const short = `${catDe} mit ${motor}, ${wh} Wh Akku${gears ? `, ${gears}` : ''}.`;
  out.push({
    id: m.slug, slug: m.slug, name, brand, category: cat,
    price: q2(m.uvp * 0.995), originalPrice: m.uvp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: numOf(s.Drehmoment), batteryStandardWh: wh, rangeKm: 0, weightKg: Number.isFinite(kg) && kg > 0 && kg < 60 ? kg : 0,
    image: img, gallery: [img], shortDescription: short,
    description: `Das ${name} ist ein ${catDe} von ${brand}. Es hat ${motor} und einen ${wh} Wh Akku${s.Drehmoment ? `, das Drehmoment beträgt ${s.Drehmoment}` : ''}.${gears ? ` Geschaltet wird über ${gears}.` : ''}${brakes ? ` Die Bremsanlage: ${brakes}.` : ''} Rahmenform, Größe und Farbe stimmen wir bei der Bestellbestätigung ab.`,
    options: {
      frameSizes: ['Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: [{ name: 'Farbe laut Abbildung, weitere nach Verfügbarkeit', hex: '#888888' }],
    },
    specs, isFeatured: false,
  });
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/import-xxl.mjs + build-xxl.mjs from retailer product pages (fahrrad-xxl.de), 2026-10-31.\n// price = manufacturer list price (UVP) x 0.995 (owner rule). Stock and delivery times still need the owner's confirmation.\n// One page per model: frame forms, sizes and colours are variants. Photos: data/image-sources.json.\n`;
fs.writeFileSync('lib/catalog-xxl.ts', `${header}\nexport const XXL_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
const by = {};
out.forEach((p) => { by[p.brand] = (by[p.brand] || 0) + 1; });
console.log('xxl products written:', out.length, JSON.stringify(by));
