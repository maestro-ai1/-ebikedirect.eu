import type { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { productKeywords } from '@/lib/product-keywords';

// On-page SEO helpers for product pages (Product Rule): power-word title, 110-158 character description, 400+ word structured copy.
// Every sentence is built from the product's own data or from owner-confirmed shop terms; nothing is invented.

const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export const CATEGORY_LABEL: Record<Product['category'], string> = {
  'E-MTB': 'E-Mountainbike',
  'E-Trekking': 'Trekking-E-Bike',
  'E-City': 'City-E-Bike',
  'Speed-Pedelec': 'S-Pedelec',
  'Cargo-E-Bike': 'Cargo-E-Bike',
  'Falt-E-Bike': 'Falt-E-Bike',
  'E-Gravel': 'E-Gravel-Bike',
  'E-Kinder': 'Kinder-E-Bike',
  'Zubehör': 'Zubehör'
};

export const CATEGORY_PATH: Record<string, string> = {
  'E-MTB': '/e-bikes/e-mountainbikes',
  'E-Trekking': '/e-bikes/trekking-e-bikes',
  'E-City': '/e-bikes/city-e-bikes',
  'Speed-Pedelec': '/e-bikes/s-pedelec',
  'Cargo-E-Bike': '/e-bikes/cargo-bikes',
  'Falt-E-Bike': '/e-bikes/falt-e-bikes',
  'E-Gravel': '/e-bikes/e-rennrad-gravel',
  'E-Kinder': '/e-bikes/kinder-jugend',
  'Zubehör': '/zubehoer'
};

const BRAND_PATH: Record<string, string> = {
  Cube: '/marken/cube', Specialized: '/marken/specialized', 'Riese & Müller': '/marken/riese-und-mueller', Haibike: '/marken/haibike',
  Kalkhoff: '/marken/kalkhoff', Gazelle: '/marken/gazelle', Canyon: '/marken/canyon', Tenways: '/marken/tenways', Focus: '/marken/focus',
  Winora: '/marken/winora', Ghost: '/marken/ghost', KTM: '/marken/ktm', Trek: '/marken/trek', Giant: '/marken/giant'
};
// every brand with a bike in the catalogue has a hub page /marken/<slug>
export const brandPath = (brand: string): string | undefined =>
  BRAND_PATH[brand] ||
  '/marken/' + brand.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Title starts with the product name and ends with a power word; the longest variant that fits 60 characters wins. */
/** "kalkhoff endeavour 5" -> "Kalkhoff Endeavour 5": keyword as it is written in a heading, title or question. */
const SMALL = new Set(['und', 'für', 'mit', 'von', 'der', 'die', 'das', 'im', 'in', 'bei', 'zu', 'oder']);
const BRAND_CASE: Record<string, string> = { ktm: 'KTM', qio: 'QiO' };
export const titleCase = (kw: string) => kw.split(' ').map((w, i) => (BRAND_CASE[w] ? BRAND_CASE[w] : i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');

// The title starts with the mapped primary keyword when it is not simply the product name (Golden Keyword Rule section 5).
export function productTitle(name: string, focus?: string): string {
  const lead = focus && !name.toLowerCase().startsWith(focus.toLowerCase()) ? titleCase(focus) : '';
  const keyed = lead ? [`${lead} kaufen: ${name} | ebikedirect.eu`, `${lead}: ${name} | ebikedirect.eu`, `${lead} kaufen | ebikedirect.eu`, `${lead} | ebikedirect.eu`] : [];
  const keyedHit = keyed.find((v) => v.length <= 60);
  if (keyedHit) return keyedHit;
  const variants = [`${name} kaufen: sofort lieferbar | ebikedirect.eu`, `${name} kaufen – ab Lager | ebikedirect.eu`, `${name} kaufen | Bestpreis | ebikedirect.eu`, `${name} kaufen | ebikedirect.eu`, `${name} | ebikedirect.eu`];
  return variants.find((v) => v.length <= 60) || name.slice(0, 60);
}

export function productDescription(p: Pick<Product, 'name' | 'price' | 'motor' | 'batteryStandardWh' | 'rangeKm'>, focus?: string): string {
  const price = eur(p.price);
  const wh = p.batteryStandardWh > 0 ? `, ${p.batteryStandardWh} Wh` : '';
  const keyedTries = focus && !p.name.toLowerCase().startsWith(focus.toLowerCase()) ? [
    `${titleCase(focus)} kaufen: ${p.name} mit ${p.motor.split(' ').slice(0, 3).join(' ')}${wh}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie, Lieferung per Spedition.`,
    `${titleCase(focus)} kaufen: ${p.name}${wh.replace(', ', ' mit ')}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie und Spedition.`,
    `${titleCase(focus)} kaufen: ${p.name}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie, Lieferung per Spedition.`
  ] : [];
  const keyedHit = keyedTries.find((t) => t.length >= 110 && t.length <= 158);
  if (keyedHit) return keyedHit;
  const tries = [
    `${p.name} kaufen: ${p.motor}${wh}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie, Lieferung per Spedition.`,
    `${p.name} kaufen: ${p.motor.split(' ').slice(0, 3).join(' ')}${wh}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie und Spedition.`,
    `${p.name} kaufen${wh.replace(', ', ': ')}. Jetzt für ${price} ab Lager sichern, 2 Jahre Garantie, Lieferung per Spedition.`,
    `${p.name} kaufen: Jetzt für ${price} ab Lager sichern. 2 Jahre Garantie, 30 Tage Rückgaberecht, Lieferung per Spedition.`
  ];
  let text = tries.find((t) => t.length >= 110 && t.length <= 158) || tries[tries.length - 1];
  if (text.length > 158) text = text.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (text.length < 110) text = `${text} Alle Preise inklusive Mehrwertsteuer.`;
  return text;
}

const CATEGORY_TEXT: Record<string, string> = {
  'E-MTB': 'E-Mountainbikes verbinden einen kräftigen Mittelmotor mit einem stabilen Rahmen und einer Federung für Trails, Schotterwege und steile Anstiege. Wichtig sind ein hohes Drehmoment, ein großer Akku und leistungsfähige Bremsen. Fullys mit Hinterbaufederung bieten mehr Komfort und Kontrolle im Gelände, Hardtails sind leichter und brauchen weniger Wartung.',
  'E-Trekking': 'Trekking-E-Bikes sind für lange Strecken auf Straße und Radweg gebaut. Sie haben meist Gepäckträger, Schutzbleche und Beleuchtung ab Werk, eine aufrechte Sitzposition und einen großen Akku für hohe Reichweiten. Damit eignen sie sich für den Arbeitsweg ebenso wie für Radreisen am Wochenende.',
  'E-City': 'City-E-Bikes machen den Alltag in der Stadt leichter: aufrechte Sitzposition, Schutzbleche, Licht und oft ein tiefer Einstieg zum bequemen Auf- und Absteigen. Sie sind auf Komfort, Sicherheit und wartungsarmen Betrieb ausgelegt und eignen sich für Pendler, Einkäufe und Ausflüge.',
  'Speed-Pedelec': 'S-Pedelecs unterstützen bis 45 km/h und gelten rechtlich als Kleinkrafträder. Dafür sind ein Versicherungskennzeichen, mindestens der Führerschein der Klasse AM und ein Helm nötig. Sie sind die schnellste Art, mit Muskelkraft und Motor längere Pendelstrecken in kurzer Zeit zu fahren.',
  'Cargo-E-Bike': 'Cargo-E-Bikes transportieren Kinder, Einkäufe oder Lasten mit Motorunterstützung. Der lange Radstand und der stabile Rahmen sorgen für sicheren Stand, der Motor gleicht das Gewicht aus. Sie ersetzen im Alltag oft ein Zweitauto auf kurzen Strecken.',
  'Falt-E-Bike': 'Falt-E-Bikes lassen sich klein zusammenlegen und passen in Bahn, Kofferraum oder Wohnung. Kleine Laufräder und ein kompakter Rahmen machen sie wendig in der Stadt, der Motor unterstützt auch bei Anstiegen und Gegenwind.',
  'E-Kinder': 'Kinder- und Jugend-E-Bikes haben einen kleineren Rahmen, kleinere Laufräder und einen sanft einsetzenden Motor, damit Kinder ab dem Schulalter sicher mit Unterstützung fahren. Wichtig sind ein niedriges Gewicht, zuverlässige Bremsen und die richtige Rahmengröße. Der Akku ist meist kleiner als bei Erwachsenenrädern, was das Rad leicht hält.',
  'E-Gravel': 'E-Rennräder und E-Gravelbikes verbinden einen leichten Rahmen mit Rennlenker, schmalen bis mittelbreiten Reifen und einem kompakten Motor. Sie sind schneller und sportlicher als ein Trekkingrad und eignen sich für Asphalt, Feldwege und lange Touren. Viele Modelle haben einen kleinen, leichten Akku, damit das Fahrgefühl eines normalen Rennrads erhalten bleibt.',
};

const WHO_TEXT: Record<string, string> = {
  'E-MTB': 'Das Modell richtet sich an Fahrerinnen und Fahrer, die im Gelände mehr Höhenmeter und längere Touren fahren möchten, ohne auf Fahrspaß zu verzichten.',
  'E-Trekking': 'Das Modell passt zu Pendlern und Tourenfahrern, die Komfort, Gepäcktransport und eine hohe Reichweite für lange Strecken suchen.',
  'E-City': 'Das Modell passt zu allen, die in der Stadt und im Umland komfortabel, sicher und ohne Schweiß ankommen wollen.',
  'Speed-Pedelec': 'Das Modell passt zu Pendlern, die längere Strecken zügig fahren möchten und die rechtlichen Voraussetzungen für ein S-Pedelec erfüllen.',
  'Cargo-E-Bike': 'Das Modell passt zu Familien und Gewerbetreibenden, die Kinder oder Lasten sicher mit dem Rad transportieren möchten.',
  'Falt-E-Bike': 'Das Modell passt zu Menschen, die Bahn, Auto und Rad kombinieren und wenig Platz zum Abstellen haben.',
  'E-Kinder': 'Das Modell passt zu Kindern und Jugendlichen, die mit Motorunterstützung sicher Rad fahren möchten, und zu Eltern, die auf Gewicht, Bremsen und die passende Rahmengröße achten.',
  'E-Gravel': 'Das Modell passt zu sportlichen Fahrerinnen und Fahrern, die längere Strecken auf Asphalt und Schotter fahren möchten und dabei Unterstützung am Berg und bei Gegenwind schätzen.',
};

export interface ProductContentData {
  focus: string;
  sections: { h2: string; blocks: { h3?: string; text: string }[] }[];
  faqs: { q: string; a: string }[];
  words: number;
}

const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;
const pct = (n: number) => Math.abs(Math.round(n));

export function buildProductContent(p: Product, focus: string): ProductContentData {
  const cat = CATEGORY_LABEL[p.category];
  const wh = p.batteryStandardWh > 0 ? p.batteryStandardWh : 0;
  const price = eur(p.price);
  const peers = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
  const avg = peers.length ? peers.reduce((t, x) => t + x.price, 0) / peers.length : p.price;
  const cheaper = peers.filter((x) => x.price < p.price).length;
  const withWh = peers.filter((x) => x.batteryStandardWh > 0);
  const biggerBattery = withWh.filter((x) => x.batteryStandardWh > wh).length;
  const frameInfo = p.options.frameSizes.length > 1 && p.options.frameSizes.every((x) => x.length < 25)
    ? `Es ist in den Rahmengrößen ${p.options.frameSizes.join(', ')} erhältlich.`
    : 'Rahmenform und Größe stimmen wir bei der Bestellbestätigung mit Ihnen ab.';
  const colors = p.options.colors.map((c) => c.name).filter(Boolean);

  const specBlocks = Object.entries(p.specs || {}).map(([k, v]) => ({ h3: k, text: `${k}: ${v}.` }));

  const position: string[] = [];
  if (peers.length >= 3) {
    const diff = ((p.price - avg) / avg) * 100;
    position.push(`Im Shop gibt es ${peers.length} weitere ${cat}s. Mit ${price} liegt das Rad ${pct(diff) < 3 ? 'ungefähr auf dem Durchschnitt' : diff > 0 ? `rund ${pct(diff)} % über dem Durchschnitt` : `rund ${pct(diff)} % unter dem Durchschnitt`} von ${eur(avg)}; ${cheaper} dieser Modelle sind günstiger.`);
  }
  if (wh > 0 && withWh.length >= 3) {
    position.push(`Der ${wh} Wh Akku ist ${biggerBattery === 0 ? 'der größte' : biggerBattery < withWh.length / 3 ? 'einer der größten' : biggerBattery < (withWh.length * 2) / 3 ? 'von mittlerer Größe' : 'eher kompakt'} in dieser Kategorie; ${biggerBattery} Modelle haben mehr Kapazität.`);
  }

  const sections: ProductContentData['sections'] = [
    {
      h2: `${p.name}: Überblick`,
      blocks: [
        { text: `${focus.charAt(0).toUpperCase() + focus.slice(1)} bei ebikedirect.eu: Dieses Rad von ${p.brand} ist ein ${cat} mit ${p.motor}${wh ? ` und ${wh} Wh Akku` : ''}. Es kostet ${price} inklusive 19 % Mehrwertsteuer und ist ab Lager lieferbar.` },
        { text: p.description }
      ]
    },
    { h2: 'Ausstattung im Detail', blocks: specBlocks },
    {
      h2: 'Größen, Farben und Gewicht',
      blocks: [{ text: `${frameInfo}${colors.length ? ` Farbe: ${colors.slice(0, 3).join(', ')}.` : ''}${p.weightKg > 0 ? ` Das Gewicht beträgt ${p.weightKg} kg.` : ''}${p.rangeKm > 0 ? ` Der Hersteller nennt bis zu ${p.rangeKm} km Reichweite; sie hängt von Fahrergewicht, Gelände, Unterstützungsstufe und Temperatur ab.` : ''}${p.category === 'Speed-Pedelec' ? ' Als S-Pedelec bis 45 km/h braucht das Rad ein Versicherungskennzeichen und einen passenden Führerschein.' : ''}` }]
    }
  ];
  sections.splice(1, 0, {
    h2: 'Auf einen Blick',
    blocks: [{ text: `Marke: ${p.brand}. Kategorie: ${cat}. Antrieb: ${p.motor}.${wh ? ` Akku: ${wh} Wh.` : ''}${p.torqueNm > 0 ? ` Drehmoment: bis zu ${p.torqueNm} Nm.` : ''}${p.weightKg > 0 ? ` Gewicht: ${p.weightKg} kg.` : ''} Preis: ${price} inklusive 19 % Mehrwertsteuer, ab Lager lieferbar mit 2 Jahren Garantie. Die Lieferung erfolgt per Spedition mit Hebebühne nach Terminabsprache.` }]
  });
  // Secondary keywords from the product map: one H3 each, every one carrying a different fact about this bike (no repeated wording).
  const kw = productKeywords(p.slug);
  const secondary = (kw?.secondary || []).slice(0, 5).map((s) => s.keyword);
  if (secondary.length) {
    const facts = [
      `Es kostet ${price} inklusive 19 % Mehrwertsteuer${p.price < 10000 ? ', dazu kommt die Speditionspauschale bis 10.000 € Bestellwert' : ', der Versand ist kostenfrei'}.`,
      `Der Antrieb ist ${p.motor}${p.torqueNm > 0 ? ` mit bis zu ${p.torqueNm} Nm Drehmoment` : ''}.`,
      wh ? `Der Akku hat ${wh} Wh${p.rangeKm > 0 ? `, der Hersteller nennt bis zu ${p.rangeKm} km Reichweite` : ''}.` : `${cat} von ${p.brand}: die Akkudaten stehen in der Ausstattungsliste weiter oben.`,
      frameInfo,
      'Lieferung per Spedition mit Hebebühne, 2 Jahre Garantie und 30 Tage Rückgaberecht.'
    ];
    sections.push({ h2: 'Preis, Antrieb, Akku und Lieferung im Überblick', blocks: secondary.map((s, i) => ({ h3: titleCase(s), text: facts[i] })) });
  }
  if (position.length) sections.push({ h2: 'Preis und Akku im Vergleich', blocks: [{ text: position.join(' ') }] });
  sections.push({ h2: 'Preis, Zahlung, Lieferung und Garantie', blocks: [{ text: `Der Preis liegt bei ${price} inklusive 19 % Mehrwertsteuer. Bei Vorkasse überweisen Sie genau diesen Betrag, bei Zahlung in Kryptowährung gilt der Preis von ${eur(p.price * 0.9)} (10 % Rabatt). ${p.price < 10000 ? 'Zum Preis kommt die Speditionspauschale von 49 € hinzu, ab 10.000 € Bestellwert ist der Versand kostenfrei.' : 'Der Versand ist bei diesem Bestellwert kostenfrei.'} Das Rad wird per Spedition mit Hebebühne nach Terminabsprache geliefert. Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht. Einzelheiten stehen in den Bedingungen zu Lieferung, Rückgabe und Garantie.` }] });

  const defaultFaqs = [
    { q: 'Was kostet das Rad?', a: `${price} inklusive 19 % Mehrwertsteuer${p.price < 10000 ? ', dazu kommt die Speditionspauschale bis 10.000 € Bestellwert' : ', der Versand ist kostenfrei'}. Bei Zahlung in Kryptowährung sind es ${eur(p.price * 0.9)}.` },
    { q: 'Welchen Motor hat das Rad?', a: `${p.motor}${p.torqueNm > 0 ? ` mit bis zu ${p.torqueNm} Nm Drehmoment` : ''}. Der Antrieb gehört zu einem ${cat}${wh ? ` mit ${wh} Wh Akku` : ''} der Marke ${p.brand}.` },
    { q: 'Wie groß ist der Akku?', a: wh ? `Der Akku hat ${wh} Wh${p.rangeKm > 0 ? `, der Hersteller nennt bis zu ${p.rangeKm} km Reichweite` : ''}. Beim Preis von ${price} entspricht das rund ${eur(p.price / wh).replace(',00', '')} je Wattstunde Akkukapazität.` : 'Die Akkukapazität steht in den technischen Daten oben.' },
    { q: 'In welchen Größen gibt es das Rad?', a: frameInfo },
    { q: 'Ist das Rad sofort lieferbar?', a: 'Ja, es ist ab Lager lieferbar. Die Zustellung erfolgt per Spedition mit Hebebühne nach Terminabsprache, danach gelten 2 Jahre Garantie und 30 Tage Rückgaberecht.' }
  ];
  // Each FAQ carries one mapped FAQ keyword as its topic; without a keyword the plain question stays.
  const shortQ = ['Was kostet das Modell?', 'Welchen Motor hat es?', 'Wie groß ist der Akku?', 'In welchen Größen gibt es das Rad?', 'Ist es sofort lieferbar?'];
  const faqKeywords = (kw?.faq || []).slice(0, 5).map((f) => f.keyword);
  const faqs = defaultFaqs.map((f, i) => (faqKeywords[i] ? { q: `${titleCase(faqKeywords[i])}: ${shortQ[i]}`, a: f.a } : f));

  const words = sections.reduce((t, sec) => t + wc(sec.h2) + sec.blocks.reduce((b, bl) => b + wc(bl.text) + (bl.h3 ? wc(bl.h3) : 0), 0), 0) + faqs.reduce((t, f2) => t + wc(f2.q) + wc(f2.a), 0);
  return { focus, sections, faqs, words };
}
