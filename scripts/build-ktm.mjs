// Builds lib/catalog-ktm.ts and the product photos for KTM Macina models that were not yet in the shop (.image-work/ktm-pages.json + ktm-imgs.json).
// Source: ktm-bikes.at/de (manufacturer, model year 2027: UVP incl. VAT, specification block, geometry table, official studio photos).
// price = UVP x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, studio cut-outs only (ktm_bg_ lifestyle photos rejected),
// diamond frame (h) first, then the low-step or ladies frame as a second view.  usage: node scripts/build-ktm.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/ktm-pages.json', 'utf8'));
const imgsAll = JSON.parse(fs.readFileSync('.image-work/ktm-imgs.json', 'utf8'));
const shop = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'KTM').map((p) => p.name);
const q2 = (n) => Math.round(n * 100) / 100;
const nk = (s) => s.toLowerCase().replace(/^ktm /, '').replace(/[^a-z0-9]+/g, ' ').trim();
const shopKeys = new Set(shop.map(nk));

const CAT = { 'e-bikes-mountainbike': 'E-MTB', 'e-bikes-trekking': 'E-Trekking', 'e-bikes-utility': 'E-City', 'e-bikes-city-urban': 'E-City', 'light-e-bikes-mountainbike': 'E-MTB', 'light-e-bikes-roadbike': 'E-Gravel', 'light-e-bikes-trekking': 'E-Trekking', 'light-e-bikes-gravel': 'E-Gravel', 'city-urban': 'E-City', 'light-e-bikes-kids': 'E-Kinder' };
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'E-Gravel': 'E-Gravel-Bike', 'E-Kinder': 'Kinder-E-Bike' };
const KEEP = new Set(['CX-R', 'CX', 'SX', 'PX', 'LFC', 'PTS', 'XL', 'LTD', 'FS', 'RT', 'HX', 'UNI', 'P720', 'LG', 'GRX', 'AXS', 'XT', 'XTR', 'SRAM', 'GX', 'SX', 'XX']);
const titleWord = (w) => (/^DI2$/i.test(w) ? 'Di2' : KEEP.has(w) ? w : /\d/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase());
const niceName = (s) => s.split(/\s+/).map(titleWord).join(' ');
const pretty = (s) => s.split(/\s+/).map((w) => (/^[A-Z0-9-]{2,}$/.test(w) && /\d|-/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase())).join(' ');

const LABELS = ['RAHMEN', 'GABEL', 'DäMPFER', 'MOTOR', 'DISPLAY', 'AKKU', 'LADEGERäT', 'SCHALTWERK', 'SCHALTHEBEL', 'KURBEL', 'KETTE', 'LAUFRADSATZ', 'REIFEN VORNE', 'REIFEN HINTEN', 'BREMSEN', 'GEWICHT'];
function specOf(spec) {
  const L = spec.split('\n').map((x) => x.trim());
  const val = (label) => { const i = L.findIndex((x) => x.toUpperCase() === label.toUpperCase()); return i < 0 ? '' : L[i + 1] || ''; };
  const sizes = [];
  for (let i = 0; i < L.length - 1; i++) if (/^Gr(ö|o)(ß|ss)e$/i.test(L[i]) && /^\d{2}$/.test(L[i + 1])) sizes.push(`${L[i + 1]} cm`);
  return { motor: val('MOTOR'), akku: val('AKKU'), display: val('DISPLAY'), derailleur: val('SCHALTWERK'), fork: val('GABEL'), brakes: val('BREMSEN'), tires: val('REIFEN VORNE'), weight: val('GEWICHT'), frame: val('RAHMEN'), sizes: [...new Set(sizes)] };
}
function motorName(m) {
  let s = m.replace(/\(.*?\)/g, '').replace(/\bBDU\w+/i, '').replace(/\s*[-–]\s*\d+\s*km\/h.*$/i, '').replace(/\bup to \d+\s*nm\b/i, '').replace(/\bGen\.?\s*\d\b/i, '').replace(/\bSMART SYSTEM\b/i, '').replace(/\s+/g, ' ').trim();
  s = s.split(' ').map((w) => (/^(bosch)$/i.test(w) ? 'Bosch' : /^(CX-R|CX|SX|PX)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ');
  return s.replace(/^Bosch Performance (?=(CX-R|CX|SX|PX)\b)/, 'Bosch Performance Line ').replace(/^Bosch Performance$/, 'Bosch Performance Line');
}

const models = {};
for (const [u, v] of Object.entries(raw)) {
  const L = v.priceLine.split(' | ');
  let name = '', sub = '';
  for (let i = 0; i < L.length - 1; i++) if (/^MACINA /.test(L[i]) && L[i] === L[i + 1]) { name = L[i]; sub = L[i + 2] || ''; }
  if (!name) continue;
  const price = Number((L.find((x) => /€/.test(x)) || '').replace(/[^\d]/g, ''));
  (models[name] ||= { name, sub, price, cat: v.cat, series: v.series, u, spec: v.spec, imgs: imgsAll[u] || [] });
}
const picked = Object.values(models).filter((m) => !shopKeys.has(nk(`KTM ${niceName(m.name.replace(/^MACINA /, 'Macina '))}`)) && !shopKeys.has(nk(niceName(m.name))));
console.log('ktm models on site:', Object.keys(models).length, '| not in shop:', picked.length);

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { wh: 0, motor: 0, photo: 0, sizes: 0, display: 0, weight: 0 };
for (const m of picked) {
  const sp = specOf(m.spec);
  const name = `KTM ${niceName(m.name)}`;
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = CAT[m.cat];
  const catDe = CAT_DE[cat] || 'E-Bike';
  const motor = motorName(sp.motor);
  const wh = Number((sp.akku.match(/(\d{3,4})\s*Wh/i) || [])[1]) || 0;
  const gear = [sp.derailleur].filter(Boolean).join(', ');
  const gearShort = niceName(m.sub);
  const weightKg = Number((sp.weight.match(/([\d.,]+)/) || [])[1]?.replace(',', '.')) || 0;
  const studio = m.imgs.filter((u) => /\.webp$/.test(u) && !/ktm_bg_/.test(u));
  const hSide = studio.find((u) => /_h_\d\d__/.test(u)) || studio[0];
  const other = studio.filter((u) => u !== hSide && !/_(h)_\d\d__/.test(u))[0] || studio.find((u) => u !== hSide);
  const picks = [hSide, other].filter(Boolean);
  if (!sp.motor) miss.motor++; if (!wh) miss.wh++; if (!picks.length) miss.photo++; if (!sp.sizes.length) miss.sizes++; if (!sp.display) miss.display++; if (!weightKg) miss.weight++;
  if (/^BOSCH CPT-/i.test(sp.motor.trim())) { console.log('skip, motor is only a part code:', name, sp.motor); continue; }
  if (!m.price || !motor || !wh || !cat || !picks.length) { console.log('skip, data incomplete:', name, m.price, motor, wh, cat, picks.length); continue; }
  if (DRY) { console.log('dry', name, '| EUR', m.price, '|', motor, wh + 'Wh', '|', cat, '| sizes', sp.sizes.join('/'), '| photos', picks.length, '| w', weightKg, '|', gearShort); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [], logged = [];
  let n = 0;
  for (const rel of picks) {
    const url = 'https://www.ktm-bikes.at' + rel;
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
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: url, page: 'https://www.ktm-bikes.at' + m.u, store: 'ktm-bikes.at/de', fetched: '2026-11-02' });
  }
  if (!gallery.length) continue;
  sources[slug] = logged;
  const colour = ((hSide.match(/__([a-z0-9-]+)__([a-z0-9-]+?)(?:_4800|\.)/) || []).slice(1, 3)).filter(Boolean).map((c) => c.replace(/-/g, ' ').replace(/\b\w/g, (x) => x.toUpperCase())).join(' / ');
  const specs = { Motor: motor, Akku: `${wh} Wh`, ...(sp.display ? { Display: sp.display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(sp.fork ? { Gabel: sp.fork } : {}), ...(sp.frame ? { Rahmen: sp.frame.split('|')[0].trim() } : {}), ...(sp.tires ? { Reifen: sp.tires } : {}), ...(weightKg ? { Gewicht: `${String(weightKg).replace('.', ',')} kg` } : {}) };
  out.push({
    id: slug, slug, name, brand: 'KTM', category: cat,
    price: q2(m.price * 0.995), originalPrice: m.price,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: Number((sp.motor.match(/(\d{2,3})\s*nm/i) || [])[1]) || 0, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: gallery[0], gallery,
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gearShort ? `, ${gearShort}` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von KTM (Modelljahr 2027). Es hat den ${motor} und einen ${wh} Wh Akku.${gearShort ? ` Antrieb: ${gearShort}.` : ''}${sp.fork ? ` Gabel: ${sp.fork}.` : ''}${weightKg ? ` Gewicht laut Hersteller: ${String(weightKg).replace('.', ',')} kg.` : ''}`,
    options: {
      frameSizes: sp.sizes.length ? sp.sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: colour ? [{ name: colour, hex: '#888888' }] : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', m.price, '|', motor, wh + 'Wh', '|', cat, '| photos', gallery.length, '| sizes', sp.sizes.length);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-ktm.mjs from the manufacturer pages ktm-bikes.at/de (model year 2027, price = UVP x 0.995, owner rule), 2026-11-02.\n// Photos: official studio cut-outs on pure white (data/image-sources.json). Stock and delivery times need the owner's confirmation.\n`;
  fs.writeFileSync('lib/catalog-ktm.ts', `${header}\nexport const KTM_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
