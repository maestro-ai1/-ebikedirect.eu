// Builds lib/catalog-cannondale.ts and the product photos from the scraped Cannondale DE e-bike pages (.image-work/cannondale.json).
// Source: cannondale.com/de-de (manufacturer: price, specs, official studio photos). price = RRP x 0.995 (owner rule), originalPrice = RRP.
// Image Rule: pure white 1200x1200 WebP + 600, white-background side view first, then the three-quarter view; no colour duplicates, no detail shots.
// usage: node scripts/build-cannondale.mjs [prefix]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
const raw = JSON.parse(fs.readFileSync('.image-work/cannondale.json', 'utf8'));
const q2 = (n) => Math.round(n * 100) / 100;
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' und ').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CAT = { 'Moterra Neo': 'E-MTB', 'Moterra SL': 'E-MTB', 'Moterra Neo LT': 'E-MTB', 'Habit Neo': 'E-MTB', 'Synapse Neo': 'E-Gravel', 'Synapse Neo Allroad': 'E-Gravel', Tesoro: 'E-Trekking', 'Tesoro Neo Carbon': 'E-Trekking', Mavaro: 'E-City', 'Mavaro Neo': 'E-City', FlyingV: 'E-City', 'Wonderwagen Neo': 'Cargo-E-Bike', 'Cargowagen Neo': 'Cargo-E-Bike' };
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'Cargo-E-Bike': 'Cargo E-Bike', 'E-Gravel': 'E-Gravel-Bike' };
const short = (v, n = 2) => String(v || '').split(',').slice(0, n).join(',').trim();

// unique names: same model name twice -> add the model number
const count = {};
for (const m of raw) count[m.h1] = (count[m.h1] || 0) + 1;
const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
let skipped = 0;
for (const m of raw) {
  const s = m.specs;
  const cat = CAT[s['Plattform']];
  if (!cat || !m.price) { console.log('skip (no category or price):', m.h1, s['Plattform']); skipped++; continue; }
  const num = String(s['Modellnummer'] || '').replace(/\s+/g, ' ').trim();
  const name = `Cannondale ${m.h1}${count[m.h1] > 1 ? ' ' + num : ''}`.replace(/\s+/g, ' ').trim();
  const slug = slugify(name);
  const rrp = Number(m.price);
  const wh = Number((String(s['Batterie'] || '').match(/(\d{3,4})\s*Wh/i) || [])[1]) || 0;
  const nm = Number((String(s['Motor'] || '').match(/(\d{2,3})\s*Nm/i) || [])[1]) || 0;
  const motor = String(s['Motor'] || '').split(',')[0].trim() || 'Mittelmotor';
  const gear = [s['Schaltwerk'], s['Kassette']].filter(Boolean).map((x) => short(x, 1)).join(', ') || short(s['Kette'], 1);
  const specs = { Motor: short(s['Motor'], 2), ...(nm ? { Drehmoment: `${nm} Nm` } : {}), Akku: short(s['Batterie'], 2), Display: short(s['Display'], 1) };
  if (gear) specs['Schaltung'] = gear;
  if (s['Bremsen']) specs['Bremsen'] = short(s['Bremsen'], 1);
  if (s['Gabel']) specs['Gabel'] = short(s['Gabel'], 1);
  if (s['Rahmen']) specs['Rahmen'] = short(s['Rahmen'], 2);
  if (s['Reifen'] || s['Vorderreifen']) specs['Reifen'] = short(s['Reifen'] || s['Vorderreifen'], 1);
  if (s['Reifengröße'] || s['Reifendimension']) specs['Laufradgröße'] = `${s['Reifendimension'] || ''} ${s['Reifengröße'] || ''}`.trim();
  for (const k of Object.keys(specs)) if (!specs[k]) delete specs[k];

  // photos: first colourway, side view (PD) first, then the three-quarter views
  const pd = m.imgs.find((u) => /_PD\.png/.test(u));
  const colour = pd ? (pd.match(/_([A-Z0-9]{2,4})_PD\.png/) || [])[1] : null;
  const same = (suffix) => m.imgs.find((u) => new RegExp(`${colour ? '_' + colour : ''}_${suffix}\\.png`).test(u));
  const picks = [pd, same('3Q'), same('R3Q')].filter(Boolean).filter((u, i, a) => a.indexOf(u) === i).slice(0, 3);
  if (!picks.length) { console.log('skip (no photo):', name); skipped++; continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [];
  const logged = [];
  let n = 0;
  for (const url of picks) {
    let buf = null;
    for (let t = 0; t < 3 && !buf; t++) {
      try { const r = await fetch(url); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ }
    }
    if (!buf) { console.log('download failed:', url); continue; }
    n++;
    for (const size of [1200, 600]) {
      const inner = Math.round(size * 0.92);
      const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
      const meta = await sharp(body).metadata();
      const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
      await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-${n}${size === 600 ? '-600' : ''}.webp`));
    }
    gallery.push(`/products/${slug}/${slug}-${prefix}-${n}.webp`);
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: url, page: m.url, store: 'cannondale.com/de-de', fetched: '2026-11-02' });
  }
  if (!gallery.length) { skipped++; continue; }
  sources[slug] = logged;
  const catDe = CAT_DE[cat];
  const shortDesc = `${catDe} mit ${motor}${wh ? `, ${wh} Wh Akku` : ''}${gear ? `, ${short(gear, 1)}` : ''}.`;
  out.push({
    id: slug, slug, name, brand: 'Cannondale', category: cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: nm, batteryStandardWh: wh, rangeKm: 0, weightKg: 0,
    image: gallery[0], gallery, shortDescription: shortDesc,
    description: `Das ${name} ist ein ${catDe} von Cannondale. Es hat ${motor}${wh ? ` und einen ${wh} Wh Akku` : ''}${nm ? `, das Drehmoment beträgt ${nm} Nm` : ''}.${gear ? ` Geschaltet wird mit ${short(gear, 2)}.` : ''} Modellnummer ${num}.`,
    options: {
      frameSizes: ['Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: wh ? `Akku ${wh} Wh` : 'Standardakku', capacityWh: wh, priceDelta: 0 }],
      colors: [{ name: 'Farbe laut Abbildung, weitere nach Verfügbarkeit', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| photos', gallery.length, '| EUR', rrp);
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-cannondale.mjs from the manufacturer pages cannondale.com/de-de (price = RRP x 0.995, owner rule), 2026-11-02.\n// Photos: official studio shots (data/image-sources.json). Stock and delivery times still need the owner's confirmation.\n`;
fs.writeFileSync('lib/catalog-cannondale.ts', `${header}\nexport const CANNONDALE_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('written:', out.length, 'products | skipped:', skipped);
