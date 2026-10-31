import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { PRODUCTS } from '@/lib/products';
import { getMappedPage } from '@/lib/mapped-pages';

export const metadata: Metadata = {
  title: 'Marken im Überblick: E-Bike Hersteller',
  description: 'Alle E-Bike Marken im Sortiment von ebikedirect.eu auf einen Blick: Kalkhoff, Haibike, Riese & Müller, Cube, Trek und mehr mit lieferbaren Modellen.',
};

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'de') redirect('/marken');

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Marken', href: '/marken' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        <header className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">Hersteller</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight">Marken im Überblick</h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-3xl leading-relaxed">
            Diese Hersteller führen wir im Sortiment. Zu jeder Marke finden Sie die aktuell lieferbaren Modelle mit Preis, Motor und Akku.
            Die Markenlogos dienen allein der Kennzeichnung der Marken, die wir verkaufen, und gehören den jeweiligen Inhabern.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRAND_LOGOS.map((b) => {
            const count = PRODUCTS.filter((p) => p.brand === b.name && p.category !== 'Zubehör').length;
            const acc = PRODUCTS.filter((p) => p.brand === b.name && p.category === 'Zubehör').length;
            const href = getMappedPage(b.hub) ? b.hub : `/shop?brand=${encodeURIComponent(b.name)}`;
            return (
              <li key={b.slug}>
                <Link href={href} className="group flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#FF5722] hover:shadow-[0_12px_28px_-16px_rgba(19,26,34,0.35)]">
                  <span className="flex h-16 w-36 shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.logo} alt={`${b.name} Logo`} loading="lazy" className="max-h-12 w-auto max-w-full object-contain" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-[#131A22] group-hover:text-[#FF5722] transition-colors">{b.name}</span>
                    <span className="block text-xs text-gray-500">{count} {count === 1 ? 'Modell' : 'Modelle'} im Sortiment{acc ? `, ${acc} Zubehör` : ''}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
