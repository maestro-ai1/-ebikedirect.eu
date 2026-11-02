// Builds lib/catalog-gazelle.ts and the product photos from the Gazelle DE model pages (.image-work/gazelle.json + .image-work/gazelle-cand/).
// Source: gazelle.de (manufacturer: base price, battery options with surcharge, technical data, official configurator photo).
// price = base price x 0.995 (owner rule). Image Rule: pure white 1200x1200 WebP + 600, one official studio photo per model (award badges rejected).
// usage: node scripts/build-gazelle.mjs [prefix]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const prefix = process.argv[2] || 'v1';
const raw = JSON.parse(fs.readFileSync('.image-work/gazelle.json', 'utf8'));
const q2 = (n) => Math.round(n * 100) / 100;
const g = (t, re) => (t.match(re) || [])[1] || '';
const CAT = (name) => (/^Makki/.test(name) ? 'Cargo-E-Bike' : 'E-City');
const CAT_DE = { 'E-City': 'City E-Bike', 'Cargo-E-Bike': 'Cargo E-Bike' };

const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
const out = [];
for (const [slugKey, v] of Object.entries(raw)) {
  const t = v.txt;
  const name = `Gazelle ${v.h1}`.trim();
  const slug = name.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rrp = Number(g(t, /\n([\d.]+)\s*€\nLieferung/).replace(/\./g, ''));
  const bats = [];
  for (const m of t.matchAll(/(\d{3,4})[\s ]*Wh:[\s ]*bis zu[\s ]*(\d+)[\s ]*km[\s ]*\n[\s ]*(?:Enthalten|\+[\s ]*\n?[\s ]*(\d+)[\s ]*€)/g)) if (!bats.some((b) => b.capacityWh === +m[1])) bats.push({ label: `Akku ${m[1]} Wh`, capacityWh: +m[1], priceDelta: m[3] ? +m[3] : 0, rangeKm: +m[2] });
  const sys = g(t, /E-Bike System Hersteller\n([^\n]+)/);
  const line = g(t, /\nMotor\n([^\n]+)\nE-Bike Motor Position/);
  const torque = Number(g(t, /Drehmoment \(Nm\)\n(\d+)/)) || 0;
  const maker = /Shimano/i.test(sys) ? 'Shimano' : /Bosch/i.test(sys) ? 'Bosch' : sys.split(' ')[0];
  const motor = `${maker}${line && !/^bosch|shimano/i.test(line) ? ' ' + line : ''}`.trim();
  const sizes = [];
  const sec = (t.split('Rahmengröße\n')[1] || '').split('\nBremssystem')[0];
  for (const m of sec.matchAll(/(\d{2})\n(\d\.\d{2}m - \d\.\d{2}m)/g)) sizes.push(`${m[1]} cm (${m[2].replace(/m/g, ' m').replace(/ {2}/g, ' ')})`);
  const colours = g(t, /Allgemeines\nGewicht\n[^\n]+\nFarbe\n([^\n]+)/).split(',').map((x) => x.trim()).filter(Boolean);
  const weight = g(t, /Gewicht\n([^\n]+)/);
  const display = g(t, /Display\nDisplay\n([^\n]+)/);
  const gears = g(t, /Art der Schaltung\n(\d+)/);
  const brakes = g(t, /Bremssystem\n([^\n]+)/);
  const form = g(t, /Rahmenform\n([^\n]+)/);
  const levels = g(t, /Unterstützungsstufen\nEco[^\n]*/) || g(t, /Unterstützungsstufen\n(Eco[^\n]+)/);
  if (!rrp || !bats.length || !motor) { console.log('skip, data incomplete:', name, rrp, bats.length, motor); continue; }
  const cat = CAT(v.h1);
  const catDe = CAT_DE[cat];

  // photo: first image only (second one is an award badge)
  const file = `.image-work/gazelle-cand/${slugKey}-0.bin`;
  if (!fs.existsSync(file)) { console.log('missing photo', slugKey); continue; }
  const dir = path.join('public', 'products', slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const buf = fs.readFileSync(file);
  for (const size of [1200, 600]) {
    const inner = Math.round(size * 0.92);
    const body = await sharp(buf).trim({ threshold: 12 }).flatten({ background: '#ffffff' }).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const meta = await sharp(body).metadata();
    const padX = Math.floor((size - meta.width) / 2), padY = Math.floor((size - meta.height) / 2);
    await sharp(body).extend({ top: padY, bottom: size - meta.height - padY, left: padX, right: size - meta.width - padX, background: '#ffffff' }).webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-1${size === 600 ? '-600' : ''}.webp`));
  }
  const img = `/products/${slug}/${slug}-${prefix}-1.webp`;
  sources[slug] = [{ file: `${slug}-${prefix}-1.webp`, source: v.imgs[0], page: `https://www.gazelle.de/ebikes/${slugKey}`, store: 'gazelle.de', fetched: '2026-11-02' }];
  const wh = bats[0].capacityWh;
  const specs = { Motor: `${motor}${torque ? `, ${torque} Nm` : ''}`, Akku: `${wh} Wh (bis ${bats[0].rangeKm} km)`, ...(display ? { Display: display } : {}), ...(gears ? { Schaltung: `${gears} Gänge` } : {}), ...(brakes ? { Bremsen: brakes } : {}), ...(form ? { Rahmen: form } : {}), ...(weight ? { Gewicht: weight } : {}) };
  out.push({
    id: slug, slug, name, brand: 'Gazelle', category: cat,
    price: q2(rrp * 0.995), originalPrice: rrp,
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0,
    motor, torqueNm: torque, batteryStandardWh: wh, rangeKm: bats[0].rangeKm, weightKg: 0,
    image: img, gallery: [img],
    shortDescription: `${catDe} mit ${motor}, ${wh} Wh Akku${gears ? `, ${gears} Gänge` : ''}.`,
    description: `Das ${name} ist ein ${catDe} von Gazelle. Es hat ${motor}${torque ? ` mit ${torque} Nm Drehmoment` : ''} und einen ${wh} Wh Akku, der Hersteller nennt bis zu ${bats[0].rangeKm} km Reichweite.${gears ? ` Geschaltet wird mit ${gears} Gängen.` : ''}${display ? ` Das Display ist das ${display}.` : ''}${weight ? ` Gewicht laut Hersteller: ${weight}.` : ''}`,
    options: {
      frameSizes: sizes.length ? sizes : ['Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt'],
      batteries: bats.map((b) => ({ label: b.label, capacityWh: b.capacityWh, priceDelta: b.priceDelta })),
      colors: colours.length ? colours.map((c) => ({ name: c.charAt(0).toUpperCase() + c.slice(1), hex: '#888888' })) : [{ name: 'Farbe laut Abbildung', hex: '#888888' }]
    },
    specs, isFeatured: false
  });
  console.log('ok', name, '| EUR', rrp, '| motor', motor, torque + 'Nm', '| bats', bats.map((b) => b.capacityWh + (b.priceDelta ? '+' + b.priceDelta : '')).join('/'), '| sizes', sizes.length, '| colours', colours.length);
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-gazelle.mjs from the manufacturer pages gazelle.de (price = base price x 0.995, owner rule; battery upgrades as priceDelta), 2026-11-02.\n// Photos: official configurator studio photo (data/image-sources.json). Stock and delivery times still need the owner's confirmation.\n`;
fs.writeFileSync('lib/catalog-gazelle.ts', `${header}\nexport const GAZELLE_NEW_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('written:', out.length, 'products');
