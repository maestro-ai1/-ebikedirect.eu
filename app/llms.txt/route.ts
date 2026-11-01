import { llmsTxt } from '@/lib/agent-ready';

export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } });
}
