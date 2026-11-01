import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/products';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';

// Each tile shows a bright colour lifestyle photo (owner-supplied, 1200 x 800, same size for every tile) of that category.
const TILES: { key: string; path: string; category?: string; photo: string; alt: string }[] = [
  { key: 'mtb', path: '/e-bikes/e-mountainbikes', category: 'E-MTB', photo: 'e-mountainbike-kaufen', alt: 'E-Mountainbike kaufen' },
  { key: 'trekking', path: '/e-bikes/trekking-e-bikes', category: 'E-Trekking', photo: 'trekking-e-bike-kaufen', alt: 'Trekking-E-Bike kaufen' },
  { key: 'city', path: '/e-bikes/city-e-bikes', category: 'E-City', photo: 'city-e-bike-kaufen', alt: 'City-E-Bike kaufen' },
  { key: 'speed', path: '/e-bikes/s-pedelec', category: 'Speed-Pedelec', photo: 's-pedelec-kaufen', alt: 'S-Pedelec kaufen' },
  { key: 'cargo', path: '/e-bikes/cargo-bikes', category: 'Cargo-E-Bike', photo: 'cargo-e-bike-kaufen', alt: 'Cargo-E-Bike kaufen' },
  { key: 'falt', path: '/e-bikes/falt-e-bikes', category: 'Falt-E-Bike', photo: 'falt-e-bike-kaufen', alt: 'Falt-E-Bike kaufen' },
  { key: 'gravel', path: '/e-bikes/e-rennrad-gravel', category: 'E-Gravel', photo: 'e-rennrad-gravel-kaufen', alt: 'E-Rennrad und Gravel E-Bike kaufen' },
  { key: 'kids', path: '/e-bikes/kinder-jugend', category: 'E-Kinder', photo: 'kinder-e-bike-kaufen', alt: 'Kinder-E-Bike kaufen' },
  { key: 'all', path: '/e-bikes', photo: 'e-bike-kaufen', alt: 'E-Bike kaufen' },
  { key: 'acc', path: '/zubehoer', category: 'Zubehör', photo: 'e-bike-zubehoer-kaufen', alt: 'E-Bike Zubehör kaufen' }
];

export function CategoryTiles({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  return (
    <section className="py-14 sm:py-20 bg-[#F8F9FA]" aria-labelledby="cat-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <h2 id="cat-heading" className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight leading-[1.05]">{m.catTitle}</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">{m.catSub}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {TILES.map((t) => {
            const count = t.category ? PRODUCTS.filter((p) => p.category === t.category).length : PRODUCTS.filter((p) => p.category !== 'Zubehör').length;
            return (
              <li key={t.key}>
                <Link href={getLocalizedPath(t.path, locale)} className="group block bg-white rounded-3xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-3/2 overflow-hidden">
                    <Image src={`/lifestyle/${t.photo}.webp`} alt={locale === 'de' ? t.alt : m.cat[t.key]} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                      {count} {count === 1 ? m.model : m.models}
                    </div>
                    <h3 className="font-display mt-1 text-xl sm:text-2xl font-bold leading-tight text-[#131A22]">{m.cat[t.key]}</h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#131A22]">
                      {m.viewCategory}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
