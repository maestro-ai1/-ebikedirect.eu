import React from 'react';

// Outbound links of authority for product pages (Golden Keyword Rule section 6). Every target was checked to answer before it was added.
const BRAND_SITES: Record<string, { label: string; href: string }> = {
  Cube: { label: 'Cube Bikes: Hersteller', href: 'https://www.cube.eu/' },
  Kalkhoff: { label: 'Kalkhoff: Hersteller', href: 'https://www.kalkhoff-bikes.com/' },
  Haibike: { label: 'Haibike: Hersteller', href: 'https://www.haibike.com/' },
  'Riese & Müller': { label: 'Riese & Müller: Hersteller', href: 'https://r-m.de/' },
  Specialized: { label: 'Specialized: Hersteller', href: 'https://www.specialized.com/de/de' },
  Trek: { label: 'Trek: Hersteller', href: 'https://www.trekbikes.com/de/de_DE/' },
  Giant: { label: 'Giant: Hersteller', href: 'https://www.giant-bicycles.com/de' },
  Gazelle: { label: 'Gazelle: Hersteller', href: 'https://www.gazelle.nl/' },
  Canyon: { label: 'Canyon: Hersteller', href: 'https://www.canyon.com/de-de' },
  Tenways: { label: 'Tenways: Hersteller', href: 'https://www.tenways.com/' },
  Focus: { label: 'Focus Bikes: Hersteller', href: 'https://www.focus-bikes.com/' },
  Winora: { label: 'Winora: Hersteller', href: 'https://www.winora.com/' },
  Ghost: { label: 'Ghost Bikes: Hersteller', href: 'https://www.ghost-bikes.com/' },
  KTM: { label: 'KTM Bikes: Hersteller', href: 'https://www.ktm-bikes.at/' },
  Brompton: { label: 'Brompton: Hersteller', href: 'https://brompton.com/' },
  Babboe: { label: 'Babboe: Hersteller', href: 'https://babboe.com/' },
  'Urban Arrow': { label: 'Urban Arrow: Hersteller', href: 'https://www.urbanarrow.com/' },
  Flyer: { label: 'Flyer: Hersteller', href: 'https://www.flyer-bikes.com/' },
  Kettler: { label: 'Kettler Alu-Rad: Hersteller', href: 'https://www.kettler-alu-rad.de/' },
  Hercules: { label: 'Hercules: Hersteller', href: 'https://www.hercules-bikes.de/' },
  Conway: { label: 'Conway: Hersteller', href: 'https://www.conway-bikes.de/' },
  Koga: { label: 'Koga: Hersteller', href: 'https://www.koga.com/' },
  Bergamont: { label: 'Bergamont: Hersteller', href: 'https://www.bergamont.com/' },
  Cannondale: { label: 'Cannondale: Hersteller', href: 'https://www.cannondale.com/de-de' },
  Scott: { label: 'Scott Sports: Hersteller', href: 'https://www.scott-sports.com/de/de' },
  Merida: { label: 'Merida: Hersteller', href: 'https://www.merida-bikes.com/de-de' }
};

export function ProductLinks({ brand, category, motor }: { brand: string; category: string; motor: string }) {
  const links: { label: string; href: string; note: string }[] = [];
  const site = BRAND_SITES[brand];
  if (site) links.push({ ...site, note: 'Offizielle Herstellerseite mit allen Modellen und Technik.' });
  if (/bosch/i.test(motor)) links.push({ label: 'Bosch eBike Systems', href: 'https://www.bosch-ebike.com/de/', note: 'Antriebssysteme, Akkus und Updates des Motorherstellers.' });
  if (category === 'Speed-Pedelec') links.push({ label: 'Straßenverkehrs-Zulassungs-Ordnung (StVZO)', href: 'https://www.gesetze-im-internet.de/stvzo_2012/', note: 'Vorschriften für schnelle Pedelecs bis 45 km/h im Gesetzestext.' });
  else links.push({ label: 'Elektrofahrrad: Überblick auf Wikipedia', href: 'https://de.wikipedia.org/wiki/Elektrofahrrad', note: 'Grundlagen zu Pedelec, Motor, Akku und rechtlicher Einordnung.' });
  if (links.length === 0) return null;
  return (
    <section aria-labelledby="more-info" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 id="more-info" className="text-lg font-black text-[#131A22] mb-3">Weitere Informationen</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener" className="font-semibold text-[#FF5722] hover:underline">{l.label}</a>
              <p className="text-gray-600 mt-1">{l.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
