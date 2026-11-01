import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PRODUCTS } from '@/lib/products';
import { getMappedPage } from '@/lib/mapped-pages';
import { getKeywordPage, capitalize, buildTitle, buildDescription } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog-content';
import { getLocalizedPath } from '@/lib/i18n';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { ProductCard } from '@/components/shop/product-card';
import { productFocusKeyword } from '@/lib/product-keywords';

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

function productsFor(path: string) {
  const def = getMappedPage(path);
  if (!def) return [];
  if (def.motor) return PRODUCTS.filter((p) => p.category !== 'Zubehör' && new RegExp(def.motor!, 'i').test(p.motor));
  if (def.brand) return PRODUCTS.filter((p) => p.brand === def.brand);
  if (def.accessory) return PRODUCTS.filter((p) => p.accessory === def.accessory);
  if (def.type === 'accessory') return PRODUCTS.filter((p) => p.category === 'Zubehör');
  if (def.category) return PRODUCTS.filter((p) => p.category === def.category);
  return PRODUCTS.filter((p) => p.category !== 'Zubehör');
}

export function mappedMetadata(path: string): Metadata {
  const page = getKeywordPage('de', path);
  if (!page || !getMappedPage(path)) return { title: 'Seite nicht gefunden' };
  return {
    title: { absolute: buildTitle('de', page.primary.keyword) },
    description: buildDescription('de', page.primary.keyword),
  };
}

export function MappedPage({ path }: { path: string }) {
  const def = getMappedPage(path);
  const page = getKeywordPage('de', path);
  if (!def || !page) notFound();

  const items = productsFor(path);
  const h1 = capitalize(page.primary.keyword);
  const parent =
    def.type === 'brand'
      ? [{ label: 'Marken', href: '/marken' }]
      : def.type === 'accessory'
        ? path === '/zubehoer' ? [] : [{ label: 'Zubehör', href: '/zubehoer' }]
        : path === '/e-bikes'
          ? []
          : [{ label: 'E-Bikes', href: '/e-bikes' }];
  const posts = getAllPosts().filter((p) => !p.legacy).slice(0, 3);
  const ACC = ['/zubehoer', '/zubehoer/schloesser', '/zubehoer/helme', '/zubehoer/taschen-koerbe', '/zubehoer/gepaecktraeger-anhaenger', '/zubehoer/schutzbleche-staender', '/zubehoer/handyhalter', '/zubehoer/werkzeug-pflege', '/zubehoer/regenschutz-bekleidung', '/zubehoer/beleuchtung', '/zubehoer/sattel-lenker'];
  const siblings = (def.type === 'accessory' ? ACC : def.type === 'brand' ? ['/marken/cube', '/marken/specialized', '/marken/riese-und-mueller', '/marken/haibike', '/marken/kalkhoff', '/marken/gazelle', '/marken/bosch', '/marken/tenways', '/marken/focus', '/marken/winora', '/marken/ghost', '/marken/ktm', '/marken/trek', '/marken/giant'] : ['/e-bikes', '/e-bikes/e-mountainbikes', '/e-bikes/trekking-e-bikes', '/e-bikes/city-e-bikes', '/e-bikes/s-pedelec', '/e-bikes/cargo-bikes', '/e-bikes/falt-e-bikes'])
    .filter((s) => s !== path)
    .map((s) => ({ path: s, name: getKeywordPage('de', s)?.name || s }));

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[...parent, { label: page.name, href: path }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        <header className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-3">
          {def.type === 'brand' && BRAND_LOGOS.find((b) => b.name === def.brand) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={BRAND_LOGOS.find((b) => b.name === def.brand)!.logo} alt={`${def.brand} Logo`} className="h-10 w-auto max-w-[220px] object-contain" />
          )}
          <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">{def.type === 'brand' ? 'Marke' : def.type === 'accessory' ? 'Zubehör' : 'Kategorie'}</p>
          <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">{h1}</h1>
          <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">
            {def.type === 'accessory'
              ? `${h1}: Hier finden Sie ${items.length === 1 ? 'den aktuell lieferbaren Artikel' : `die ${items.length} aktuell lieferbaren Artikel`} aus dem Bereich ${page.name}, mit Preis und Angabe, für welche Räder sie passen. Bestellen Sie Zubehör für Ihr E-Bike direkt online.`
              : `${h1}: Hier finden Sie ${items.length === 1 ? 'das aktuell lieferbare Modell' : `die ${items.length} aktuell lieferbaren Modelle`} aus dem Bereich ${page.name}, mit Preis, Motor und Akkukapazität auf einen Blick. Vergleichen Sie die Ausstattung und bestellen Sie Ihr E-Bike online mit Speditionslieferung nach Hause.`}
          </p>
        </header>

        <section aria-labelledby="models" className="space-y-4">
          <h2 id="models" className="text-xl font-black text-[#131A22]">{def.type === 'accessory' ? 'Lieferbare Artikel' : 'Lieferbare Modelle'}</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">Aktuell sind in diesem Bereich keine Modelle gelistet. Alle Modelle sehen Sie im <Link href={getLocalizedPath('/shop', 'de')} className="text-[#FF5722] font-semibold">Sortiment</Link>.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <li key={p.id}>
                  {p.category === 'Zubehör' ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
                      <Link href={`/shop/${p.slug}`} className="block relative aspect-square bg-white border-b border-gray-100">
                        <Image src={p.image} alt={productFocusKeyword(p.slug, p.name)} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-contain p-4" />
                      </Link>
                      <div className="p-5 flex flex-col gap-2 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{p.brand} · {p.category}</span>
                        <h3 className="text-base font-bold text-[#131A22] leading-snug">
                          <Link href={`/shop/${p.slug}`} className="hover:text-[#FF5722]">{p.name}</Link>
                        </h3>
                        <div className="text-lg font-black text-[#131A22] mt-auto">{eur.format(p.price)}</div>
                      </div>
                    </div>
                  ) : (
                    <ProductCard product={p} alt={productFocusKeyword(p.slug, p.name)} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {page.secondary.length > 0 && (
          <section aria-labelledby="topics" className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
            <h2 id="topics" className="text-xl font-black text-[#131A22]">Worauf Käufer bei {page.name} achten</h2>
            <p className="text-sm text-gray-700 max-w-3xl">
              Diese Suchbegriffe zeigen, wonach Kundinnen und Kunden in diesem Bereich am häufigsten suchen. Zu jedem Thema führt der Weg über die Modelle oben oder über unseren Ratgeber.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {page.secondary.slice(0, 5).map((s) => (
                <div key={s.keyword}>
                  <h3 className="text-base font-bold text-[#131A22]">{capitalize(s.keyword)}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Passende Modelle für diese Suche finden Sie in der Liste oben, dazu Motor, Akku und Reichweite im direkten Vergleich.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="more" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 id="more" className="text-base font-black text-[#131A22] mb-3">{def.type === 'brand' ? 'Weitere Marken' : def.type === 'accessory' ? 'Weiteres Zubehör' : 'Weitere Kategorien'}</h2>
            <ul className="space-y-1.5 text-sm">
              {siblings.map((s) => (
                <li key={s.path}><Link href={getLocalizedPath(s.path, 'de')} className="text-[#FF5722] font-semibold hover:underline">{s.name}</Link></li>
              ))}
            </ul>
          </div>
          {posts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-black text-[#131A22] mb-3">Aus dem Ratgeber</h2>
              <ul className="space-y-1.5 text-sm">
                {posts.map((p) => (
                  <li key={p.slug}><Link href={getLocalizedPath(`/blog/${p.slug}`, 'de')} className="text-[#FF5722] font-semibold hover:underline">{p.title}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
