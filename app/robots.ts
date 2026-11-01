import { MetadataRoute } from 'next';

// WebForge robots: search crawlers, AI agents (allowed to read the public catalogue) and bulk scrapers (blocked) are separate groups.
// Private paths (cart, checkout, order API) stay closed for everyone.
const PRIVATE = ['/api/order', '/cart', '/checkout', '/checkout/*'];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';

  return {
    rules: [
      // Search engine crawlers
      {
        userAgent: ['Googlebot', 'Bingbot', 'Applebot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'],
        allow: '/',
        disallow: [...PRIVATE, '/*?*sort=*', '/*?*filter=*']
      },
      // AI agents and answer engines: may read pages, the catalogue API and the agent files
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Cohere-ai', 'anthropic-ai', 'Meta-ExternalAgent', 'CCBot'],
        allow: ['/', '/api/products', '/api/openapi.json', '/.well-known/', '/llms.txt', '/llms-full.txt'],
        disallow: PRIVATE
      },
      // Bulk scrapers
      { userAgent: ['Bytespider'], disallow: '/' },
      // Everyone else
      { userAgent: '*', allow: '/', disallow: PRIVATE }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
