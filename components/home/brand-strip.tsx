import React from 'react';
import Link from 'next/link';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { getMappedPage } from '@/lib/mapped-pages';

// Logo wall of the brands in the shop. Logos are shown on white tiles so every brand colour reads well.
export function BrandStrip({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  return (
    <section className="bg-white border-b border-gray-200 py-10 sm:py-14" aria-labelledby="brands-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
          <h2 id="brands-heading" className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#131A22]">{m.brandsTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-500">{m.brandsSub}</p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BRAND_LOGOS.map((b) => {
            const href = getMappedPage(b.hub) ? b.hub : `/shop?brand=${encodeURIComponent(b.name)}`;
            return (
              <li key={b.slug}>
                <Link
                  href={getLocalizedPath(href, locale)}
                  aria-label={b.name}
                  className="group flex h-20 sm:h-24 items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF5722] hover:shadow-[0_12px_28px_-16px_rgba(19,26,34,0.35)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.logo} alt={`${b.name} Logo`} loading="lazy" className="max-h-9 sm:max-h-11 w-auto max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 text-right">
          <Link href={getLocalizedPath('/marken', locale)} className="inline-flex items-center gap-2 text-sm font-bold text-[#131A22] border-b-2 border-[#FF5722] pb-1 hover:text-[#FF5722] transition-colors">
            {m.brandsAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
