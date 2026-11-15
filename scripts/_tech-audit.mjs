// Technical audit of the sitemap against the pages themselves: every sitemap URL answers 200 without a redirect, is indexable, has a canonical equal to its own sitemap address,
// carries hreflang links that match the sitemap, has a valid <lastmod>, and every hreflang target is itself a sitemap URL that points back.
// usage: node scripts/_tech-audit.mjs <base>   (base = http://localhost:3100 or https://ebikedirect.eu). Output: .image-work/tech-audit.json
import fs from 'fs';
const base = process.argv[2] || 'http://localhost:3100';
const LIVE = 'https://ebikedirect.eu';
const xml = await (async (b) => { const i = await (await fetch(b + '/sitemap.xml')).text(); if (!/<sitemapindex/.test(i)) return i; const ls = [...i.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => new URL(m[1]).pathname); return (await Promise.all(ls.map(async (p) => (await fetch(b + p)).text()))).join('\n'); })(base);
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
  const b = m[1];
  const loc = (b.match(/<loc>([^<]*)<\/loc>/) || [])[1];
  const lastmod = (b.match(/<lastmod>([^<]*)<\/lastmod>/) || [])[1];
  const alts = [...b.matchAll(/<xhtml:link[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/g)].map((a) => [a[1], a[2]]);
  return { loc, lastmod, alts };
});
const set = new Set(entries.map((e) => e.loc));
const local = (u) => u.replace(LIVE, base);
const out = { base, total: entries.length, fail: {}, examples: {} };
const bad = (k, u, note = '') => { out.fail[k] = (out.fail[k] || 0) + 1; (out.examples[k] ||= []).length < 4 && out.examples[k].push(u + (note ? ' ' + note : '')); };
const altMap = new Map(entries.map((e) => [e.loc, e.alts]));
let idx = 0;
async function one(e) {
  if (!e.lastmod || !/^\d{4}-\d\d-\d\dT/.test(e.lastmod) || isNaN(Date.parse(e.lastmod))) bad('lastmod invalid', e.loc, e.lastmod);
  let r;
  try { r = await fetch(local(e.loc), { redirect: 'manual' }); } catch { bad('fetch error', e.loc); return; }
  if (r.status !== 200) { bad('status not 200', e.loc, String(r.status)); return; }
  const h = await r.text();
  const can = (h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/) || h.match(/<link[^>]*href="([^"]*)"[^>]*rel="canonical"/) || [])[1];
  const norm = (u) => (u || '').replace(/\/$/, '');
  if (!can) bad('canonical missing', e.loc); else if (norm(can) !== norm(e.loc)) bad('canonical differs from sitemap url', e.loc, can);
  const robots = (h.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
  const hdr = r.headers.get('x-robots-tag') || '';
  if (/noindex/i.test(hdr)) bad('X-Robots-Tag noindex header on a sitemap page', e.loc, hdr);
  if (/noindex/.test(robots)) bad('noindex page in sitemap', e.loc);
  const page = [...h.matchAll(/<link[^>]*rel="alternate"[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/g)].map((a) => a[1] + '|' + norm(a[2]));
  const sm = e.alts.map((a) => a[0] + '|' + norm(a[1]));
  if (e.alts.length) {
    if (!sm.some((x) => x.split('|')[1] === norm(e.loc))) bad('hreflang set does not include the page itself', e.loc);
    if (page.length && page.sort().join() !== sm.sort().join()) bad('hreflang page vs sitemap differ', e.loc);
    for (const [, href] of e.alts) {
      if (!set.has(href) && !set.has(href + '/') && !set.has(href.replace(/\/$/, ''))) { bad('hreflang target not in sitemap', e.loc, href); break; }
      const back = altMap.get(href) || altMap.get(href + '/') || altMap.get(href.replace(/\/$/, ''));
      if (back && back.length && !back.some((b) => norm(b[1]) === norm(e.loc))) { bad('hreflang not reciprocal', e.loc, href); break; }
    }
  }
  if (!/<title>[^<]{3,}/.test(h)) bad('title missing', e.loc);
}
async function worker() { while (idx < entries.length) { const e = entries[idx++]; await one(e); } }
await Promise.all(Array.from({ length: 10 }, worker));
fs.writeFileSync('.image-work/tech-audit.json', JSON.stringify(out, null, 1));
const dupLoc = entries.length - set.size;
console.log('sitemap urls', entries.length, '| duplicate urls', dupLoc, '| lastmod distinct values', new Set(entries.map((e) => e.lastmod)).size);
console.log(Object.keys(out.fail).length ? JSON.stringify(out.fail, null, 1) : 'no failures');
for (const [k, v] of Object.entries(out.examples)) console.log(k, v.join(' ; '));
