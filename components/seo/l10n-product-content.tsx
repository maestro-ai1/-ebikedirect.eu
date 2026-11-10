import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { buildFrContent, frRelated, frEntry, FR_CATEGORY_LABEL } from '@/lib/l10n-product';
import { l10nByDePath } from '@/lib/l10n-pages';
import { MAPPED_PAGES } from '@/lib/mapped-pages';
import { BRAND_SITES } from '@/components/seo/product-links';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const slug = (b: string) => b.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// French product page copy: sections with the secondary keywords as H3, FAQ, related products, links to brand and category pages, authority links.
export function L10nProductContent({ product }: { product: Product }) {
  const c = buildFrContent(product);
  const related = frRelated(product);
  const isAcc = product.category === 'Zubehör';
  const brandPage = l10nByDePath('fr', `/marken/${slug(product.brand)}`);
  const catDef = !isAcc ? MAPPED_PAGES.find((m) => m.type === 'category' && m.category === product.category) : MAPPED_PAGES.find((m) => m.type === 'accessory' && m.accessory === product.accessory);
  const catPage = catDef ? l10nByDePath('fr', catDef.path) : undefined;
  const site = BRAND_SITES[product.brand];
  const links: { label: string; href: string; note: string }[] = [];
  if (site) links.push({ label: `${product.brand} : site du fabricant`, href: site.href, note: 'Site officiel avec tous les modèles et les informations techniques.' });
  if (/bosch/i.test(product.motor)) links.push({ label: 'Bosch eBike Systems', href: 'https://www.bosch-ebike.com/fr/', note: 'Systèmes d’entraînement, batteries et mises à jour du fabricant du moteur.' });
  links.push({ label: 'FUB : Fédération des usagers de la bicyclette', href: 'https://www.fub.fr/', note: 'Informations et conseils pour les cyclistes au quotidien.' });
  links.push({ label: 'Vélo à assistance électrique sur Wikipédia', href: 'https://fr.wikipedia.org/wiki/V%C3%A9lo_%C3%A0_assistance_%C3%A9lectrique', note: 'Principes du vélo à assistance électrique : moteur, batterie et cadre réglementaire.' });
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10" aria-label={`Informations sur ${product.name}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 space-y-8">
        {c.sections.map((s) => (
          <div key={s.h2} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">{s.h2}</h2>
            {s.blocks.map((b, i) => (
              <div key={i} className="space-y-1">
                {b.h3 && <h3 className="text-base sm:text-lg font-bold text-[#131A22]">{b.h3}</h3>}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">{b.text}</p>
              </div>
            ))}
          </div>
        ))}

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Questions fréquentes sur {product.name}</h2>
          <FaqAccordion items={c.faqs} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Voir aussi</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">
            {brandPage && <>Tous les modèles de la marque : <Link href={`/fr${brandPage.url.replace(/\/$/, '')}`} className="font-semibold text-[#FF5722] hover:underline">{brandPage.display}</Link>. </>}
            {catPage && <>{isAcc ? 'Rubrique' : 'Catégorie'} : <Link href={`/fr${catPage.url.replace(/\/$/, '')}`} className="font-semibold text-[#FF5722] hover:underline">{catPage.name}</Link>. </>}
            {FR_CATEGORY_LABEL[product.category]} : <Link href="/fr/shop" className="font-semibold text-[#FF5722] hover:underline">toute la gamme dans la boutique</Link>.
          </p>
          {related.length > 0 && (
            <>
              <h3 className="text-base sm:text-lg font-bold text-[#131A22]">Produits similaires</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                {related.map((x) => (
                  <li key={x.slug} className="flex items-center gap-3">
                    <Link href={`/fr/shop/${x.slug}`} className="relative w-14 h-14 shrink-0 bg-white border border-gray-100 rounded-lg overflow-hidden">
                      <Image src={x.image} alt={`${x.name} - ${product.brand}`} fill sizes="56px" className="object-contain p-1" />
                    </Link>
                    <span><Link href={`/fr/shop/${x.slug}`} className="font-semibold text-[#131A22] hover:text-[#FF5722]">{x.name}</Link> <span className="text-gray-600">({fmt(x.price)})</span></span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22]">Pour en savoir plus</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener" className="font-semibold text-[#FF5722] hover:underline">{l.label}</a>
                <p className="text-gray-600 mt-1">{l.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { frEntry };
