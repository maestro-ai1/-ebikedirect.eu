// Builds lib/catalog-orbea.ts and the product photos for Orbea e-MTB models (season 2026/2027) that were not yet in the shop (.image-work/orbea-mount7.json).
// Source: mount7.com (specialist retailer: full specification table, manufacturer list price "UVP", studio photos; orbea.com blocks automated access).
// price = UVP x 0.995 (owner rule). When mount7 shows no "ehem. UVP" and a whole-euro price, that price is the list price itself.
// Image Rule: pure white 1200x1200 WebP + 600, one side view of the first colourway (no colour duplicates).  usage: node scripts/build-orbea.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/orbea-mount7.json', 'utf8'));
const shop = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'Orbea').map((p) => p.name);
const q2 = (n) => Math.round(n * 100) / 100;
const eurNum = (s) => Number(String(s || '').replace(/\./g, '').replace(',', '.')) || 0;
const nk = (s) => s.toLowerCase().replace(/^orbea /, '').replace(/\s*-\s*20\d\d$/, '').replace(/(\d{3})\s*wh\b/g, '$1w').replace(/[^a-z0-9]+/g, ' ').trim();
const shopKeys = new Set(shop.map(nk));

function parse(v) {
  const L = v.spec.split('\n').map((x) => x.trim());
  const val = (label) => { const i = L.findIndex((x) => x === label); return i < 0 ? '' : L[i + 1] || ''; };
  const sub = (label) => { const l = L.find((x) => x.startsWith(label + ':')); return l ? l.slice(label.length + 1).trim() : ''; };
  const uvpStated = eurNum((v.price.match(/ehem\.\s*UVP\s*([\d.]+(?:,\d+)?)\s*€/) || [])[1]);
  const now = (v.price.match(/nur\s*\n?\s*([\d.]+(?:,\d+)?)\s*€/) || [])[1];
  const nowNum = eurNum(now);
  const uvp = uvpStated || (Number.isInteger(nowNum) && !/Du sparst\s*\n?\s*[\d.]+/.test(v.price) ? nowNum : 0);
  return {
    uvp, motor: val('Motor'), torque: Number((sub('Drehmoment').match(/(\d{2,3})/) || [])[1]) || 0, wh: Number(((sub('Akkukapazität') || sub('Akkugröße') || val('Akku')).match(/(\d{3,4})\s*Wh/i) || sub('Akkukapazität').match(/(\d{3,4})/) || [])[1]) || 0,
    derailleur: val('Schaltwerk'), gears: val('Gänge'), brakes: val('Bremsen'), fork: val('Gabel'), forkTravel: sub('Gabel-Federweg'), rearTravel: sub('Federweg hinten'), frame: sub('Rahmenmaterial'), wheel: sub('Laufradgröße'), tires: val('Reifen'), control: val('Bedieneinheit')
  };
}

const picked = [];
const seen = new Set();
for (const v of Object.values(raw)) {
  const name = `Orbea ${(v.name || '').replace(/^Orbea\s+/, '').replace(/\s*-\s*20\d\d$/, '').replace(/\bH-TEAM\b/, 'H-Team').replace(/\bM-TEAM\b/, 'M-Team').replace(/\bM-LTD\b/, 'M-LTD').trim()}`;
  if (shopKeys.has(nk(name)) || seen.has(nk(name))) continue;
  seen.add(nk(name));
  picked.push({ name, v });
}
console.log('mount7 orbea pages:', Object.keys(raw).length, '| to add:', picked.length);

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
for (const { name, v } of picked) {
  const sp = parse(v);
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const motor = sp.motor.replace(/\s*\([^)]*\)/g, '').replace(/\s+MC\b/, '').trim();
  if (!sp.wh) sp.wh = Number((v.spec.match(/(\d{3,4})\s?Wh/i) || [])[1]) || 0;
  const side = v.imgs.filter((u) => /\/master\/product\/1\/[^/]*side[^/]*\.jpg$/i.test(u))[0] || v.imgs.filter((u) => /side[^/]*\.jpg$/i.test(u))[0];
  const sizes = [...new Set((v.variants || []).map((x) => x.s).filter(Boolean))];
  const colours = [...new Set((v.variants || []).map((x) => x.c).filter(Boolean))];
  if (!sp.uvp || !motor || !sp.wh || !side) { console.log('skip, data incomplete:', name, 'uvp', sp.uvp, motor, sp.wh, !!side); continue; }
  if (DRY) { console.log('dry', name, '| EUR', sp.uvp, '|', motor, sp.torque + 'Nm', sp.wh + 'Wh', '| sizes', sizes.join('/'), '| colours', colours.length, '|', side.replace(/^.*\//, '')); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  let buf = null;
  for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(side); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } }
  if (!buf) { console.log('download failed', side); continue; }
  for (const size of [1200, 600]) {
    const inner = Math.round(size * 0.92);
    const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const meta = await sharp(body).metadata();
    const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
    await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${slug}/${slug}-${prefix}-1.webp`;
  sources[slug] = [{ file: `${slug}-${prefix}-1.webp`, source: side, page: 'https://www.mount7.com/' + v.u, store: 'mount7.com', fetched: '2026-11-02' }];
  const gear = [sp.derailleur, sp.gears ? `${sp.gears}-fach` : ''].filter(Boolean).join(', ');
  const travel = [sp.forkTravel && `${sp.forkTravel.replace(/\s*mm/, '')} mm vorn`, sp.rearTravel && `${sp.rearTravel.replace(/\s*mm/, '')} mm hinten`].filter(Boolean).join(', ');
  const specs = { Motor: `${motor}${sp.torque ? `, ${sp.torque} Nm` : ''}`, Akku: `${sp.wh} Wh`, ...(sp.control ? { Bedieneinheit: sp.control } : {}), ...(gear ? { Schaltung: gear } : {}), ...(sp.brakes ? { Bremsen: sp.brakes } : {}), ...(sp.fork ? { Gabel: sp.fork } : {}), ...(travel ? { Federweg: travel } : {}), ...(sp.frame ? { Rahmen: sp.frame } : {}), ...(sp.tires ? { Reifen: sp.tires } : {}), ...(sp.wheel ? { Laufradgröße: sp.wheel } : {}) };
  out.push({
    id: slug, slug, name, brand: 'Orbea', category: 'E-MTB',
    price: q2(sp.uvp * 0.995), originalPrice: sp.uvp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: sp.torque, batteryStandardWh: sp.wh, rangeKm: 0, weightKg: 0,
    image: img, gallery: [img],
    shortDescription: `E-Mountainbike mit ${motor}, ${sp.wh} Wh Akku${sp.derailleur ? `, ${sp.derailleur}` : ''}.`,
    description: `Das ${name} ist ein E-Mountainbike von Orbea. Es hat den ${motor}${sp.torque ? ` mit ${sp.torque} Nm Drehmoment` : ''} und einen ${sp.wh} Wh Akku.${sp.derailleur ? ` Geschaltet wird mit ${gear}.` : ''}${sp.fork ? ` Gabel: ${sp.fork}${sp.forkTravel ? `, ${sp.forkTravel} Federweg` : ''}.` : ''}${sp.frame ? ` Rahmenmaterial: ${sp.frame}.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${sp.wh} Wh`, capacityWh: sp.wh, priceDelta: 0 }],
      colors: colours.length ? colours.slice(0, 6).map((c) => ({ name: c, hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', sp.uvp, '|', motor, sp.torque + 'Nm', sp.wh + 'Wh', '| sizes', sizes.length, '| colours', colours.length);
}
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-orbea.mjs from mount7.com (retailer; price = manufacturer list price UVP x 0.995, owner rule), season 2026/2027, 2026-11-02.\n// Photos: studio side view (data/image-sources.json). Stock and delivery times need the owner's confirmation.\n`;
  fs.writeFileSync('lib/catalog-orbea.ts', `${header}\nexport const ORBEA_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
