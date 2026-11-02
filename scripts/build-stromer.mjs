// Builds lib/catalog-stromer.ts and the product photos from the Stromer DE model pages (.image-work/stromer.json + .image-work/stromer-cand/).
// Source: stromerbike.com/de (manufacturer: price, specification table, official studio photos). price = current manufacturer price x 0.995 (owner rule).
// Image Rule: pure white 1200x1200 WebP + 600, white-background side view first, then the three-quarter view; no lifestyle photos, no detail shots.
// usage: node scripts/build-stromer.mjs [prefix]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
const raw = JSON.parse(fs.readFileSync('.image-work/stromer.json', 'utf8'));
const cand = JSON.parse(fs.readFileSync('.image-work/stromer-cand.json', 'utf8'));
const q2 = (n) => Math.round(n * 100) / 100;
// manufacturer prices read from the pages (EUR); ST7 shows 12,990 struck through and 11,490 as the current price
const PRICE = { st1: { rrp: 5565, now: 5565 }, st2: { rrp: 6890, now: 6890 }, st3: { rrp: 8882, now: 8882 }, st5: { rrp: 10990, now: 10990 }, st7: { rrp: 12990, now: 11490 } };
// chosen studio photos (index in stromer-cand.json): side view first, then three-quarter views
const PICKS = { st1: [0], st2: [1, 0, 2], st3: [1, 0, 2], st5: [1, 0, 2], st7: [1, 2] };

function parse(spec) {
  const L = spec.split('\n').map((x) => x.trim()).filter(Boolean);
  const after = (label, skipSame = true) => { const i = L.indexOf(label); if (i < 0) return ''; let j = i + 1; while (skipSame && L[j] === label) j++; return L[j] || ''; };
  const wh = Number((spec.match(/(\d{3,4})\s*Wh/) || [])[1]) || 0;
  const range = Number((spec.match(/Batteriereichweite\s*\n\s*-?\s*(\d+)\s*KM/i) || [])[1]) || 0;
  return {
    motor: after('Motor'), power: after('Motorleistung'), torque: Number((after('Motordrehmoment').match(/(\d+)/) || [])[1]) || 0, cat: (after('Kategorie EU').match(/L\d+e-[A-Z]/) || [''])[0],
    battery: after('Batterie enthalten'), wh, range, display: after('Display'), gear: after('Schaltung'), brakes: after('Bremsen'), tires: after('Tires'),
    sizes: after('Größen').split(',').map((x) => x.trim()).filter(Boolean), frames: after('Rahmenoptionen'), colours: after('Rahmenfarben').split(',').map((x) => x.trim()).filter(Boolean)
  };
}

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
for (const [m, v] of Object.entries(raw)) {
  const s = parse(v.spec);
  const name = `Stromer ${m.toUpperCase()}`;
  const slug = `stromer-${m}`;
  const pr = PRICE[m];
  if (!pr || !s.motor || !s.wh) { console.log('skip, data incomplete:', name, s.motor, s.wh); continue; }
  const page = `https://www.stromerbike.com/de/bikes/${m}`;
  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [], logged = [];
  let n = 0;
  for (const idx of PICKS[m]) {
    const file = `.image-work/stromer-cand/${m}-${idx}.bin`;
    if (!fs.existsSync(file)) { console.log('missing photo', file); continue; }
    n++;
    const buf = fs.readFileSync(file);
    for (const size of [1200, 600]) {
      const inner = Math.round(size * 0.92);
      const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
      const meta = await sharp(body).metadata();
      const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
      await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-${n}${size === 600 ? '-600' : ''}.webp`));
    }
    gallery.push(`/products/${slug}/${slug}-${prefix}-${n}.webp`);
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: cand[m][idx], page, store: 'stromerbike.com/de', fetched: '2026-11-02' });
  }
  if (!gallery.length) continue;
  sources[slug] = logged;
  const motorText = `${s.motor}${s.power ? `, ${s.power}` : ''}`;
  const specs = { Motor: motorText, Drehmoment: s.torque ? `${s.torque} Nm` : '', Akku: `${s.wh} Wh (${s.battery.split('|')[0].trim()})`, Reichweite: s.range ? `bis ${s.range} km` : '', Geschwindigkeit: `bis 45 km/h (Klasse ${s.cat})`, Display: s.display, Schaltung: s.gear, Bremsen: s.brakes, Reifen: s.tires, Rahmen: s.frames };
  for (const k of Object.keys(specs)) if (!specs[k]) delete specs[k];
  out.push({
    id: slug, slug, name, brand: 'Stromer', category: 'Speed-Pedelec',
    price: q2(pr.now * 0.995), originalPrice: pr.rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor: s.motor, torqueNm: s.torque, batteryStandardWh: s.wh, rangeKm: s.range, weightKg: 0,
    image: gallery[0], gallery,
    shortDescription: `S-Pedelec bis 45 km/h mit ${s.motor}, ${s.wh} Wh Akku${s.gear ? `, ${s.gear}` : ''}.`,
    description: `Das ${name} ist ein Speed-Pedelec von Stromer, zugelassen bis 45 km/h (Klasse ${s.cat}). Es hat den ${motorText}${s.torque ? ` mit ${s.torque} Nm Drehmoment` : ''} und einen ${s.wh} Wh Akku, der Hersteller nennt bis zu ${s.range} km Reichweite.${s.gear ? ` Geschaltet wird mit ${s.gear}.` : ''}${s.display ? ` Das Display ist das ${s.display}.` : ''} Für ein Speed-Pedelec gelten Versicherungskennzeichen und Helmpflicht.`,
    options: {
      frameSizes: s.sizes.length ? s.sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${s.wh} Wh`, capacityWh: s.wh, priceDelta: 0 }],
      colors: s.colours.length ? s.colours.map((c) => ({ name: c, hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| photos', gallery.length, '| EUR', pr.now, '| Wh', s.wh, '| sizes', s.sizes.join('/'), '| colours', s.colours.join('/'));
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-stromer.mjs from the manufacturer pages stromerbike.com/de (price = current manufacturer price x 0.995, owner rule), 2026-11-02.\n// ST7: manufacturer shows 12,990 EUR struck through and 11,490 EUR as the current price. Photos: official studio shots (data/image-sources.json).\n`;
fs.writeFileSync('lib/catalog-stromer.ts', `${header}\nexport const STROMER_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('written:', out.length, 'products');
