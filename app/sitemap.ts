import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { localesForPath, getLocalizedPath, getHreflangAlternates } from '@/lib/i18n';
import { l10nAlternates, l10nPages, L10N_LOCALES } from '@/lib/l10n-pages';
import { getAllPosts } from '@/lib/blog-content';
import { MAPPED_PAGES, listingPageCount, listingUrl } from '@/lib/mapped-pages';
import { FAMILIES, familyMembers, familyPageCount, familyListingUrl } from '@/lib/families';

type Entry = { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' };

// One sitemap entry per indexed language, each carrying the full hreflang set.
// Languages without a keyword bank (en) are not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const currentDate = new Date().toISOString();

  const routes: Entry[] = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/shop', priority: 0.95, changeFrequency: 'daily' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/marken', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/policies', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/policies/returns', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/policies/delivery', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/policies/privacy', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/policies/imprint', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/sitemap', priority: 0.6, changeFrequency: 'weekly' },
    ...PRODUCTS.map((p): Entry => ({ path: `/shop/${p.slug}`, priority: 0.9, changeFrequency: 'weekly' })),
    ...getAllPosts().map((p): Entry => ({ path: `/blog/${p.slug}`, priority: 0.8, changeFrequency: 'monthly' })),
    ...Array.from({ length: Math.max(0, Math.ceil(getAllPosts().length / 12) - 1) }, (_, i): Entry => ({ path: `/blog/page/${i + 2}`, priority: 0.5, changeFrequency: 'weekly' })),
    ...MAPPED_PAGES.map((p): Entry => ({ path: p.path, priority: p.type === 'category' ? 0.9 : 0.8, changeFrequency: 'weekly' })),
    // model-family pages and their numbered pages
    ...FAMILIES.filter((f) => familyMembers(f).length >= 2).map((f): Entry => ({ path: f.path, priority: 0.8, changeFrequency: 'weekly' })),
    ...FAMILIES.filter((f) => familyMembers(f).length >= 2).flatMap((f) =>
      Array.from({ length: Math.max(0, familyPageCount(f) - 1) }, (_, i): Entry => ({ path: familyListingUrl(f.path, i + 2), priority: 0.5, changeFrequency: 'weekly' }))
    ),
    // numbered listing pages (9 products per page): page 2 onward
    ...MAPPED_PAGES.flatMap((p) =>
      Array.from({ length: Math.max(0, listingPageCount(p.path) - 1) }, (_, i): Entry => ({ path: listingUrl(p.path, i + 2), priority: 0.5, changeFrequency: 'weekly' }))
    ),
  ];

  const translated = L10N_LOCALES.flatMap((l) => l10nPages(l).map((p) => ({
    url: `${baseUrl}/${l}${p.url.replace(/\/$/, '')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: p.type === 'category' ? 0.8 : 0.7,
    alternates: { languages: Object.fromEntries((l10nAlternates(p.url, l, baseUrl) || []).map((a) => [a.hreflang, a.url])) },
  })));
  const base = routes.flatMap((route) => {
    const languages = Object.fromEntries(
      (l10nAlternates(route.path, 'de', baseUrl) || getHreflangAlternates(route.path, baseUrl)).map((a) => [a.hreflang, a.url])
    );
    return localesForPath(route.path).map((l) => ({
      url: `${baseUrl}${getLocalizedPath(route.path, l.code)}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });
  return [...base, ...translated];
}
