import { buildSitemap, groupOfUrl } from '@/lib/sitemap-build';

// Sitemap index: one entry per sitemap file, lastmod = newest page date in that file.
export const dynamic = 'force-static';

export function GET() {
  const base = process.env.APP_URL || 'https://ebikedirect.eu';
  const groups = new Map<string, string>();
  for (const e of buildSitemap()) {
    const g = groupOfUrl(e.url);
    const d = String(e.lastModified);
    if (!groups.has(g) || d > (groups.get(g) as string)) groups.set(g, d);
  }
  const body = [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([g, d]) => `  <sitemap>\n    <loc>${base}/sitemap/${g}.xml</loc>\n    <lastmod>${d}</lastmod>\n  </sitemap>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' }
  });
}
