import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ProductCard } from '@/components/shop/product-card';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { productsForPath } from '@/lib/mapped-pages';
import { l10nByUrl, l10nPages } from '@/lib/l10n-pages';
import { L10N, buildCtx, cap } from '@/lib/l10n-strings';
import type { Locale } from '@/lib/i18n';

const SHOWN = 12;

// Translated category, brand or accessory page: same product list as its German original, copy built from catalogue data (see lib/l10n-strings.ts).
export function L10nCategoryPage({ locale, url }: { locale: Locale; url: string }) {
  const page = l10nByUrl(locale, url);
  const S = L10N[locale];
  if (!page || !S) notFound();
  const kind = page.type;
  const all = productsForPath(page.dePath);
  const items = all.slice(0, SHOWN);
  const fmt = (n: number) => new Intl.NumberFormat(S.intl, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const ctx = all.length ? buildCtx(all, fmt) : null;
  const h1 = page.display;
  const note = S.notes[page.dePath];
  const prefix = `/${locale}`;
  const siblings = l10nPages(locale).filter((p) => p.type === kind && p.url !== page.url);
  const facts = ctx ? S.facts(kind, ctx, page.name) : [];
  const faqs = ctx ? S.faq(kind, ctx, page.name).map((f, i) => (page.faq[i] ? { q: `${cap(page.faq[i].keyword)} : ${f.q}`, a: f.a } : f)) : [];
  const altSeen = new Set<string>();
  const altFor = (p: { slug: string; name: string }, i: number) => {
    let a = i === 0 ? `${page.primary.keyword} - ${p.name}` : `${p.name} - ${page.name}`;
    if (altSeen.has(a)) a = `${a} (${i + 1})`;
    altSeen.add(a);
    return a;
  };
  const crumbs = [{ label: page.name, href: `${prefix}${page.url.replace(/\/$/, '')}` }];

  return (
    <div className="pb-16">
      <Breadcrumbs items={crumbs} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-10">
        <header className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">{S.eyebrow[kind]}</p>
          <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">{h1}</h1>
          <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">{S.intro(kind, h1, all.length, page.name)}</p>
          {note && <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">{note}</p>}
        </header>

        <section aria-labelledby="models" className="space-y-4">
          <h2 id="models" className="text-xl font-black text-[#131A22]">{S.models[kind]}</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">{S.noModels}</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <li key={p.id}>
                  {p.category === 'Zubehör' ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
                      <Link href={`${prefix}/shop/${p.slug}`} className="block relative aspect-square bg-white border-b border-gray-100">
                        <Image src={p.image} alt={altFor(p, i)} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-contain p-4" />
                      </Link>
                      <div className="p-5 flex flex-col gap-2 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{p.brand}</span>
                        <h3 className="text-base font-bold text-[#131A22] leading-snug">
                          <Link href={`${prefix}/shop/${p.slug}`} className="hover:text-[#FF5722]">{p.name}</Link>
                        </h3>
                        <div className="text-lg font-black text-[#131A22] mt-auto">{fmt(p.price)}</div>
                      </div>
                    </div>
                  ) : (
                    <ProductCard product={p} alt={altFor(p, i)} tag={S.categoryTag[p.category] || p.category} />
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm"><Link href={`${prefix}/shop`} className="text-[#FF5722] font-semibold hover:underline">{S.seeAll}</Link></p>
        </section>

        {page.secondary.length > 0 && facts.length > 0 && (
          <section aria-labelledby="topics" className="bg-white rounded-2xl border border-gray-200 p-8 space-y-5">
            <h2 id="topics" className="text-xl font-black text-[#131A22]">{S.topicsH2(page.name)}</h2>
            <p className="text-sm text-gray-700 max-w-3xl">{S.topicsIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {page.secondary.slice(0, 5).map((s, i) => (
                <div key={s.keyword}>
                  <h3 className="text-base font-bold text-[#131A22]">{cap(s.keyword)}</h3>
                  <p className="text-sm text-gray-600 mt-1">{facts[i]}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section aria-labelledby="faq" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
            <h2 id="faq" className="text-xl font-black text-[#131A22]">{S.faqH2(page.name)}</h2>
            <FaqAccordion items={faqs} />
          </section>
        )}

        {siblings.length > 0 && (
          <section aria-labelledby="more" className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 id="more" className="text-base font-black text-[#131A22] mb-3">{S.moreCategories[kind]}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-sm">
              {siblings.map((s) => (
                <li key={s.url}><Link href={`${prefix}${s.url.replace(/\/$/, '')}`} className="text-[#FF5722] font-semibold hover:underline">{s.name}</Link></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
