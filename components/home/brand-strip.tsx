import React from 'react';
import Link from 'next/link';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';

const BRANDS = [
  { name: 'Kalkhoff', path: '/marken/kalkhoff' },
  { name: 'Haibike', path: '/marken/haibike' },
  { name: 'Riese & Müller', path: '/marken/riese-und-mueller' },
  { name: 'Cube', path: '/marken/cube' },
  { name: 'Specialized', path: '/marken/specialized' },
  { name: 'Gazelle', path: '/marken/gazelle' },
  { name: 'Canyon', path: '/marken/canyon' },
  { name: 'Tenways', path: '/marken/tenways' },
];

export function BrandStrip({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  return (
    <section className="bg-[#131A22] text-white py-10 sm:py-14" aria-labelledby="brands-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
          <h2 id="brands-heading" className="font-display text-xl sm:text-2xl font-bold tracking-tight">{m.brandsTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-400">{m.brandsSub}</p>
        </div>
        <ul className="flex flex-wrap border-t border-white/15">
          {BRANDS.map((b) => (
            <li key={b.name} className="basis-1/2 sm:basis-1/4 border-b border-white/15 sm:border-r last:sm:border-r-0 even:border-l-0 sm:[&:nth-child(4n)]:border-r-0">
              <Link
                href={getLocalizedPath(b.path, locale)}
                className="font-display block px-1 sm:px-5 py-5 sm:py-7 text-lg sm:text-2xl font-bold tracking-tight text-white/80 hover:text-[#FF5722] hover:bg-white/5 transition-colors"
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
