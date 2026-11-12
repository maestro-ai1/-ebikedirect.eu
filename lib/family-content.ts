import type { Product } from '@/lib/types';
import { CATEGORY_LABEL, titleCase } from '@/lib/product-seo';
import { familyMembers, type FamilyDef } from '@/lib/families';

// Copy for the model-family pages. Every sentence comes from the real catalogue data of the line (prices, batteries, motors, frames);
// nothing is invented. The family name is used sparingly so the main keyword does not turn into stuffing.
const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const uniq = <T,>(a: T[]) => [...new Set(a)];
const motorShort = (p: Product) => p.motor.replace(/Mittelmotor\s*/i, '').replace(/\s*\d+\s*Watt.*$/i, '').replace(/\s+/g, ' ').trim() || p.motor;

export function remainderName(f: FamilyDef, p: Product): string {
  const r = p.name.replace(new RegExp(f.match, 'i'), '').trim();
  return r || 'Basismodell';
}

export interface FamilyContent {
  members: Product[];
  intro: string;
  rows: { slug: string; label: string; price: number; wh: number; motor: string }[];
  topics: { h3: string; text: string }[];
  faqs: { q: string; a: string }[];
  title: string;
  description: string;
  categories: string[];
}

export function buildFamilyContent(f: FamilyDef): FamilyContent {
  const members = familyMembers(f);
  const n = members.length;
  const prices = members.map((p) => p.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / Math.max(1, n);
  const whs = members.map((p) => p.batteryStandardWh).filter((w) => w > 0);
  const whMin = whs.length ? Math.min(...whs) : 0, whMax = whs.length ? Math.max(...whs) : 0;
  const motors = uniq(members.map(motorShort));
  const cats = uniq(members.map((p) => CATEGORY_LABEL[p.category]));
  const frames = uniq(members.map((p) => (p.specs && p.specs['Rahmen']) || '').filter(Boolean));
  const cheapest = members[0], priciest = members[n - 1];
  const bigBattery = members.slice().sort((a, b) => b.batteryStandardWh - a.batteryStandardWh)[0];
  const rows = members.map((p) => ({ slug: p.slug, label: remainderName(f, p), price: p.price, wh: p.batteryStandardWh, motor: motorShort(p) }));
  const whText = whMin ? (whMin === whMax ? `${whMin} Wh` : `${whMin} bis ${whMax} Wh`) : 'laut Datenblatt';
  const motorText = motors.length === 1 ? motors[0] : `${motors.slice(0, -1).join(', ')} und ${motors[motors.length - 1]}`;

  const intro = `Die Modellreihe ${f.name} von ${f.brand} umfasst bei ebikedirect.eu ${n} Modelle (${cats.join(', ')}). Die Preise liegen zwischen ${eur(min)} und ${eur(max)}, die Akkus haben ${whText}, als Antrieb kommt ${motorText} zum Einsatz. In der Übersicht unten sehen Sie jede Ausführung mit Preis, Akku und Motor.`;

  const facts: { h3: string; text: string }[] = [
    { h3: 'Preis der Modelle', text: `Die ${n} Modelle kosten zwischen ${eur(min)} und ${eur(max)}, im Durchschnitt ${eur(avg)}. Am günstigsten ist das Modell ${remainderName(f, cheapest)} für ${eur(cheapest.price)}, am teuersten ${remainderName(f, priciest)} für ${eur(priciest.price)}. Alle Preise verstehen sich inklusive 19 % Mehrwertsteuer; bis 1.000 € Bestellwert kommt die Speditionspauschale von 49 € hinzu.` },
    { h3: 'Antrieb', text: `Verbaut ist ${motorText}. ${members.some((p) => p.torqueNm > 0) ? `Das Drehmoment liegt bei bis zu ${Math.max(...members.map((p) => p.torqueNm))} Nm.` : 'Die genaue Motorstufe steht in den technischen Daten jedes Modells.'}` },
    { h3: 'Akku und Reichweite', text: whMin ? `Die Akkus reichen von ${whMin} bis ${whMax} Wh. Die größte Kapazität bietet das Modell ${remainderName(f, bigBattery)} mit ${bigBattery.batteryStandardWh} Wh. Die Reichweite hängt von Fahrer, Strecke und Unterstützungsstufe ab.` : 'Die Akkukapazität steht in den technischen Daten jedes Modells. Die Reichweite hängt von Fahrer, Strecke und Unterstützungsstufe ab.' },
    { h3: 'Rahmen und Ausstattung', text: frames.length ? `Die Modelle gibt es mit diesen Rahmen: ${frames.join('; ')}. Schaltung, Bremsen und Gabel unterscheiden sich je nach Ausführung und stehen auf der jeweiligen Modellseite.` : 'Rahmen, Schaltung, Bremsen und Gabel unterscheiden sich je nach Ausführung und stehen auf der jeweiligen Modellseite.' },
    { h3: 'Lieferung und Garantie', text: 'Alle Modelle werden per Spedition mit Hebebühne nach Terminabsprache geliefert. Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht.' }
  ];
  // The mapped secondary keywords become the H3 headings (one per fact); without a keyword the plain heading stays.
  const topics = facts.map((x, i) => ({ h3: f.secondary[i] ? titleCase(f.secondary[i].keyword) : x.h3, text: x.text }));

  const list = rows.slice(0, 6).map((r) => r.label).join(', ');
  const defaults = [
    { q: 'Welche Modelle der Reihe gibt es?', a: `Im Shop sind ${n} Modelle lieferbar: ${list}${n > 6 ? ' und weitere' : ''}.` },
    { q: 'Was kosten die Modelle?', a: `Die Preise liegen zwischen ${eur(min)} und ${eur(max)} inklusive 19 % Mehrwertsteuer.` },
    { q: 'Welchen Motor haben die Modelle?', a: `Verbaut ist ${motorText}.` },
    { q: 'Wie groß sind die Akkus?', a: whMin ? `Die Akkus haben ${whText}.` : 'Die Akkukapazität steht in den technischen Daten jedes Modells.' },
    { q: 'Sind die Modelle sofort lieferbar?', a: 'Ja, sie sind ab Lager lieferbar. Die Zustellung erfolgt per Spedition mit Hebebühne nach Terminabsprache, danach gelten 2 Jahre Garantie und 30 Tage Rückgaberecht.' }
  ];
  const faqs = defaults.map((d, i) => (f.faq[i] ? { q: `${titleCase(f.faq[i].keyword)}: ${d.q}`, a: d.a } : d));

  const P = titleCase(f.primary.keyword);
  const titleTries = [`${P}: ${n} Modelle ab ${eur(min)} | ebikedirect.eu`, `${P}: ${n} Modelle | ebikedirect.eu`, `${P} | ebikedirect.eu`];
  const title = titleTries.find((t) => t.length <= 60) || `${P} | ebikedirect.eu`.slice(0, 60);
  const mot = motorShort(members[0]).split(' ').slice(0, 3).join(' ');
  const descTries = [
    `${P} kaufen: ${n} Modelle von ${eur(min)} bis ${eur(max)}, ${mot}. 2 Jahre Garantie, Lieferung per Spedition.`,
    `${P} kaufen: ${n} Modelle von ${eur(min)} bis ${eur(max)} mit Preis, Motor und Akku im Vergleich. 2 Jahre Garantie, Lieferung per Spedition.`,
    `${P} kaufen: ${n} Modelle von ${eur(min)} bis ${eur(max)}. Preis, Motor und Akku im Vergleich, 2 Jahre Garantie, 30 Tage Rückgaberecht.`
  ];
  let description = descTries.find((d) => d.length >= 110 && d.length <= 158) || descTries[2];
  if (description.length > 158) description = description.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (description.length < 110) description += ' Lieferung per Spedition.';
  return { members, intro, rows, topics, faqs, title, description, categories: uniq(members.map((p) => p.category)) };
}
