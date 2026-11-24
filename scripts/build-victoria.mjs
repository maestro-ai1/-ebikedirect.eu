// Builds lib/catalog-victoria.ts and the product photos for Victoria e-bike models from .image-work/gen-victoria.json (written by .image-work/_victoria-scrape.cjs).
// Source: victoria-bikes.com (manufacturer: price marked * = UVP incl. VAT, full specification list, studio photo on white).
// price = UVP x 0.995 (owner rule). One entry per model number (Diamant frame preferred, Wave when that is the only form). Image Rule: pure white 1200x1200 WebP + 600.
// Descriptions are written from the facts. usage: node scripts/build-victoria.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/gen-victoria.json', 'utf8'));
const q2 = (n) => Math.round(n * 100) / 100;
const CAT_DE = { 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'E-MTB': 'E-Mountainbike', 'Falt-E-Bike': 'Falt-E-Bike' };
const brandCase = (s) => s.replace(/\bBOSCH\b/g, 'Bosch').replace(/\bSHIMANO\b/g, 'Shimano').replace(/\bROCKSHOX\b/g, 'RockShox').replace(/\bMAXXIS\b/g, 'Maxxis').replace(/\bSCHWALBE\b/g, 'Schwalbe').replace(/\bSUNTOUR\b/g, 'SR Suntour').replace(/\bMAGURA\b/g, 'Magura').replace(/\bCONTINENTAL\b/g, 'Continental').replace(/\bSRAM\b/g, 'SRAM').replace(/\bENVIOLO\b/g, 'Enviolo').replace(/\bGATES\b/g, 'Gates');
const clean = (s) => brandCase(String(s || '').replace(/"/g, '').replace(/\s+/g, ' ').trim());
const title = (s) => s.split(/\s+/).map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(' ');
const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { motor: 0, wh: 0, display: 0, gear: 0, brakes: 0, fork: 0, tires: 0, weight: 0 };
const seen = new Set();
const seenBase = new Set();
// a weight that is identical for four or more models of one series is series-level data, not a per-model fact: left out
const wcount = {};
for (const m of raw) { const w = m.attrs['Gewicht'] || ''; wcount[m.series + '|' + w] = (wcount[m.series + '|' + w] || 0) + 1; }
for (const m of raw) {
  const a = m.attrs;
  const base = title(m.name.replace(/\s+(Unisex\s+)?(Diamant|Wave|Trapez)\b.*$/i, '').replace(/\s+Unisex\b.*$/i, '').trim());
  if (seenBase.has(m.series + '|' + base)) continue; seenBase.add(m.series + '|' + base);
  let nm = `Victoria ${base}`;
  if (/^wave$/i.test(m.form)) nm += ' Wave';
  const slug = nm.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (seen.has(slug)) continue; seen.add(slug);
  const motor = clean(a['Motor']).split(',')[0].replace(/\s+BES\d\b/i, '').replace(/\s+\d{2,3}\s*Nm.*$/i, '').replace(/\bDrive Unit\s+/i, '').replace(/\s+Gen\.?\s*\d\b/i, '').trim();
  const wh = Number(((a['Akkukapazität'] || '').match(/(\d{3,4})/) || [])[1]) || Number(((a['Akku'] || '').match(/(\d{3,4})\s*Wh/i) || [])[1]) || 0;
  const display = clean(a['Display']);
  const gearMain = clean(a['Schaltwerk']).split(',').slice(0, 2).join(',').trim();
  const gear = (gearMain || clean(a['Schaltungsmodell'] || a['Schaltungsart'])) + (a['Gänge'] && !/-fach|gang/i.test(gearMain) ? `, ${a['Gänge']}` : '');
  const brakeRaw = clean(a['Bremse V.R.']).split(',')[0];
  const brakeModel = (brakeRaw.match(/BR-[A-Z0-9]+/) || [])[0];
  const brakeName = brakeModel ? `${(brakeRaw.match(/^(\w+)/) || [])[1] || ''} ${brakeModel}`.trim() : brakeRaw.replace(/\s+SM-[A-Z0-9-]+.*$/, '');
  const brakes = [brakeName, a['Bremssystem']].filter(Boolean).join(', ');
  const forkRaw = clean(a['Gabel']);
  const fork = forkRaw.replace(/,?\s*\d+\s*mm.*$/i, '').replace(/,\s*\d{2}[,.]?\d?"?$/, '').trim();
  const travel = a['Gabelfederweg'] || (forkRaw.match(/(\d{2,3})\s*mm/) || [])[0] || '';
  const tires = clean(a['Reifen V.R.']).split(',')[0];
  const wheel = (a['Laufradgröße'] || '').replace('"', ' Zoll');
  const frameMat = clean(a['Rahmen']).split(',').pop().trim();
  const frame = [frameMat, /^wave$/i.test(m.form) ? 'Wave-Rahmen (Tiefeinstieg)' : ''].filter(Boolean).join(', ');
  const weightText = wcount[m.series + '|' + (a['Gewicht'] || '')] >= 4 ? '' : (a['Gewicht'] || '').replace(/,00\s*kg/, ' kg').replace(/(\d),(\d)0\s*kg/, '$1,$2 kg');
  const weightKg = Number((weightText.match(/([\d.,]+)\s*kg/i) || [])[1]?.replace(',', '.')) || 0;
  if (!motor) miss.motor++; if (!wh) miss.wh++; if (!display) miss.display++; if (!gear) miss.gear++; if (!brakes) miss.brakes++; if (!fork) miss.fork++; if (!tires) miss.tires++; if (!weightKg) miss.weight++;
  const imgUrl = m.listImg || m.gallery.find((u) => /\.jpg$/i.test(u));
  if (!m.uvp || !motor || !wh || !imgUrl) { console.log('skip, data incomplete:', nm, m.uvp, motor, wh, !!imgUrl); continue; }
  m.cat = a['Kategorie'] === 'Faltrad' ? 'Falt-E-Bike' : a['Kategorie'] === 'Urbanbike' ? 'E-City' : m.cat;
  const catDe = CAT_DE[m.cat] || 'E-Bike';
  const colour = clean(a['Farbbezeichnung']);
  if (DRY) { console.log('dry', nm, '| EUR', m.uvp, '|', motor, wh + 'Wh', '|', m.cat, '| gear', gear, '| brakes', brakes, '| fork', fork, travel, '| kg', weightKg, '| colour', colour); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  let buf = null;
  for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(imgUrl); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } }
  if (!buf) { console.log('download failed', imgUrl); continue; }
  // some studio photos carry a header strip (logo, "MODEL / COLOR" text) in the top 10%: cropped off every photo (image rule: no logos or captions)
  { const mt = await sharp(buf).metadata(); const cut = Math.round(mt.height * 0.13); buf = await sharp(buf).extract({ left: 0, top: cut, width: mt.width, height: mt.height - cut }).toBuffer(); }
  for (const size of [1200, 600]) {
    const inner = Math.round(size * 0.92);
    const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const meta = await sharp(body).metadata();
    const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
    await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${slug}/${slug}-${prefix}-1.webp`;
  sources[slug] = [{ file: `${slug}-${prefix}-1.webp`, source: imgUrl, page: m.page, store: 'victoria-bikes.com', fetched: '2026-11-24' }];
  const specs = { Motor: motor, Akku: `${wh} Wh`, ...(display ? { Display: display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(brakes ? { Bremsen: brakes } : {}), ...(fork ? { Gabel: travel ? `${fork}, ${travel} Federweg` : fork } : {}), ...(frame ? { Rahmen: frame } : {}), ...(tires ? { Reifen: wheel ? `${tires}, ${wheel}` : tires } : {}), ...(weightText ? { Gewicht: weightText } : {}) };
  const rrp = m.uvp;
  out.push({
    id: slug, slug, name: nm, brand: 'Victoria', category: m.cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: 0, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: img, gallery: [img],
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear.split(',')[0]}` : ''}.`,
    description: `Das ${nm} ist ein ${catDe} von Victoria. Es hat den ${motor} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear.split(',')[0]}.` : ''}${brakes ? ` Gebremst wird mit ${brakes}.` : ''}${fork ? ` Die Gabel ist eine ${fork}${travel ? ` mit ${travel} Federweg` : ''}.` : ''}${weightText ? ` Gewicht laut Hersteller: ${weightText}.` : ''}`,
    options: {
      frameSizes: ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: [{ name: colour || 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', nm, '| EUR', rrp, '|', motor, wh + 'Wh', '|', m.cat);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-victoria.mjs from the manufacturer site victoria-bikes.com (price = UVP x 0.995, owner rule), 2026-11-24.\n// Photos: official studio view on white (data/image-sources.json). Stock and delivery times are confirmed by the owner.\n`;
  fs.writeFileSync('lib/catalog-victoria.ts', `${header}\nexport const VICTORIA_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
