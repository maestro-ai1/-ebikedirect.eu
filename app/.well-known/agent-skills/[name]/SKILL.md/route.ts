import { AGENT_SKILLS } from '@/lib/agent-ready';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return AGENT_SKILLS.map((s) => ({ name: s.name }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const skill = AGENT_SKILLS.find((s) => s.name === name);
  if (!skill) return new Response('Not found', { status: 404 });
  return new Response(skill.body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' } });
}
