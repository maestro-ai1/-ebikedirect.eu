// Keeps data/lastmod.json honest: crawls every sitemap URL of the built site, hashes the visible content (title, description, canonical, main text),
// and moves a URL's date to now only when its hash changed. New URLs get today's date. Run after a build, before the commit that ships it.
// usage: node scripts/update-lastmod.mjs [base]   (default http://localhost:3100)
import fs from 'fs';
import crypto from 'crypto';
const base = process.argv[2] || 'http://localhost:3100';
const LIVE = 'https://ebikedirect.eu';
const file = 'data/lastmod.json';
const old = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const idx = await (await fetch(base + '/sitemap.xml')).text();
const parts = /<sitemapindex/.test(idx) ? await Promise.all([...idx.matchAll(/<loc>([^<]*)<\/loc>/g)].map(async (m) => (await fetch(base + new URL(m[1]).pathname)).text())) : [idx];
const urls = parts.flatMap((x) => [...x.matchAll(/<url>\s*<loc>([^<]*)<\/loc>/g)].map((m) => m[1]));
const now = new Date().toISOString();
const next = {}; let changed = 0, added = 0, same = 0, i = 0;
async function one(u) {
  let h = '';
  try { h = await (await fetch(u.replace(LIVE, base))).text(); } catch { next[u] = old[u] || { h: '', d: now }; return; }
  const pick = (re) => ((h.match(re) || [])[1] || '').trim();
  const main = (h.match(/<main[\s\S]*<\/main>/) || [h])[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ');
  const sig = [pick(/<title>([^<]*)/), pick(/<meta name="description" content="([^"]*)"/), pick(/<link rel="canonical" href="([^"]*)"/), main].join('\n');
  const hash = crypto.createHash('sha1').update(sig).digest('hex').slice(0, 12);
  const prev = old[u];
  if (!prev) { next[u] = { h: hash, d: now }; added++; }
  else if (prev.h !== hash) { next[u] = { h: hash, d: now }; changed++; }
  else { next[u] = prev; same++; }
}
await Promise.all(Array.from({ length: 10 }, async () => { while (i < urls.length) await one(urls[i++]); }));
const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => (a < b ? -1 : 1)));
fs.writeFileSync(file, JSON.stringify(sorted) + '\n');
console.log('urls', urls.length, '| new', added, '| changed', changed, '| unchanged', same);
