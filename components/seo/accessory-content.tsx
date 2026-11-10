import React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { productKeywords, productFocusKeyword } from '@/lib/product-keywords';
import { titleCase } from '@/lib/product-seo';

const eur = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

// General buying guidance per accessory group. Only generic, verifiable statements: nothing here claims a test result, a certification or a spec of one product.
const GROUPS: Record<string, { label: string; path: string; guide: string[]; points: string[]; blog?: { href: string; label: string } }> = {
  beleuchtung: {
    label: 'Beleuchtung',
    path: '/zubehoer/beleuchtung/',
    guide: [
      'Licht am Fahrrad dient zwei Zwecken: Sie sehen den Weg, und andere sehen Sie. Im Straßenverkehr sind vorn ein weißes und hinten ein rotes Licht vorgeschrieben, dazu Reflektoren. Zusatzlichter wie kleine Akku-Lampen ergänzen die fest verbaute Beleuchtung und erhöhen die Sichtbarkeit bei Dämmerung, Regen und Nebel.',
      'Beim Kauf zählen die Art der Stromversorgung (Akku mit USB-Ladung oder Batterie), die Halterung am Lenker oder an der Sattelstütze und die Frage, ob das Licht ohne Werkzeug abgenommen werden kann. Wer sein Rad draußen abstellt, nimmt abnehmbare Lampen mit und lässt sie nicht am Rad.'
    ],
    points: ['Stromversorgung und Ladedauer in der Produktbeschreibung prüfen', 'Halterung muss zum Lenker- oder Sattelstützendurchmesser passen', 'Zusatzlicht ersetzt die vorgeschriebene Grundausstattung nicht'],
    blog: { href: '/blog/e-bike-wartung-tipps-fuer-den-winter', label: 'E-Bike Wartung: Tipps für den Winter' }
  },
  handyhalter: {
    label: 'Handyhalter',
    path: '/zubehoer/handyhalter/',
    guide: [
      'Eine Handyhalterung am Lenker macht das Smartphone zum Navigationsgerät und zur Anzeige für Fahrdaten. Wichtig ist, dass das Telefon auch auf Kopfsteinpflaster und bei Nässe sicher sitzt und dass sich der Bildschirm gut ablesen lässt, ohne die Hände vom Lenker zu nehmen.',
      'Vor dem Kauf sollten Sie prüfen, ob die Halterung zu Ihrem Telefonmodell passt, ob eine Hülle montiert bleiben kann und wie die Halterung am Lenker befestigt wird. Bei E-Bikes mit Display und Bedieneinheit am Lenker muss genug Platz für die Montage bleiben.'
    ],
    points: ['Passende Größe für das eigene Smartphone und die Hülle prüfen', 'Lenkerdurchmesser und freie Montagefläche messen', 'Bei Regen auf wasserdichten Schutz des Telefons achten'],
    blog: { href: '/blog/e-bike-reichweiten-guide-2026-bosch-shimano-specialized', label: 'E-Bike Reichweite: Guide für Bosch und Shimano' }
  },
  'sattel-lenker': {
    label: 'Sattel und Lenker',
    path: '/zubehoer/sattel-lenker/',
    guide: [
      'Sattel, Griffe und Lenker sind die drei Kontaktpunkte zwischen Fahrer und Rad. Sie bestimmen, wie bequem sich lange Touren anfühlen. Ein passender Sattel entlastet die Sitzknochen, ergonomische Griffe nehmen Druck von den Handflächen und beugen tauben Fingern vor.',
      'Beim Tausch zählen die Einbaumaße: Durchmesser der Sattelstütze, Lenkerklemmung und die Länge der Griffe müssen zum Rad passen. Bei E-Bikes sitzen Bedieneinheit und Bremshebel am Lenker, daher sollte man vor dem Kauf prüfen, ob die neuen Griffe zu den vorhandenen Bauteilen passen.'
    ],
    points: ['Sattelbreite an den Abstand der Sitzknochen anpassen', 'Lenker- und Sattelstützendurchmesser vor dem Kauf messen', 'Griffe mit Klemmschrauben lassen sich ohne Kleber montieren'],
    blog: { href: '/blog/e-bike-wartung-tipps-fuer-den-winter', label: 'E-Bike Wartung: Tipps für den Winter' }
  },
  'taschen-koerbe': {
    label: 'Taschen und Körbe',
    path: '/zubehoer/taschen-koerbe/',
    guide: [
      'Fahrradtaschen und Körbe machen aus dem E-Bike ein Alltagsfahrzeug für Einkauf, Büro und Wochenendtour. Satteltaschen, Lenkertaschen und Gepäckträgertaschen unterscheiden sich vor allem im Volumen, in der Befestigung und im Schutz gegen Regen.',
      'Wichtig sind eine stabile Halterung, die auch bei Schlaglöchern hält, und ein Material, das Nässe abhält. Bei einem E-Bike mit hohem Eigengewicht sollten Sie außerdem die zulässige Zuladung von Gepäckträger und Rad beachten.'
    ],
    points: ['Zulässige Zuladung des Gepäckträgers beachten', 'Befestigungssystem muss zum Träger oder Lenker passen', 'Wasserdichtes Material oder Regenhülle für Pendler'],
    blog: { href: '/blog/e-bike-reichweiten-guide-2026-bosch-shimano-specialized', label: 'E-Bike Reichweite: Guide für Bosch und Shimano' }
  },
  'werkzeug-pflege': {
    label: 'Werkzeug und Pflege',
    path: '/zubehoer/werkzeug-pflege/',
    guide: [
      'Regelmäßige Pflege hält ein E-Bike zuverlässig und spart Reparaturkosten. Kette, Ritzel und Schaltwerk brauchen Schmierstoff, der Rahmen und die Bremsscheiben gründliche Reinigung. Fahrradspezifische Produkte sind auf die Materialien am Rad abgestimmt, zum Beispiel auf Lack, Carbon und Gummi.',
      'Für Elektronik gilt: Motor, Akku und Display nie mit einem starken Wasserstrahl reinigen, sondern mit einem feuchten Tuch und fahrradgeeignetem Reiniger. Werkzeug für unterwegs gehört in die Satteltasche, damit ein Platten oder eine lockere Schraube nicht das Ende der Tour bedeutet.'
    ],
    points: ['Reiniger und Schmiermittel nur auf die vorgesehenen Teile auftragen', 'Bremsscheiben und Bremsbeläge vor Schmiermitteln schützen', 'Elektronik nie mit Hochdruck reinigen'],
    blog: { href: '/blog/e-bike-wartung-tipps-fuer-den-winter', label: 'E-Bike Wartung: Tipps für den Winter' }
  }
};

const FALLBACK = {
  label: 'Zubehör',
  path: '/zubehoer/',
  guide: [
    'Zubehör macht ein E-Bike komfortabler, sicherer und alltagstauglicher. Bevor Sie bestellen, lohnt ein Blick auf die Einbaumaße und die Kompatibilität mit Ihrem Rad, denn nicht jedes Teil passt an jedes Modell.',
    'Alle Angaben zu Material, Größe und Anwendung stehen in der Beschreibung dieses Artikels. Bei Fragen zur Passform hilft die Beratung unter sales@ebikedirect.eu.'
  ],
  points: ['Maße und Kompatibilität vor dem Kauf prüfen', 'Angaben des Herstellers beachten'],
  blog: undefined as undefined | { href: string; label: string }
};

export function AccessoryContent({ product }: { product: Product }) {
  const g = (product.accessory && GROUPS[product.accessory]) || FALLBACK;
  const price = eur(product.price);
  const specs = Object.entries(product.specs || {});
  const colors = product.options.colors.map((c) => c.name).filter(Boolean);
  const sizes = product.options.frameSizes.filter((s) => s && s.length < 25);
  const siblings = PRODUCTS.filter((x) => x.category === 'Zubehör' && x.slug !== product.slug && x.accessory === product.accessory).slice(0, 4);
  const more = siblings.length >= 3 ? siblings : [...siblings, ...PRODUCTS.filter((x) => x.category === 'Zubehör' && x.slug !== product.slug && !siblings.includes(x))].slice(0, 4);

  const kw = productKeywords(product.slug);
  const focus = productFocusKeyword(product.slug, product.name);
  const focusLead = kw && kw.primary.source === 'bank' && !product.name.toLowerCase().includes(focus.toLowerCase()) ? `${focus.charAt(0).toUpperCase() + focus.slice(1)} bei ebikedirect.eu: ` : '';
  const secondary = (kw?.secondary || []).slice(0, 5).map((s) => s.keyword);
  const secFacts = [
    `${product.name} kostet ${price} inklusive 19 % Mehrwertsteuer.`,
    `Der Artikel stammt von ${product.brand} und gehört zur Rubrik ${g.label}.`,
    `Bezahlt wird per Vorkasse oder in Kryptowährung; bei Kryptowährung sparen Sie 10 %, das sind ${eur(product.price * 0.1)}.`,
    'Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht.',
    `Passform: ${product.shortDescription} Prüfen Sie vor der Bestellung die Maße an Ihrem Rad.`
  ];
  const faqs = [
    { q: `Was kostet ${product.name}?`, a: `${product.name} kostet ${price} inklusive 19 % Mehrwertsteuer. Bei Zahlung in Kryptowährung gilt der Preis von ${eur(product.price * 0.9)} (10 % Rabatt).` },
    { q: 'Passt der Artikel an jedes E-Bike?', a: `Das hängt von den Einbaumaßen ab. ${product.shortDescription} Prüfen Sie Durchmesser, Befestigung und Platz an Ihrem Rad vor der Bestellung; bei Fragen hilft sales@ebikedirect.eu.` },
    { q: 'Von welcher Marke ist der Artikel?', a: `Der Artikel stammt von ${product.brand}. Weitere Artikel aus dem Bereich ${g.label} finden Sie auf der Seite ${g.label}.` },
    { q: 'Welche Garantie und welches Rückgaberecht gelten?', a: 'Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht. Einzelheiten stehen in den Bedingungen zu Lieferung, Rückgabe und Garantie.' },
    { q: 'Wie bezahle ich den Artikel?', a: `Sie zahlen per Vorkasse (Banküberweisung) oder in Kryptowährung. Bei Kryptowährung sparen Sie 10 %, das sind bei diesem Artikel ${eur(product.price * 0.1)}.` }
  ];
  const faqKw = (kw?.faq || []).slice(0, 5).map((f) => f.keyword);
  const faqsK = faqs.map((f, i) => (faqKw[i] ? { q: `${titleCase(faqKw[i])}: ${f.q}`, a: f.a } : f));
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqsK.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10" aria-label={`Informationen zu ${product.name}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 space-y-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">{product.name}: Überblick</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">{focusLead}{product.name} von {product.brand} gehört zur Rubrik <Link href={g.path} className="font-semibold text-[#FF5722] hover:underline">{g.label}</Link> bei ebikedirect.eu. Der Artikel kostet {price} inklusive 19 % Mehrwertsteuer. {product.description}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Daten und Ausführungen</h2>
          {specs.map(([k, v]) => (
            <div key={k} className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#131A22]">{k}</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{k}: {v}.</p>
            </div>
          ))}
          {(colors.length > 1 || sizes.length > 1) && (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">
              {colors.length > 1 ? `Auswählbare Varianten: ${colors.join(', ')}. ` : ''}{sizes.length > 1 ? `Größen: ${sizes.join(', ')}.` : ''}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Worauf Sie bei {g.label} achten sollten</h2>
          {g.guide.map((t, i) => <p key={i} className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">{t}</p>)}
          <h3 className="text-base sm:text-lg font-bold text-[#131A22]">Kurze Checkliste</h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
            {g.points.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {secondary.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Preis, Marke, Zahlung und Passform im Überblick</h2>
            {secondary.map((s, i) => (
              <div key={s} className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#131A22]">{titleCase(s)}</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{secFacts[i]}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Preis, Zahlung und Garantie</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">Der Preis liegt bei {price} inklusive 19 % Mehrwertsteuer. Bei Vorkasse überweisen Sie genau diesen Betrag, bei Zahlung in Kryptowährung gilt der Preis von {eur(product.price * 0.9)}. Es gelten 2 Jahre Garantie und 30 Tage Rückgaberecht. Versandkosten und Lieferzeit nennen wir Ihnen im Bestellvorgang.</p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">Das passende Rad zum Zubehör finden Sie unter <Link href="/e-bikes" className="font-semibold text-[#FF5722] hover:underline">Alle E-Bikes</Link>. Allgemeine Hinweise zu Sicherheit und Ausrüstung am Fahrrad bietet der <a href="https://www.adfc.de/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#FF5722] hover:underline">ADFC</a>. Weitere Artikel für Ihr Rad stehen unter <Link href="/zubehoer/" className="font-semibold text-[#FF5722] hover:underline">E-Bike Zubehör</Link>{g.blog ? <>; Pflegehinweise und Tipps lesen Sie im Beitrag <Link href={g.blog.href} className="font-semibold text-[#FF5722] hover:underline">{g.blog.label}</Link>.</> : '.'}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Häufige Fragen zu {product.name}</h2>
          <FaqAccordion items={faqsK} />
        </div>

        {more.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Weitere Artikel aus dem Zubehör</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
              {more.map((x) => (
                <li key={x.slug}><Link href={`/shop/${x.slug}`} className="font-semibold text-[#131A22] hover:text-[#FF5722]">{x.name}</Link> <span className="text-gray-600">({eur(x.price)})</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
