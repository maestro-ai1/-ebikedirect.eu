import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { MAPPED_PAGES, getMappedPage, productsForPath } from '@/lib/mapped-pages';
import { getKeywordPage } from '@/lib/seo';
import { ui } from '@/lib/ui';
import { l10nByDePath } from '@/lib/l10n-pages';
import type { Locale } from '@/lib/i18n';

const CATEGORY_LINKS = [
  { path: '/e-bikes', key: 'nav.all' },
  { path: '/e-bikes/e-mountainbikes', key: 'nav.mtb' },
  { path: '/e-bikes/trekking-e-bikes', key: 'nav.trekking' },
  { path: '/e-bikes/city-e-bikes', key: 'nav.city' },
  { path: '/e-bikes/s-pedelec', key: 'nav.speed' },
  { path: '/e-bikes/cargo-bikes', key: 'nav.cargo' },
  { path: '/e-bikes/falt-e-bikes', key: 'nav.fold' },
  { path: '/e-bikes/e-rennrad-gravel', key: 'nav.gravel' },
  { path: '/e-bikes/kinder-jugend', key: 'nav.kids' },
  { path: '/e-bikes/damen', key: 'nav.women' },
  { path: '/e-bikes/herren', key: 'nav.men' },
  { path: '/e-bikes/leichte-carbon-e-bikes', key: 'nav.light' },
  { path: '/e-bikes/radgroesse', key: 'nav.wheel' },
  { path: '/e-bikes/motor-antrieb', key: 'nav.motor' },
  { path: '/zubehoer', key: 'nav.acc' }
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
export function CatalogNav({ current, locale = 'de' }: { current?: string; locale?: Locale }) {
  const L = (key: string) => ui(locale, key);
  // in another language only pages that exist there are linked; their URL and name come from that language's page list
  const hrefOf = (path: string) => (locale === 'de' ? path : (l10nByDePath(locale, path) ? `/${locale}${l10nByDePath(locale, path)!.url.replace(/\/$/, '')}` : null));
  const nameOf = (path: string, fallback: string) => (locale === 'de' ? fallback : (l10nByDePath(locale, path)?.name || fallback));
  const bike = PRODUCTS.filter((p) => p.category !== 'Zubehör');
  const count = (path: string) => productsForPath(path).length;
  const brands = MAPPED_PAGES.filter((m) => m.type === 'brand' && m.brand && count(m.path) > 0).sort((a, b) => a.brand!.localeCompare(b.brand!, 'de'));
  const motors = MAPPED_PAGES.filter((m) => m.type === 'brand' && m.motor);
  const acc = MAPPED_PAGES.filter((m) => m.type === 'accessory' && m.path !== '/zubehoer');
  const link = (path: string, label: string, n: number) => {
    const href = hrefOf(path);
    if (!href) return null;
    return (
      <li key={path}>
        <Link href={href} aria-current={current === path ? 'page' : undefined} className={`flex items-center justify-between gap-3 py-1.5 text-sm hover:text-[#FF5722] ${current === path ? 'font-black text-[#FF5722]' : 'font-semibold text-[#131A22]'}`}>
          <span>{label}</span>
          <span className="text-xs font-medium text-gray-500">{n}</span>
        </Link>
      </li>
    );
  };
  const shopHref = locale === 'de' ? '/shop' : `/${locale}/shop`;
  return (
    <nav aria-label={L('nav.label')} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex flex-wrap items-start gap-3">
        <Dropdown label={L('nav.cats')}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {CATEGORY_LINKS.map((c) => link(c.path, L(c.key), c.path === '/e-bikes' ? bike.length : count(c.path)))}
          </ul>
        </Dropdown>
        <Dropdown label={L('nav.brands')}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
            {brands.map((b) => link(b.path, b.brand!, count(b.path)))}
          </ul>
          {motors.length > 0 && (
            <>
              <p className="mt-4 mb-1 text-xs font-black uppercase tracking-wider text-gray-500">{L('nav.motors')}</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
                {motors.map((m) => link(m.path, nameOf(m.path, getKeywordPage('de', m.path)?.name.replace(/ \(.*\)/, '') || m.path), count(m.path)))}
              </ul>
            </>
          )}
        </Dropdown>
        <Dropdown label={L('nav.acc')}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {link('/zubehoer', L('nav.allAcc'), PRODUCTS.length - bike.length)}
            {acc.map((a) => link(a.path, nameOf(a.path, getKeywordPage('de', a.path)?.name || getMappedPage(a.path)?.accessory || a.path), count(a.path)))}
          </ul>
        </Dropdown>
        <Link href={shopHref} className="inline-flex items-center px-4 py-2.5 rounded-lg bg-[#131A22] text-white text-sm font-bold hover:bg-[#1D2633]">{L('nav.filter')}</Link>
      </div>
    </nav>
  );
}
