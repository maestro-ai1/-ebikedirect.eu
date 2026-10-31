import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/products';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';

// Each tile shows a real colour product photo of that category. The photos have white studio backgrounds,
// so multiply blending lets the tile tint show through while the bike keeps its colours.
const TILES: { key: string; path: string; category?: string; photo: string; tone: string }[] = [
  { key: 'trekking', path: '/e-bikes/trekking-e-bikes', category: 'E-Trekking', photo: 'kalkhoff-endeavour-5-advance-plus', tone: 'bg-[#EEF1F4]' },
  { key: 'city', path: '/e-bikes/city-e-bikes', category: 'E-City', photo: 'gazelle-avignon-c380-600-wh-28-zoll', tone: 'bg-[#E8F8F0]' },
  { key: 'mtb', path: '/e-bikes/e-mountainbikes', category: 'E-MTB', photo: 'haibike-allmtn-6-800-wh-29', tone: 'bg-[#FFF1EC]' },
  { key: 'speed', path: '/e-bikes/s-pedelec', category: 'Speed-Pedelec', photo: 'riese-und-mueller-charger5-vario-hs-45-km-h-800-wh-27-5-zoll', tone: 'bg-[#EEF1F4]' },
  { key: 'cargo', path: '/e-bikes/cargo-bikes', category: 'Cargo-E-Bike', photo: 'urban-arrow-familynext-advanced-belt-800-wh-26-zoll', tone: 'bg-[#FFF1EC]' },
  { key: 'falt', path: '/e-bikes/falt-e-bikes', category: 'Falt-E-Bike', photo: 'brompton-electric-g-line-e-motiq-urban-345-wh-20-zoll', tone: 'bg-[#E8F8F0]' },
  { key: 'all', path: '/e-bikes', photo: 'kalkhoff-entice-5-season-2-800-wh-29-zoll', tone: 'bg-[#EEF1F4]' },
  { key: 'acc', path: '/zubehoer', category: 'Zubehör', photo: 'tenways-eh20-smart-helm', tone: 'bg-[#FFF1EC]' },
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TILES.map((t) => {
            const product = PRODUCTS.find((p) => p.slug === t.photo);
            const count = t.category ? PRODUCTS.filter((p) => p.category === t.category).length : PRODUCTS.filter((p) => p.category !== 'Zubehör').length;
            return (
              <li key={t.key}>
                <Link
                  href={getLocalizedPath(t.path, locale)}
                  className={`group relative block overflow-hidden rounded-3xl ${t.tone} min-h-[310px] transition-transform duration-300 hover:-translate-y-1`}
                >
                  {product && (
                    <Image
                      src={product.image}
                      alt={`${m.cat[t.key]}: ${product.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain object-bottom mix-blend-multiply px-3 pt-14 pb-11 transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="relative p-5 sm:p-6 text-[#131A22]">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                      {count} {count === 1 ? m.model : m.models}
                    </div>
                    <h3 className="font-display mt-1 text-xl sm:text-2xl font-bold leading-tight">{m.cat[t.key]}</h3>
                  </div>
                  <span className="absolute left-5 sm:left-6 bottom-4 inline-flex items-center gap-2 text-sm font-bold text-[#131A22]">
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
