// Crawls every URL in the sitemap of a running site, collects all links and checks them.
// Internal links must return 200 (after redirects); external (outbound) links are listed with their status.
// Usage: node scripts/link-audit.mjs [origin]   (default https://ebikedirect.eu)
const origin = (process.argv[2] || 'https://ebikedirect.eu').replace(/\/$/, '');
const sm = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://ebikedirect.eu', origin));
const internal = new Map(); // target -> first source
const external = new Map();
const dec = (s) => s.replace(/&amp;/g, '&');
async function scan(u) {
  let html = '';
  try { html = await (await fetch(u)).text(); } catch { return; }
  for (const m of html.matchAll(/<a\b[^>]*?href="([^"#]+)"/g)) {
    const href = dec(m[1]);
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
    let abs;
    try { abs = new URL(href, u).toString(); } catch { continue; }
    if (abs.startsWith(origin)) { const k = abs.split('#')[0]; if (!internal.has(k)) internal.set(k, u); }
    else if (/^https?:/.test(abs)) { const k = abs.split('#')[0]; if (!external.has(k)) external.set(k, u); }
  }
}
for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(scan));
const bad = [];
const keys = [...internal.keys()].filter((k) => !/\/_next\//.test(k));
async function check(k) {
  try { const r = await fetch(k, { redirect: 'follow' }); if (r.status !== 200) bad.push(`${r.status} ${k}  (linked from ${internal.get(k)})`); } catch (e) { bad.push(`ERR ${k}  (linked from ${internal.get(k)})`); }
}
for (let i = 0; i < keys.length; i += 10) await Promise.all(keys.slice(i, i + 10).map(check));
const ext = [];
async function checkExt(k) {
  try { const r = await fetch(k, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 link-audit' }, signal: AbortSignal.timeout(15000) }); ext.push([r.status, k, external.get(k)]); } catch { ext.push(['ERR', k, external.get(k)]); }
}
const extKeys = [...external.keys()];
for (let i = 0; i < extKeys.length; i += 6) await Promise.all(extKeys.slice(i, i + 6).map(checkExt));
console.log(`pages crawled: ${urls.length}, internal links checked: ${keys.length}, broken internal: ${bad.length}`);
bad.slice(0, 60).forEach((b) => console.log('  ' + b));
console.log(`outbound links: ${extKeys.length}`);
const byHost = {};
ext.forEach(([s, k]) => { const h = new URL(k).host; byHost[h] = byHost[h] || { n: 0, bad: 0 }; byHost[h].n++; if (s !== 200) byHost[h].bad++; });
Object.entries(byHost).sort((a, b) => b[1].n - a[1].n).forEach(([h, v]) => console.log(`  ${h}: ${v.n} link(s), not 200: ${v.bad}`));
ext.filter(([s]) => s !== 200).slice(0, 40).forEach(([s, k, src]) => console.log(`  outbound ${s} ${k}  (on ${src})`));
process.exit(bad.length ? 1 : 0);
