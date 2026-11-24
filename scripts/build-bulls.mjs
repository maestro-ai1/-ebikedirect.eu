// Builds lib/catalog-bulls.ts and the product photos for Bulls e-bike models from .image-work/gen-bulls.json (written by .image-work/_bulls-scrape.cjs).
// Source: bulls.de/de-de (manufacturer shop: "unverbindliche Preisempfehlung des Herstellers" = UVP incl. VAT, full attribute list, studio photo).
// price = UVP x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, one side view, no colour duplicates. Descriptions are written from the facts (no copied marketing text).
// usage: node scripts/build-bulls.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/gen-bulls.json', 'utf8'));
const q2 = (n) => Math.round(n * 100) / 100;
const dec = (s) => String(s || '').replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö').replace(/&uuml;/g, 'ü').replace(/&Auml;/g, 'Ä').replace(/&Ouml;/g, 'Ö').replace(/&Uuml;/g, 'Ü').replace(/&szlig;/g, 'ß').replace(/&reg;/g, '®').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'E-Gravel': 'E-Gravel-Bike' };
const ACR = new Set(['EVO', 'AM', 'SX', 'CX', 'FS', 'EN-R', 'ABS', 'EVA', 'AM-SX', 'I', 'II', 'III']);
const title = (s) => s.split(/\s+/).map((w) => { const u = w.toUpperCase(); return ACR.has(u) || /^\d/.test(w) ? u : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join(' ');
const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { motor: 0, wh: 0, display: 0, gear: 0, brakes: 0, fork: 0, tires: 0, sizes: 0, weight: 0 };
const seen = new Set();
for (const m of raw) {
  const A = {}; for (const [k, v] of Object.entries(m.attrs)) A[dec(k).toLowerCase()] = dec(v);
  const a = (k) => A[k.toLowerCase()] || '';
  let nm = `Bulls ${title(m.name)}`;
  if (/^(Wave|Trapez)$/.test(m.frame) && !/\b(low|wave|trapez)\b/i.test(nm)) nm += ` ${m.frame}`;
  const slug = nm.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (seen.has(slug)) continue; seen.add(slug);
  const motorRaw = a('Motor Bezeichnung') || a('Motor');
  const motor = motorRaw.replace(/\s*\(Smart System\)/i, '').replace(/\s+\d{2}\/\d{2,3}\s*Nm\s*$/i, '').replace(/\s*\d{2,3}\s*Nm\s*$/i, '').replace(/\s+/g, ' ').trim();
  const torque = Number(a('Drehmoment (Nm)')) || Number((motorRaw.match(/\/(\d{2,3})\s*Nm/) || [])[1]) || 0;
  const wh = Number((a('Akkukapazität (Wh)').match(/(\d{3,4})/) || a('Kapazität').match(/(\d{3,4})/) || [])[1]) || 0;
  const display = a('Display');
  const gear = [a('Schaltwerk'), a('Anzahl Gänge') && !/nabe/i.test(a('Schaltwerk')) ? a('Anzahl Gänge') : ''].filter(Boolean).join(', ') || a('Schaltungstyp / Gänge').replace('|', ',');
  const brakes = [a('Bremse vorne'), a('Bremse hinten')].filter(Boolean).filter((x, i, arr) => arr.indexOf(x) === i).join(' / ');
  const fork = a('Gabel');
  const travelF = a('Federweg vorne') || a('Gabel Federweg') || '';
  const tires = a('Bereifung');
  const tireSize = a('Reifengröße (Zoll)');
  const frame = [a('Rahmenmaterial'), m.frame && m.frame !== 'Diamant' ? `${m.frame}-Rahmen` : ''].filter(Boolean).join(', ');
  const weightText = a('Gewicht **') || a('Gewicht');
  const weightKg = Number((weightText.match(/([\d.,]+)\s*kg/i) || [])[1]?.replace(',', '.')) || 0;
  const sizes = m.sizes.length ? m.sizes.map((s) => `Rahmenhöhe ${s}`) : [];
  if (!motor) miss.motor++; if (!wh) miss.wh++; if (!display) miss.display++; if (!gear) miss.gear++; if (!brakes) miss.brakes++; if (!fork) miss.fork++; if (!tires) miss.tires++; if (!sizes.length) miss.sizes++; if (!weightKg) miss.weight++;
  // the photo CDN only serves fixed sizes: 1200x675 works, other sizes answer 405
  if (!m.imageUrl && m.listImage) m.imageUrl = m.listImage.replace('{{width}}x{{height}}', '1200x675');
  m.imageUrl = (m.imageUrl || '').replace(/\/\d+x\d+_png\//, '/1200x675_png/');
  if (!m.uvp || !motor || !wh || !m.imageUrl) { console.log('skip, data incomplete:', nm, m.uvp, motor, wh); continue; }
  const catDe = CAT_DE[m.cat] || 'E-Bike';
  if (DRY) { console.log('dry', nm, '| EUR', m.uvp, '|', motor, torque + 'Nm', wh + 'Wh', '|', m.cat, '| sizes', sizes.join('/'), '| gear', gear, '| brakes', brakes, '| kg', weightKg); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  let buf = null;
  for (const u of [m.imageUrl, m.listImage.replace('{{width}}x{{height}}', '1200x675')]) { for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(u); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } } if (buf) break; }
  if (!buf) { console.log('download failed', m.imageUrl); continue; }
  for (const size of [1200, 600]) {
    const inner = Math.round(size * 0.92);
    const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const meta = await sharp(body).metadata();
    const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
    await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${slug}/${slug}-${prefix}-1.webp`;
  sources[slug] = [{ file: `${slug}-${prefix}-1.webp`, source: m.imageUrl, page: m.page, store: 'bulls.de/de-de', fetched: '2026-11-24' }];
  const specs = { Motor: `${motor}${torque ? `, ${torque} Nm` : ''}`, Akku: `${wh} Wh`, ...(display ? { Display: display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(brakes ? { Bremsen: brakes } : {}), ...(fork ? { Gabel: travelF ? `${fork}, ${travelF}` : fork } : {}), ...(frame ? { Rahmen: frame } : {}), ...(tires ? { Reifen: tireSize ? `${tires}, ${tireSize}` : tires } : {}), ...(weightText ? { Gewicht: weightText } : {}) };
  const rrp = m.uvp;
  out.push({
    id: slug, slug, name: nm, brand: 'Bulls', category: m.cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: img, gallery: [img],
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear.split(',')[0]}` : ''}.`,
    description: `Das ${nm} ist ein ${catDe} von Bulls. Es hat den ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear.split(',')[0]}.` : ''}${brakes ? ` Gebremst wird mit ${brakes}.` : ''}${fork ? ` Die Gabel ist eine ${fork}${travelF ? ` mit ${travelF}` : ''}.` : ''}${weightText ? ` Gewicht laut Hersteller: ${weightText}.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: [{ name: dec(a('Herstellerfarbe')) || 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', nm, '| EUR', rrp, '|', motor, torque + 'Nm', wh + 'Wh', '|', m.cat, '| sizes', sizes.length);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-bulls.mjs from the manufacturer shop bulls.de/de-de (price = UVP x 0.995, owner rule), 2026-11-24.\n// Photos: official studio view on white (data/image-sources.json). Stock and delivery times are confirmed by the owner.\n`;
  fs.writeFileSync('lib/catalog-bulls.ts', `${header}\nexport const BULLS_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
