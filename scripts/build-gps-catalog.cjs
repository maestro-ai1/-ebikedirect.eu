// Builds lib/catalog-gps.ts (GPS and bike computer accessories) and merges the image sources into data/image-sources.json.
// Sources (2026-11-17): manufacturer pages garmin.com/de-DE and de-eu.wahoofitness.com. list price = manufacturer price shown on the page; price = list price x 0.995 (owner rule).
// Descriptions are written here from facts on those pages; no spec is stated that the manufacturer page does not show. Stock and delivery times are owner facts and are not set here.
// usage: node scripts/build-gps-catalog.cjs
const fs = require('fs');
const q2 = (n) => Math.round(n * 100) / 100;
const GROUP = 'gps-fahrradcomputer';
const ITEMS = [
  {
    slug: 'garmin-edge-540', name: 'Garmin Edge 540 GPS-Fahrradcomputer', brand: 'Garmin', list: 329.99, sku: '010-02694-01', imgs: 3,
    short: 'GPS-Fahrradcomputer mit Tastenbedienung, Standard Edition.',
    desc: 'Der Garmin Edge 540 ist ein GPS-Fahrradcomputer, der sich über Tasten bedienen lässt und ohne Touchscreen auskommt. Er zeigt Strecke, Navigation und Trainingsdaten am Lenker an. Angeboten wird die Standard Edition des Herstellers.',
    specs: { 'Marke': 'Garmin', 'Modell': 'Edge 540', 'Edition': 'Standard Edition', 'Bedienung': 'Tasten, kein Touchscreen', 'Artikelnummer': '010-02694-01', 'Einsatz': 'Fahrrad und E-Bike, am Lenker' },
    src: [['garmin-540/0', 'https://res.garmin.com/en/products/010-02694-01/v/cf-lg.jpg'], ['garmin-540/3', 'https://res.garmin.com/en/products/010-02694-01/v/pd-02-lg.jpg'], ['garmin-540/1', 'https://res.garmin.com/en/products/010-02694-01/v/lf-lg.jpg']],
  },
  {
    slug: 'garmin-edge-840', name: 'Garmin Edge 840 GPS-Fahrradcomputer', brand: 'Garmin', list: 409.99, sku: '010-02695-01', imgs: 3,
    short: 'GPS-Fahrradcomputer mit Touchdisplay und Tasten, Standard Edition.',
    desc: 'Der Garmin Edge 840 verbindet Touchdisplay und Tastenbedienung in einem GPS-Fahrradcomputer. Laut Hersteller hält der Akku bis zu 42 Stunden. Angeboten wird die Standard Edition des Herstellers.',
    specs: { 'Marke': 'Garmin', 'Modell': 'Edge 840', 'Edition': 'Standard Edition', 'Bedienung': 'Touchdisplay und Tasten', 'Akkulaufzeit': 'bis zu 42 Stunden (Herstellerangabe)', 'Artikelnummer': '010-02695-01', 'Einsatz': 'Fahrrad und E-Bike, am Lenker' },
    src: [['garmin-840/3', 'https://res.garmin.com/en/products/010-02695-01/v/pd-02-lg.jpg'], ['garmin-840/2', 'https://res.garmin.com/en/products/010-02695-01/v/pd-01-lg.jpg'], ['garmin-840/1', 'https://res.garmin.com/en/products/010-02695-01/v/lf-lg.jpg']],
  },
  {
    slug: 'garmin-edge-1050', name: 'Garmin Edge 1050 GPS-Fahrradcomputer', brand: 'Garmin', list: 659.99, sku: '010-02890-01', imgs: 3,
    short: 'Premium-GPS-Fahrradcomputer von Garmin, Einzelgerät.',
    desc: 'Der Garmin Edge 1050 ist das Premium-Modell der Edge Reihe. Laut Hersteller hält der Akku im anspruchsvollsten Einsatz bis zu 20 Stunden und im Energiesparmodus bis zu 60 Stunden. Angeboten wird das Einzelgerät.',
    specs: { 'Marke': 'Garmin', 'Modell': 'Edge 1050', 'Edition': 'Einzelgerät', 'Akkulaufzeit': 'bis zu 20 Stunden, im Energiesparmodus bis zu 60 Stunden (Herstellerangabe)', 'Artikelnummer': '010-02890-01', 'Einsatz': 'Fahrrad und E-Bike, am Lenker' },
    src: [['garmin-1050/0', 'https://res.garmin.com/en/products/010-02890-01/V/cf-lg.jpg'], ['garmin-1050/2', 'https://res.garmin.com/en/products/010-02890-01/V/pd-01-lg.jpg'], ['garmin-1050/1', 'https://res.garmin.com/en/products/010-02890-01/V/lf-lg.jpg']],
  },
  {
    slug: 'garmin-edge-mtb', name: 'Garmin Edge MTB GPS-Fahrradcomputer', brand: 'Garmin', list: 369.99, sku: '010-02993-10', imgs: 3,
    short: 'GPS-Fahrradcomputer von Garmin, für Mountainbiker entwickelt.',
    desc: 'Der Garmin Edge MTB ist der erste Fahrradcomputer von Garmin, der speziell für Mountainbiker entwickelt wurde. Er zeigt Strecke und Fahrdaten am Lenker an.',
    specs: { 'Marke': 'Garmin', 'Modell': 'Edge MTB', 'Einsatz': 'Mountainbike, Fahrrad und E-Bike, am Lenker', 'Artikelnummer': '010-02993-10' },
    src: [['garmin-mtb/0', 'https://res.garmin.com/en/products/010-02993-10/v/cf-lg.jpg'], ['garmin-mtb/2', 'https://res.garmin.com/en/products/010-02993-10/v/rf-lg.jpg'], ['garmin-mtb/1', 'https://res.garmin.com/en/products/010-02993-10/v/lf-lg.jpg']],
  },
  {
    slug: 'wahoo-elemnt-bolt-3', name: 'Wahoo ELEMNT BOLT 3 GPS-Fahrradcomputer', brand: 'Wahoo', list: 329.99, sku: 'ELEMNT BOLT 3', imgs: 1,
    short: 'GPS-Fahrradcomputer mit 2,3 Zoll Display und Tastenbedienung.',
    desc: 'Der Wahoo ELEMNT BOLT 3 ist ein GPS-Fahrradcomputer mit einem 2,3 Zoll großen, kontrastreichen Display, das bei jeder Geschwindigkeit gut ablesbar sein soll. Die Bedienung erfolgt über Tasten am Gerät.',
    specs: { 'Marke': 'Wahoo', 'Modell': 'ELEMNT BOLT 3', 'Display': '2,3 Zoll', 'Bedienung': 'Tasten', 'Einsatz': 'Fahrrad und E-Bike, am Lenker' },
    src: [['wahoo-bolt3/0', 'https://de-eu.wahoofitness.com/media/catalog/product/e/l/elemnt_bolt_compare_mobile_a.jpg']],
  },
];
const out = []; const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
for (const it of ITEMS) {
  const imgs = Array.from({ length: it.imgs }, (_, i) => `/products/${it.slug}/${it.slug}-v1-${i + 1}.webp`);
  for (const f of imgs) if (!fs.existsSync('public' + f)) throw new Error('missing image ' + f);
  sources[it.slug] = it.src.map(([key, url], i) => ({ file: `${it.slug}-v1-${i + 1}.webp`, source: url, store: new URL(url).host, fetched: '2026-11-17' }));
  out.push({
    id: it.slug, slug: it.slug, name: it.name, brand: it.brand, category: 'Zubehör', accessory: GROUP, price: q2(it.list * 0.995),
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: 'Zubehör', torqueNm: 0, batteryStandardWh: 0, rangeKm: 0, weightKg: 0,
    image: imgs[0], gallery: imgs, shortDescription: it.short, description: it.desc,
    options: { frameSizes: ['Einheitsgröße'], batteries: [{ label: 'Ohne Akku', capacityWh: 0, priceDelta: 0 }], colors: [{ name: 'Standard', hex: '#1C1C1E' }] },
    specs: it.specs, isFeatured: false,
  });
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-gps-catalog.cjs from manufacturer pages (garmin.com/de-DE, de-eu.wahoofitness.com), 2026-11-17.\n// price = manufacturer list price x 0.995 (owner rule). Stock and delivery times are owner facts and are not set by this script.\n`;
fs.writeFileSync('lib/catalog-gps.ts', `${header}\nexport const GPS_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('gps products written:', out.length, out.map((p) => p.slug + ' ' + p.price).join(' | '));
