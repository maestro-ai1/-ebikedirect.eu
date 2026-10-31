import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';
import { BikeGlyph, GlyphVariant } from '@/components/home/bike-glyph';

const TILES: { key: GlyphVariant; path: string; category?: string; tone: string }[] = [
  { key: 'trekking', path: '/e-bikes/trekking-e-bikes', category: 'E-Trekking', tone: 'bg-[#EEF1F4]' },
  { key: 'city', path: '/e-bikes/city-e-bikes', category: 'E-City', tone: 'bg-[#E8F8F0]' },
  { key: 'mtb', path: '/e-bikes/e-mountainbikes', category: 'E-MTB', tone: 'bg-[#FFF1EC]' },
  { key: 'speed', path: '/e-bikes/s-pedelec', category: 'Speed-Pedelec', tone: 'bg-[#EEF1F4]' },
  { key: 'cargo', path: '/e-bikes/cargo-bikes', category: 'Cargo-E-Bike', tone: 'bg-[#FFF1EC]' },
  { key: 'acc', path: '/zubehoer', category: 'Zubehör', tone: 'bg-[#131A22]' },
];

export function CategoryTiles({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  return (
    <section className="py-16 sm:py-24 bg-[#F8F9FA]" aria-labelledby="cat-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <h2 id="cat-heading" className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight leading-[1.05]">{m.catTitle}</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">{m.catSub}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TILES.map((t) => {
            const count = t.category ? PRODUCTS.filter((p) => p.category === t.category).length : PRODUCTS.length;
            const dark = t.key === 'acc';
            return (
              <li key={t.key}>
                <Link
                  href={getLocalizedPath(t.path, locale)}
                  className={`group relative block overflow-hidden rounded-3xl ${t.tone} p-6 sm:p-8 min-h-[230px] transition-transform duration-300 hover:-translate-y-1`}
                >
                  <div className={dark ? 'text-white' : 'text-[#131A22]'}>
                    <div className={`text-xs font-bold uppercase tracking-[0.14em] ${dark ? 'text-[#00C853]' : 'text-[#FF5722]'}`}>
                      {count} {count === 1 ? m.model : m.models}
                    </div>
                    <h3 className="font-display mt-2 text-2xl sm:text-3xl font-bold leading-tight max-w-[12ch]">{m.cat[t.key]}</h3>
                  </div>
                  <BikeGlyph
                    variant={t.key}
                    className={`absolute -right-4 bottom-2 w-[62%] max-w-[270px] transition-transform duration-500 group-hover:translate-x-1 ${dark ? 'text-white/80' : 'text-[#131A22]/80'}`}
                  />
                  <span className={`absolute left-6 sm:left-8 bottom-6 sm:bottom-8 inline-flex items-center gap-2 text-sm font-bold ${dark ? 'text-white' : 'text-[#131A22]'}`}>
                    {m.viewCategory}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
