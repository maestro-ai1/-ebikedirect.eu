import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';

  return {
    rules: [
      // Standard search engine web crawlers
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot'
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/*?*sort=*',
          '/*?*filter=*'
        ]
      },
      // Dedicated AI Indexing Agents & LLM Scrapers
      {
        userAgent: [
          'Google-Extended',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Cohere-ai',
          'Bytespider',
          'CCBot',
          'anthropic-ai',
          'OAI-SearchBot'
        ],
        allow: [
          '/',
          '/shop',
          '/shop/*',
          '/about',
          '/faq',
          '/blog',
          '/blog/*',
          '/policies/*',
          '/llms.txt',
          '/llms-full.txt'
        ],
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/checkout/*'
        ]
      },
      // Default fallback rule
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
