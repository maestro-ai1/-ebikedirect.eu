// Builds lib/catalog-giant.ts and the product photos for Giant E+ models that were not yet in the shop (.image-work/giant-pages.json).
// Source: giant-bicycles.com/de (manufacturer: price incl. VAT, specification table, official studio photos on white).
// price = manufacturer price x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, side view first, then front and rear studio views;
// detail shots (-D) rejected.  usage: node scripts/build-giant.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/giant-pages.json', 'utf8'));
const shop = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'Giant').map((p) => p.name);
const q2 = (n) => Math.round(n * 100) / 100;
const nk = (s) => s.toLowerCase().replace(/^giant /, '').replace(/[^a-z0-9]+/g, ' ').trim();
// frame-shape suffixes (DD diamond, STA step-through, LST low-step) do not make a different model for the duplicate check
const nk2 = (s) => nk(s).replace(/\b(dd|sta|lst)\b/g, '').replace(/\s+/g, ' ').trim();
const shopKeys = new Set(shop.map(nk2));

const CAT_OF = (name) => (/^(Reign|Trance|Fathom|Talon|Stance)/i.test(name) ? 'E-MTB' : /^Defy/i.test(name) ? 'E-Gravel' : 'E-Trekking');
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-Gravel': 'E-Rennrad' };

function parse(text) {
  const L = text.split('\n').map((x) => x.trim());
  const val = (label) => { const i = L.findIndex((x) => x === label); return i < 0 ? '' : L[i + 1] || ''; };
  const price = Number(((text.match(/Current price:\s*\n?\s*([\d.]+),\d\d/) || [])[1] || '').replace(/\./g, '')) || 0;
  return { price, motor: val('Motor'), akku: val('Akku'), display: val('Displayeinheit'), sizes: val('Rahmengrößen'), colour: val('Farbe(n)'), frame: val('Rahmen'), fork: val('Gabel'), brakes: val('Bremsen'), derailleur: val('Schaltwerk'), tires: val('Reifen'), weight: val('Gewicht (kg)') };
}

const picked = [];
const seen = new Set();
for (const v of Object.values(raw)) {
  if (/^\/de\/bikes-/.test(v.u)) continue; // family overview pages
  const name = `Giant ${(v.h1 || '').replace(/\s+/g, ' ').trim()}`;
  if (shopKeys.has(nk2(name))) continue;
  if (seen.has(nk(name))) continue;
  seen.add(nk(name));
  picked.push({ name, v });
}
console.log('giant pages:', Object.keys(raw).length, '| to add:', picked.length);

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { motor: 0, wh: 0, price: 0, photo: 0, sizes: 0, weight: 0 };
for (const { name, v } of picked) {
  const sp = parse(v.text);
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = CAT_OF(name.replace(/^Giant /, ''));
  const catDe = CAT_DE[cat] || 'E-Bike';
  const motorFull = sp.motor;
  let motor = motorFull.split(',')[0].replace(/\[RT\]/g, '').replace(/\b\d+\s*V\b/g, '').replace(/\s*\d{2,3}\s*Nm\b/gi, '').replace(/\s+/g, ' ').trim();
  let torque = Number((motorFull.match(/(\d{2,3})\s*Nm/i) || [])[1]) || 0;
  const tail = motor.match(/^(.*\S)\s+(55|65|75|85|100|120)$/);
  if (tail && /(Core|Sport|Pro)/i.test(tail[1])) { motor = tail[1]; torque = torque || Number(tail[2]); }
  if (!/^Giant\b/i.test(motor)) motor = `Giant ${motor}`;
  const wh = Number((sp.akku.match(/(\d{3,4})\s*(?:Wh)?/i) || [])[1]) || 0;
  const sizes = sp.sizes ? sp.sizes.split(',').map((x) => x.trim()).filter(Boolean) : [];
  const weightKg = Number((sp.weight.match(/([\d.,]+)\s*kg/i) || [])[1]?.replace(',', '.')) || 0;
  const hi = v.imgs.filter((u) => /h_2000/.test(u) && !/-D-?\d/.test(u));
  const base = hi.find((u) => /_Color[A-Z][^-/]*\.jpg$/.test(u)) || hi[0];
  const front = hi.find((u) => /-Front\.jpg$/.test(u) && base && u.split('/').pop().replace(/-Front\.jpg$/, '') === base.split('/').pop().replace(/\.jpg$/, ''));
  const rear = hi.find((u) => /-Rear\.jpg$/.test(u) && base && u.split('/').pop().replace(/-Rear\.jpg$/, '') === base.split('/').pop().replace(/\.jpg$/, ''));
  const picks = [base, front, rear].filter(Boolean);
  if (!motor) miss.motor++; if (!wh) miss.wh++; if (!sp.price) miss.price++; if (!picks.length) miss.photo++; if (!sizes.length) miss.sizes++; if (!weightKg) miss.weight++;
  if (!sp.price || !motor || !wh || !picks.length) { console.log('skip, data incomplete:', name, sp.price, motor, wh, picks.length); continue; }
  if (DRY) { console.log('dry', name, '| EUR', sp.price, '|', motor, torque + 'Nm', wh + 'Wh', '|', cat, '| sizes', sizes.join('/'), '| photos', picks.length, '| w', weightKg); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [], logged = [];
  let n = 0;
  for (const url of picks) {
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
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: url, page: 'https://www.giant-bicycles.com' + v.u, store: 'giant-bicycles.com/de', fetched: '2026-11-02' });
  }
  if (!gallery.length) continue;
  sources[slug] = logged;
  const gear = sp.derailleur.split(',')[0].trim();
  const specs = { Motor: `${motorFull.replace(/,\s*/g, ', ')}`, Akku: sp.akku, ...(sp.display ? { Display: sp.display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(sp.brakes ? { Bremsen: sp.brakes } : {}), ...(sp.fork ? { Gabel: sp.fork } : {}), ...(sp.frame ? { Rahmen: sp.frame } : {}), ...(sp.tires ? { Reifen: sp.tires } : {}), ...(weightKg ? { Gewicht: `${String(weightKg).replace('.', ',')} kg` } : {}) };
  out.push({
    id: slug, slug, name, brand: 'Giant', category: cat,
    price: q2(sp.price * 0.995), originalPrice: sp.price,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: gallery[0], gallery,
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear}` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von Giant. Es hat den ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear}.` : ''}${sp.fork ? ` Gabel: ${sp.fork}.` : ''}${weightKg ? ` Gewicht laut Hersteller: ${String(weightKg).replace('.', ',')} kg.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: sp.colour ? sp.colour.split(/[,/]/).map((c) => c.trim()).filter(Boolean).map((c) => ({ name: c.charAt(0).toUpperCase() + c.slice(1), hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', sp.price, '|', motor, torque + 'Nm', wh + 'Wh', '|', cat, '| photos', gallery.length, '| sizes', sizes.length);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-giant.mjs from the manufacturer pages giant-bicycles.com/de (price = manufacturer price x 0.995, owner rule), 2026-11-02.\n// Photos: official studio photos on white (data/image-sources.json). Stock and delivery times need the owner's confirmation.\n`;
  fs.writeFileSync('lib/catalog-giant.ts', `${header}\nexport const GIANT_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
