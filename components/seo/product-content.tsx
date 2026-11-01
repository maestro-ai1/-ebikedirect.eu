import React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { buildProductContent, CATEGORY_LABEL, CATEGORY_PATH, brandPath } from '@/lib/product-seo';
import { productFocusKeyword } from '@/lib/product-keywords';
import { FaqAccordion } from '@/components/ui/faq-accordion';

const MOTOR_HUBS: { re: RegExp; path: string; label: string }[] = [
  { re: /bosch/i, path: '/marken/bosch', label: 'Bosch E-Bikes' },
  { re: /shimano/i, path: '/marken/shimano', label: 'Shimano STEPS E-Bikes' },
  { re: /yamaha/i, path: '/marken/yamaha-motor', label: 'Yamaha E-Bikes' }
];

/** Tags: crawlable links to indexable landing pages that exist (brand, motor maker, category). */
export function productTags(p: Product): { label: string; href: string }[] {
  const tags: { label: string; href: string }[] = [];
  const bp = brandPath(p.brand);
  if (bp) tags.push({ label: `${p.brand} E-Bikes`, href: bp });
  const hub = MOTOR_HUBS.find((h) => h.re.test(p.motor));
  if (hub) tags.push({ label: hub.label, href: hub.path });
  if (CATEGORY_PATH[p.category]) tags.push({ label: `${CATEGORY_LABEL[p.category]}s`.replace('ss', 's'), href: CATEGORY_PATH[p.category] });
  tags.push({ label: 'Alle E-Bikes', href: '/e-bikes' });
  return tags;
}

function related(p: Product): Product[] {
  return PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug && x.category !== 'Zubehör')
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 4);
}

export function ProductContent({ product }: { product: Product }) {
  const focus = productFocusKeyword(product.slug, product.name);
  const content = buildProductContent(product, focus);
  const tags = productTags(product);
  const rel = related(product);
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  };
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10" aria-label={`Informationen zum ${product.name}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 space-y-8">
        {content.sections.map((sec) => (
          <div key={sec.h2} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">{sec.h2}</h2>
            {sec.blocks.map((b, i) => (
              <div key={i} className="space-y-1.5">
                {b.h3 && <h3 className="text-base sm:text-lg font-bold text-[#131A22]">{b.h3}</h3>}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">{b.text}</p>
              </div>
            ))}
          </div>
        ))}

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Häufige Fragen zum {product.name}</h2>
          <FaqAccordion items={content.faqs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Schlagwörter und passende Seiten</h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="inline-block px-3 py-1.5 rounded-full border border-gray-300 text-sm font-semibold text-[#131A22] hover:border-[#FF5722] hover:text-[#FF5722] transition-colors">{t.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {rel.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Ähnliche {CATEGORY_LABEL[product.category]}s im Preisbereich</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {rel.map((r) => (
                <li key={r.slug}>
                  <Link href={`/shop/${r.slug}`} className="font-semibold text-[#FF5722] hover:underline">{r.name} kaufen</Link>
                  <span className="text-gray-500">{' '}({r.brand})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
