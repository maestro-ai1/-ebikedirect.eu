// Builds lib/catalog-tenways.ts and the product photos from the Tenways feed.
// Run after: node scripts/import-tenways.mjs fetch  (and after the contact sheets were reviewed)
// node scripts/build-tenways.mjs v1
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { loadFeed, BIKES, ACCESSORIES } from './import-tenways.mjs';

const prefix = process.argv[2] || 'v1';

// Chosen on the contact sheets: white studio shots only, no lifestyle or cropped close-ups.
const PICK = {
  'tenways-ago-air': [2, 3, 4], 'tenways-ago-performance': [1, 2, 3], 'tenways-ago-x': [2, 3, 4], 'tenways-ago-t': [1, 2, 3],
  'tenways-cargo-one': [1, 2, 4], 'tenways-cgo-compact': [1, 2, 3], 'tenways-cgo009': [1, 2, 3], 'tenways-cgo600': [2, 3, 4], 'tenways-cgo800s': [1, 2, 3],
  'abus-iven-kettenschloss-140-cm': [1], 'abus-iven-kettenschloss-85-cm': [1], 'abus-rahmenschloss': [1], 'abus-faltschloss': [1],
  'tenways-universal-handyhalterung': [1, 2], 'tenways-eh20-smart-helm': [1, 2, 3], 'tenways-elektrische-luftpumpe': [1, 2, 3],
  'tenways-gepaecktasche': [1, 2], 'tenways-gepaecktasche-m': [1], 'tenways-gepaecktasche-l': [1], 'tenways-huefttasche': [1],
  'tenways-regenschutz': [1], 'tenways-kindersitz-mik-hd': [1],
  'tenways-cgo009-gepaecktraeger-hinten': [1, 2], 'tenways-cgo009-gepaecktraeger-vorne': [1, 3], 'tenways-cgo-compact-gepaecktraeger-hinten': [1],
  'tenways-ago-air-gepaecktraeger': [1], 'tenways-ago-x-gepaecktraeger-hinten': [1], 'tenways-cgo600-gepaecktraeger': [1, 2],
  'tenways-cgo600-schutzbleche': [1, 2], 'tenways-ago-air-schutzbleche': [1], 'tenways-cgo009-schutzbleche': [1, 2], 'tenways-ago-x-schutzbleche': [1],
  'tenways-cgo600-seitenstaender': [1, 2], 'tenways-ago-air-seitenstaender': [1], 'tenways-cgo009-seitenstaender': [1, 2],
};

// Bikes: curated facts only (taken from the product pages); everything else stays empty and the shop hides it.
const BIKE_DATA = {
  'ago-performance': { name: 'Tenways AGO Performance', cat: 'E-City', motor: 'Bosch Performance Line', wh: 540, nm: 0, km: 0, kg: 0, short: 'Urban E-Bike mit Bosch Performance Line Motor, 540 Wh Bosch PowerTube Akku, Gates Riemenantrieb und stufenloser Enviolo Nabe.', specs: { 'Motor': 'Bosch Performance Line Mittelmotor', 'Akku': 'Bosch PowerTube, 540 Wh', 'Antrieb': 'Gates CDX Carbon Riemen', 'Schaltung': 'Enviolo stufenlose Nabenschaltung' } },
  'ago-air': { name: 'Tenways AGO AIR', cat: 'E-City', motor: 'Mittelmotor, 80 Nm', wh: 560, nm: 80, km: 0, kg: 0, short: 'Leichtes Urban E-Bike mit 80 Nm Mittelmotor, 560 Wh Wechselakku, Federgabel und hydraulischen Scheibenbremsen.', specs: { 'Motor': 'Mittelmotor, 80 Nm', 'Akku': '560 Wh, herausnehmbar', 'Gabel': 'Federgabel', 'Display': 'Smart LCD Display', 'Bremsen': 'Hydraulische Scheibenbremsen', 'Antrieb': 'Kette oder Riemen je nach Variante' } },
  'ago-x': { name: 'Tenways AGO X', cat: 'E-Trekking', motor: 'Mittelmotor, 80 Nm', wh: 0, nm: 80, km: 100, kg: 0, short: 'Trekking E-Bike mit 80 Nm Mittelmotor, Wechselakku, Shimano 10-Gang Schaltung und hydraulischen Scheibenbremsen.', specs: { 'Motor': 'Mittelmotor, 80 Nm', 'Akku': 'Herausnehmbar', 'Schaltung': 'Shimano 10-Gang', 'Gabel': 'Hydraulische Federgabel', 'Bremsen': 'Hydraulische Scheibenbremsen', 'Reichweite': 'bis 100 km (Herstellerangabe)' } },
  'ago-t': { name: 'Tenways AGO T', cat: 'E-Trekking', motor: 'Mittelmotor, 80 Nm', wh: 504, nm: 80, km: 0, kg: 0, short: 'Trekking E-Bike mit 80 Nm Mittelmotor, 504 Wh Wechselakku, Gates Riemenantrieb und stufenloser Enviolo Nabe.', specs: { 'Motor': 'Mittelmotor, 80 Nm', 'Akku': '504 Wh, herausnehmbar', 'Antrieb': 'Gates Carbon Riemen', 'Schaltung': 'Enviolo stufenlose Nabenschaltung', 'Gabel': 'Federgabel mit Lockout', 'Bremsen': 'Hydraulische Scheibenbremsen' } },
  'cgo009': { name: 'Tenways CGO009', cat: 'E-City', motor: 'TENWAYS C9 Motor', wh: 0, nm: 0, km: 0, kg: 0, short: 'Urban E-Bike mit Gates Riemenantrieb, magnetischem Drehmomentsensor, Wechselakku und Smart Connect Modul.', specs: { 'Motor': 'TENWAYS C9 Motor', 'Antrieb': 'Gates Carbon Riemen', 'Sensor': 'Magnetischer Drehmomentsensor', 'Akku': 'Herausnehmbar', 'App': 'Smart Connect Modul mit Benachrichtigungen' } },
  'cgo-compact': { name: 'Tenways CGO COMPACT', cat: 'E-City', motor: 'TENWAYS C9 Nabenmotor', wh: 500, nm: 0, km: 0, kg: 0, short: 'Kompaktes E-Bike mit 500 Wh Wechselakku, Gates Riemenantrieb, MIK HD Gepäckträger und hydraulischen Scheibenbremsen.', specs: { 'Motor': 'TENWAYS C9 Nabenmotor', 'Akku': '500 Wh, herausnehmbar', 'Antrieb': 'Gates Carbon Riemen', 'Gepäckträger': 'MIK HD Hinterradträger', 'Vorbau': 'Byschulz Speedlifter Twist', 'Bremsen': 'Hydraulische Scheibenbremsen' } },
  'cgo600': { name: 'Tenways CGO600', cat: 'E-City', motor: 'Hinterradnabenmotor', wh: 0, nm: 0, km: 70, kg: 15, short: 'Leichtes Urban E-Bike mit 15 kg, Gates Riemenantrieb, magnetischem Drehmomentsensor und Hinterradnabenmotor.', specs: { 'Gewicht': '15 kg (Herstellerangabe)', 'Motor': 'Hinterradnabenmotor', 'Antrieb': 'Carbon Riemen', 'Sensor': 'Magnetischer Drehmomentsensor', 'Reichweite': 'bis 70 km (Herstellerangabe)' } },
  'cgo800s': { name: 'Tenways CGO800S', cat: 'E-City', motor: 'Hinterradnabenmotor', wh: 0, nm: 0, km: 100, kg: 0, short: 'E-Bike mit tiefem Einstieg, Wechselakku, magnetischem Drehmomentsensor, Federgabel und Hinterradnabenmotor.', specs: { 'Rahmen': 'Tiefeinsteiger', 'Motor': 'Hinterradnabenmotor', 'Sensor': 'Magnetischer Drehmomentsensor', 'Gabel': 'Federgabel', 'Akku': 'Herausnehmbar', 'Reichweite': 'bis 100 km (Herstellerangabe)' } },
  'cargo-one': { name: 'Tenways CARGO ONE', cat: 'Cargo-E-Bike', motor: 'Mittelmotor', wh: 960, nm: 0, km: 0, kg: 0, short: 'Cargo E-Bike mit extragroßer Transportbox, 960 Wh Wechselakku, Gates CDX Riemen und stufenloser Enviolo Nabe.', specs: { 'Motor': 'Mittelmotor', 'Akku': '960 Wh, herausnehmbar', 'Antrieb': 'Gates CDX Carbon Riemen', 'Schaltung': 'Enviolo stufenlose Nabenschaltung', 'Transport': 'Extragroße Cargo-Box mit Seitenlichtern' } },
};

// Accessories: German name, what it fits, plain description built from the product type.
const ACC_DATA = {
  'abus-chain-lock-iven-8210-140': ['ABUS IVEN Kettenschloss 8210, 140 cm', 'Universal', 'Kettenschloss mit 140 cm Länge zum Sichern von Rahmen und Laufrad an einem festen Gegenstand.', { 'Länge': '140 cm' }],
  'abus-iven-chain-lock-8210-85cm': ['ABUS IVEN Kettenschloss 8210, 85 cm', 'Universal', 'Kettenschloss mit 85 cm Länge, handlich für Rahmen und Laufrad am Fahrradständer.', { 'Länge': '85 cm' }],
  'abus-ring-lock': ['ABUS Rahmenschloss', 'Universal', 'Rahmenschloss, das am Hinterbau montiert wird und das Hinterrad mit einer Bewegung sperrt.', {}],
  'abus-foldable-lock': ['ABUS Faltschloss', 'Universal', 'Faltschloss aus Stahlgliedern, zusammengeklappt kompakt zu verstauen.', {}],
  'tenways-universal-phone-mount': ['Tenways Universal Handyhalterung', 'Universal, alle Modelle', 'Handyhalterung für den Lenker, passend für verschiedene Smartphones.', {}],
  'eh20-smart-helmet': ['Tenways EH20 Smart Helm', 'Universal', 'Fahrradhelm mit integrierter Beleuchtung vorn und hinten für bessere Sichtbarkeit im Stadtverkehr.', {}],
  'tenways-electric-air-pump': ['Tenways Elektrische Luftpumpe', 'Universal', 'Kompakte Akku-Luftpumpe mit Display zum schnellen Aufpumpen von Fahrradreifen.', {}],
  'pannier-bag': ['Tenways Gepäcktasche', 'Universal', 'Wasserdichte Gepäckträgertasche zum Transport von Einkauf und Arbeitsgepäck.', {}],
  'tenways-m-pannier-bag': ['Tenways Gepäcktasche M', 'Universal', 'Wasserdichte Gepäckträgertasche in Größe M.', { 'Größe': 'M' }],
  'tenways-l-pannier-bag': ['Tenways Gepäcktasche L', 'Universal', 'Wasserdichte Gepäckträgertasche in Größe L für mehr Stauraum.', { 'Größe': 'L' }],
  'waist-bag-blue': ['Tenways Hüfttasche', 'Universal', 'Hüfttasche für Schlüssel, Handy und Kleinigkeiten unterwegs.', {}],
  'rain-cover': ['Tenways Regenschutz für Cargo E-Bike', 'Tenways CARGO ONE', 'Regenverdeck für die Transportbox des Cargo E-Bikes mit transparenten Seitenfenstern.', {}],
  'tenways-child-seat-mik-hd': ['Tenways Kindersitz MIK HD', 'Gepäckträger mit MIK HD Aufnahme', 'Kindersitz für Gepäckträger mit MIK HD Aufnahme.', {}],
  'cgo009-rear-carrier': ['Tenways CGO009 Gepäckträger hinten', 'Tenways CGO009', 'Hinterer Gepäckträger für das Tenways CGO009.', {}],
  'cgo009-new-edition-front-carrier': ['Tenways CGO009 Frontgepäckträger', 'Tenways CGO009 New Edition', 'Frontgepäckträger für das Tenways CGO009 New Edition.', {}],
  'cgo-compact-rear-carrier-with-mik-hd': ['Tenways CGO COMPACT Gepäckträger hinten', 'Tenways CGO COMPACT', 'Hinterer Gepäckträger mit MIK HD Aufnahme für das Tenways CGO COMPACT.', {}],
  'ago-air-rear-carrier': ['Tenways AGO AIR Gepäckträger', 'Tenways AGO AIR', 'Hinterer Gepäckträger mit Rücklicht für das Tenways AGO AIR.', {}],
  'ago-x-rear-carrier-with-mik-hd': ['Tenways AGO X Gepäckträger hinten', 'Tenways AGO X', 'Hinterer Gepäckträger mit MIK HD Aufnahme für das Tenways AGO X.', {}],
  'cgo600-pro-rear-carrier': ['Tenways CGO600 Gepäckträger', 'Tenways CGO600 und CGO600 Pro', 'Gepäckträger für das Tenways CGO600 und CGO600 Pro.', {}],
  'mudguards': ['Tenways CGO600 Schutzbleche', 'Tenways CGO600', 'Schutzblech-Set für das Tenways CGO600.', {}],
  'ago-air-mudguards': ['Tenways AGO AIR Schutzbleche', 'Tenways AGO AIR', 'Schutzblech-Set für das Tenways AGO AIR.', {}],
  'cgo009-mudguards': ['Tenways CGO009 Schutzbleche', 'Tenways CGO009', 'Schutzblech-Set für das Tenways CGO009.', {}],
  'ago-x-special-edition-mudguards': ['Tenways AGO X Schutzbleche', 'Tenways AGO X', 'Schutzblech-Set für das Tenways AGO X.', {}],
  'kickstand': ['Tenways CGO600 Seitenständer', 'Tenways CGO600 und CGO600 Pro', 'Seitenständer für das Tenways CGO600 und CGO600 Pro.', {}],
  'ago-air-kickstand': ['Tenways AGO AIR Seitenständer', 'Tenways AGO AIR', 'Seitenständer für das Tenways AGO AIR.', {}],
  'cgo009-kickstand': ['Tenways CGO009 Seitenständer', 'Tenways CGO009', 'Seitenständer für das Tenways CGO009.', {}],
};

const HEX = [[/black|midnight|schwarz/i, '#1C1C1E'], [/white|pearl|ivory/i, '#ECECEC'], [/red|velvet/i, '#A32A2A'], [/walnut|brown/i, '#6B4A32'], [/mineral|sky|blue/i, '#5C7C99'], [/green|olive|moss|sage|jungle/i, '#6B7F5E'], [/silver|starlight|grey|gray|slate/i, '#9AA0A6'], [/beige|sandstone|sand/i, '#C9B79C'], [/mint/i, '#9ADBC1']];
const hexOf = (n) => (HEX.find(([re]) => re.test(n)) || [0, '#888888'])[1];
const q2 = (n) => Math.round(n * 100) / 100;

async function whiten(file, crop) {
  let img = sharp(file).flatten({ background: '#ffffff' });
  const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => { const i = (y * info.width + x) * info.channels; return (data[i] + data[i + 1] + data[i + 2]) / 3; };
  // sample inside the picture (rounded studio cards have white corners): median of four inset points
  const w = info.width, h = info.height;
  const samples = [px(Math.round(w * 0.12), Math.round(h * 0.12)), px(Math.round(w * 0.88), Math.round(h * 0.12)), px(Math.round(w * 0.12), Math.round(h * 0.88)), px(Math.round(w * 0.88), Math.round(h * 0.88))].sort((a, b) => a - b);
  const avg = (samples[1] + samples[2]) / 2;
  if (crop) {
    const cw = Math.round(info.width * 0.24), ch = Math.round(info.height * 0.24);
    const white = await sharp({ create: { width: cw, height: ch, channels: 3, background: '#ffffff' } }).png().toBuffer();
    img = sharp(await img.clone().composite([{ input: white, left: 0, top: 0 }]).png().toBuffer());
  }
  if (avg > 185 && avg < 252) img = img.linear(255 / avg, 0); // light grey studio background -> pure white
  return img;
}

const feed = await loadFeed();
const by = Object.fromEntries(feed.map((p) => [p.handle, p]));
const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const manifest = JSON.parse(fs.readFileSync('.image-work/tenways.json', 'utf8'));
const out = [];

async function place(slug) {
  const dir = path.join('public', 'products', slug);
  fs.mkdirSync(dir, { recursive: true });
  const names = [];
  const picks = PICK[slug];
  for (let i = 0; i < picks.length; i++) {
    const cand = fs.readdirSync(path.join('.image-work/cand', slug)).find((f) => parseInt(f) === picks[i]);
    const src = path.join('.image-work/cand', slug, cand);
    for (const size of [1200, 600]) {
      const base = (await whiten(src, slug.startsWith('abus-'))).resize(size, size, { fit: 'contain', background: '#ffffff' });
      await base.webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-${i + 1}${size === 600 ? '-600' : ''}.webp`));
    }
    names.push(`/products/${slug}/${slug}-${prefix}-${i + 1}.webp`);
    const m = manifest[slug].find((x) => x.n === picks[i]);
    (sources[slug] ||= []).push({ file: `${slug}-${prefix}-${i + 1}.webp`, source: m?.url, store: 'tenways.com', fetched: '2026-10-31' });
  }
  return names;
}

function optionsOf(p, isBike) {
  const find = (re) => p.options.find((o) => re.test(o.name));
  const colorOpt = find(/colou?r/i);
  const sizeOpt = find(/size|größe/i);
  const colors = (colorOpt ? [...new Set(colorOpt.values)] : []).slice(0, 6).map((n) => ({ name: n, hex: hexOf(n) }));
  const sizes = sizeOpt ? [...new Set(sizeOpt.values)] : [];
  return {
    frameSizes: sizes.length ? sizes : isBike ? ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'] : ['Einheitsgröße'],
    colors: colors.length ? colors : [{ name: isBike ? 'Standard' : 'Schwarz', hex: '#1C1C1E' }],
  };
}

function priceOf(p) {
  const av = p.variants.filter((v) => v.available);
  const vs = av.length ? av : p.variants;
  const price = Math.min(...vs.map((v) => Number(v.price)));
  const rrp = Math.max(price, ...vs.map((v) => Number(v.compare_at_price) || 0));
  return { price: q2(rrp * 0.995), rrp };
}

for (const [handle, slug] of Object.entries(BIKES)) {
  const p = by[handle]; const d = BIKE_DATA[handle];
  const { price, rrp } = priceOf(p);
  const imgs = await place(slug);
  const o = optionsOf(p, true);
  out.push({
    id: slug, slug, name: d.name, brand: 'Tenways', category: d.cat, price, originalPrice: rrp > price ? rrp : undefined,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: d.motor, torqueNm: d.nm, batteryStandardWh: d.wh, rangeKm: d.km, weightKg: d.kg,
    image: imgs[0], gallery: imgs, shortDescription: d.short,
    description: `${d.short} Rahmengröße und Farbe wählen Sie bei der Bestellung, die Auslieferung erfolgt per Spedition.`,
    options: { frameSizes: o.frameSizes, batteries: [{ label: d.wh ? `Wechselakku ${d.wh} Wh` : 'Akku laut Datenblatt', capacityWh: d.wh, priceDelta: 0 }], colors: o.colors },
    specs: d.specs, isFeatured: false,
  });
}
for (const [handle, [group, slug]] of Object.entries(ACCESSORIES)) {
  if (!PICK[slug] || !ACC_DATA[handle]) continue;
  const p = by[handle]; const [name, fits, desc, extra] = ACC_DATA[handle];
  const { price, rrp } = priceOf(p);
  const imgs = await place(slug);
  const o = optionsOf(p, false);
  out.push({
    id: slug, slug, name, brand: handle.startsWith('abus') ? 'ABUS' : 'Tenways', category: 'Zubehör', accessory: group, price, originalPrice: rrp > price ? rrp : undefined,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: 'Zubehör', torqueNm: 0, batteryStandardWh: 0, rangeKm: 0, weightKg: 0,
    image: imgs[0], gallery: imgs, shortDescription: desc,
    description: `${desc} Passend für: ${fits}.`,
    options: { frameSizes: o.frameSizes, batteries: [{ label: 'Ohne Akku', capacityWh: 0, priceDelta: 0 }], colors: o.colors },
    specs: { 'Passend für': fits, ...extra }, isFeatured: false,
  });
}

const header = `import type { Product } from './types';

// Generated by scripts/build-tenways.mjs from the official Tenways store feed (EUR), 2026-10-31.
// price = RRP x 0.995 (owner rule); originalPrice = RRP. Unknown values stay 0 and the shop hides them.
// Stock and delivery times still need the owner's confirmation. Photos: data/image-sources.json.
`;
fs.writeFileSync('lib/catalog-tenways.ts', `${header}\nexport const TENWAYS_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('products written:', out.length, '(bikes', Object.keys(BIKES).length, ', accessories', out.length - Object.keys(BIKES).length, ')');
