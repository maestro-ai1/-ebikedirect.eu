import { REVIEWS_POOL } from '@/lib/reviews';
import type { Product, TrustpilotReview } from '@/lib/types';

// Trustpilot reviews that name exactly the bike a product page sells. Review markup (and the visible rating) is only shown on those product pages,
// never site-wide: Google requires review markup to describe the item on the page.
const BY_SLUG: Record<string, string[]> = {
  'gazelle-ultimate-c380': ['rev-de-2', 'rev-nl-2', 'rev-es-2'],
  'haibike-allmtn-7': ['rev-it-2'],
  'specialized-turbo-levo-pro-carbon-g4-840-wh-29': ['rev-nl-1'],
  'cube-kathmandu-hybrid-slt-800': ['rev-it-3'],
};

export function productReviews(slug: string): TrustpilotReview[] {
  const ids = BY_SLUG[slug] || [];
  return REVIEWS_POOL.filter((r) => ids.includes(r.id));
}

export function withReviews(product: Product): Product {
  const rs = productReviews(product.slug);
  if (!rs.length) return product;
  const avg = rs.reduce((t, r) => t + r.stars, 0) / rs.length;
  return { ...product, rating: Math.round(avg * 10) / 10, reviewsCount: rs.length };
}

const MONTHS: Record<string, string> = { januar: '01', februar: '02', märz: '03', april: '04', mai: '05', juni: '06', juli: '07', august: '08', september: '09', oktober: '10', november: '11', dezember: '12' };
// review dates are stored as "14. Oktober 2026"; schema.org wants ISO 8601
export function reviewIsoDate(d: string): string {
  const m = /^(\d{1,2})\.\s*([A-Za-zäöüÄÖÜ]+)\s+(\d{4})$/.exec(d.trim());
  if (!m) return '2026-01-01';
  const mo = MONTHS[m[2].toLowerCase()] || '01';
  return `${m[3]}-${mo}-${m[1].padStart(2, '0')}`;
}
