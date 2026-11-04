import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/shop/product-card';
import { productFocusKeyword } from '@/lib/product-keywords';
import { Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';

// Nine popular bikes from the three best categories (mountain, trekking, city): an even 3 x 3 grid.
const PICKS: { slug: string; tag: string }[] = [
  { slug: 'haibike-allmtn-6-800-wh-29', tag: 'E-Mountainbike' },
  { slug: 'specialized-turbo-levo-comp-alloy-g4-840-wh-29', tag: 'E-Mountainbike' },
  { slug: 'trek-powerfly-plus-4-gen-5-800-wh-29-zoll', tag: 'E-Mountainbike' },
  { slug: 'kalkhoff-endeavour-5-advance-plus', tag: 'Trekking-E-Bike' },
  { slug: 'giant-explore-e-plus-1-800-wh-28-zoll', tag: 'Trekking-E-Bike' },
  { slug: 'winora-yucatan-x10-800-wh-27-5-zoll', tag: 'Trekking-E-Bike' },
  { slug: 'gazelle-avignon-c380-600-wh-28-zoll', tag: 'City-E-Bike' },
  { slug: 'tenways-ago-air', tag: 'City-E-Bike' },
  { slug: 'ktm-macina-city-820-xl-belt-800-wh-28-zoll', tag: 'City-E-Bike' }
];

export function BestProducts({ locale }: { locale: Locale }) {
  if (locale !== 'de') return null; // the shop pages are German; other languages show the category tiles
  const items = PICKS.map((p) => ({ ...p, product: PRODUCTS.find((x) => x.slug === p.slug) })).filter((x) => x.product);
  if (items.length < 6) return null;
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-gray-100" aria-labelledby="best-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <h2 id="best-heading" className="font-display text-3xl sm:text-4xl font-bold text-[#131A22] tracking-tight">Beliebte E-Bikes: Elektrofahrrad Modelle aus den Top-Kategorien</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">E-Mountainbike, Trekking und City: neun lieferbare Modelle mit Preis, Motor und Akku auf einen Blick.</p>
          </div>
          <Link href={getLocalizedPath('/e-bikes', locale)} className="inline-flex items-center gap-2 text-sm font-bold text-[#131A22] border-b-2 border-[#FF5722] pb-1 hover:text-[#FF5722] transition-colors">
            Alle E-Bikes ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, items.length >= 9 ? 9 : 6).map(({ product, tag }) => (
            <li key={product!.id}>
              <ProductCard product={product!} tag={tag} alt={productFocusKeyword(product!.slug, product!.name)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
