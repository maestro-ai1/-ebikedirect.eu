// Re-bases the prices of the brand-store accessories in lib/catalog-universal.ts on the manufacturer's CURRENT selling price (owner rule: slightly below the manufacturer): price = current store price x 0.995,
// originalPrice = the store's compare-at (list) price where it is higher. Fresh product feeds are fetched from the same stores the importer used.
// usage: node scripts/reprice-accessories.mjs [--write]
import fs from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const STORES = { reelight: 'https://www.reelight.com', quadlock: 'https://www.quadlockcase.eu', mucoff: 'https://eu.muc-off.com' };
const src = fs.readFileSync('scripts/import-universal.mjs', 'utf8');
const items = [...src.matchAll(/^\s*\['(reelight|quadlock|mucoff)', '([^']+)', '([^']+)', '([^']+)',/gm)].map((m) => ({ store: m[1], handle: m[2], slug: m[4] }));
const feeds = {};
for (const [k, base] of Object.entries(STORES)) { let all = []; for (let p = 1; p <= 6; p++) { const r = await fetch(`${base}/products.json?limit=250&page=${p}`, { headers: { 'user-agent': UA } }); if (!r.ok) break; const j = await r.json(); if (!j.products.length) break; all.push(...j.products); } feeds[k] = all; }
const file = 'lib/catalog-universal.ts'; const text = fs.readFileSync(file, 'utf8');
const start = text.indexOf('= [') + 2; const end = text.lastIndexOf(']') + 1;
const arr = JSON.parse(text.slice(start, end)); const q2 = (n) => Math.round(n * 100) / 100;
let changed = 0, same = 0, missing = 0; const rows = [];
for (const p of arr) {
  const it = items.find((x) => x.slug === p.slug); const f = it && feeds[it.store].find((x) => x.handle === it.handle);
  if (!f) { missing++; rows.push([p.slug, 'NOT IN FEED', p.price]); continue; }
  const av = f.variants.filter((v) => v.available); const vs = av.length ? av : f.variants;
  const now = Math.min(...vs.map((v) => Number(v.price))); const cmp = Math.max(0, ...vs.map((v) => Number(v.compare_at_price) || 0));
  const price = q2(now * 0.995); const orig = cmp > now ? cmp : undefined;
  if (price !== p.price || orig !== p.originalPrice) { rows.push([p.slug, p.price + (p.originalPrice ? '/' + p.originalPrice : ''), price + (orig ? '/' + orig : '')]); p.price = price; if (orig) p.originalPrice = orig; else delete p.originalPrice; changed++; } else same++;
}
for (const r of rows) console.log(r.join(' | '));
console.log('products', arr.length, '| repriced', changed, '| unchanged', same, '| not in feed', missing);
if (process.argv.includes('--write')) { fs.writeFileSync(file, text.slice(0, start) + JSON.stringify(arr, null, 2) + text.slice(end)); console.log('written'); }
