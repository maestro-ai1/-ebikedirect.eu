import enProducts from '@/data/keywords/en-products.json';
import { PRODUCTS } from '@/lib/products';
import type { Product } from '@/lib/types';
import { frRelated } from '@/lib/l10n-product';

// English (UK database) product pages: keywords (data/keywords/en-products.json), title, description, specs and copy, all built from catalogue data.
// Nothing is invented: every sentence comes from a spec value, the price, or shop terms the owner confirmed. No VAT wording.
export interface EnKw { keyword: string; volume: number; kd: number | null; intent: string }
export interface EnEntry { primary: EnKw & { source: string }; secondary: EnKw[]; faq: EnKw[] }

const MAP = (enProducts as unknown as { products: Record<string, EnEntry> }).products;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const DISP: Record<string, string> = { emtb: 'eMTB', mtb: 'MTB', uk: 'UK', ktm: 'KTM', qio: 'QiO', abus: 'ABUS', bmx: 'BMX' };
/** "cube reaction pro" -> "Cube reaction pro": the keyword as it is written in a title or heading. */
export const enDisplay = (kw: string) => {
  const w = kw.split(' ').map((x) => DISP[x] || x);
  return DISP[kw.split(' ')[0]] ? w.join(' ') : cap(w.join(' '));
};

export function enEntry(p: Product): EnEntry {
  const e = MAP[p.slug];
  if (e) return e;
  return { primary: { keyword: `buy ${p.name.toLowerCase()}`, volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] };
}

const fmt = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fmt2 = (n: number) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(n);

export const EN_CATEGORY_LABEL: Record<string, string> = { 'E-MTB': 'Electric mountain bike', 'E-Trekking': 'Electric trekking bike', 'E-City': 'Electric city bike', 'Speed-Pedelec': 'Speed pedelec', 'Cargo-E-Bike': 'Electric cargo bike', 'Falt-E-Bike': 'Electric folding bike', 'E-Gravel': 'Electric gravel bike', 'E-Kinder': 'Kids electric bike', 'Zubehör': 'Accessory' };
const CAT_NOUN: Record<string, string> = { 'E-MTB': 'electric mountain bike', 'E-Trekking': 'electric trekking bike', 'E-City': 'electric city bike', 'Speed-Pedelec': 'speed pedelec', 'Cargo-E-Bike': 'electric cargo bike', 'Falt-E-Bike': 'electric folding bike', 'E-Gravel': 'electric gravel bike', 'E-Kinder': 'electric bike for kids' };

const CATEGORY_TEXT: Record<string, string> = {
  'E-MTB': 'Electric mountain bikes pair a powerful mid-drive motor with a robust frame and suspension for trails, tracks and steep climbs. High torque, a large battery and strong brakes matter most. Full-suspension models offer more comfort and control on rough ground; hardtails are lighter and need less maintenance.',
  'E-Trekking': 'Electric trekking bikes are built for long distances on roads and cycle paths. They usually come with a rack, mudguards and lights as standard, an upright seating position and a large battery for long range. They suit daily commuting as well as weekend bike tours.',
  'E-City': 'Electric city bikes make everyday riding in town easier: upright position, mudguards, lights and often a low step-through frame for easy mounting and dismounting. They focus on comfort, safety and low maintenance, and suit commuting, shopping and leisure rides.',
  'Speed-Pedelec': 'Speed pedelecs assist up to 45 km/h and are classed as mopeds in many countries. An insurance plate, a suitable licence and a helmet are usually required, so check the rules that apply where you ride. They are the fastest way to cover longer commutes with leg power and a motor.',
  'Cargo-E-Bike': 'Electric cargo bikes carry children, shopping or loads with the help of the motor. The long wheelbase and stable frame give good balance, and the motor takes care of the weight. In daily use they often replace a second car on short trips.',
  'Falt-E-Bike': 'Electric folding bikes fold down to a small package and fit in a train, a car boot or a flat. Small wheels and a compact frame make them handy in town, and the motor helps on hills and against the wind.',
  'E-Kinder': 'Electric bikes for kids and teenagers have a smaller frame, smaller wheels and a motor with a gentle start, so young riders can ride with assistance safely from school age. Low weight, reliable brakes and the right frame size are essential. The battery is usually smaller than on adult bikes, which keeps the bike light.',
  'E-Gravel': 'Electric road and gravel bikes combine a light frame with drop handlebars, narrow to medium tyres and a compact motor. They are faster and sportier than a trekking bike and suit tarmac, tracks and long rides. Many models have a small, light battery to keep the feel of a classic road bike.',
};
const WHO_TEXT: Record<string, string> = {
  'E-MTB': 'The model suits riders who want more climbing and longer days off-road without giving up the fun of riding.',
  'E-Trekking': 'The model suits commuters and bike tourers who want comfort, luggage capacity and long range for long distances.',
  'E-City': 'The model suits anyone who wants to arrive comfortably, safely and without breaking a sweat, in town and on the outskirts.',
  'Speed-Pedelec': 'The model suits commuters who want to ride fast over longer distances and who meet the legal requirements for speed pedelecs where they ride.',
  'Cargo-E-Bike': 'The model suits families and professionals who want to carry children or loads safely by bike.',
  'Falt-E-Bike': 'The model suits people who combine train, car and bike and have little space to store a bike.',
  'E-Kinder': 'The model suits children and teenagers who want to ride safely with assistance, and parents who care about weight, brakes and the right frame size.',
  'E-Gravel': 'The model suits sporty riders who want to go further on tarmac and tracks, with help on climbs and against the wind.',
};

// ---------- specs: German catalogue values translated word by word; a value that still contains German is left out of the English page
const SPEC_LABEL: Record<string, string> = { Motor: 'Motor', Akku: 'Battery', Display: 'Display', Schaltung: 'Gears', Bremsen: 'Brakes', Rahmen: 'Frame', Gabel: 'Fork', Reifen: 'Tyres', 'Laufradgröße': 'Wheel size', Drehmoment: 'Torque', Gewicht: 'Weight', Reichweite: 'Range', Antrieb: 'Drive', Federweg: 'Suspension travel', Geschwindigkeit: 'Speed', Sensor: 'Sensor', Bedieneinheit: 'Control unit', App: 'App', 'Gepäckträger': 'Rack', Vorbau: 'Stem', Transport: 'Transport', 'Passend für': 'Fits', Material: 'Material', Farbe: 'Colour', 'Größe': 'Size', 'Länge': 'Length', Inhalt: 'Contents', Volumen: 'Volume', Lieferumfang: 'In the box' };
const RULES: [RegExp, string][] = [
  [/&quot;|&ldquo;|&rdquo;/g, '"'], [/&amp;/g, '&'], [/&#39;|&rsquo;/g, '’'],
  [/Stufenlose Getriebe-Nabenschaltung/gi, 'continuously variable hub gear'], [/Stufenlose/gi, 'continuously variable'], [/Getriebeschaltung/gi, 'gearbox'], [/Nabenschaltung/gi, 'hub gear'], [/Kettenschaltung/gi, 'derailleur'],
  [/(\d+)[- ]Gang/gi, '$1-speed'], [/(\d+) Gänge/gi, '$1 speeds'], [/mit Riemenantrieb/gi, 'with belt drive'], [/Riemenantrieb/gi, 'belt drive'], [/\(Freilauf\)/gi, '(freewheel)'], [/\(Rücktrittbremse\)/gi, '(coaster brake)'], [/Rücktrittbremse/gi, 'coaster brake'],
  [/hydraulische Scheibenbremse/gi, 'hydraulic disc brake'], [/hydraulische Felgenbremse/gi, 'hydraulic rim brake'], [/Scheibenbremse/gi, 'disc brake'], [/Felgenbremse/gi, 'rim brake'], [/hydraulische/gi, 'hydraulic'], [/(\d)\/(\d)[- ]Kolben/gi, '$1/$2-piston'], [/(\d)[- ]Kolben/gi, '$1-piston'],
  [/Mittelmotor/gi, 'mid-drive motor'], [/Hinterradmotor/gi, 'rear hub motor'], [/Frontmotor/gi, 'front hub motor'],
  [/mit integrierten Display/gi, 'with integrated display'], [/Farb ?-?Display/gi, 'colour display'], [/mit Schiebehilfe/gi, 'with walk assist'], [/Schiebehilfe/gi, 'walk assist'], [/inklusive Mini Remote/gi, 'including mini remote'],
  [/\(mit Update bis zu (\d+) Nm\)/gi, '(up to $1 Nm with update)'], [/bis zu/gi, 'up to'], [/\bbis\b/gi, 'up to'],
  [/Starrgabel/gi, 'rigid fork'], [/Federgabel/gi, 'suspension fork'], [/Federweg/gi, 'travel'], [/\bZoll\b/gi, 'inch'], [/Steckachse/gi, 'thru-axle'], [/Stahlfeder/gi, 'steel spring'], [/Spiralfeder/gi, 'coil spring'], [/Teleskop/gi, 'telescopic'], [/\bLuft\b/gi, 'air'],
  [/\bohne Akku\b/gi, 'without battery'], [/\bmit Akku\b/gi, 'with battery'], [/\bohne\b/gi, 'without'], [/\bTiefeinsteiger\b/gi, 'step-through'], [/\bDiamant\b/gi, 'diamond frame'], [/\bFully\b/gi, 'full suspension'], [/\bTrapez\b/gi, 'trapeze frame'],
  [/Lithium[- ]?Ionen/gi, 'lithium-ion'], [/\bStahl\b/gi, 'steel'], [/Pannenschutz/gi, 'puncture protection'], [/herausnehmbar(er|e|en)?/gi, 'removable'],
  [/\bAluminium\b/gi, 'aluminium'], [/\bmit\b/gi, 'with'], [/\bund\b/gi, 'and'], [/\binklusive\b/gi, 'including'],
];
const GERMAN_LEFT = /([äöüß]|\b(der|die|das|ein|eine|für|nicht|auch|oder|zum|zur|beim|werden|wird|ist|sind|integriert|integrierter|integrierten|Akku|Rahmen|Gepäckträger|Schutzblech|Seitenständer|Aufnahme|Achsaufnahme|Anhänger|Auslieferung|kompatibel|universell|Fahrrad|Mischung|hinten|vorne|Schaft|Fach|Dämpfer)\b|[A-Za-z]{4,}(ung|keit|heit|lich)\b)/;
export function enSpecValue(v: string): string | null {
  let s = v;
  for (const [re, r] of RULES) s = s.replace(re, r);
  s = s.replace(/\s+/g, ' ').trim();
  if (GERMAN_LEFT.test(s)) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function enSpecs(p: Product): [string, string][] {
  const out: [string, string][] = [];
  for (const [k, v] of Object.entries(p.specs || {})) {
    const label = SPEC_LABEL[k];
    const val = label ? enSpecValue(v) : null;
    if (label && val) out.push([label, val]);
  }
  return out;
}

const nz = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
/** H1: the product name; when the main keyword is not part of the name, the keyword leads: "Cube nuroad race: Cube Nuroad Hybrid ...". */
export function enH1(p: Product): string {
  const e = enEntry(p);
  if (e.primary.source !== 'bank') return p.name;
  return nz(p.name).includes(nz(e.primary.keyword)) ? p.name : `${enDisplay(e.primary.keyword)}: ${p.name}`;
}

// ---------- title and description
export function enTitle(p: Product): string {
  const e = enEntry(p);
  const lead = e.primary.source === 'bank' && !p.name.toLowerCase().startsWith(e.primary.keyword.toLowerCase()) ? enDisplay(e.primary.keyword) : '';
  const tries = lead ? [`${lead} | ebikedirect.eu`] : [];
  const name = [`${p.name}: buy online | ebikedirect.eu`, `${p.name}: buy | ebikedirect.eu`, `${p.name} | ebikedirect.eu`];
  return [...tries, ...name].find((t) => t.length <= 60) || p.name.slice(0, 60);
}
export function enDescription(p: Product): string {
  const e = enEntry(p);
  const kwLead = e.primary.source === 'bank' && !p.name.toLowerCase().startsWith(e.primary.keyword.toLowerCase()) ? enDisplay(e.primary.keyword) : '';
  const lead = kwLead ? kwLead + ': ' + p.name : p.name;
  const wh = p.batteryStandardWh > 0 ? `, ${p.batteryStandardWh} Wh battery` : '';
  const motor = enSpecValue(p.motor) || p.motor.split(' ').slice(0, 3).join(' ');
  const price = fmt(p.price);
  const tries = p.category === 'Zubehör'
    ? [`${lead} at ${price}. Order online, 2-year warranty, 30-day returns, delivery by freight carrier.`, `${lead} at ${price}. Order online with a 2-year warranty and 30-day returns.`]
    : [`${lead}, ${motor} motor${wh}. ${price}, 2-year warranty, delivery by freight carrier.`, `${lead}${wh}. ${price}, 2-year warranty, 30-day returns, delivery by freight carrier.`, `${lead} at ${price}. 2-year warranty, 30-day returns, delivery by freight carrier.`];
  let t = tries.find((x) => x.length >= 110 && x.length <= 158) || tries[tries.length - 1];
  if (t.length > 158) t = t.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (t.length < 110) t += ' Pay by bank transfer or crypto.';
  return t;
}

// ---------- page content
export interface EnSection { h2: string; blocks: { h3?: string; text: string }[] }
const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;
const frames = (p: Product) => (p.options.frameSizes.length > 1 && p.options.frameSizes.every((x) => x.length < 25) ? `It is available in the frame sizes ${p.options.frameSizes.join(', ')}.` : 'Frame shape and size are confirmed with you when your order is checked.');

export function buildEnContent(p: Product): { lead: string; sections: EnSection[]; faqs: { q: string; a: string }[]; words: number; specs: [string, string][] } {
  const e = enEntry(p);
  const isAcc = p.category === 'Zubehör';
  const noun = isAcc ? 'accessory' : (CAT_NOUN[p.category] || 'electric bike');
  const focus = e.primary.source === 'bank' ? enDisplay(e.primary.keyword) : p.name;
  const specs = enSpecs(p);
  const price = fmt(p.price), crypto = fmt2(p.price * 0.9);
  const wh = p.batteryStandardWh;
  const motor = enSpecValue(p.motor) || p.motor;
  const lead = isAcc
    ? `${p.name} by ${p.brand}: an e-bike accessory at ${price}. Delivery by freight carrier, 2-year warranty and 30-day returns.`
    : `${p.name} by ${p.brand}: ${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun} with ${motor} motor${wh ? ` and a ${wh} Wh battery` : ''}${p.rangeKm > 0 ? `, range stated by the manufacturer up to ${p.rangeKm} km` : ''}. Price: ${price}, delivery by freight carrier, 2-year warranty.`;
  const peers = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
  const avg = peers.length ? peers.reduce((t, x) => t + x.price, 0) / peers.length : p.price;
  const cheaper = peers.filter((x) => x.price < p.price).length;
  const withWh = peers.filter((x) => x.batteryStandardWh > 0);
  const bigger = withWh.filter((x) => x.batteryStandardWh > wh).length;
  const sections: EnSection[] = [];
  sections.push({
    h2: `${p.name}: overview`,
    blocks: [
      { text: `${focus} at ebikedirect.eu: ${isAcc ? `${p.name} by ${p.brand} is an e-bike accessory at ${price}, delivered by freight carrier with a 2-year warranty.` : `this ${noun} by ${p.brand} is fitted with the ${motor} motor${wh ? ` and a ${wh} Wh battery` : ''}. It costs ${price}, with a 2-year warranty and 30-day returns.`}` },
      ...(isAcc ? [] : [{ text: CATEGORY_TEXT[p.category] || '' }, { text: WHO_TEXT[p.category] || '' }]),
    ].filter((b) => b.text),
  });
  if (specs.length) sections.push({ h2: 'Equipment in detail', blocks: specs.map(([k, v]) => ({ h3: k, text: `${k}: ${v}.` })) });
  if (!isAcc) {
    sections.push({
      h2: 'At a glance',
      blocks: [{ text: `Brand: ${p.brand}. Category: ${EN_CATEGORY_LABEL[p.category] || p.category}. Motor: ${motor}.${wh ? ` Battery: ${wh} Wh.` : ''}${p.torqueNm > 0 ? ` Torque: up to ${p.torqueNm} Nm.` : ''}${p.weightKg > 0 ? ` Weight: ${p.weightKg} kg.` : ''} Price: ${price}, 2-year warranty, delivery by freight carrier by appointment. ${frames(p)}` }],
    });
  }
  const secs = e.secondary.slice(0, 5).map((s) => s.keyword);
  if (secs.length) {
    const facts = isAcc
      ? [`${p.name} costs ${price}.`, `The item is made by ${p.brand}.`, `Payment is by bank transfer or crypto; with crypto the price is ${crypto} (10% discount).`, '2-year warranty and 30-day returns.', 'Delivery is by freight carrier; the cost and the lead time are shown at checkout.']
      : [`It costs ${price}; payment is by bank transfer or crypto (${crypto} with a 10% discount).`, `The motor is a ${motor}${p.torqueNm > 0 ? ` with up to ${p.torqueNm} Nm of torque` : ''}.`, wh ? `The battery has a capacity of ${wh} Wh${p.rangeKm > 0 ? `, and the manufacturer states a range of up to ${p.rangeKm} km` : ''}.` : 'The battery capacity is shown in the spec sheet above.', frames(p), 'Delivery by freight carrier with a lift gate, 2-year warranty and 30-day returns.'];
    sections.push({ h2: 'Price, motor, battery and delivery', blocks: secs.map((s, i) => ({ h3: enDisplay(s), text: facts[i] })) });
  }
  if (!isAcc && peers.length >= 3) {
    const diff = ((p.price - avg) / avg) * 100;
    const pos = `In this category the shop offers ${peers.length} other models. At ${price}, this bike is ${Math.abs(Math.round(diff)) < 3 ? 'close to the average' : diff > 0 ? `about ${Math.round(diff)}% above the average` : `about ${Math.abs(Math.round(diff))}% below the average`} of ${fmt(avg)}; ${cheaper} of these models are cheaper.`;
    const bat = wh > 0 && withWh.length >= 3 ? ` Its ${wh} Wh battery is ${bigger === 0 ? 'the largest' : bigger < withWh.length / 3 ? 'one of the largest' : bigger < (withWh.length * 2) / 3 ? 'mid-sized' : 'rather compact'} in the category; ${bigger} models have a higher capacity.` : '';
    sections.push({ h2: 'Price and battery compared', blocks: [{ text: pos + bat }] });
  }
  sections.push({
    h2: 'Price, payment, delivery and warranty',
    blocks: [{ text: `The price is ${price}. If you pay by bank transfer you pay this amount; if you pay with crypto the price is ${crypto} (10% discount). ${p.price < 1000 ? 'A flat freight charge of 49 € is added; delivery is free from an order value of 1,000 €.' : 'Delivery is free for this order value.'} The item is delivered by freight carrier by appointment. A 2-year warranty and 30-day returns apply.` }],
  });
  const faqKw = e.faq.slice(0, 5).map((f) => f.keyword);
  const base = isAcc
    ? [
      { q: `How much does ${p.name} cost?`, a: `${p.name} costs ${price}. If you pay with crypto the price is ${crypto} (10% discount).` },
      { q: 'Does this item fit every electric bike?', a: 'That depends on the mounting dimensions. Check the diameter, the fixing and the space on your bike before you order; for any question write to sales@ebikedirect.eu.' },
      { q: 'Which brand is the item from?', a: `The item is made by ${p.brand}.` },
      { q: 'Which warranty and returns apply?', a: 'A 2-year warranty and 30-day returns apply.' },
      { q: 'How do I pay for the item?', a: `You pay by bank transfer or crypto. With crypto you save 10%, which is ${fmt2(p.price * 0.1)} on this item.` },
    ]
    : [
      { q: 'How much does this bike cost?', a: `${price}${p.price < 1000 ? ', plus the flat freight charge of 49 € below an order value of 1,000 €' : ', free delivery'}. If you pay with crypto the price is ${crypto}.` },
      { q: 'Which motor does this bike have?', a: `${motor}${p.torqueNm > 0 ? `, with up to ${p.torqueNm} Nm of torque` : ''}. The motor drives ${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}${wh ? ` with a ${wh} Wh battery` : ''} from ${p.brand}.` },
      { q: 'What is the battery capacity?', a: wh ? `The battery has a capacity of ${wh} Wh${p.rangeKm > 0 ? `, and the manufacturer states a range of up to ${p.rangeKm} km` : ''}.` : 'The battery capacity is shown in the spec sheet.' },
      { q: 'Which sizes is this bike available in?', a: frames(p) },
      { q: 'Is this bike available straight away?', a: 'Yes, it is in stock. It is delivered by freight carrier with a lift gate, by appointment; a 2-year warranty and 30-day returns apply.' },
    ];
  const faqs = base.map((f, i) => (faqKw[i] ? { q: `${enDisplay(faqKw[i])}: ${f.q}`, a: f.a } : f));
  const words = sections.reduce((t, s) => t + wc(s.h2) + s.blocks.reduce((b, bl) => b + wc(bl.text) + (bl.h3 ? wc(bl.h3) : 0), 0), 0) + faqs.reduce((t, f) => t + wc(f.q) + wc(f.a), 0);
  return { lead, sections, faqs, words, specs };
}

export const enRelated = frRelated;
