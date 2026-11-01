import { aiCatalog } from '@/lib/agent-ready';

export const dynamic = 'force-static';

/** ARD (Agentic Resource Discovery) manifest. Lists only resources that exist. */
export function GET() {
  return new Response(JSON.stringify(aiCatalog(), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
  });
}
