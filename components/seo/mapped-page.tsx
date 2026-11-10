import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getMappedPage, MAPPED_PAGES, productsForPath, listingPageCount, listingUrl, PER_PAGE } from '@/lib/mapped-pages';
import { getKeywordPage, capitalize, buildTitle, buildDescription, type KeywordPage } from '@/lib/seo';
import { getAllPosts } from '@/lib/blog-content';
import { getLocalizedPath } from '@/lib/i18n';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { ProductCard } from '@/components/shop/product-card';
import { CatalogNav } from '@/components/shop/catalog-nav';
import { productFocusKeyword } from '@/lib/product-keywords';
import { familiesOfBrand } from '@/lib/families';
import { buildMappedFaqs } from '@/lib/mapped-faq';
import { FaqAccordion } from '@/components/ui/faq-accordion';

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

// Colour lifestyle photo (1200 x 800) for the landing pages that have one.
const BANNERS: Record<string, string> = {
  '/e-bikes': 'e-bike-kaufen',
  '/e-bikes/e-mountainbikes': 'e-mountainbike-kaufen',
  '/e-bikes/trekking-e-bikes': 'trekking-e-bike-kaufen',
  '/e-bikes/city-e-bikes': 'city-e-bike-kaufen',
  '/e-bikes/s-pedelec': 's-pedelec-kaufen',
  '/e-bikes/cargo-bikes': 'cargo-e-bike-kaufen',
  '/e-bikes/falt-e-bikes': 'falt-e-bike-kaufen',
  '/e-bikes/e-rennrad-gravel': 'e-rennrad-gravel-kaufen',
  '/e-bikes/kinder-jugend': 'kinder-e-bike-kaufen',
  '/zubehoer': 'e-bike-zubehoer-kaufen'
};

// A brand hub without its own entry in the keyword map still gets a page (brand name plus "e-bike kaufen") until the map covers it.
function pageFor(path: string): KeywordPage | null {
  const found = getKeywordPage('de', path);
  if (found && found.primary) return found;
  const def = getMappedPage(path);
  if (!def || !def.brand) return null;
  return { url: path, type: 'brand', name: def.brand, primary: { keyword: `${def.brand.toLowerCase()} e-bike kaufen`, volume: 0, kd: null, intent: 'T' }, secondary: [] };
}

export function mappedMetadata(path: string, pageNum = 1): Metadata {
  const page = pageFor(path);
  if (!page || !page.primary || !getMappedPage(path)) return { title: 'Seite nicht gefunden' };
  if (pageNum <= 1) {
    return {
      title: { absolute: page.metaTitle || buildTitle('de', page.primary.keyword) },
      description: page.metaDescription || buildDescription('de', page.primary.keyword),
    };
  }
  // page 2 onward: own title and description, no repetition of page 1 copy
  const total = listingPageCount(path);
  const head = `${capitalize(page.primary.keyword)}: Seite ${pageNum}`;
  const title = `${head} | ebikedirect.eu`.length <= 60 ? `${head} | ebikedirect.eu` : `${page.name}: Seite ${pageNum} | ebikedirect.eu`.slice(0, 60);
  let description = `${page.name}, Seite ${pageNum} von ${total}: weitere lieferbare Modelle mit Preis, Motor und Akku. Jetzt vergleichen und bei ebikedirect.eu online bestellen.`;
  if (description.length > 158) description = `${page.name}, Seite ${pageNum} von ${total}: weitere lieferbare Modelle mit Preis, Motor und Akku. Jetzt online bestellen.`;
  if (description.length < 110) description += ' Lieferung per Spedition, 2 Jahre Garantie.';
  return { title: { absolute: title }, description };
}

function Pagination({ path, page, total }: { path: string; page: number; total: number }) {
  if (total <= 1) return null;
  const nums = Array.from({ length: total }, (_, i) => i + 1);
  const item = 'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg border text-sm font-bold';
  return (
    <nav aria-label="Seitennavigation" className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {page > 1 && <Link href={listingUrl(path, page - 1)} rel="prev" className={`${item} border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]`}>Zurück</Link>}
      {nums.map((n) => (
        <Link key={n} href={listingUrl(path, n)} aria-current={n === page ? 'page' : undefined} aria-label={`Seite ${n}`} className={`${item} ${n === page ? 'border-[#FF5722] bg-[#FF5722] text-white' : 'border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]'}`}>{n}</Link>
      ))}
      {page < total && <Link href={listingUrl(path, page + 1)} rel="next" className={`${item} border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]`}>Weiter</Link>}
    </nav>
  );
}

export function MappedPage({ path, pageNum = 1 }: { path: string; pageNum?: number }) {
  const def = getMappedPage(path);
  const page = pageFor(path);
  if (!def || !page || !page.primary) notFound();

  const all = productsForPath(path);
  const total = listingPageCount(path);
  if (pageNum < 1 || pageNum > total) notFound();
  const items = all.slice((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE);
  const altSeen = new Set<string>();
  const first = pageNum === 1;
  const faqs = first ? buildMappedFaqs(def, page.name, (page.faq || []).slice(0, 5).map((k) => k.keyword), all) : [];
  const h1base = capitalize(page.primary.keyword);
  const h1 = first ? h1base : `${h1base}: Seite ${pageNum}`;
  const banner = BANNERS[path];
  // The page's main keyword must sit in at least one image alt: when the page has no logo or banner carrying it, the first product image does.
  const hasKwImage = (def.type === 'brand' && !!BRAND_LOGOS.find((b) => b.name === def.brand)) || (!!banner && pageNum === 1);
  let kwAltUsed = hasKwImage;
  const altFor = (p: { slug: string; name: string }) => {
    let a = productFocusKeyword(p.slug, p.name);
    if (!kwAltUsed) { kwAltUsed = true; const k = page.primary.keyword; if (!a.toLowerCase().includes(k.toLowerCase())) a = `${k} - ${a}`; }
    if (altSeen.has(a)) return `${a} - ${p.name}`; altSeen.add(a); return a;
  };
  const parent =
    def.type === 'brand'
      ? [{ label: 'Marken', href: '/marken' }]
      : def.type === 'accessory'
        ? path === '/zubehoer' ? [] : [{ label: 'Zubehör', href: '/zubehoer' }]
        : path === '/e-bikes'
          ? []
          : [{ label: 'E-Bikes', href: '/e-bikes' }];
  const crumbs = [...parent, { label: page.name, href: path }, ...(first ? [] : [{ label: `Seite ${pageNum}`, href: listingUrl(path, pageNum) }])];
  const posts = getAllPosts().filter((p) => !p.legacy).slice(0, 3);
  const ACC = MAPPED_PAGES.filter((m) => m.type === 'accessory').map((m) => m.path);
  const siblings = (def.type === 'accessory' ? ACC : def.type === 'brand' ? MAPPED_PAGES.filter((m) => m.type === 'brand' && (m.brand || m.motor)).map((m) => m.path) : ['/e-bikes', '/e-bikes/e-mountainbikes', '/e-bikes/trekking-e-bikes', '/e-bikes/city-e-bikes', '/e-bikes/s-pedelec', '/e-bikes/cargo-bikes', '/e-bikes/falt-e-bikes', '/e-bikes/e-rennrad-gravel', '/e-bikes/kinder-jugend', '/e-bikes/damen', '/e-bikes/herren', '/e-bikes/leichte-carbon-e-bikes', '/e-bikes/radgroesse', '/e-bikes/motor-antrieb'])
    .filter((s) => s !== path)
    .map((s) => ({ path: s, name: pageFor(s)?.name || getKeywordPage('de', s)?.name || s }));

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={crumbs} />
      <CatalogNav current={path} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        <header className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${banner && first ? 'grid grid-cols-1 md:grid-cols-5' : ''}`}>
          <div className={`p-8 sm:p-10 space-y-3 ${banner && first ? 'md:col-span-3' : ''}`}>
            {def.type === 'brand' && BRAND_LOGOS.find((b) => b.name === def.brand) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={BRAND_LOGOS.find((b) => b.name === def.brand)!.logo} alt={`${page.primary.keyword} Logo`} className="h-10 w-auto max-w-[220px] object-contain" />
            )}
            <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">{def.type === 'brand' ? 'Marke' : def.type === 'accessory' ? 'Zubehör' : 'Kategorie'}</p>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">{h1}</h1>
            {first ? (
              <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">
                {def.type === 'accessory'
                  ? `${h1}: Hier finden Sie ${all.length === 1 ? 'den aktuell lieferbaren Artikel' : `die ${all.length} aktuell lieferbaren Artikel`} aus dem Bereich ${page.name}, mit Preis und Angabe, für welche Räder sie passen. Bestellen Sie Zubehör für Ihr E-Bike direkt online.`
                  : `${h1}: Hier finden Sie ${all.length === 1 ? 'das aktuell lieferbare Modell' : `die ${all.length} aktuell lieferbaren Modelle`} aus dem Bereich ${page.name}, mit Preis, Motor und Akkukapazität auf einen Blick. Vergleichen Sie die Ausstattung und bestellen Sie Ihr E-Bike online mit Speditionslieferung nach Hause.`}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Seite {pageNum} von {total}: Modelle {(pageNum - 1) * PER_PAGE + 1} bis {Math.min(pageNum * PER_PAGE, all.length)} von {all.length}.</p>
            )}
            {first && def.note && <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{def.note}{def.filter === 'motor-hub' && <> <Link href="/marken/bosch" className="text-[#FF5722] font-semibold hover:underline">Bosch</Link>, <Link href="/marken/shimano" className="text-[#FF5722] font-semibold hover:underline">Shimano</Link>, <Link href="/marken/yamaha-motor" className="text-[#FF5722] font-semibold hover:underline">Yamaha</Link>.</>}</p>}
          </div>
          {banner && first && (
            <div className="relative aspect-3/2 md:aspect-auto md:col-span-2 min-h-56">
              <Image src={`/lifestyle/${banner}.webp`} alt={page.primary.keyword} fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
          )}
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
                        <Image src={p.image} alt={altFor(p)} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-contain p-4" />
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
                    <ProductCard product={p} alt={altFor(p)} />
                  )}
                </li>
              ))}
            </ul>
          )}
          <Pagination path={path} page={pageNum} total={total} />
        </section>

        {first && def.type === 'brand' && def.brand && familiesOfBrand(def.brand).length > 0 && (
          <section aria-labelledby="families" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-3">
            <h2 id="families" className="text-xl font-black text-[#131A22]">Modellreihen von {def.brand}</h2>
            <ul className="flex flex-wrap gap-2">
              {familiesOfBrand(def.brand).map((fm) => (
                <li key={fm.path}><Link href={fm.path} className="inline-block px-3 py-1.5 rounded-full border border-gray-300 text-sm font-semibold text-[#131A22] hover:border-[#FF5722] hover:text-[#FF5722] transition-colors">{fm.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {first && page.secondary.length > 0 && (
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

        {faqs.length > 0 && (
          <section aria-labelledby="faq" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
            <h2 id="faq" className="text-xl font-black text-[#131A22]">Häufige Fragen: {page.name}</h2>
            <FaqAccordion items={faqs} />
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
