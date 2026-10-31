// Imports universal accessories (lights, phone mounts, tools and care, bags, bells, rain wear) from
// brand and specialist Shopify stores that sell in EUR. Descriptions are written here, not copied.
//   node scripts/import-universal.mjs fetch       -> downloads candidate photos to .image-work/cand
//   node scripts/import-universal.mjs build v1    -> places photos, writes lib/catalog-universal.ts
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const STORES = {
  reelight: 'https://www.reelight.com',
  quadlock: 'https://www.quadlockcase.eu',
  mucoff: 'https://eu.muc-off.com',
};

// [store, handle, group, slug, German name, description]
const ITEMS = [
  ['reelight', 'gem-plus-front', 'beleuchtung', 'reelight-gem-plus-frontlicht', 'Reelight GEM+ Frontlicht', 'Wiederaufladbares LED-Frontlicht mit Halterung für den Lenker, für bessere Sichtbarkeit bei Dämmerung und Dunkelheit.'],
  ['reelight', 'gem-plus-rear', 'beleuchtung', 'reelight-gem-plus-ruecklicht', 'Reelight GEM+ Rücklicht', 'Wiederaufladbares LED-Rücklicht mit Halterung für die Sattelstütze.'],
  ['reelight', 'stadium-bike', 'beleuchtung', 'reelight-stadium-bike-licht', 'Reelight STADIUM Bike Licht', 'Wiederaufladbares Fahrradlicht mit Halterung, in mehreren Varianten erhältlich.'],
  ['reelight', 'lux-light-700', 'beleuchtung', 'reelight-lux-700-licht', 'Reelight LUX 700 Fahrradlicht', 'Wiederaufladbares Fahrradlicht der LUX Serie mit hoher Helligkeit.'],
  ['reelight', 'lux-light-350', 'beleuchtung', 'reelight-lux-350-licht', 'Reelight LUX 350 Fahrradlicht', 'Wiederaufladbares Fahrradlicht der LUX Serie für den Stadtverkehr.'],
  ['reelight', 'go', 'beleuchtung', 'reelight-go-licht', 'Reelight GO Fahrradlicht', 'Kompaktes Fahrradlicht mit Batterie, einfach zu montieren.'],
  ['reelight', 'smart-grip-phone-mount', 'handyhalter', 'lezyne-smart-grip-handyhalterung', 'Lezyne Smart Grip Handyhalterung', 'Handyhalterung für den Lenker, die das Smartphone sicher hält.'],
  ['quadlock', 'bike-mount', 'handyhalter', 'quad-lock-lenker-vorbau-halterung', 'Quad Lock Lenker- und Vorbau-Halterung', 'Halterung für Lenker oder Vorbau, rastet mit dem Quad Lock Hüllensystem für Smartphones ein.'],
  ['quadlock', 'out-front-mount', 'handyhalter', 'quad-lock-out-front-halterung', 'Quad Lock Out Front Halterung', 'Halterung, die das Smartphone vor dem Lenker positioniert, zum Beispiel für die Navigation.'],
  ['quadlock', 'products-bike-kit-universal-fit', 'handyhalter', 'quad-lock-bike-kit-universal', 'Quad Lock Bike Kit Universal', 'Set aus Fahrradhalterung und Befestigung für Smartphone Hüllen.'],
  ['quadlock', 'iphone-bike-kit-all-devices', 'handyhalter', 'quad-lock-bike-kit-iphone', 'Quad Lock Bike Kit für iPhone', 'Set aus Fahrradhalterung und passender Hülle für iPhone Modelle.'],
  ['quadlock', 'quad-lock-360-accessory-vibration-dampener', 'handyhalter', 'quad-lock-vibrationsdaempfer', 'Quad Lock Vibrationsdämpfer', 'Dämpfer, der Vibrationen vom Lenker vom Smartphone fernhält.'],
  ['quadlock', 'cycle-waterproof-wireless-charging-head', 'handyhalter', 'quad-lock-wasserdichter-ladekopf', 'Quad Lock Wasserdichter Ladekopf', 'Halterungskopf mit kabellosem Laden für das Smartphone am Lenker.'],
  ['reelight', 'dualpressure-minipump', 'werkzeug-pflege', 'bbb-dualpressure-minipumpe', 'BBB Dualpressure Minipumpe', 'Kompakte Handpumpe für unterwegs mit zwei Druckstufen.'],
  ['reelight', 'sv-pro-tool', 'werkzeug-pflege', 'lezyne-sv-pro-7-multitool', 'Lezyne SV Pro 7 Multitool', 'Kompaktes Multitool für Einstellungen und kleine Reparaturen unterwegs.'],
  ['reelight', 'repair-kit-with-co2-inflator', 'werkzeug-pflege', 'lezyne-co2-reparaturset', 'Lezyne CO2 Reparaturset', 'Reparaturset mit CO2 Inflator für schnelle Pannenhilfe.'],
  ['reelight', 'tt02-touring-bike-tire-repair-kit', 'werkzeug-pflege', 'tip-top-flickzeug-set', 'Tip Top Flickzeug Set', 'Flickzeug zum Reparieren eines platten Schlauchs.'],
  ['reelight', 'finish-line-dry-lube-oil-120-ml', 'werkzeug-pflege', 'finish-line-dry-lube-120-ml', 'Finish Line Dry Lube 120 ml', 'Kettenöl für trockene Bedingungen, 120 ml.'],
  ['reelight', 'wet-lube-oil-120-ml', 'werkzeug-pflege', 'finish-line-wet-lube-120-ml', 'Finish Line Wet Lube 120 ml', 'Kettenöl für nasse Bedingungen, 120 ml.'],
  ['mucoff', 'dark-energy', 'werkzeug-pflege', 'muc-off-dark-energy-kettenwachs', 'Muc-Off Dark Energy Kettenwachs', 'Kettenwachs zur Schmierung der Fahrradkette.'],
  ['mucoff', 'bicycle-clean-protect-and-all-weather-lube-kit', 'werkzeug-pflege', 'muc-off-reinigungs-und-schmierset', 'Muc-Off Reinigungs- und Schmierset', 'Set mit Reiniger, Schutz und Allwetter-Schmiermittel für die Fahrradpflege.'],
  ['mucoff', 'bam-instant-puncture-repair', 'werkzeug-pflege', 'muc-off-bam-pannenreparatur', 'Muc-Off B.A.M! Pannenreparatur', 'Pannenreparatur-Spray, das den Reifen aufpumpt und das Loch abdichtet.'],
  ['mucoff', '3-in-1-detailing-brush-set', 'werkzeug-pflege', 'muc-off-buersten-set-3-in-1', 'Muc-Off Bürsten-Set 3 in 1', 'Drei Bürsten zum Reinigen von Rahmen, Kette und schwer erreichbaren Stellen.'],
  ['mucoff', 'foam-sprayer-essentials-bundle', 'werkzeug-pflege', 'muc-off-schaumspruehr-set', 'Muc-Off Schaumsprüher-Set', 'Set mit Schaumsprüher und Fahrradreiniger für die gründliche Wäsche.'],
  ['reelight', 'm-caddy-qr', 'taschen-koerbe', 'lezyne-m-caddy-satteltasche', 'Lezyne M-Caddy Satteltasche', 'Kleine Satteltasche mit Schnellverschluss für Ersatzschlauch und Werkzeug.'],
  ['reelight', 'e-ne-bell', 'sattel-lenker', 'crane-e-ne-fahrradklingel', 'Crane E-NE Fahrradklingel', 'Klassische Fahrradklingel mit klarem Klang für den Lenker.'],
  ['reelight', 'mini-karen-bell', 'sattel-lenker', 'crane-mini-karen-fahrradklingel', 'Crane Mini Karen Fahrradklingel', 'Kleine Fahrradklingel für schmale Lenker.'],
  ['reelight', 'mini-suzu-bell-chrome-plated', 'sattel-lenker', 'crane-mini-suzu-fahrradklingel', 'Crane Mini Suzu Fahrradklingel', 'Kleine verchromte Fahrradklingel.'],
  ['reelight', 'portland-bell-brass', 'sattel-lenker', 'basil-portland-fahrradklingel-messing', 'Basil Portland Fahrradklingel Messing', 'Fahrradklingel aus Messing mit klassischem Look.'],
  ['reelight', 'rover-2-0-rain-cape', 'regenschutz-bekleidung', 'cleverhood-rover-2-0-regencape', 'Cleverhood Rover 2.0 Regencape', 'Regencape für Radfahrer, in mehreren Größen und Farben erhältlich.'],
  ['reelight', 'stadium-vest', 'regenschutz-bekleidung', 'reelight-stadium-warnweste', 'Reelight STADIUM Warnweste', 'Reflektierende Weste für bessere Sichtbarkeit im Straßenverkehr.'],
  ['reelight', 'joy-reflective-vest', 'regenschutz-bekleidung', 'gofluo-joy-warnweste', 'Gofluo Joy Warnweste', 'Reflektierende Weste in mehreren Größen.'],
  ['reelight', 'darknight-reflective-vest', 'regenschutz-bekleidung', 'gofluo-darknight-warnweste', 'Gofluo Darknight Warnweste', 'Reflektierende Weste für Fahrten in der Dunkelheit.'],
];

const HEX = [[/black|midnight|schwarz/i, '#1C1C1E'], [/white|weiss|weiß/i, '#ECECEC'], [/red|rot/i, '#A32A2A'], [/orange/i, '#E8731A'], [/yellow|gelb|neon/i, '#E6D23A'], [/blue|blau/i, '#4F6D8A'], [/green|grün|olive/i, '#6B7F5E'], [/silver|grey|gray|grau/i, '#9AA0A6'], [/brass|gold|messing/i, '#B08D3C'], [/pink|rose/i, '#D9879C']];
const hexOf = (n) => (HEX.find(([re]) => re.test(n)) || [0, '#888888'])[1];
const q2 = (n) => Math.round(n * 100) / 100;

async function feed(base) {
  let all = [];
  for (let p = 1; p <= 4; p++) {
    const r = await fetch(`${base}/products.json?limit=250&page=${p}`, { headers: { 'user-agent': UA } });
    if (!r.ok) break;
    const j = await r.json();
    if (!j.products.length) break;
    all = all.concat(j.products);
  }
  return Object.fromEntries(all.map((p) => [p.handle, p]));
}

const mode = process.argv[2];
const feeds = {};
for (const k of Object.keys(STORES)) feeds[k] = await feed(STORES[k]);

if (mode === 'fetch') {
  const manifest = {};
  fs.mkdirSync('.image-work/cand', { recursive: true });
  for (const [store, handle, , slug] of ITEMS) {
    const p = feeds[store][handle];
    if (!p) { console.log('MISSING', store, handle); continue; }
    const dir = path.join('.image-work/cand', slug);
    fs.mkdirSync(dir, { recursive: true });
    manifest[slug] = [];
    let n = 0;
    for (const im of p.images.slice(0, 5)) {
      if (n >= 4) break;
      try {
        const url = im.src.split('?')[0];
        const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 5000) continue;
        n++;
        const ext = (url.match(/\.(jpe?g|png|webp)$/i) || ['', 'jpg'])[1].toLowerCase();
        fs.writeFileSync(path.join(dir, `${n}.${ext}`), buf);
        manifest[slug].push({ n, url });
      } catch { /* skip */ }
    }
    console.log(slug, p.vendor, '| images', manifest[slug].length, '| options', p.options.map((o) => o.name + ':' + o.values.length).join(','));
  }
  fs.writeFileSync('.image-work/universal.json', JSON.stringify(manifest, null, 1));
}

if (mode === 'build') {
  const prefix = process.argv[3] || 'v1';
  const PICK = JSON.parse(fs.readFileSync('scripts/universal-picks.json', 'utf8'));
  const manifest = JSON.parse(fs.readFileSync('.image-work/universal.json', 'utf8'));
  const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
  const out = [];

  async function whiten(file) {
    let img = sharp(file).flatten({ background: '#ffffff' });
    const { data, info } = await img.clone().raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;
    const px = (x, y) => { const i = (y * w + x) * info.channels; return (data[i] + data[i + 1] + data[i + 2]) / 3; };
    const s = [px(Math.round(w * 0.12), Math.round(h * 0.12)), px(Math.round(w * 0.88), Math.round(h * 0.12)), px(Math.round(w * 0.12), Math.round(h * 0.88)), px(Math.round(w * 0.88), Math.round(h * 0.88))].sort((a, b) => a - b);
    const avg = (s[1] + s[2]) / 2;
    if (avg > 185 && avg < 252) img = img.linear(255 / avg, 0);
    return img;
  }

  for (const [store, handle, group, slug, name, desc] of ITEMS) {
    const p = feeds[store][handle];
    const picks = PICK[slug];
    if (!p || !picks || !picks.length) continue;
    const dir = path.join('public', 'products', slug);
    fs.mkdirSync(dir, { recursive: true });
    const imgs = [];
    for (let i = 0; i < picks.length; i++) {
      const cand = fs.readdirSync(path.join('.image-work/cand', slug)).find((f) => parseInt(f) === picks[i]);
      const src = path.join('.image-work/cand', slug, cand);
      for (const size of [1200, 600]) {
        const base = (await whiten(src)).resize(size, size, { fit: 'contain', background: '#ffffff' });
        await base.webp({ quality: size === 1200 ? 82 : 78 }).toFile(path.join(dir, `${slug}-${prefix}-${i + 1}${size === 600 ? '-600' : ''}.webp`));
      }
      imgs.push(`/products/${slug}/${slug}-${prefix}-${i + 1}.webp`);
      const m = manifest[slug].find((x) => x.n === picks[i]);
      (sources[slug] ||= []).push({ file: `${slug}-${prefix}-${i + 1}.webp`, source: m?.url, store: STORES[store].replace('https://', ''), fetched: '2026-10-31' });
    }
    const av = p.variants.filter((v) => v.available);
    const vs = av.length ? av : p.variants;
    const price = Math.min(...vs.map((v) => Number(v.price)));
    const rrp = Math.max(price, ...vs.map((v) => Number(v.compare_at_price) || 0));
    const colorOpt = p.options.find((o) => /colou?r|farbe/i.test(o.name));
    const sizeOpt = p.options.find((o) => /size|größe/i.test(o.name));
    const colors = (colorOpt ? [...new Set(colorOpt.values)] : []).slice(0, 8).map((n) => ({ name: n, hex: hexOf(n) }));
    const sizes = sizeOpt ? [...new Set(sizeOpt.values)].slice(0, 10) : [];
    const brand = ['Lezyne', 'BBB', 'Tip Top', 'Basil', 'Cleverhood', 'Gofluo', 'Crane', 'Finish Line', 'Quad Lock', 'Muc-Off', 'Reelight'].find((b) => name.startsWith(b)) || 'Reelight';
    out.push({
      id: slug, slug, name, brand, category: 'Zubehör', accessory: group, price: q2(rrp * 0.995), originalPrice: rrp > price ? rrp : undefined,
      inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: 'Zubehör', torqueNm: 0, batteryStandardWh: 0, rangeKm: 0, weightKg: 0,
      image: imgs[0], gallery: imgs, shortDescription: desc, description: `${desc} Universal einsetzbar am Fahrrad und E-Bike.`,
      options: { frameSizes: sizes.length ? sizes : ['Einheitsgröße'], batteries: [{ label: 'Ohne Akku', capacityWh: 0, priceDelta: 0 }], colors: colors.length ? colors : [{ name: 'Standard', hex: '#1C1C1E' }] },
      specs: { 'Marke': brand, 'Einsatz': 'Fahrrad und E-Bike, universell' }, isFeatured: false,
    });
  }
  const header = `import type { Product } from './types';\n\n// Generated by scripts/import-universal.mjs from brand and specialist stores selling in EUR (Reelight, Quad Lock, Muc-Off), 2026-10-31.\n// price = RRP x 0.995 (owner rule). Stock and delivery times still need the owner's confirmation. Photos: data/image-sources.json.\n`;
  fs.writeFileSync('lib/catalog-universal.ts', `${header}\nexport const UNIVERSAL_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
  fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
  console.log('universal products written:', out.length);
}
