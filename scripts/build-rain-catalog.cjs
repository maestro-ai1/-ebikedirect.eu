// Builds lib/catalog-rain.ts: 7 AGU rain-gear products for the accessory group regenschutz-bekleidung (agu.com, EUR, read 2026-11-20).
// price = current agu.com price x 0.995, slightly below the manufacturer (owner rule); originalPrice = AGU's regular price where agu.com shows a reduction.
// Descriptions use only facts stated in AGU's own product texts. Stock and delivery are owner facts: the owner confirmed on 2026-11-20 that all 7 are stocked.
// usage: node scripts/build-rain-catalog.cjs
const fs = require('fs');
const q2 = (n) => Math.round(n * 100) / 100;
const SZ = ['S', 'M', 'L', 'XL', 'XXL'];
const ITEMS = [
  { slug: 'agu-langarm-regenponcho-urban-outdoor', name: 'AGU Langarm Regenponcho Urban Outdoor', agu: 56.95, was: 84.95, sizes: ['XS/S', 'M/L', 'XL/XXL'], color: ['Deep Sea Green', '#2F4A4F'],
    short: 'Regenponcho mit langen Ärmeln aus recyceltem Polyester, wind- und wasserdicht, mit reflektierenden Details.',
    desc: 'Regenponcho mit langen Ärmeln, den Sie bei Regen einfach über die Kleidung ziehen. Die lockere Passform lässt Bewegungsfreiheit beim Radfahren, ohne dass der Poncho zu stark flattert. Wind- und wasserdicht sowie atmungsaktiv (Poray 5K), aus 100 % recyceltem Polyester, mit reflektierenden Details an Rücken, Brust und Schulter. Über den großen Reißverschluss vorn lässt er sich auch mit Helm über den Kopf ziehen.',
    specs: { 'Marke': 'AGU', 'Serie': 'Urban Outdoor', 'Material': '100 % recyceltes Polyester', 'Membran': 'Poray 5K, wind- und wasserdicht, atmungsaktiv', 'Sicherheit': 'Reflektierende Details an Rücken, Brust und Schulter', 'Passform': 'Locker (Loose Fit)' } },
  { slug: 'agu-original-premium-regenjacke', name: 'AGU Original Premium Regenjacke', agu: 179.95, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], color: ['Schwarz', '#1C1C1E'],
    short: 'Wasserdichte, atmungsaktive Regenjacke aus recyceltem Polyester mit getapten Nähten und verstellbarer Kapuze.',
    desc: 'Die Original Premium Jacket ist seit 1976 ein Klassiker von AGU, hier in neuer Ausführung. Dreilagiges Material mit 20.000 mm Wassersäule und 10.000 Atmungsaktivität laut Hersteller, getapte Nähte und doppelte YKK-Reißverschlüsse halten das Wasser draußen. Die verstellbare Kapuze ist auf freie Sicht von 180 Grad ausgelegt, reflektierende Elemente erhöhen die Sichtbarkeit im Verkehr. Aus 100 % recyceltem Polyester.',
    specs: { 'Marke': 'AGU', 'Serie': 'Original Premium', 'Material': '100 % recyceltes Polyester, 3-lagig', 'Wassersäule': '20.000 mm', 'Nähte': 'Getapt', 'Reißverschlüsse': 'Doppelte YKK-Reißverschlüsse', 'Kapuze': 'Verstellbar und abnehmbar' } },
  { slug: 'agu-rainguard-regenjacke', name: 'AGU RainGuard Regenjacke', agu: 219.95, sizes: SZ, color: ['Schwarz', '#1C1C1E'],
    short: 'Dreilagige, wind- und wasserdichte Regenjacke mit 20.000 mm Wassersäule und 360-Grad-Reflexion.',
    desc: 'Die RainGuard Jacket besteht aus winddichtem, wasserdichtem und atmungsaktivem dreilagigem Ripstop-Material mit 20.000 mm Wassersäule und getapten Nähten. Die helmfreundliche Kapuze mit verstärktem Schirm hält den Regen aus den Augen, 360-Grad-Reflexion erhöht die Sichtbarkeit bei wenig Licht. Wasserdichte Reißverschlüsse und mehrere Staumöglichkeiten machen sie praktisch bei wechselndem Wetter. PFAS-freie DWR-Beschichtung, 100 % recyceltes Polyester.',
    specs: { 'Marke': 'AGU', 'Serie': 'RainGuard', 'Material': '100 % recyceltes Polyester, 3-lagiges Ripstop', 'Wassersäule': '20.000 mm', 'Beschichtung': 'PFAS-freie DWR', 'Sicherheit': '360-Grad-Reflexion', 'Kapuze': 'Helmfreundlich, verstellbar' } },
  { slug: 'agu-rainguard-regenhose', name: 'AGU RainGuard Regenhose', agu: 169.95, sizes: SZ, color: ['Schwarz', '#1C1C1E'],
    short: 'Wasserdichte, atmungsaktive Regenhose mit 20.000 mm Wassersäule und reflektierenden Details.',
    desc: 'Die RainGuard Pants aus dreilagigem Ripstop-Material mit 20.000 mm Wassersäule und PFAS-freier Beschichtung halten Sie bei Nässe trocken und bequem. Das halb gefütterte Innere gibt sanfte Wärme und schützt die wasserdichte Schicht vor Reibung. Die atmungsaktive Konstruktion hilft bei der Temperaturregulierung, 360-Grad-Reflexion erhöht die Sichtbarkeit. Aus 100 % recyceltem Polyester, winddicht und wasserdicht.',
    specs: { 'Marke': 'AGU', 'Serie': 'RainGuard', 'Material': '100 % recyceltes Polyester, 3-lagiges Ripstop', 'Wassersäule': '20.000 mm', 'Beschichtung': 'PFAS-freie DWR', 'Futter': 'Halb gefüttert', 'Sicherheit': '360-Grad-Reflexion' } },
  { slug: 'agu-original-regenanzug-essential', name: 'AGU Original Regenanzug Essential', agu: 134.95, sizes: SZ, color: ['Schwarz', '#1C1C1E'],
    short: 'Regenanzug aus Jacke und Hose, wasserdicht und atmungsaktiv, mit 5.000 mm Wassersäule und getapten Nähten.',
    desc: 'Der Klassiker unter der Regenkleidung von AGU: Mit diesem Regenanzug aus Jacke und Hose kommen Sie auch bei Regen trocken zur Arbeit oder zum Einkauf. Dank 5.000 mm Wassersäule, getapter Nähte und verschließbarer Ärmel bleiben Sie trocken. Das Poray-Membran macht die Jacke zudem atmungsaktiv. Doppelter Reißverschluss, verstellbare Kapuze, reflektierende Details und zwei Seitentaschen.',
    specs: { 'Marke': 'AGU', 'Serie': 'Original Essential', 'Lieferumfang': 'Jacke und Hose', 'Material': '100 % Polyester', 'Wassersäule': '5.000 mm', 'Nähte': 'Getapt', 'Kapuze': 'Verstellbar', 'Taschen': '2 Seitentaschen' } },
  { slug: 'agu-tech-regen-ueberschuhe-commuter-hi-vis', name: 'AGU Tech Regen Überschuhe Commuter Hi-Vis', agu: 35.95, was: 59.95, sizes: SZ, color: ['Neon Gelb', '#DFFF00'],
    short: 'Wind- und wasserdichte Überschuhe in Neongelb mit Reflexion, rückseitiger Reißverschluss.',
    desc: 'Die Tech Regen Bike Boots Commuter Hi-Vis halten die Füße trocken und sorgen für gute Sichtbarkeit im Verkehr. Sie lassen sich leicht über die Schuhe ziehen und nach der Ankunft ebenso schnell wieder ausziehen. Wind- und wasserdicht, neongelb mit Reflexion, wasserabweisender Reißverschluss hinten, Oberkante mit Klett verstellbar. Aus 100 % recyceltem Polyester.',
    specs: { 'Marke': 'AGU', 'Serie': 'Commuter Tech', 'Material': '100 % recyceltes Polyester', 'Eigenschaften': 'Wind- und wasserdicht', 'Farbe': 'Neongelb mit Reflexion', 'Verschluss': 'Reißverschluss hinten, Klett oben' } },
  { slug: 'agu-winter-regen-ueberschuhe-commuter', name: 'AGU Winter Regen Überschuhe Commuter', agu: 64.95, sizes: SZ, color: ['Schwarz', '#1C1C1E'],
    short: 'Leichte Winter-Überschuhe mit Kevlar-Verstärkung und isolierendem Futter, wind- und wasserdicht.',
    desc: 'Leichte, schützende Winter-Überschuhe mit Kevlar-Verstärkung an der Unterseite, isolierendem Futter mit gebürsteter Innenseite, Klettverschluss und reflektierenden Details. Sie halten die Füße bei kalten und nassen Winterbedingungen warm und trocken. Wind- und wasserdicht, wasserabweisende Reißverschlüsse. Material: 85 % Polyester, 10 % Kevlar, 5 % Polyamid.',
    specs: { 'Marke': 'AGU', 'Serie': 'Commuter Winter', 'Material': '85 % Polyester, 10 % Kevlar, 5 % Polyamid', 'Eigenschaften': 'Wind- und wasserdicht, gebürstetes Futter', 'Verstärkung': 'Kevlar an der Unterseite', 'Verschluss': 'Klett oben, wasserabweisende Reißverschlüsse' } },
];
const out = ITEMS.map((i) => { const img = `/products/${i.slug}/v1-1.webp`; return {
  id: i.slug, slug: i.slug, name: i.name, brand: 'AGU', category: 'Zubehör', accessory: 'regenschutz-bekleidung', price: q2(i.agu * 0.995), ...(i.was ? { originalPrice: i.was } : {}),
  inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: 'Zubehör', torqueNm: 0, batteryStandardWh: 0, rangeKm: 0, weightKg: 0, image: img, gallery: [img],
  shortDescription: i.short, description: i.desc,
  options: { frameSizes: i.sizes, batteries: [{ label: 'Ohne Akku', capacityWh: 0, priceDelta: 0 }], colors: [{ name: i.color[0], hex: i.color[1] }] }, specs: i.specs, isFeatured: false }; });
const ts = `import type { Product } from './types';\n\n// Generated by scripts/build-rain-catalog.cjs from agu.com (EUR), 2026-11-20.\n// price = current agu.com price x 0.995, slightly below the manufacturer (owner rule); originalPrice = AGU regular price where agu.com shows a reduction. Stock confirmed by the owner 2026-11-20.\n\nexport const RAIN_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2).replace(/\\u00fc/g, 'ü')};\n`;
fs.writeFileSync('lib/catalog-rain.ts', ts); console.log('written', out.length, 'products', out.map((p) => p.slug + ' ' + p.price).join(' | '));
