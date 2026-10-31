// Checks every post in content/blog/de against the Blog Rule and Golden Keyword Rule.
// Run from the repo root: node scripts/blog-audit.mjs   (exit code 1 when any check fails)
import fs from 'node:fs';
import path from 'node:path';

const dir = 'content/blog/de';
const norm = (s) => s.toLowerCase().replace(/[-_]/g, ' ').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/\s+/g, ' ');
const stem = (w) => w.replace(/(en|e|n|s)$/, '');
const hasKw = (text, kw) => { const t = norm(text).split(' ').map(stem); return norm(kw).split(' ').filter((w) => w.length > 1).every((w) => t.some((x) => x.startsWith(stem(w)) || stem(w).startsWith(x) && x.length > 3)); };
const words = (t) => t.replace(/[#|*_>\-\[\]()`]/g, ' ').split(/\s+/).filter(Boolean).length;

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort() : [];
const slugs = new Set();
const primaries = new Map();
const problems = [];
const dormant = new Set();
let totalWords = 0;

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const bad = (msg) => problems.push(`${f}: ${msg}`);
  if (!m) { bad('no frontmatter'); continue; }
  const meta = {};
  for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }
  const body = m[2].trim();
  const w = words(body);
  totalWords += w;

  for (const k of ['slug', 'title', 'seoTitle', 'description', 'primary', 'volume', 'kd', 'date', 'updated']) if (!meta[k]) bad(`missing ${k}`);
  if (slugs.has(meta.slug)) bad('duplicate slug'); slugs.add(meta.slug);
  if (primaries.has(meta.primary)) bad(`primary keyword also used by ${primaries.get(meta.primary)}`); primaries.set(meta.primary, f);

  if (w < 1500) bad(`only ${w} words (min 1500)`);
  if (meta.seoTitle && meta.seoTitle.length > 60) bad(`seoTitle ${meta.seoTitle.length} chars (max 60)`);
  if (meta.seoTitle && meta.primary && !norm(meta.seoTitle).startsWith(norm(meta.primary).split(' ')[0].slice(0, 5))) bad('seoTitle does not start with the primary');
  if (meta.description && (meta.description.length < 110 || meta.description.length > 158)) bad(`description ${meta.description.length} chars (110-158)`);
  if (meta.title && meta.primary && !hasKw(meta.title, meta.primary)) bad('H1 (title) lacks the primary');
  if (meta.kd && Number(meta.kd) > 28) bad(`KD ${meta.kd} above 28`);
  if (meta.volume && Number(meta.volume) < 50) bad('volume below 50');

  const firstPara = body.split('\n\n')[0] || '';
  if (meta.primary && !hasKw(firstPara, meta.primary)) bad('primary missing from first paragraph');

  const h2 = body.split('\n').filter((l) => l.startsWith('## '));
  if (h2.length < 8) bad(`only ${h2.length} H2 (min 8)`);
  const faqIdx = h2.findIndex((l) => /faq|häufige fragen/i.test(l));
  if (faqIdx < 0) bad('no FAQ section');
  const faqSection = body.split(/\n## /).find((s) => /^(Häufige Fragen|FAQ)/i.test(s)) || '';
  const faqCount = (faqSection.match(/^### /gm) || []).length;
  if (faqCount !== 5) bad(`${faqCount} FAQ questions (need exactly 5)`);

  const links = [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((x) => x[1]);
  const internal = links.filter((l) => l.startsWith('/'));
  const outbound = links.filter((l) => /^https?:/.test(l));
  if (new Set(internal).size < 8) bad(`only ${new Set(internal).size} distinct internal links (min 8)`);
  if (outbound.length < 3) bad(`only ${outbound.length} outbound links (min 3)`);
  if (!/\n\|.*\|\n\|[-| :]+\|/.test(body)) bad('no table');
  if (!body.split('\n').some((l) => /^## /.test(l) && /faq|häufige/i.test(l))) bad('FAQ heading missing');
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(raw)) bad('emoji found');
}

// internal links to other posts must resolve
for (const f of files) {
  const body = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const x of body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)) if (!slugs.has(x[1]) && !['page'].includes(x[1])) dormant.add(x[1]);
}

console.log(`posts: ${files.length}  total words: ${totalWords}  avg: ${files.length ? Math.round(totalWords / files.length) : 0}`);
console.log(`problems: ${problems.length}  dormant links (target post not written yet, shown as plain text): ${dormant.size}`);
for (const p of problems) console.log('  - ' + p);
process.exit(problems.length ? 1 : 0);
