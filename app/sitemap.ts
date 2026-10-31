import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { BLOG_POSTS } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const currentDate = new Date().toISOString();

  const coreRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/shop', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/checkout/crypto', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/policies/returns', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/policies/delivery', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/policies/privacy', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/policies/imprint', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/sitemap', priority: 0.6, changeFrequency: 'weekly' as const }
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        'de-DE': `${baseUrl}${route.path}`,
        'de-AT': `${baseUrl}${route.path}?lang=at`,
        'nl-NL': `${baseUrl}${route.path}?lang=nl`,
        'it-IT': `${baseUrl}${route.path}?lang=it`,
        'es-ES': `${baseUrl}${route.path}?lang=es`,
        'en-EU': `${baseUrl}${route.path}?lang=en`
      }
    }
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    alternates: {
      languages: {
        'de-DE': `${baseUrl}/shop/${product.slug}`,
        'de-AT': `${baseUrl}/shop/${product.slug}?lang=at`,
        'nl-NL': `${baseUrl}/shop/${product.slug}?lang=nl`,
        'it-IT': `${baseUrl}/shop/${product.slug}?lang=it`,
        'es-ES': `${baseUrl}/shop/${product.slug}?lang=es`,
        'en-EU': `${baseUrl}/shop/${product.slug}?lang=en`
      }
    }
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        'de-DE': `${baseUrl}/blog/${post.slug}`,
        'de-AT': `${baseUrl}/blog/${post.slug}?lang=at`,
        'nl-NL': `${baseUrl}/blog/${post.slug}?lang=nl`,
        'it-IT': `${baseUrl}/blog/${post.slug}?lang=it`,
        'es-ES': `${baseUrl}/blog/${post.slug}?lang=es`,
        'en-EU': `${baseUrl}/blog/${post.slug}?lang=en`
      }
    }
  }));

  return [...coreEntries, ...productEntries, ...blogEntries];
}
