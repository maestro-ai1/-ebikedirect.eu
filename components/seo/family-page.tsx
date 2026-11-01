import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { CatalogNav } from '@/components/shop/catalog-nav';
import { ProductCard } from '@/components/shop/product-card';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { BRAND_LOGOS } from '@/lib/brand-logos';
import { titleCase } from '@/lib/product-seo';
import { PER_PAGE } from '@/lib/mapped-pages';
import { productFocusKeyword } from '@/lib/product-keywords';
import { getFamily, familiesOfBrand, familyListingUrl, familyPageCount } from '@/lib/families';
import { buildFamilyContent, remainderName } from '@/lib/family-content';

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const CATEGORY_PATH: Record<string, { label: string; href: string }> = {
  'E-MTB': { label: 'E-Mountainbikes', href: '/e-bikes/e-mountainbikes' },
  'E-Trekking': { label: 'Trekking-E-Bikes', href: '/e-bikes/trekking-e-bikes' },
  'E-City': { label: 'City-E-Bikes', href: '/e-bikes/city-e-bikes' },
  'Speed-Pedelec': { label: 'S-Pedelecs', href: '/e-bikes/s-pedelec' },
  'Cargo-E-Bike': { label: 'Cargo-Bikes', href: '/e-bikes/cargo-bikes' },
  'Falt-E-Bike': { label: 'Falt-E-Bikes', href: '/e-bikes/falt-e-bikes' },
  'E-Gravel': { label: 'E-Rennrad und Gravel', href: '/e-bikes/e-rennrad-gravel' },
  'E-Kinder': { label: 'Kinder- und Jugend-E-Bikes', href: '/e-bikes/kinder-jugend' }
};


export function familyMetadata(brandSlug: string, slug: string, pageNum = 1): Metadata {
  const f = getFamily(brandSlug, slug);
  if (!f) return { title: 'Seite nicht gefunden' };
  const c = buildFamilyContent(f);
  if (pageNum <= 1) return { title: { absolute: c.title }, description: c.description };
  const total = familyPageCount(f);
  const head = `${titleCase(f.primary.keyword)}: Seite ${pageNum}`;
  const title = `${head} | ebikedirect.eu`.length <= 60 ? `${head} | ebikedirect.eu` : `${f.name}: Seite ${pageNum} | ebikedirect.eu`.slice(0, 60);
  let description = `${f.name}, Seite ${pageNum} von ${total}: weitere lieferbare Modelle mit Preis, Motor und Akku. Jetzt vergleichen und bei ebikedirect.eu online bestellen.`;
  if (description.length > 158) description = `${f.name}, Seite ${pageNum} von ${total}: weitere Modelle mit Preis, Motor und Akku. Jetzt online bestellen.`;
  if (description.length < 110) description += ' Lieferung per Spedition, 2 Jahre Garantie.';
  return { title: { absolute: title }, description };
}

function Pagination({ path, page, total }: { path: string; page: number; total: number }) {
  if (total <= 1) return null;
  const nums = Array.from({ length: total }, (_, i) => i + 1);
  const item = 'inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg border text-sm font-bold';
  return (
    <nav aria-label="Seitennavigation" className="flex flex-wrap items-center justify-center gap-2 pt-4">
      {page > 1 && <Link href={familyListingUrl(path, page - 1)} rel="prev" className={`${item} border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]`}>Zurück</Link>}
      {nums.map((n) => (
        <Link key={n} href={familyListingUrl(path, n)} aria-current={n === page ? 'page' : undefined} aria-label={`Seite ${n}`} className={`${item} ${n === page ? 'border-[#FF5722] bg-[#FF5722] text-white' : 'border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]'}`}>{n}</Link>
      ))}
      {page < total && <Link href={familyListingUrl(path, page + 1)} rel="next" className={`${item} border-gray-300 bg-white text-[#131A22] hover:border-[#131A22]`}>Weiter</Link>}
    </nav>
  );
}

export function FamilyPage({ brandSlug, slug, pageNum = 1 }: { brandSlug: string; slug: string; pageNum?: number }) {
  const f = getFamily(brandSlug, slug);
  if (!f) notFound();
  const c = buildFamilyContent(f);
  const total = Math.max(1, Math.ceil(c.members.length / PER_PAGE));
  if (c.members.length < 2 || pageNum < 1 || pageNum > total) notFound();
  const items = c.members.slice((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE);
  const first = pageNum === 1;
  const h1base = titleCase(f.primary.keyword);
  const h1 = first ? h1base : `${h1base}: Seite ${pageNum}`;
  const logo = BRAND_LOGOS.find((b) => b.name === f.brand);
  const crumbs = [
    { label: 'Marken', href: '/marken' },
    { label: f.brand, href: `/marken/${f.brandSlug}` },
    { label: f.name, href: f.path },
    ...(first ? [] : [{ label: `Seite ${pageNum}`, href: familyListingUrl(f.path, pageNum) }])
  ];
  const otherFamilies = familiesOfBrand(f.brand).filter((x) => x.path !== f.path);
  const cats = c.categories.map((k) => CATEGORY_PATH[k]).filter(Boolean);
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faqs.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })) };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={crumbs} />
      <CatalogNav current={`/marken/${f.brandSlug}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        <header className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-3">
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.logo} alt={`${f.brand} Logo`} className="h-10 w-auto max-w-[220px] object-contain" />
          )}
          <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">Modellreihe</p>
          <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">{h1}</h1>
          {first ? (
            <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">{c.intro}</p>
          ) : (
            <p className="text-sm text-gray-600">Seite {pageNum} von {total}: Modelle {(pageNum - 1) * PER_PAGE + 1} bis {Math.min(pageNum * PER_PAGE, c.members.length)} von {c.members.length}.</p>
          )}
        </header>

        <section aria-labelledby="models" className="space-y-4">
          <h2 id="models" className="text-xl font-black text-[#131A22]">Lieferbare Modelle</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <li key={p.id}><ProductCard product={p} alt={productFocusKeyword(p.slug, p.name)} /></li>
            ))}
          </ul>
          <Pagination path={f.path} page={pageNum} total={total} />
        </section>

        {first && (
          <>
            <section aria-labelledby="compare" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <h2 id="compare" className="text-xl font-black text-[#131A22]">Die Ausführungen im Vergleich</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <th className="py-2 pr-4">Ausführung</th><th className="py-2 pr-4">Preis</th><th className="py-2 pr-4">Akku</th><th className="py-2">Motor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.members.map((p) => (
                      <tr key={p.slug} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 pr-4"><Link href={`/shop/${p.slug}`} className="font-semibold text-[#FF5722] hover:underline">{remainderName(f, p)}</Link></td>
                        <td className="py-2 pr-4 whitespace-nowrap">{eur.format(p.price)}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{p.batteryStandardWh > 0 ? `${p.batteryStandardWh} Wh` : '-'}</td>
                        <td className="py-2 text-gray-600">{c.rows.find((r) => r.slug === p.slug)?.motor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="topics" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
              <h2 id="topics" className="text-xl font-black text-[#131A22]">Worauf Käufer bei der Reihe {f.name} achten</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {c.topics.map((t) => (
                  <div key={t.h3}>
                    <h3 className="text-base font-bold text-[#131A22]">{t.h3}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="faq" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
              <h2 id="faq" className="text-xl font-black text-[#131A22]">Häufige Fragen zur Modellreihe</h2>
              <FaqAccordion items={c.faqs} />
            </section>
          </>
        )}

        <section aria-labelledby="more" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 id="more" className="text-base font-black text-[#131A22] mb-3">Mehr von {f.brand}</h2>
            <ul className="space-y-1.5 text-sm">
              <li><Link href={`/marken/${f.brandSlug}`} className="text-[#FF5722] font-semibold hover:underline">Alle {f.brand} E-Bikes</Link></li>
              {otherFamilies.map((o) => (<li key={o.path}><Link href={o.path} className="text-[#FF5722] font-semibold hover:underline">{o.name}</Link></li>))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-black text-[#131A22] mb-3">Passende Kategorien</h2>
            <ul className="space-y-1.5 text-sm">
              {cats.map((k) => (<li key={k.href}><Link href={k.href} className="text-[#FF5722] font-semibold hover:underline">{k.label}</Link></li>))}
              <li><Link href="/e-bikes" className="text-[#FF5722] font-semibold hover:underline">Alle E-Bikes</Link></li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
