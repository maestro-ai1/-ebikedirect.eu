// Builds lib/catalog-haibike.ts and the product photos from the Haibike DE shop pages (.image-work/haibike*.json).
// Source: haibike.com/de-de (manufacturer: recommended retail price incl. VAT, full specification block, official transparent studio photos).
// price = RRP x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, side view first then three-quarter view,
// dark-background and lifestyle photos rejected, no colour duplicates. usage: node scripts/build-haibike.mjs [prefix]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
const feed = JSON.parse(fs.readFileSync('.image-work/haibike.json', 'utf8'));
const specsRaw = JSON.parse(fs.readFileSync('.image-work/haibike-specs.json', 'utf8'));
const picks = JSON.parse(fs.readFileSync('.image-work/haibike-final-picks.json', 'utf8'));
const shopDump = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'Haibike');
const q2 = (n) => Math.round(n * 100) / 100;

// category by line, taken from the Haibike bikes already in the shop
const lineCat = {};
for (const p of shopDump) { const l = p.name.replace('Haibike ', '').split(' ')[0].toLowerCase(); (lineCat[l] ||= {})[p.category] = ((lineCat[l] || {})[p.category] || 0) + 1; }
const catOf = (title) => {
  const l = title.split(' ')[0].toLowerCase();
  const c = lineCat[l];
  if (c) return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
  return /nduro|hybe|lyke|allmtn|alltrail/.test(l) ? 'E-MTB' : 'E-Trekking';
};
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike' };
const nice = (t) => t.split(' ').map((w) => (/^(CF|SE|ABS|TRN\/IQ)$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ');

const LABELS = ['Batterie', 'Ladegerät', 'Display', 'Motor', 'Rahmen', 'Maximal zulässiges Gesamtgewicht', 'Antrieb', 'Kette', 'Kasette', 'Kurbelsatz', 'Schaltwerk', 'Gänge', 'Anzahl der Gänge', 'Schalthebel Rechts', 'Federung', 'Vordergabel', 'Federweg', 'Shock', 'Dämpfer', 'Federweg hinten', 'Komponenten', 'Bremslicht', 'Vorderradbremse', 'Hinterradbremse', 'Headlight', 'Rücklicht', 'Griffe', 'Lenker', 'Pedal', 'Sattel', 'Sattelstütze', 'Laufräder', 'Radgröße (vorne)', 'Radgröße (hinten)', 'Felge', 'Reifen', 'Dokumente'];
const field = (spec, label) => {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${esc(label)}:\\s*(.*?)(?=(?:${LABELS.map(esc).join('|')})\\s*:|$)`);
  return ((spec.match(re) || [])[1] || '').replace(/\s*(Rahmen|Antrieb|Federung|Komponenten|Laufräder)\s*$/, '').trim();
};

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
for (const [handle, sp] of Object.entries(specsRaw)) {
  if (!picks[handle]) { console.log('skip (not selected):', sp.title); continue; }
  const entry = feed.find((p) => p.handle === handle);
  const spec = sp.spec || '';
  const name = `Haibike ${nice(sp.title)}`;
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rrp = Number(String(sp.price || '').replace(/,/g, ''));
  const motorFull = field(spec, 'Motor');
  const motor = motorFull.split(',')[0].trim();
  const torque = Number((motorFull.match(/(\d{2,3})\s*Nm/i) || [])[1]) || 0;
  const wh = Number((field(spec, 'Batterie').match(/(\d{3,4})\s*Wh/i) || [])[1]) || 0;
  if (!rrp || !motor || !wh || !picks[handle].length) { console.log('skip, data incomplete:', name, rrp, motor, wh); continue; }
  const display = field(spec, 'Display');
  const fork = field(spec, 'Vordergabel').split(',')[0].trim();
  const travel = (field(spec, 'Vordergabel').match(/Travel:\s*(\d+\s*mm)/i) || [])[1] || '';
  const brakes = field(spec, 'Vorderradbremse').split(',').slice(0, 2).join(',').trim();
  const gear = field(spec, 'Schaltwerk').split(',')[0].trim();
  const tires = field(spec, 'Reifen').split(',')[0].trim();
  const frame = field(spec, 'Rahmen').split(',')[0].trim();
  const sizes = (entry.options.find((o) => /size|größe|grösse/i.test(o.name)) || { values: [] }).values;
  const colours = (entry.options.find((o) => /color|farbe/i.test(o.name)) || { values: [] }).values;
  const shapes = (entry.options.find((o) => /shape|form/i.test(o.name)) || { values: [] }).values;
  const cat = catOf(sp.title);
  const catDe = CAT_DE[cat] || 'E-Bike';

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [], logged = [];
  let n = 0;
  for (const url of picks[handle]) {
    let buf = null;
    for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(url); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } }
    if (!buf) { console.log('download failed', url); continue; }
    n++;
    for (const size of [1200, 600]) {
      const inner = Math.round(size * 0.92);
      const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
      const meta = await sharp(body).metadata();
      const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
      await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-${n}${size === 600 ? '-600' : ''}.webp`));
    }
    gallery.push(`/products/${slug}/${slug}-${prefix}-${n}.webp`);
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: url, page: `https://haibike.com/de-de/products/${handle}`, store: 'haibike.com/de-de', fetched: '2026-11-02' });
  }
  if (!gallery.length) continue;
  sources[slug] = logged;
  const specs = { Motor: `${motorFull.replace(/,\s*25\s*km\/h/i, '')}`, Akku: `${wh} Wh`, ...(display ? { Display: display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(brakes ? { Bremsen: brakes } : {}), ...(fork ? { Gabel: travel ? `${fork}, ${travel} Federweg` : fork } : {}), ...(frame ? { Rahmen: frame } : {}), ...(tires ? { Reifen: tires } : {}) };
  out.push({
    id: slug, slug, name, brand: 'Haibike', category: cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: 0, weightKg: 0,
    image: gallery[0], gallery,
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear}` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von Haibike. Es hat den ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear}.` : ''}${fork ? ` Die Federgabel ist eine ${fork}${travel ? ` mit ${travel} Federweg` : ''}.` : ''}${shapes.length > 1 ? ` Es gibt die Rahmenformen ${shapes.join(' und ')}.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: colours.length ? colours.map((c) => ({ name: c.charAt(0).toUpperCase() + c.slice(1), hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', rrp, '|', motor, torque + 'Nm', wh + 'Wh', '|', cat, '| photos', gallery.length, '| sizes', sizes.join('/'), '| colours', colours.length);
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-haibike.mjs from the manufacturer pages haibike.com/de-de (price = RRP x 0.995, owner rule), 2026-11-02.\n// Photos: official transparent studio photos on pure white (data/image-sources.json). Haibike shows "check availability at dealers"; stock and delivery times need the owner's confirmation.\n`;
fs.writeFileSync('lib/catalog-haibike.ts', `${header}\nexport const HAIBIKE_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('written:', out.length, 'products');
