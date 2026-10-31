// Crawls the running site (default http://localhost:3100) from its own sitemap and checks
// status, title (max 60), meta description (110-158), one H1, canonical, hreflang, html lang, emojis.
// Usage: node scripts/live-audit.mjs [origin]
const origin = process.argv[2] || 'http://localhost:3100';
const PUBLIC = 'https://ebikedirect.eu';
const problems = [];
const stats = { pages: 0, ok200: 0 };
const titles = new Map();
const descs = new Map();
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const sm = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
const emojiRe = /[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{2B50}]/u;

async function check(url) {
  const local = url.replace(PUBLIC, origin);
  const res = await fetch(local, { redirect: 'manual' });
  stats.pages++;
  if (res.status !== 200) { problems.push(`${url}: status ${res.status}`); return; }
  stats.ok200++;
  const html = await res.text();
  const bad = (m) => problems.push(`${url}: ${m}`);
  const title = dec((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = dec((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const hreflangs = (html.match(/<link rel="alternate" hrefLang="[^"]+"|<link rel="alternate" hreflang="[^"]+"/gi) || []).length;
  const lang = (html.match(/<html lang="([^"]*)"/) || [])[1];
  if (!title) bad('no title'); else if (title.length > 60) bad(`title ${title.length} chars`);
  if (!desc) bad('no meta description'); else if (desc.length < 110 || desc.length > 158) bad(`description ${desc.length} chars`);
  if (h1s !== 1) bad(`${h1s} H1`);
  if (!canon) bad('no canonical'); else if (canon !== url) bad(`canonical ${canon} differs from ${url}`);
  if (hreflangs < 2) bad(`hreflang count ${hreflangs}`);
  if (!lang) bad('no html lang');
  if (html.includes('noindex')) bad('noindex on a sitemap URL');
  // first heading must be the H1
  const firstHeading = (html.match(/<h[1-6][\s>]/) || [])[0];
  if (firstHeading && !firstHeading.startsWith('<h1')) bad(`first heading is ${firstHeading.slice(1, 3)}, not h1`);
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (emojiRe.test(body)) bad('emoji in HTML');
  titles.set(title, [...(titles.get(title) || []), url]);
  descs.set(desc, [...(descs.get(desc) || []), url]);
}

for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(check));

for (const [t, list] of titles) if (t && list.length > 1) problems.push(`duplicate title "${t}" on ${list.length} URLs (e.g. ${list[0]})`);
for (const [d, list] of descs) if (d && list.length > 1) problems.push(`duplicate description on ${list.length} URLs (e.g. ${list[0]})`);

console.log(`sitemap URLs: ${urls.length}  crawled: ${stats.pages}  status 200: ${stats.ok200}`);
console.log(`problems: ${problems.length}`);
for (const p of problems.slice(0, 1000)) console.log('  - ' + p);
if (problems.length > 80) console.log(`  ... ${problems.length - 80} more`);
process.exit(problems.length ? 1 : 0);
