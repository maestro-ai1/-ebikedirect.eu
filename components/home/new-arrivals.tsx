import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATALOG_PRODUCTS } from '@/lib/catalog-products';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';

function eur(locale: Locale, v: number) {
  const intl = { de: 'de-DE', fr: 'fr-FR', nl: 'nl-NL', it: 'it-IT', es: 'es-ES', pt: 'pt-PT', en: 'en-IE' }[locale];
  return new Intl.NumberFormat(intl, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
}

export function NewArrivals({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-gray-200" aria-labelledby="new-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 id="new-heading" className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight leading-[1.05]">{m.newTitle}</h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">{m.newSub}</p>
          </div>
          <Link href={getLocalizedPath('/shop', locale)} className="inline-flex items-center gap-2 text-sm font-bold text-[#131A22] border-b-2 border-[#FF5722] pb-1 hover:text-[#FF5722] transition-colors self-start md:self-auto">
            {m.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {CATALOG_PRODUCTS.map((p) => (
            <li key={p.id} className="group">
              <Link href={getLocalizedPath(`/shop/${p.slug}`, locale)} className="block">
                <div className="relative aspect-square rounded-3xl bg-[#F8F9FA] overflow-hidden ring-1 ring-gray-200 transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-18px_rgba(19,26,34,0.35)]">
                  <Image src={p.image} alt={`${p.name} kaufen`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#131A22] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{p.brand}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#131A22] leading-snug group-hover:text-[#FF5722] transition-colors">{p.name}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{p.shortDescription}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-xl font-bold text-[#131A22]">{eur(locale, p.price)}</div>
                    {p.originalPrice ? <div className="text-xs text-gray-500">{m.rrp} <span className="line-through">{eur(locale, p.originalPrice)}</span></div> : null}
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#131A22]">
                  {m.details}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#FF5722]" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
