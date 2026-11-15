import { MetadataRoute } from 'next';
import { buildSitemap, groupOfUrl } from '@/lib/sitemap-build';

// The sitemap is split into one file per language and kind (pages, products), listed by the index at /sitemap.xml (app/sitemap.xml/route.ts).
// Each file stays far below the 50 MB / 50,000 URL limits, and Search Console reports every file on its own.
export async function generateSitemaps() {
  return Array.from(new Set(buildSitemap().map((e) => groupOfUrl(e.url)))).sort().map((id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  return buildSitemap().filter((e) => groupOfUrl(e.url) === id);
}
