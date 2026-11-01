// One-off: adds the E-Gravel category (road and gravel e-bikes) to the product copy helpers and the homepage tiles.
const fs = require('fs');
function edit(file, fn) { const s = fs.readFileSync(file, 'utf8'); const t = fn(s); if (t === s) { console.log('no change', file); process.exit(1); } fs.writeFileSync(file, t); console.log('patched', file); }

edit('lib/product-seo.ts', (s) => {
  const lines = s.split('\n');
  const out = [];
  for (const l of lines) {
    out.push(l);
    if (l.startsWith("  'Falt-E-Bike': 'Falt-E-Bike',")) out.push("  'E-Gravel': 'E-Gravel-Bike',");
    else if (l.startsWith("  'Falt-E-Bike': '/e-bikes/falt-e-bikes',")) out.push("  'E-Gravel': '/e-bikes/e-rennrad-gravel',");
    else if (l.startsWith("  'Falt-E-Bike': 'Falt-E-Bikes lassen sich klein")) out.push("  'E-Gravel': 'E-Rennräder und E-Gravelbikes verbinden einen leichten Rahmen mit Rennlenker, schmalen bis mittelbreiten Reifen und einem kompakten Motor. Sie sind schneller und sportlicher als ein Trekkingrad und eignen sich für Asphalt, Feldwege und lange Touren. Viele Modelle haben einen kleinen, leichten Akku, damit das Fahrgefühl eines normalen Rennrads erhalten bleibt.',");
    else if (l.startsWith("  'Falt-E-Bike': 'Das Modell passt zu Menschen, die Bahn")) out.push("  'E-Gravel': 'Das Modell passt zu sportlichen Fahrerinnen und Fahrern, die längere Strecken auf Asphalt und Schotter fahren möchten und dabei Unterstützung am Berg und bei Gegenwind schätzen.',");
  }
  return out.join('\n');
});

edit('components/home/category-tiles.tsx', (s) => {
  let t = s.replace("  { key: 'all', path: '/e-bikes', photo: 'e-bike-kaufen', alt: 'E-Bike kaufen' },", "  { key: 'gravel', path: '/e-bikes/e-rennrad-gravel', category: 'E-Gravel', photo: 'e-rennrad-gravel-kaufen', alt: 'E-Rennrad und Gravel E-Bike kaufen' },\n  { key: 'all', path: '/e-bikes', photo: 'e-bike-kaufen', alt: 'E-Bike kaufen' },");
  t = t.replace('lg:grid-cols-4', 'lg:grid-cols-3');
  return t;
});
