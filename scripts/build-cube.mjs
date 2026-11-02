// Builds lib/catalog-cube.ts and the product photos for Cube e-bike models that were not yet in the shop (.image-work/cube-models.json).
// Source: cube.eu/de-de (manufacturer: UVP incl. VAT, full specification block, official studio photo on white).
// price = UVP x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, white-background side view (S_00) only;
// the P_ photos have dark studio backgrounds and are rejected, colour variants are not added as extra photos.
// usage: node scripts/build-cube.mjs [prefix] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1';
const DRY = process.argv.includes('--dry');
const raw = JSON.parse(fs.readFileSync('.image-work/cube-models.json', 'utf8'));
const shop = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.brand === 'Cube').map((p) => p.name);
const q2 = (n) => Math.round(n * 100) / 100;
const TAGS = /\b(actionteam|artline|blackline)\b/gi;
// same normalisation as the gap check: shop names carry battery and wheel size, cube.eu names do not
const nk = (s) => s.toLowerCase().replace(/^cube /, '').replace(/\d{3}\s*wh\s*(2[79][,.]?\d?\s*zoll)?/g, '').replace(/\b(27,5|29)\s*zoll\b/g, '').replace(TAGS, '').replace(/[^a-z0-9]+/g, ' ').trim();
const shopKeys = new Set(shop.map(nk));

const CAT = { 'reaction-hybrid': 'E-MTB', 'stereo-hybrid': 'E-MTB', 'ams-hybrid': 'E-MTB', 'touring-hybrid': 'E-Trekking', 'kathmandu-hybrid': 'E-Trekking', 'nuride-hybrid': 'E-Trekking', 'editor-hybrid': 'E-City', 'nulane-hybrid': 'E-City', 'supreme-hybrid': 'E-City', 'aruba-hybrid': 'E-City', 's-pedelec': 'Speed-Pedelec', 'compact-hybrid': 'Falt-E-Bike', 'fold-hybrid': 'Falt-E-Bike', 'nuroad-hybrid': 'E-Gravel', 'cargo-hybrid': 'Cargo-E-Bike', 'longtail-hybrid': 'Cargo-E-Bike', 'trike-hybrid': 'Cargo-E-Bike' };
const CAT_DE = { 'E-MTB': 'E-Mountainbike', 'E-Trekking': 'Trekking E-Bike', 'E-City': 'City E-Bike', 'Falt-E-Bike': 'Falt-E-Bike', 'E-Gravel': 'E-Gravel-Bike', 'Cargo-E-Bike': 'Cargo E-Bike', 'Speed-Pedelec': 'Speed-Pedelec' };

const nice = (m) => m.replace(/\s+/g, ' ').trim();
const colourName = (c) => c.replace(/'n'/g, ' / ').replace(/´n´/g, ' / ').replace(/\b\w/g, (x) => x.toUpperCase());

function parse(text) {
  const L = text.split('\n').map((x) => x.trim()).filter(Boolean);
  const val = (label) => { const i = L.findIndex((x) => x.toLowerCase() === label.toLowerCase()); if (i < 0) return ''; let j = i + 1; while (L[j] && L[j].toLowerCase() === label.toLowerCase()) j++; return L[j] || ''; };
  const akkuI = L.findIndex((x, i) => x.toLowerCase() === 'akku' && /\d{3}/.test(L[i + 1] || ''));
  const akku = akkuI >= 0 ? L[akkuI + 1] : '';
  return {
    sizes: val('Größe'), fork: val('Federgabel'), motorRaw: val('Motor'), display: val('Display'), akku,
    brakes: val('Bremsanlage'), derailleur: val('Schaltwerk'), hub: val('Hinterrad Nabe') || val('Schaltnabe') || val('Getriebe') || val('Schalthebel'), cassette: val('Kassette'), tires: val('Reifen') || val('Hinterreifen'), weight: val('Gewicht'), frame: val('Rahmen'),
    avail: (text.match(/verfügbar ab [^\n]+/i) || [''])[0],
    uvp: Number((text.match(/UVP\*?\s*\n?\s*([\d.]+)\s*EUR/) || [])[1]?.replace(/\./g, '')) || 0
  };
}

// "Classic: 50cm, 54cm" -> sizes; "27.5: S // 29: M, L" -> "27,5 Zoll S", "29 Zoll M"; "Easy Entry Size Split: 26: 42cm // 28: 46cm" -> "Easy Entry 28 Zoll 46 cm"
function sizeOptions(s) {
  if (!s) return [];
  const sp = s.match(/^([A-Za-zÄÖÜäöü ]+):\s*Size Split:\s*(.*)$/i);
  let prefix = '';
  if (sp) { prefix = /^classic$/i.test(sp[1].trim()) ? '' : sp[1].trim(); s = sp[2]; } else prefix = ((s.match(/^([A-Za-zÄÖÜäöü ]+?)\s*(?=\d+\s*:)/) || [])[1] || '').trim();
  const out = [];
  for (const grp of s.split(/\s*\/\/\s*|;/)) {
    const w = grp.match(/^(?:[A-Za-zÄÖÜäöü ]+)?\s*([\d.]+)\s*:\s*(.+)$/);
    const p = grp.match(/^[^:]+:\s*(.+)$/);
    const wheel = w ? `${w[1].replace('.', ',')} Zoll` : '';
    const list = w ? w[2] : p ? p[1] : grp;
    for (const sz of list.split(',').map((x) => x.trim()).filter(Boolean)) out.push([w ? prefix : '', wheel, sz.replace(/(\d)cm/, '$1 cm')].filter(Boolean).join(' '));
  }
  return [...new Set(out)];
}

const picked = [];
const seenBatch = new Set();
for (const [key, m] of Object.entries(raw)) {
  const model = nice(m.model);
  const k = nk(model);
  if (shopKeys.has(k)) continue;
  const hasTag = TAGS.test(model); TAGS.lastIndex = 0;
  if (hasTag && Object.values(raw).some((o) => nk(nice(o.model)) === k && !TAGS.test(o.model))) { TAGS.lastIndex = 0; continue; }
  TAGS.lastIndex = 0;
  if (seenBatch.has(k)) continue;
  seenBatch.add(k);
  picked.push([key, m]);
}
console.log('cube.eu models:', Object.keys(raw).length, '| to add:', picked.length);

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
const miss = { motor: 0, wh: 0, display: 0, gear: 0, brakes: 0, fork: 0, tires: 0, sizes: 0, weight: 0 };
for (const [key, m] of picked) {
  const sp = parse(m.text);
  const name = `Cube ${nice(m.model).replace(TAGS, '').replace(/\s+/g, ' ').trim()}`;
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const cat = CAT[m.line.split('/').pop()];
  const catDe = CAT_DE[cat] || 'E-Bike';
  const motor = sp.motorRaw.split(',')[0].replace(/\bDrive Unit\b\s*/i, '').replace(/\s*max\.?\s*\d+\s*Nm/i, '').replace(/\s*\d+\s*Nm/i, '').replace(/\s*\(BDU\w+\)/i, '').replace(/\s+/g, ' ').trim();
  const torque = Number((sp.motorRaw.match(/(\d{2,3})\s*Nm/i) || [])[1]) || 0;
  const wh = Number((sp.akku.match(/(\d{3,4})/) || [])[1]) || 0;
  const gear = [sp.derailleur || sp.hub, sp.cassette].filter(Boolean).map((x) => x.split(',')[0].trim()).join(', ');
  const brakes = sp.brakes.split(',').slice(0, 2).join(',').trim();
  const fork = sp.fork.split(',')[0].trim();
  const travel = (sp.fork.match(/(\d{2,3})\s*mm/) || [])[1] || '';
  const tires = sp.tires.split(',')[0].trim();
  const frame = sp.frame.split(',').slice(0, 3).join(',').trim();
  const sizes = sizeOptions(sp.sizes);
  const colours = m.colours.filter(Boolean).map(colourName);
  if (!motor) miss.motor++; if (!wh) miss.wh++; if (!sp.display) miss.display++; if (!gear) miss.gear++; if (!brakes) miss.brakes++; if (!fork) miss.fork++; if (!tires) miss.tires++; if (!sizes.length) miss.sizes++; if (!sp.weight) miss.weight++;
  if (!sp.uvp || !motor || !wh || !cat) { console.log('skip, data incomplete:', name, sp.uvp, motor, wh, cat); continue; }
  const firstId = m.url.split('/').pop();
  const imgUrl = m.imgs.find((u) => new RegExp(`synqup_${firstId}_S_00\\.`).test(u));
  if (!imgUrl) { console.log('skip, no white side photo:', name); continue; }
  if (DRY) { console.log('dry', name, '| EUR', sp.uvp, '|', motor, torque + 'Nm', wh + 'Wh', '| sizes', sizes.join('/'), '| gear', gear, '|', sp.avail); continue; }

  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  let buf = null;
  for (let t = 0; t < 3 && !buf; t++) { try { const r = await fetch(imgUrl); if (r.ok) buf = Buffer.from(await r.arrayBuffer()); } catch { /* retry */ } }
  if (!buf) { console.log('download failed', imgUrl); continue; }
  for (const size of [1200, 600]) {
    const inner = Math.round(size * 0.92);
    const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const meta = await sharp(body).metadata();
    const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
    await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${slug}/${slug}-${prefix}-1.webp`;
  sources[slug] = [{ file: `${slug}-${prefix}-1.webp`, source: imgUrl, page: m.url, store: 'cube.eu/de-de', fetched: '2026-11-02' }];
  const specs = { Motor: `${motor}${torque ? `, ${torque} Nm` : ''}`, Akku: `${wh} Wh`, ...(sp.display ? { Display: sp.display } : {}), ...(gear ? { Schaltung: gear } : {}), ...(brakes ? { Bremsen: brakes } : {}), ...(fork ? { Gabel: travel ? `${fork.replace(/,?\s*\d+\s*mm$/, '')}, ${travel} mm Federweg` : fork } : {}), ...(frame ? { Rahmen: frame } : {}), ...(tires ? { Reifen: tires } : {}), ...(sp.weight ? { Gewicht: sp.weight } : {}) };
  const rrp = sp.uvp;
  const weightKg = Number((sp.weight.match(/([\d,]+)\s*kg/i) || [])[1]?.replace(',', '.')) || 0;
  out.push({
    id: slug, slug, name, brand: 'Cube', category: cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: 0, weightKg,
    image: img, gallery: [img],
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gear ? `, ${gear.split(',')[0]}` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von Cube. Es hat den ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku.${gear ? ` Geschaltet wird mit ${gear.split(',')[0]}.` : ''}${fork ? ` Die Federgabel ist eine ${fork.replace(/,?\s*\d+\s*mm$/, '')}${travel ? ` mit ${travel} mm Federweg` : ''}.` : ''}${sp.weight ? ` Gewicht laut Hersteller: ${sp.weight}.` : ''}${sp.avail ? ` Laut Hersteller ist es ${sp.avail.replace(/^verfügbar/i, 'verfügbar')}.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'],
      batteries: [{ label: `Akku ${wh} Wh`, capacityWh: wh, priceDelta: 0 }],
      colors: colours.length ? colours.map((c) => ({ name: c, hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', rrp, '|', motor, torque + 'Nm', wh + 'Wh', '|', cat, '| sizes', sizes.length, '| colours', colours.length);
}
console.log('missing fields:', JSON.stringify(miss));
if (!DRY) {
  const header = `import type { Product } from './types';\n\n// Generated by scripts/build-cube.mjs from the manufacturer pages cube.eu/de-de (price = UVP x 0.995, owner rule), 2026-11-02.\n// Photos: official white-background side view (data/image-sources.json). Stock and delivery times need the owner's confirmation.\n`;
  fs.writeFileSync('lib/catalog-cube.ts', `${header}\nexport const CUBE_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('written:', out.length, 'products');
}
