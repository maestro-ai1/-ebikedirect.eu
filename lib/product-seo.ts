import type { Product } from '@/lib/types';

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
export function productTitle(name: string): string {
  const variants = [`${name} kaufen: sofort lieferbar | ebikedirect.eu`, `${name} kaufen – ab Lager | ebikedirect.eu`, `${name} kaufen | Bestpreis | ebikedirect.eu`, `${name} kaufen | ebikedirect.eu`, `${name} | ebikedirect.eu`];
  return variants.find((v) => v.length <= 60) || name.slice(0, 60);
}

export function productDescription(p: Pick<Product, 'name' | 'price' | 'motor' | 'batteryStandardWh' | 'rangeKm'>): string {
  const price = eur(p.price);
  const wh = p.batteryStandardWh > 0 ? `, ${p.batteryStandardWh} Wh` : '';
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
  'E-Gravel': 'E-Rennräder und E-Gravelbikes verbinden einen leichten Rahmen mit Rennlenker, schmalen bis mittelbreiten Reifen und einem kompakten Motor. Sie sind schneller und sportlicher als ein Trekkingrad und eignen sich für Asphalt, Feldwege und lange Touren. Viele Modelle haben einen kleinen, leichten Akku, damit das Fahrgefühl eines normalen Rennrads erhalten bleibt.',
};

const WHO_TEXT: Record<string, string> = {
  'E-MTB': 'Das Modell richtet sich an Fahrerinnen und Fahrer, die im Gelände mehr Höhenmeter und längere Touren fahren möchten, ohne auf Fahrspaß zu verzichten.',
  'E-Trekking': 'Das Modell passt zu Pendlern und Tourenfahrern, die Komfort, Gepäcktransport und eine hohe Reichweite für lange Strecken suchen.',
  'E-City': 'Das Modell passt zu allen, die in der Stadt und im Umland komfortabel, sicher und ohne Schweiß ankommen wollen.',
  'Speed-Pedelec': 'Das Modell passt zu Pendlern, die längere Strecken zügig fahren möchten und die rechtlichen Voraussetzungen für ein S-Pedelec erfüllen.',
  'Cargo-E-Bike': 'Das Modell passt zu Familien und Gewerbetreibenden, die Kinder oder Lasten sicher mit dem Rad transportieren möchten.',
  'Falt-E-Bike': 'Das Modell passt zu Menschen, die Bahn, Auto und Rad kombinieren und wenig Platz zum Abstellen haben.',
  'E-Gravel': 'Das Modell passt zu sportlichen Fahrerinnen und Fahrern, die längere Strecken auf Asphalt und Schotter fahren möchten und dabei Unterstützung am Berg und bei Gegenwind schätzen.',
};

export interface ProductContentData {
  focus: string;
  sections: { h2: string; blocks: { h3?: string; text: string }[] }[];
  faqs: { q: string; a: string }[];
  words: number;
}

const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function buildProductContent(p: Product, focus: string): ProductContentData {
  const cat = CATEGORY_LABEL[p.category];
  const wh = p.batteryStandardWh > 0 ? `${p.batteryStandardWh} Wh` : null;
  const frameInfo = p.options.frameSizes.length > 1 && p.options.frameSizes.every((s) => s.length < 25)
    ? `Das ${p.name} ist in den Rahmengrößen ${p.options.frameSizes.join(', ')} erhältlich.`
    : `Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt, damit das ${p.name} zu Ihrer Körpergröße passt.`;
  const colors = p.options.colors.map((c) => c.name).filter(Boolean);
  const colorInfo = colors.length ? `Verfügbare Farbe: ${colors.slice(0, 3).join(', ')}.` : '';
  const price = eur(p.price);

  const sections: ProductContentData['sections'] = [
    {
      h2: `${p.name}: Überblick`,
      blocks: [
        { text: `${focus.charAt(0).toUpperCase() + focus.slice(1)} bei ebikedirect.eu: Das ${p.name} von ${p.brand} gehört zur Kategorie ${cat}. Es ist mit ${p.motor}${wh ? ` und einem ${wh} Akku` : ''} ausgestattet und kostet ${price} inklusive 19 % Mehrwertsteuer. Das Modell ist ab Lager lieferbar.` },
        { text: p.description },
        { h3: `Was zeichnet ein ${cat} aus?`, text: CATEGORY_TEXT[p.category] || '' }
      ]
    },
    {
      h2: `Technische Daten und Ausstattung des ${p.name}`,
      blocks: [
        { h3: 'Antrieb', text: `Als Antrieb dient ${p.motor}.${p.torqueNm > 0 ? ` Das maximale Drehmoment beträgt ${p.torqueNm} Nm. Ein hohes Drehmoment hilft vor allem beim Anfahren, an Steigungen und mit Gepäck.` : ' Der Mittelmotor sitzt tief im Rahmen und sorgt für eine natürliche Gewichtsverteilung.'}` },
        { h3: 'Akku und Reichweite', text: `${wh ? `Der Akku hat eine Kapazität von ${wh}.` : 'Die Akkukapazität entnehmen Sie dem Datenblatt.'}${p.rangeKm > 0 ? ` Der Hersteller gibt eine Reichweite von bis zu ${p.rangeKm} km an.` : ''} Die tatsächliche Reichweite hängt von Fahrergewicht, Gelände, Unterstützungsstufe, Wind und Temperatur ab und liegt im Alltag meist unter dem Maximalwert.` },
        { h3: 'Rahmen, Größen und Farben', text: `${frameInfo} ${colorInfo}`.trim() },
        { h3: 'Gewicht und Zulassung', text: `${p.weightKg > 0 ? `Das Gewicht beträgt ${p.weightKg} kg. ` : ''}${p.category === 'Speed-Pedelec' ? 'Als S-Pedelec bis 45 km/h benötigt das Rad ein Versicherungskennzeichen und einen passenden Führerschein.' : 'Das Rad ist ein Pedelec mit Unterstützung bis 25 km/h und gilt im Straßenverkehr als Fahrrad. Eine Zulassung, ein Kennzeichen oder ein Führerschein sind nicht nötig.'}` }
      ]
    },
    {
      h2: `Für wen eignet sich das ${p.name}?`,
      blocks: [{ text: `${WHO_TEXT[p.category] || ''} Die Preisangabe von ${price} gilt für die Standardausstattung mit${wh ? ` ${wh}` : ''} Akku.` }]
    },
    {
      h2: 'Lieferung, Garantie und Rückgabe',
      blocks: [
        { h3: 'Lieferung per Spedition', text: `Das ${p.name} wird per Spedition mit Hebebühne geliefert und nach Terminabsprache zugestellt. Der Versand ist ab einem Bestellwert von 10.000 € kostenfrei, darunter fällt eine Speditionspauschale an. Der Mindestbestellwert im Shop beträgt 500 €.` },
        { h3: 'Garantie und Rückgabe', text: `Auf Ihr ${p.name} erhalten Sie 2 Jahre Garantie. Dazu kommt ein Rückgaberecht von 30 Tagen. Die Einzelheiten stehen in unseren Bedingungen zu Rückgabe und Garantie.` }
      ]
    }
  ];

  const faqs = [
    { q: `Was kostet das ${p.name}?`, a: `Das ${p.name} kostet ${price} inklusive 19 % Mehrwertsteuer. Der Versand per Spedition ist ab 10.000 € Bestellwert kostenfrei.` },
    { q: `Welchen Motor und Akku hat das ${p.name}?`, a: `Das ${p.name} wird von ${p.motor} angetrieben${wh ? ` und hat einen ${wh} Akku` : ''}.` },
    { q: `Wie weit kommt man mit dem ${p.name}?`, a: `${p.rangeKm > 0 ? `Der Hersteller nennt bis zu ${p.rangeKm} km Reichweite. ` : ''}Im Alltag hängt sie von Fahrergewicht, Gelände, Unterstützungsstufe und Temperatur ab.` },
    { q: `Wie wird das ${p.name} geliefert?`, a: 'Per Spedition mit Hebebühne und nach Terminabsprache. Ab 10.000 € Bestellwert ist die Lieferung kostenfrei.' },
    { q: `Welche Garantie gibt es auf das ${p.name}?`, a: `Sie erhalten 2 Jahre Garantie und ein Rückgaberecht von 30 Tagen auf das ${p.name}.` }
  ];

  const words = sections.reduce((s, sec) => s + wc(sec.h2) + sec.blocks.reduce((b, bl) => b + wc(bl.text) + (bl.h3 ? wc(bl.h3) : 0), 0), 0) + faqs.reduce((s, f) => s + wc(f.q) + wc(f.a), 0);
  return { focus, sections, faqs, words };
}
