import type { Product } from '@/lib/types';
import type { MappedPageDef } from '@/lib/mapped-pages';
import { CATEGORY_LABEL, titleCase } from '@/lib/product-seo';
import { familiesOfBrand } from '@/lib/families';

// FAQ for the category, brand, motor-maker and accessory pages. Questions carry the page's mapped FAQ keywords as topics; every answer is built
// from the real catalogue data of that page (counts, prices, motors, batteries) or from owner-confirmed shop terms. Nothing is invented.
const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const uniq = <T,>(a: T[]) => [...new Set(a)];
const list = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} und ${a[a.length - 1]}`);
const motorShort = (p: Product) => p.motor.replace(/Mittelmotor\s*/i, '').replace(/\s*\d+\s*Watt.*$/i, '').replace(/\s+/g, ' ').trim() || p.motor;

export function buildMappedFaqs(def: MappedPageDef, pageName: string, faqKeywords: string[], products: Product[]): { q: string; a: string }[] {
  const n = products.length;
  if (n === 0) return [];
  const prices = products.map((p) => p.price);
  const min = Math.min(...prices), max = Math.max(...prices), avg = prices.reduce((a, b) => a + b, 0) / n;
  const byPrice = products.slice().sort((a, b) => a.price - b.price);
  const cheapest = byPrice[0], priciest = byPrice[byPrice.length - 1];
  const whs = products.map((p) => p.batteryStandardWh).filter((w) => w > 0);
  const whText = whs.length ? (Math.min(...whs) === Math.max(...whs) ? `${Math.min(...whs)} Wh` : `${Math.min(...whs)} bis ${Math.max(...whs)} Wh`) : '';
  const motors = uniq(products.map(motorShort)).slice(0, 4);
  const brands = uniq(products.map((p) => p.brand));
  const cats = uniq(products.map((p) => CATEGORY_LABEL[p.category]).filter(Boolean));
  const delivery = 'Die Lieferung erfolgt per Spedition mit Hebebühne nach Terminabsprache. Bis 1.000 € Bestellwert kommt eine Speditionspauschale von 49 € hinzu, danach ist der Versand kostenfrei. Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht.';
  const priceText = `Die Preise liegen zwischen ${eur(min)} und ${eur(max)}, im Durchschnitt bei ${eur(avg)}, jeweils inklusive 19 % Mehrwertsteuer.`;
  const motorText = motors.length ? `Verbaut sind ${list(motors)}.` : '';
  const batteryText = whText ? `Die Akkus haben ${whText}.` : 'Die Akkukapazität steht bei jedem Modell in den technischen Daten.';

  let base: { q: string; a: string }[];
  if (def.type === 'accessory') {
    base = [
      { q: 'Welche Artikel sind lieferbar?', a: `Im Shop sind ${n} ${n === 1 ? 'Artikel' : 'Artikel'} aus dem Bereich ${pageName} gelistet, von ${list(brands.slice(0, 6))}.` },
      { q: 'Was kosten die Artikel?', a: `Die Preise liegen zwischen ${eur(min)} und ${eur(max)} inklusive 19 % Mehrwertsteuer.` },
      { q: 'Von welchen Marken gibt es Artikel?', a: `Gelistet sind Artikel von ${list(brands)}.` },
      { q: 'Welcher Artikel ist der günstigste?', a: `Am günstigsten ist ${cheapest.name} von ${cheapest.brand} für ${eur(cheapest.price)} inklusive 19 % Mehrwertsteuer.` },
      { q: 'Welcher Artikel kostet am meisten?', a: `Am teuersten ist ${priciest.name} von ${priciest.brand} für ${eur(priciest.price)} inklusive 19 % Mehrwertsteuer.` }
    ];
  } else if (def.type === 'brand' && def.brand) {
    const fams = familiesOfBrand(def.brand).slice(0, 3).map((f) => f.name);
    base = [
      { q: `Welche ${def.brand} Modelle sind lieferbar?`, a: `Im Shop sind ${n} ${def.brand} Modelle lieferbar, aus den Bereichen ${list(cats)}.${fams.length ? ` Die größten Modellreihen sind ${list(fams)}.` : ''}` },
      { q: 'Was kosten die Modelle?', a: priceText },
      { q: 'Welche Motoren sind verbaut?', a: motorText || 'Der Motor steht bei jedem Modell in den technischen Daten.' },
      { q: 'Wie groß sind die Akkus?', a: batteryText },
      { q: 'Wie werden die Modelle geliefert?', a: delivery }
    ];
  } else if (def.type === 'brand' && def.motor) {
    base = [
      { q: `Welche E-Bikes mit ${pageName} Antrieb gibt es?`, a: `Im Shop sind ${n} Modelle mit diesem Antrieb lieferbar, von ${list(brands.slice(0, 8))}.` },
      { q: 'Was kosten die Modelle?', a: priceText },
      { q: 'Welche Antriebe gibt es genau?', a: motorText || 'Die Motorstufe steht bei jedem Modell in den technischen Daten.' },
      { q: 'Wie groß sind die Akkus?', a: batteryText },
      { q: 'Wie werden die Modelle geliefert?', a: delivery }
    ];
  } else {
    base = [
      { q: 'Welche Modelle gibt es in dieser Kategorie?', a: `Im Shop sind ${n} Modelle lieferbar, von ${list(brands.slice(0, 8))}${brands.length > 8 ? ' und weiteren Marken' : ''}.` },
      { q: 'Was kosten die Modelle?', a: priceText },
      { q: 'Welche Motoren sind verbaut?', a: motorText || 'Der Motor steht bei jedem Modell in den technischen Daten.' },
      { q: 'Wie groß sind die Akkus?', a: batteryText },
      { q: 'Wie werden die Modelle geliefert?', a: delivery }
    ];
  }
  return base.map((f, i) => (faqKeywords[i] ? { q: `${titleCase(faqKeywords[i])}: ${f.q}`, a: f.a } : f));
}
