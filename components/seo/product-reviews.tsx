import React from 'react';
import { productReviews } from '@/lib/product-reviews';
import { TRUSTPILOT_STATS } from '@/lib/reviews';

const HEAD: Record<string, string> = { de: 'Kundenbewertungen auf Trustpilot', fr: 'Avis clients sur Trustpilot', en: 'Customer reviews on Trustpilot' };
const SHOP: Record<string, (s: string, n: string) => string> = {
  de: (s, n) => `Shop-Bewertung auf Trustpilot: ${s.replace('.', ',')} von 5 aus ${n} Bewertungen. Die Bewertungen beziehen sich auf den Shop und den Kaufablauf, nicht auf dieses einzelne Modell.`,
  fr: (s, n) => `Note de la boutique sur Trustpilot : ${s.replace('.', ',')} sur 5 pour ${n.replace('.', ' ')} avis. Ces avis portent sur la boutique et le processus d’achat, pas sur ce modèle précis.`,
  en: (s, n) => `Shop rating on Trustpilot: ${s} out of 5 from ${n.replace('.', ',')} reviews. These reviews are about the shop and the buying process, not about this single model.`,
};

// Shop-level rating line (visible text only, no review markup: Google requires review markup to describe the item on the page) on every product page,
// plus the visible reviews of exactly this bike where Trustpilot reviews name the model.
export function ProductReviews({ slug, locale = 'de' }: { slug: string; locale?: string }) {
  const rs = productReviews(slug);
  const shop = (SHOP[locale] || SHOP.de)(TRUSTPILOT_STATS.score, TRUSTPILOT_STATS.totalReviews);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" aria-label={HEAD[locale] || HEAD.de}>
      <p className="text-xs text-gray-600">{shop}</p>
      {rs.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-black text-[#131A22] mt-6 mb-4">{HEAD[locale] || HEAD.de}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {rs.map((r) => (
              <figure key={r.id} className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="text-amber-500 text-sm" aria-label={`${r.stars} / 5`}>{'★'.repeat(r.stars)}</div>
                <figcaption className="mt-1 text-sm font-bold text-gray-900">{r.title}</figcaption>
                <blockquote className="mt-2 text-sm text-gray-700">{r.comment}</blockquote>
                <div className="mt-3 text-xs text-gray-500">{r.name}, {r.location}, {r.date}{r.verifiedPurchase ? ' (geprüfter Kauf)' : ''}</div>
              </figure>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
