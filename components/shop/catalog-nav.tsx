import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { MAPPED_PAGES, getMappedPage, productsForPath } from '@/lib/mapped-pages';
import { getKeywordPage } from '@/lib/seo';

const CATEGORY_LINKS = [
  { path: '/e-bikes', label: 'Alle E-Bikes' },
  { path: '/e-bikes/e-mountainbikes', label: 'E-Mountainbikes' },
  { path: '/e-bikes/trekking-e-bikes', label: 'Trekking-E-Bikes' },
  { path: '/e-bikes/city-e-bikes', label: 'City-E-Bikes' },
  { path: '/e-bikes/s-pedelec', label: 'S-Pedelecs (45 km/h)' },
  { path: '/e-bikes/cargo-bikes', label: 'Cargo-E-Bikes' },
  { path: '/e-bikes/falt-e-bikes', label: 'Falt-E-Bikes' },
  { path: '/zubehoer', label: 'Zubehör' }
];

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details name="catalog-nav" className="group relative">
      <summary className="cursor-pointer list-none inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-300 hover:border-[#131A22] text-sm font-bold text-[#131A22] [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden="true" className="text-[#FF5722] transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="absolute left-0 top-full mt-2 z-30 w-[min(92vw,640px)] max-h-[70vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-5">{children}</div>
    </details>
  );
}

/** Drop-down structure of the shop: categories, brands (with motor makers) and accessory groups, all as crawlable links. */
export function CatalogNav({ current }: { current?: string }) {
  const bike = PRODUCTS.filter((p) => p.category !== 'Zubehör');
  const count = (path: string) => productsForPath(path).length;
  const brands = MAPPED_PAGES.filter((m) => m.type === 'brand' && m.brand && count(m.path) > 0).sort((a, b) => a.brand!.localeCompare(b.brand!, 'de'));
  const motors = MAPPED_PAGES.filter((m) => m.type === 'brand' && m.motor);
  const acc = MAPPED_PAGES.filter((m) => m.type === 'accessory' && m.path !== '/zubehoer');
  const link = (path: string, label: string, n: number) => (
    <li key={path}>
      <Link href={path} aria-current={current === path ? 'page' : undefined} className={`flex items-center justify-between gap-3 py-1.5 text-sm hover:text-[#FF5722] ${current === path ? 'font-black text-[#FF5722]' : 'font-semibold text-[#131A22]'}`}>
        <span>{label}</span>
        <span className="text-xs font-medium text-gray-500">{n}</span>
      </Link>
    </li>
  );
  return (
    <nav aria-label="Kategorien und Marken" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex flex-wrap items-start gap-3">
        <Dropdown label="Kategorien">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {CATEGORY_LINKS.map((c) => link(c.path, c.label, c.path === '/e-bikes' ? bike.length : count(c.path)))}
          </ul>
        </Dropdown>
        <Dropdown label="Marken">
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
            {brands.map((b) => link(b.path, b.brand!, count(b.path)))}
          </ul>
          {motors.length > 0 && (
            <>
              <p className="mt-4 mb-1 text-xs font-black uppercase tracking-wider text-gray-500">Motoren</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
                {motors.map((m) => link(m.path, getKeywordPage('de', m.path)?.name.replace(/ \(.*\)/, '') || m.path, count(m.path)))}
              </ul>
            </>
          )}
        </Dropdown>
        <Dropdown label="Zubehör">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {link('/zubehoer', 'Alles Zubehör', PRODUCTS.length - bike.length)}
            {acc.map((a) => link(a.path, getKeywordPage('de', a.path)?.name || getMappedPage(a.path)?.accessory || a.path, count(a.path)))}
          </ul>
        </Dropdown>
        <Link href="/shop" className="inline-flex items-center px-4 py-2.5 rounded-lg bg-[#131A22] text-white text-sm font-bold hover:bg-[#1D2633]">Sortiment filtern</Link>
      </div>
    </nav>
  );
}
