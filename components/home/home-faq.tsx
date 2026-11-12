import React from 'react';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { PRODUCTS } from '@/lib/products';
import { CATEGORY_LABEL } from '@/lib/product-seo';

// Home page FAQ (German only). Built from the catalogue and the owner-confirmed shop terms. The home page has no unused general
// keyword left in the bank (all of them sit on the E-Bikes category and the other pages), so these questions carry no extra keyword.
const list = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} und ${a[a.length - 1]}`);

export function HomeFaq() {
  const bikes = PRODUCTS.filter((p) => p.category !== 'Zubehör');
  const brandCount = new Map<string, number>();
  bikes.forEach((p) => brandCount.set(p.brand, (brandCount.get(p.brand) || 0) + 1));
  const brands = [...brandCount.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
  const cats = [...new Set(bikes.map((p) => CATEGORY_LABEL[p.category]).filter(Boolean))];
  const faqs = [
    { q: 'Welche E-Bikes gibt es bei ebikedirect.eu?', a: `Im Shop sind ${bikes.length} E-Bikes von ${brands.length} Marken lieferbar, aus den Bereichen ${list(cats)}.` },
    { q: 'Welche Marken sind im Shop?', a: `Die meisten Modelle gibt es von ${list(brands.slice(0, 8))}. Insgesamt führt der Shop ${brands.length} Marken, jede mit eigener Markenseite.` },
    { q: 'Sind die E-Bikes sofort lieferbar?', a: 'Ja, die Modelle sind ab Lager lieferbar. Die Zustellung erfolgt nach Terminabsprache.' },
    { q: 'Sind die E-Bikes sofort lieferbar?', a: 'Die Lieferung erfolgt per Spedition mit Hebebühne. Bis 1.000 € Bestellwert kommt eine Speditionspauschale von 49 € hinzu, ab 1.000 € ist der Versand kostenfrei.' },
    { q: 'Welche Garantie und welches Rückgaberecht gelten?', a: 'Auf jedes E-Bike gelten 2 Jahre Garantie und 30 Tage Rückgaberecht. Die Einzelheiten stehen in den Bedingungen zu Rückgabe, Garantie und Lieferung.' }
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <section aria-labelledby="home-faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
        <h2 id="home-faq" className="text-xl sm:text-2xl font-black text-[#131A22]">Elektrorad oder E-Bike kaufen: Häufige Fragen</h2>
        <FaqAccordion items={faqs} />
      </div>
    </section>
  );
}
