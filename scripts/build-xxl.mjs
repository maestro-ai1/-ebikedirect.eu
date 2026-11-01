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
let items = files.flatMap((f) => JSON.parse(fs.readFileSync(path.join('.image-work', f), 'utf8')).map((m) => ({ ...m, _catrun: f.startsWith('xxl-cat-') })));
// the dealer's cargo listing also shows ordinary bikes: a category-run model only counts as cargo when its name says so
const CARGO = /cargo|longtail|long p\d|load|family|breeze|multitinker|multicharger|porto|cabby|makki|packster|carry|transport|urbanator|curve|go mountain|compact p|cross p|e-truck/i;
items = items.filter((m) => !(m._catrun && m.cat === 'Cargo-E-Bike' && !CARGO.test(m.name + ' ' + m.parts.join(' '))));
// A brand page the dealer does not carry lists other brands' bikes, which the fetch labels with the requested brand:
// keep a model only when its dealer page address starts with the brand name.
const bslug = (b) => b.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
items = items.filter((m) => {
  const ps = String(m.page || '').split('/').pop().toLowerCase();
  const bk = bslug(m.brand === 'Riese & Müller' ? 'Riese und Müller' : m.brand);
  return ps.startsWith(bk) || ps.startsWith(bk.replace(/-/g, ''));
});
// The dealer's category lists overlap, so the category is decided from the model name first.
const CARGO_BRANDS = new Set(['Babboe', 'Carqon', 'Urban Arrow', 'QiO']);
const MTB = /fully|hardtail|trail|enduro|reaction|stereo|levo|kenevo|\bwild\b|\brise\b|urrun|patron|alltrack|alltrail|allmtn|\bjam|thron|talon|fathom|stance|moterra|e-revox|revox|durok|korak|tarok|ravor|\bams\b|\bnuride\b|powerfly|\brail\b|fuel/i;
function inferCat(m) {
  const t = m.name + ' ' + m.parts.join(' ');
  if (m.brand === 'Brompton' || /\bfold\b|falt/i.test(t)) return 'Falt-E-Bike';
  if (CARGO_BRANDS.has(m.brand) || CARGO.test(t)) return 'Cargo-E-Bike';
  if (/45\s?km|\bHS\b|speed pedelec|vado s\b/i.test(t)) return 'Speed-Pedelec';
  if (MTB.test(t)) return 'E-MTB';
  if (m.cat && m.cat !== 'Cargo-E-Bike') return m.cat;
  return /image|entice|carpe|city|suv/i.test(t) ? 'E-City' : 'E-Trekking';
}
items = items.filter((m) => !SKIP.has(m.slug) && !/testrad|demo/i.test(m.name + ' ' + m.parts.join(' ')));
// road and gravel e-bikes have no category on the site yet (the dealer lists some of them as cargo or trekking), so they wait for their own category
items = items.filter((m) => !/gravel|solace|fastlane|esilex|topstone|synapse|addict|speedster|\borca\b|\bgain\b|creo|defy|denna|norza|checkpoint|revolt|contend|nuroad|domane|endurace/i.test(m.name + ' ' + m.parts.join(' ')));
// one product per slug (a model can appear in a brand run and a category run)
items = items.filter((m, i, a) => a.findIndex((x) => x.slug === m.slug) === i);

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
  const brand = m.brand === 'Riese und Müller' ? 'Riese & Müller' : m.brand;
  const cat = inferCat(m);
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
    description: `Das ${name} ist ein ${catDe} von ${brand}. Es hat ${motor} und einen ${wh} Wh Akku${s.Drehmoment ? `, das Drehmoment beträgt ${s.Drehmoment}` : ''}.${gears ? ` Geschaltet wird über ${gears}.` : ''}${brakes ? ` Die Bremsanlage: ${brakes}.` : ''} ${cat === 'Speed-Pedelec' ? ' Als S-Pedelec bis 45 km/h braucht es Versicherungskennzeichen, Führerschein Klasse AM und Helm.' : ''} Rahmenform, Größe und Farbe stimmen wir bei der Bestellbestätigung ab.`,
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
