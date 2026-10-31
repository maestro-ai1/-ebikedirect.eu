import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { localesForPath, getLocalizedPath, getHreflangAlternates } from '@/lib/i18n';
import { getAllPosts } from '@/lib/blog-content';
import { MAPPED_PAGES } from '@/lib/mapped-pages';

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
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/policies/returns', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/policies/delivery', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/policies/privacy', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/policies/imprint', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/sitemap', priority: 0.6, changeFrequency: 'weekly' },
    ...PRODUCTS.map((p): Entry => ({ path: `/shop/${p.slug}`, priority: 0.9, changeFrequency: 'weekly' })),
    ...getAllPosts().map((p): Entry => ({ path: `/blog/${p.slug}`, priority: 0.8, changeFrequency: 'monthly' })),
    ...Array.from({ length: Math.max(0, Math.ceil(getAllPosts().length / 12) - 1) }, (_, i): Entry => ({ path: `/blog/page/${i + 2}`, priority: 0.5, changeFrequency: 'weekly' })),
    ...MAPPED_PAGES.map((p): Entry => ({ path: p.path, priority: p.type === 'category' ? 0.9 : 0.8, changeFrequency: 'weekly' })),
  ];

  return routes.flatMap((route) => {
    const languages = Object.fromEntries(
      getHreflangAlternates(route.path, baseUrl).map((a) => [a.hreflang, a.url])
    );
    return localesForPath(route.path).map((l) => ({
      url: `${baseUrl}${getLocalizedPath(route.path, l.code)}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });
}
