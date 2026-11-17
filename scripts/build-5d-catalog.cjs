// Builds lib/catalog-5d.ts (accessory groups: bottles and cages, pedals, pumps and inflators) from the Muc-Off EU and Crankbrothers store feeds (EUR) cached in .image-work/feeds-5d.json (fetched 2026-11-17).
// price = current store price x 0.995, slightly below the manufacturer (owner rule); originalPrice = the manufacturer's compare-at price where the store shows one.
// Descriptions use only facts stated in the manufacturers' own product texts. Stock and delivery are owner facts and are not set here.
// usage: node scripts/build-5d-catalog.cjs
const fs = require('fs');
const q2 = (n) => Math.round(n * 100) / 100;
const FEEDS = JSON.parse(fs.readFileSync('.image-work/feeds-5d.json', 'utf8'));
const ITEMS = require('../.image-work/_5d-items.cjs');
const SEL = JSON.parse(fs.readFileSync('.image-work/5d-selection.json', 'utf8'));
const SOURCES = JSON.parse(fs.readFileSync('.image-work/5d-sources.json', 'utf8'));
// description and specs per slug: facts from the manufacturer texts
const T = {
  'muc-off-fidlock-twist-trinkflasche-600-ml-mit-halter': ['Trinkflasche mit Fidlock Twist Verschluss: Sie wird am Rad aufgesteckt und zum Trinken abgedreht, ein Flaschenhalter ist nicht nötig. Im Set mit der passenden Bike Base, Inhalt 600 ml.', { 'Marke': 'Muc-Off x Fidlock', 'Inhalt': '600 ml', 'Lieferumfang': 'Flasche und Bike Base', 'Befestigung': 'Fidlock Twist, ohne Flaschenhalter' }],
  'muc-off-fidlock-twist-trinkflasche-450-ml-mit-halter': ['Trinkflasche mit Fidlock Twist Verschluss: Sie wird am Rad aufgesteckt und zum Trinken abgedreht, ein Flaschenhalter ist nicht nötig. Im Set mit der passenden Bike Base, Inhalt 450 ml.', { 'Marke': 'Muc-Off x Fidlock', 'Inhalt': '450 ml', 'Lieferumfang': 'Flasche und Bike Base', 'Befestigung': 'Fidlock Twist, ohne Flaschenhalter' }],
  'muc-off-elite-fly-trinkflasche': ['Sportflasche der Fly Serie von Elite, die der Hersteller als die leichteste Sportflasche der Welt beschreibt. Die Kappe ist ergonomisch geformt und fördert den Flüssigkeitsstrom.', { 'Marke': 'Muc-Off x Elite', 'Serie': 'Fly' }],
  'muc-off-tool-bottle-werkzeugflasche': ['Wasserdichte Flasche für den Flaschenhalter, in der Werkzeug, Ersatzschlauch und Handy trocken mitfahren.', { 'Marke': 'Muc-Off', 'Eigenschaft': 'wasserdicht', 'Verwendung': 'Aufbewahrung im Flaschenhalter' }],
  'crankbrothers-bc2-flaschenhalter': ['Seitlich beladbarer und umkehrbarer Flaschenhalter mit integriertem Reifenheber und Tubeless-Reparaturwerkzeug in der Basis. Teil der S.O.S. Werkzeugreihe von Crankbrothers.', { 'Marke': 'Crankbrothers', 'Modell': 'BC2', 'Beladung': 'seitlich, umkehrbar', 'Integriert': 'Reifenheber und Tubeless-Reparaturwerkzeug' }],
  'crankbrothers-stamp-1-gen-2-large-flatpedale': ['Flatpedale der zweiten Generation mit konkavem Körper, Igus-Lagern und einteiligen Pins, die sich leicht ersetzen lassen. Größe Large.', { 'Marke': 'Crankbrothers', 'Modell': 'Stamp 1 Gen 2', 'Größe': 'Large', 'Typ': 'Flatpedale' }],
  'crankbrothers-stamp-7-large-flatpedale': ['Flache Alu-Plattformpedale mit 11 bis 13 mm Bauhöhe, konkaver Plattform und 10 einstellbaren Pins pro Seite. Die Größe Large empfiehlt der Hersteller für Schuhgrößen 43 bis 49.', { 'Marke': 'Crankbrothers', 'Modell': 'Stamp 7', 'Größe': 'Large, Schuhgrößen 43 bis 49 (Herstellerempfehlung)', 'Typ': 'Flatpedale' }],
  'crankbrothers-mallet-enduro-klickpedale': ['Klickpedale mit dem 4-seitigen Crankbrothers Klick-Mechanismus, umgeben von einer konkaven Plattform für mehr Stabilität. Die Plattform liegt in der Größe zwischen Mallet Trail und Mallet DH.', { 'Marke': 'Crankbrothers', 'Modell': 'Mallet Enduro', 'Typ': 'Klickpedale', 'Mechanismus': '4-seitig' }],
  'crankbrothers-eggbeater-3-klickpedale': ['Minimalistische und leichte Klickpedale mit 4-seitigem Einstieg und guter Schlammabfuhr. Float und Auslösewinkel sind einstellbar; der Hersteller gibt 5 Jahre Garantie.', { 'Marke': 'Crankbrothers', 'Modell': 'Eggbeater 3', 'Typ': 'Klickpedale', 'Garantie': '5 Jahre (Herstellerangabe)' }],
  'crankbrothers-double-shot-2-hybridpedale': ['Hybridpedale, auf der einen Seite Plattform, auf der anderen Seite Klick-Mechanismus. Geformte Pins und Rippen sorgen für Grip, dazu Lager mit Doppeldichtung.', { 'Marke': 'Crankbrothers', 'Modell': 'Double Shot 2', 'Typ': 'Hybridpedale, halb Plattform, halb Klick' }],
  'muc-off-airmach-elektrischer-mini-inflator-pro': ['Elektrischer Mini-Inflator in Taschengröße mit LED-Anzeige für Luftdruck und Akkustand. Er pumpt laut Hersteller bis 120 psi.', { 'Marke': 'Muc-Off', 'Serie': 'AirMach', 'Antrieb': 'elektrisch, Akku', 'Anzeige': 'LED, Luftdruck und Akkustand', 'Maximaldruck': '120 psi (Herstellerangabe)' }],
  'muc-off-airmach-elektrischer-inflator-pro-max': ['Größerer elektrischer Inflator der AirMach Serie mit bürstenlosem Motor in einem Aluminiumgehäuse.', { 'Marke': 'Muc-Off', 'Serie': 'AirMach', 'Antrieb': 'elektrisch, bürstenloser Motor', 'Gehäuse': 'Aluminium' }],
  'muc-off-airmach-carbon-handpumpe': ['Handpumpe aus Carbon und CNC-gefrästem Aluminium mit eingebautem ausziehbarem Schlauch und Fußstand aus Edelstahl.', { 'Marke': 'Muc-Off', 'Serie': 'AirMach Carbon', 'Material': 'Carbon und Aluminium', 'Schlauch': 'ausziehbar, integriert', 'Fußstand': 'Edelstahl' }],
  'muc-off-airmach-mini-handpumpe': ['Kleine Handpumpe mit Zylinder aus gefrästem Aluminium und einem wendbaren Ventilkopf zum Aufschrauben.', { 'Marke': 'Muc-Off', 'Serie': 'AirMach Mini', 'Zylinder': 'Aluminium', 'Ventilkopf': 'wendbar, zum Aufschrauben' }],
  'crankbrothers-klic-hv-handpumpe-mit-pluggingtool': ['Kompakte Handpumpe für Reifen mit hohem Volumen, mit im Körper verstautem Schlauch, magnetischem Kopf mit Drehhülse und klappbarem Griff. Das eingebaute Reparatursystem dient bei Reifenschäden.', { 'Marke': 'Crankbrothers', 'Modell': 'Klic HV', 'Schlauch': 'im Körper verstaut', 'Kopf': 'magnetisch, mit Drehhülse', 'Zusatz': 'Reparatursystem mit Plug-Tool' }],
  'crankbrothers-klic-standpumpe-analog': ['Standpumpe mit großem analogem Manometer, Dreibein-Standfuß und im Körper magnetisch gehaltenem Schlauch. Maximaldruck 160 psi bzw. 11 bar, Universalkopf für Presta und Schrader (Presta nur mit vollständig gewindetem Ventilkörper).', { 'Marke': 'Crankbrothers', 'Modell': 'Klic Floor Pump Analog', 'Maximaldruck': '160 psi / 11 bar', 'Manometer': 'analog', 'Ventile': 'Presta und Schrader (Presta nur vollständig gewindet)' }],
};
const HEX = [[/black|schwarz|midnight|smoked/i, '#1C1C1E'], [/white|weiss/i, '#ECECEC'], [/red|rot/i, '#A32A2A'], [/orange/i, '#E8731A'], [/yellow|gelb/i, '#E6D23A'], [/blue|blau|navy/i, '#4F6D8A'], [/green|grün/i, '#3A7D44'], [/pink|magenta/i, '#D6338A'], [/purple|violet|plum/i, '#6B3F7B'], [/silver|grey|gray|raw/i, '#9A9A9A']];
const hexOf = (n) => (HEX.find(([re]) => re.test(n)) || [0, '#888888'])[1];
const ONE_BLACK = new Set(['crankbrothers-stamp-1-gen-2-large-flatpedale', 'crankbrothers-stamp-7-large-flatpedale', 'crankbrothers-mallet-enduro-klickpedale', 'crankbrothers-eggbeater-3-klickpedale', 'crankbrothers-double-shot-2-hybridpedale']);
const out = []; const sources = fs.existsSync('data/image-sources.json') ? JSON.parse(fs.readFileSync('data/image-sources.json', 'utf8')) : {};
for (const [store, handle, group, slug, name] of ITEMS) {
  const p = FEEDS[store === 'mucoff' ? 'mucoff' : 'crank'].find((x) => x.handle === handle);
  const av = p.variants.filter((v) => v.available); const vs = av.length ? av : p.variants;
  const now = Math.min(...vs.map((v) => Number(v.price))); const cmp = Math.max(0, ...vs.map((v) => Number(v.compare_at_price) || 0));
  const imgs = SEL[slug].map((_, i) => `/products/${slug}/${slug}-v1-${i + 1}.webp`);
  for (const f of imgs) if (!fs.existsSync('public' + f)) throw new Error('missing image ' + f);
  const colorOpt = p.options.find((o) => /colou?r|farbe/i.test(o.name)); const sizeOpt = p.options.find((o) => /size|größe|length/i.test(o.name));
  const colors = (colorOpt ? [...new Set(colorOpt.values)] : []).slice(0, 8).map((n) => ({ name: n, hex: hexOf(n) }));
  const sizes = sizeOpt ? [...new Set(sizeOpt.values)].slice(0, 10) : [];
  // pedals come in several colours at the manufacturer, but only the black photos were sourced: offer the colour that the pictures show
  if (ONE_BLACK.has(slug)) { colors.length = 0; colors.push({ name: 'Schwarz', hex: '#1C1C1E' }); }
  const [desc, specs] = T[slug]; const brand = name.startsWith('Muc-Off') ? 'Muc-Off' : 'Crankbrothers';
  const srcPick = SOURCES.filter((s) => s.product === slug);
  sources[slug] = srcPick.map((s, i) => ({ file: `${slug}-v1-${i + 1}.webp`, source: s.source, store: new URL(s.source).host, fetched: '2026-11-17' }));
  out.push({
    id: slug, slug, name, brand, category: 'Zubehör', accessory: group, price: q2(now * 0.995), ...(cmp > now ? { originalPrice: cmp } : {}),
    inStock: true, stockCount: 0, rating: 0, reviewsCount: 0, motor: 'Zubehör', torqueNm: 0, batteryStandardWh: 0, rangeKm: 0, weightKg: 0,
    image: imgs[0], gallery: imgs, shortDescription: ITEMS.find((x) => x[3] === slug)[5], description: desc,
    options: { frameSizes: sizes.length ? sizes : ['Einheitsgröße'], batteries: [{ label: 'Ohne Akku', capacityWh: 0, priceDelta: 0 }], colors: colors.length ? colors : [{ name: 'Standard', hex: '#1C1C1E' }] },
    specs, isFeatured: false,
  });
}
const header = `import type { Product } from './types';\n\n// Generated by scripts/build-5d-catalog.cjs from the Muc-Off EU and Crankbrothers store feeds (EUR), 2026-11-17.\n// price = current store price x 0.995, slightly below the manufacturer (owner rule); originalPrice = the manufacturer's compare-at price. Stock and delivery times are owner facts and are not set by this script.\n`;
fs.writeFileSync('lib/catalog-5d.ts', `${header}\nexport const FIVE_D_PRODUCTS: Product[] = ${JSON.stringify(out, null, 2)};\n`);
fs.writeFileSync('data/image-sources.json', JSON.stringify(sources, null, 1));
console.log('5d products written:', out.length); for (const p of out) console.log(' ', p.slug, p.price, p.originalPrice || '', p.gallery.length + ' img', (p.options.colors.length) + ' colours', p.options.frameSizes.join('/'));
