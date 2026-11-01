import { agentSkillsIndex } from '@/lib/agent-ready';

export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(agentSkillsIndex(), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' }
  });
}
