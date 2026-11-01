import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const dynamic = 'force-static';

// Browsers and crawlers still request /favicon.ico; answer with the SVG mark so it never 404s.
export function GET() {
  const svg = readFileSync(join(process.cwd(), 'public', 'favicon.svg'));
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
}
