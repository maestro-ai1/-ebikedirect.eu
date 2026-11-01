// One-off: adds the kids and youth e-bike category (E-Kinder) everywhere the other categories appear.
const fs = require('fs');
function edit(file, pairs) {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b, all] of pairs) {
    if (!s.includes(a)) { console.log('NOT FOUND in', file, '->', a.slice(0, 60)); process.exit(1); }
    s = all ? s.split(a).join(b) : s.replace(a, b);
  }
  fs.writeFileSync(file, s);
  console.log('patched', file);
}

edit('lib/types.ts', [["| 'E-Gravel' | 'Zubehör';", "| 'E-Gravel' | 'E-Kinder' | 'Zubehör';"]]);
edit('lib/mapped-pages.ts', [["  { path: '/e-bikes/e-rennrad-gravel', type: 'category', category: 'E-Gravel' },", "  { path: '/e-bikes/e-rennrad-gravel', type: 'category', category: 'E-Gravel' },\n  { path: '/e-bikes/kinder-jugend', type: 'category', category: 'E-Kinder' },"]]);
edit('app/[locale]/shop/page.tsx', [["'E-Gravel', 'Zubehör'];", "'E-Gravel', 'E-Kinder', 'Zubehör'];"]]);
edit('components/shop/catalog-nav.tsx', [["  { path: '/e-bikes/e-rennrad-gravel', label: 'E-Rennrad & Gravel' },", "  { path: '/e-bikes/e-rennrad-gravel', label: 'E-Rennrad & Gravel' },\n  { path: '/e-bikes/kinder-jugend', label: 'Kinder- & Jugend-E-Bikes' },"]]);
edit('components/seo/mapped-page.tsx', [
  ["  '/e-bikes/e-rennrad-gravel': 'e-rennrad-gravel-kaufen',", "  '/e-bikes/e-rennrad-gravel': 'e-rennrad-gravel-kaufen',\n  '/e-bikes/kinder-jugend': 'kinder-e-bike-kaufen',"],
  ["'/e-bikes/falt-e-bikes', '/e-bikes/e-rennrad-gravel'])", "'/e-bikes/falt-e-bikes', '/e-bikes/e-rennrad-gravel', '/e-bikes/kinder-jugend'])"]
]);
edit('components/home/category-tiles.tsx', [
  ["  { key: 'all', path: '/e-bikes', photo: 'e-bike-kaufen', alt: 'E-Bike kaufen' },", "  { key: 'kids', path: '/e-bikes/kinder-jugend', category: 'E-Kinder', photo: 'kinder-e-bike-kaufen', alt: 'Kinder-E-Bike kaufen' },\n  { key: 'all', path: '/e-bikes', photo: 'e-bike-kaufen', alt: 'E-Bike kaufen' },"],
  ['lg:grid-cols-3', 'lg:grid-cols-5']
]);
edit('lib/product-seo.ts', [
  ["  'E-Gravel': 'E-Gravel-Bike',", "  'E-Gravel': 'E-Gravel-Bike',\n  'E-Kinder': 'Kinder-E-Bike',"],
  ["  'E-Gravel': '/e-bikes/e-rennrad-gravel',", "  'E-Gravel': '/e-bikes/e-rennrad-gravel',\n  'E-Kinder': '/e-bikes/kinder-jugend',"],
  ["  'E-Gravel': 'E-Rennräder und E-Gravelbikes", "  'E-Kinder': 'Kinder- und Jugend-E-Bikes haben einen kleineren Rahmen, kleinere Laufräder und einen sanft einsetzenden Motor, damit Kinder ab dem Schulalter sicher mit Unterstützung fahren. Wichtig sind ein niedriges Gewicht, zuverlässige Bremsen und die richtige Rahmengröße. Der Akku ist meist kleiner als bei Erwachsenenrädern, was das Rad leicht hält.',\n  'E-Gravel': 'E-Rennräder und E-Gravelbikes"],
  ["  'E-Gravel': 'Das Modell passt zu sportlichen", "  'E-Kinder': 'Das Modell passt zu Kindern und Jugendlichen, die mit Motorunterstützung sicher Rad fahren möchten, und zu Eltern, die auf Gewicht, Bremsen und die passende Rahmengröße achten.',\n  'E-Gravel': 'Das Modell passt zu sportlichen"]
]);
edit('scripts/build-xxl.mjs', [
  ["'E-Gravel': 'E-Gravel-Bike',", "'E-Gravel': 'E-Gravel-Bike', 'E-Kinder': 'Kinder-E-Bike',"],
  ["  if (m._catrun && m.cat === 'E-Gravel') return 'E-Gravel';", "  if (m._catrun && m.cat === 'E-Kinder') return 'E-Kinder';\n  if (/mini me|rookie|woom|acid 240/i.test(t)) return 'E-Kinder';\n  if (m._catrun && m.cat === 'E-Gravel') return 'E-Gravel';"]
]);

const L = {
  de: 'Kinder-E-Bikes', en: 'Kids e-bikes', fr: 'Vélos électriques enfant', nl: 'Elektrische kinderfietsen',
  it: 'Bici elettriche per bambini', es: 'Bicicletas eléctricas para niños', pt: 'Bicicletas elétricas para crianças'
};
for (const [code, label] of Object.entries(L)) {
  const f = `messages/${code}.json`;
  const raw = fs.readFileSync(f, 'utf8');
  const j = JSON.parse(raw);
  j.home.cat.kids = label;
  const indent = /^\{\n( +)"/.exec(raw)?.[1].length || 2;
  fs.writeFileSync(f, JSON.stringify(j, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
}
console.log('messages updated');
