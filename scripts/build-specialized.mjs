// Builds lib/catalog-specialized.ts and the product photos for Specialized e-bikes that were not yet in the shop (.image-work/spec-pages.json).
// Source: specialized.com/de/de (manufacturer: current price incl. VAT, "Technische Spezifikationen" block, official studio photos with transparent background).
// price = current manufacturer price x 0.995 (owner rule; originalPrice = struck-through price when the site shows one).
// Image Rule: pure white 1200x1200 WebP + 600, side view (HERO-PDP) first, then front and rear three-quarter views; detail shots rejected.
// usage: node scripts/build-specialized.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/spec-pages.json', 'utf8'));
const shopDump = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'Specialized');
const q2 = (n) => Math.round(n * 100) / 100;
const nk = (s) => s.toLowerCase().replace(/^specialized /, '').replace(/^turbo /, '').replace(/[^a-z0-9]+/g, ' ').trim();
const shopKeys = new Set(shopDump.map((p) => nk(p.name)));
const eur = (s) => Number((s || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;

const lineCat = {};
for (const p of shopDump) { const l = p.name.replace('Specialized ', '').replace(/^(S-Works )?Turbo /, '').split(' ')[0].toLowerCase(); (lineCat[l] ||= {})[p.category] = ((lineCat[l] || {})[p.category] || 0) + 1; }
const catOf = (name) => {
  const l = name.replace(/^(S-Works )?(Turbo )?/, '').split(' ')[0].toLowerCase();
  if (lineCat[l]) return Object.entries(lineCat[l]).sort((a, b) => b[1] - a[1])[0][0];
  if (/levo|kenevo/.test(l)) return 'E-MTB';
  if (/creo/.test(l)) return 'E-Gravel';
  if (/porto/.test(l)) return 'Cargo-E-Bike';
  if (/como/.test(l)) return 'E-City';
  return 'E-Trekking';
};
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'E-Gravel': 'E-Gravel-Bike', 'Cargo-E-Bike': 'Cargo E-Bike' };

function parse(text) {
  const a = text.indexOf('Technische Spezifikationen');
  const L = (a >= 0 ? text.slice(a) : text).split('\n').map((x) => x.trim());
  const val = (label) => { const i = L.findIndex((x) => x === label); return i < 0 ? '' : L[i + 1] || ''; };
  return { motor: val('Motor'), akku: val('Akku'), display: val('Display/Lenkerfernbedienung') || val('Display'), frame: val('Rahmen'), fork: val('Gabel') || val('Federgabel'), derailleur: val('Schaltwerk') || val('Schaltung'), brakes: val('Bremsen') || val('Bremshebel'), tires: val('Reifen'), weight: val('Gewicht') };
}

const rows = [];
const seen = new Set();
for (const v of Object.values(raw)) {
  const name0 = v.lines.find((x) => x !== 'Vergleichen' && !/€/.test(x)) || '';
  if (!name0 || /Rahmenset|Frameset|^E-Mountainbikes$|^S-Works Turbo Levo (4|R Ultralight)$/i.test(name0)) continue;
  const name = `Specialized ${/^(S-Works |Turbo |Levo|Vado|Creo)/i.test(name0) && !/^(S-Works|Turbo)/i.test(name0) ? 'Turbo ' : ''}${name0}`.replace(/\s+/g, ' ');
  const key = nk(name);
  if (shopKeys.has(key) || seen.has(key)) continue;
  seen.add(key);
  const euros = v.lines.filter((x) => /€/.test(x));
  rows.push({ name, v, price: eur(euros[0]), old: euros[1] ? eur(euros[1]) : 0 });
}
console.log('specialized pages:', Object.keys(raw).length, '| to add:', rows.length);

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { motor: 0, wh: 0, photo: 0, sizes: 0 };
for (const { name, v, price, old } of rows) {
  const sp = parse(v.text);
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = catOf(name.replace(/^Specialized /, ''));
  const catDe = CAT_DE[cat] || 'E-Bike';
  const motor = sp.motor.split(',')[0].replace(/\s+/g, ' ').trim();
  const torque = Number((sp.motor.match(/(\d{2,3})\s*Nm/i) || [])[1]) || 0;
  const wh = Number((sp.akku.match(/(\d{3,4})\s*-?\s*Wh/i) || [])[1]) || 0;
  const groups = {};
  for (const u of v.imgs) { const f = u.split('/').pop(); const m = f.match(/^([^_]+_[^_]+(?:_[^_]+)*?)_(HERO-PDP|FDSQ|RDSQ|HERO|D\d.*)\.webp$/); if (m && !/CMPNT|HLMT|BATTERY|EXTENDER|RACK|BOTTLE|CHARGER/.test(f)) (groups[m[1]] ||= {})[m[2].replace(/^D\d.*$/, 'D')] = u; }
  const first = Object.values(groups).find((g) => g['HERO-PDP']);
  const picks = first ? [first['HERO-PDP'], first['FDSQ'], first['RDSQ']].filter(Boolean) : [];
  if (!motor) miss.motor++; if (!wh) miss.wh++; if (!picks.length) miss.photo++;
  if (!price || !motor || !wh || !picks.length) { console.log('skip, data incomplete:', name, price, motor, wh, picks.length); continue; }
  const rrp = old && old > price ? old : price;
  if (DRY) { console.log('dry', name, '| EUR', price, old || '', '|', motor.slice(0, 40), torque + 'Nm', wh + 'Wh', '|', cat, '| photos', picks.length); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const gallery = [], logged = [];
  let n = 0;
  for (const url of picks) {
    let buf = null;
    for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(url + '?w=1600'); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } }
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
    logged.push({ file: `${slug}-${prefix}-${n}.webp`, source: url, page: 'https://www.specialized.com' + v.href, store: 'specialized.com/de', fetched: '2026-11-02' });
  }
  if (!gallery.length) continue;
  sources[slug] = logged;
  const gear = sp.derailleur.split(',')[0].trim();
  const weightKg = Number((sp.weight.match(/([\d.,]+)\s*kg/i) || [])[1]?.replace(',', '.')) || 0;
  const specs = { Motor: sp.motor, Akku: sp.akku.split(',').slice(0, 1).join(',') + (sp.akku.includes('Wh') ? '' : ''), ...(sp.display ? { Display: sp.display.split(',')[0] } : {}), ...(gear ? { Schaltung: gear } : {}), ...(sp.fork ? { Gabel: sp.fork.split(',')[0] } : {}), ...(sp.frame ? { Rahmen: sp.frame.split(',').slice(0, 2).join(',') } : {}), ...(sp.tires ? { Reifen: sp.tires.split(',')[0] } : {}), ...(weightKg ? { Gewicht: `${String(weightKg).replace('.', ',')} kg` } : {}) };
  out.push({
    id: slug, slug, name, brand: 'Specialized', category: cat,
    price: q2(price * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: gallery[0], gallery,
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear}` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von Specialized. Es hat den ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear}.` : ''}${sp.fork ? ` Gabel: ${sp.fork.split(',')[0]}.` : ''}${weightKg ? ` Gewicht laut Hersteller: ${String(weightKg).replace('.', ',')} kg.` : ''}`,
    options: {
      frameSizes: ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: [{ name: 'Farbe laut Abbildung, weitere nach Verfügbarkeit', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', price, '|', motor.slice(0, 40), torque + 'Nm', wh + 'Wh', '|', cat, '| photos', gallery.length);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-specialized.mjs from the manufacturer pages specialized.com/de/de (current price x 0.995, owner rule), 2026-11-02.\n// Photos: official studio photos, transparent background flattened to pure white (data/image-sources.json). Stock and delivery times need the owner's confirmation.\n`;
  fs.writeFileSync('lib/catalog-specialized.ts', `${header}\nexport const SPECIALIZED_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
