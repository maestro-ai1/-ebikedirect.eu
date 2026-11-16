// Keyword ledger for English: every REFRESHED UK keyword (Semrush "Now") ends in exactly one bucket.
// Buckets: main keyword of a page / of a product, secondary, FAQ, or not used with ONE stated reason (intent, KD, volume, guard word, other brand, not sold, informational ...).
// Eligible but unused keywords are listed separately: those are the real gaps. Output: .image-work/ledger-fr.json
const fs = require('fs');
const root = 'C:/electric bikes europe';
const plan = require('./_lang-plan.cjs').fr;
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/fr/fr_refreshed_keys.json', 'utf8')));
const GUARD = new RegExp(plan.guard, 'i'); const NOTSOLD = new RegExp(plan.notSold, 'i');
const live = require('../data/keywords/fr-live.json').pages;
const prods = require('../data/keywords/fr-products.json').products;
const where = new Map(); // nk -> {role, where}
const put = (kw, role, w) => { if (!kw) return; const k = nk(kw.keyword); if (!where.has(k) || role === 'main') where.set(k, { role, where: w }); };
for (const p of live) { put(p.primary, 'main', 'page ' + p.url); (p.secondary || []).forEach((k) => put(k, 'secondary', 'page ' + p.url)); (p.faq || []).forEach((k) => put(k, 'faq', 'page ' + p.url)); }
for (const [slug, e] of Object.entries(prods)) { put(e.primary, 'main', 'product ' + slug); (e.secondary || []).forEach((k) => put(k, 'secondary', 'product ' + slug)); (e.faq || []).forEach((k) => put(k, 'faq', 'product ' + slug)); }
const buckets = {}; const add = (b, row) => { (buckets[b] ||= []).push(row); };
const BRANDS = new RegExp(plan.brands, 'i');
for (const l of fs.readFileSync(root + '/03-keywords/by-market/fr/fr_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); if (!REF.has(k)) continue;
  const row = { k, i: IT(p[1]), v: +p[2] || 0, kd: p[3] === '' ? null : +p[3] };
  const w = where.get(nk(k));
  if (w) { add('used: ' + w.role, { ...row, where: w.where }); continue; }
  if (row.kd === null) add('not used: no KD value', row);
  else if (row.kd > (row.v >= 1000 ? 30 : 28)) add('not used: KD above the limit (28, or 30 at volume 1,000+)', row);
  else if (row.v < 10) add('not used: volume under 10', row);
  else if (row.i === 'I') add('not used: Informational (goes to the blog queue)', row);
  else if (row.i === 'N') add('not used: Navigational (brand pages only when clearly higher)', row);
  else if (NOTSOLD.test(k)) add('not used: brand or product the shop does not sell', row);
  else if (GUARD.test(k)) add('not used: guard word (second-hand, hire, finance, review, accessory word, retailer ...)', row);
  else add('ELIGIBLE but not used', row);
}
const sum = Object.fromEntries(Object.entries(buckets).map(([b, a]) => [b, a.length]));
const elig = (buckets['ELIGIBLE but not used'] || []).sort((a, b) => b.v - a.v);
fs.writeFileSync('.image-work/ledger-fr.json', JSON.stringify({ total: REF.size, sum, eligible: elig, samples: Object.fromEntries(Object.entries(buckets).filter(([b]) => b !== 'ELIGIBLE but not used').map(([b, a]) => [b, a.sort((x, y) => y.v - x.v).slice(0, 8)])) }, null, 1));
console.log('refreshed', REF.size); console.log(JSON.stringify(sum, null, 1));
console.log('eligible unused top 30:'); for (const r of elig.slice(0, 30)) console.log(' ', r.k, r.i, r.v, 'KD', r.kd);
