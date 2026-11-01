import { apiCatalog } from '@/lib/agent-ready';

export const dynamic = 'force-static';

/** RFC 9727 API catalog (linkset). Lists only endpoints that exist. */
export function GET() {
  return new Response(JSON.stringify(apiCatalog(), null, 2), {
    headers: { 'Content-Type': 'application/linkset+json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
  });
}
