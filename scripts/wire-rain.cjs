// Wires the 7 AGU rain-gear products (lib/catalog-rain.ts) into the site. Idempotent.
// 1 product registry, 2 FR/EN name words, 3 page guide for /zubehoer/regenschutz-bekleidung, 4 image sources, 5 name-based keyword entries for de/fr/en (secondaries follow from the refreshed bank).
const fs = require('fs');
const edit = (f, fn) => { const a = fs.readFileSync(f, 'utf8'); const b = fn(a); if (b !== a) fs.writeFileSync(f, b); return b !== a; };
const res = {};
res.registry = edit('lib/products.ts', (s) => { if (s.includes('RAIN_PRODUCTS')) return s; s = s.replace("import { FIVE_D_PRODUCTS } from './catalog-5d';", "import { FIVE_D_PRODUCTS } from './catalog-5d';\nimport { RAIN_PRODUCTS } from './catalog-rain';"); return s.replace('...FIVE_D_PRODUCTS,', '...FIVE_D_PRODUCTS, ...RAIN_PRODUCTS,'); });
res.names = edit('lib/l10n-names.ts', (s) => { if (s.includes('Regen Überschuhe')) return s; return s.replace('const EN: [string, string][] = [', "const EN: [string, string][] = [\n  ['Langarm Regenponcho', 'Long-sleeve rain poncho'], ['Regen Überschuhe', 'Rain overshoes'], ['Regenanzug', 'Rain suit'], ['Regenjacke', 'Rain jacket'], ['Regenhose', 'Rain trousers'],").replace('const FR: [string, string][] = [', "const FR: [string, string][] = [\n  ['Langarm Regenponcho', 'Poncho de pluie à manches longues'], ['Regen Überschuhe', 'Surchaussures de pluie'], ['Regenanzug', 'Ensemble de pluie'], ['Regenjacke', 'Veste de pluie'], ['Regenhose', 'Pantalon de pluie'],"); });
res.guide = edit('components/seo/accessory-content.tsx', (s) => {
  if (s.includes("'regenschutz-bekleidung': {")) return s;
  const add = `  'regenschutz-bekleidung': {
    label: 'Regenschutz und Bekleidung',
    path: '/zubehoer/regenschutz-bekleidung/',
    guide: [
      'Wer mit dem E-Bike zur Arbeit oder zum Einkauf fährt, wird irgendwann nass. Regenjacke, Regenhose, Regenponcho und Überschuhe halten Sie auf dem Rad trocken. Wichtig sind eine hohe Wassersäule, getapte Nähte und eine atmungsaktive Membran, damit Sie unter der Kleidung nicht schwitzen.',
      'Ein Poncho zieht sich schnell über Kleidung und Rucksack und passt zur kurzen Dusche unterwegs. Jacke und Hose mit 20.000 mm Wassersäule sind für längere Strecken bei Dauerregen gedacht. Reflektierende Details erhöhen die Sichtbarkeit bei wenig Licht, Überschuhe schützen die Füße vor Nässe und Wind.',
    ],
    points: ['Wassersäule und getapte Nähte für Dauerregen prüfen', 'Reflektierende Details für Fahrten bei wenig Licht', 'Größe nach der Größentabelle wählen, Ponchos fallen weit aus'],
    blog: { href: '/blog/e-bike-wartung-tipps-fuer-den-winter', label: 'E-Bike Wartung: Tipps für den Winter' }
  },
`;
  return s.replace("  'werkzeug-pflege': {", add + "  'werkzeug-pflege': {");
});
// image sources (object keyed by slug)
const src = JSON.parse(fs.readFileSync('.image-work/rain-sources.json', 'utf8')); const IS = JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')); let added = 0;
for (const x of src) { const slug = x.file.split('/')[1]; const file = x.file.split('/')[2] + '.webp'; if (!IS[slug]) { IS[slug] = [{ file, source: x.source, store: 'agu.com', fetched: '2026-11-20' }]; added++; } }
if (added) fs.writeFileSync('data/image-sources.json', JSON.stringify(IS, null, 1)); res.sources = added;
// keyword entries (name-based primary, as for the earlier accessory groups)
const NAMES = {
  'agu-langarm-regenponcho-urban-outdoor': ['AGU Langarm Regenponcho Urban Outdoor', 'AGU Poncho de pluie à manches longues Urban Outdoor', 'AGU Long-sleeve rain poncho Urban Outdoor'],
  'agu-original-premium-regenjacke': ['AGU Original Premium Regenjacke', 'AGU Original Premium Veste de pluie', 'AGU Original Premium Rain jacket'],
  'agu-rainguard-regenjacke': ['AGU RainGuard Regenjacke', 'AGU RainGuard Veste de pluie', 'AGU RainGuard Rain jacket'],
  'agu-rainguard-regenhose': ['AGU RainGuard Regenhose', 'AGU RainGuard Pantalon de pluie', 'AGU RainGuard Rain trousers'],
  'agu-original-regenanzug-essential': ['AGU Original Regenanzug Essential', 'AGU Original Ensemble de pluie Essential', 'AGU Original Rain suit Essential'],
  'agu-tech-regen-ueberschuhe-commuter-hi-vis': ['AGU Tech Regen Überschuhe Commuter Hi-Vis', 'AGU Tech Surchaussures de pluie Commuter Hi-Vis', 'AGU Tech Rain overshoes Commuter Hi-Vis'],
  'agu-winter-regen-ueberschuhe-commuter': ['AGU Winter Regen Überschuhe Commuter', 'AGU Winter Surchaussures de pluie Commuter', 'AGU Winter Rain overshoes Commuter'],
};
const FILES = [['data/keywords/products.json', 0, (n) => n.toLowerCase() + ' kaufen'], ['data/keywords/fr-products.json', 1, (n) => 'acheter ' + n.toLowerCase()], ['data/keywords/en-products.json', 2, (n) => 'buy ' + n.toLowerCase()]];
res.keywords = {};
for (const [f, i, kw] of FILES) { const J = JSON.parse(fs.readFileSync(f, 'utf8')); let n = 0; for (const [slug, names] of Object.entries(NAMES)) if (!J.products[slug]) { J.products[slug] = { name: names[i], brand: 'AGU', category: 'Zubehör', primary: { keyword: kw(names[i]), intent: 'T', volume: 0, kd: null, source: 'name' }, secondary: [], faq: [] }; n++; } if (n) fs.writeFileSync(f, JSON.stringify(J, null, 1)); res.keywords[f] = n; }
console.log(JSON.stringify(res));
