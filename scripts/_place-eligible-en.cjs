// Places every ELIGIBLE-but-unused English keyword (ledger-en.json) on a page, or records it on a hold list with a reason.
// Nothing is dropped: placed + hold must equal the eligible count, and displaced keywords are logged too (check at the end).
// usage: node scripts/_place-eligible-en.cjs [--write]
const fs = require('fs');
const write = process.argv.includes('--write');
const plan = require('./_lang-plan-en.cjs');
const L = require('../.image-work/ledger-en.json');
const pf = 'data/keywords/en-live.json';
const D = JSON.parse(fs.readFileSync(pf, 'utf8'));
const pages = D.pages;
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const toks = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(Boolean);
const GENERIC = new Set('bike bikes e ebike ebikes electric bicycle bicycles cycle cycles for sale price prices buy uk deals deal shop online best cheap new pedelec pedelecs the a with in of and mtb mountain emtb trekking city commuter folding cargo kids kid women womens ladies mens men full suspension hardtail road gravel'.split(' '));
const byUrl = Object.fromEntries(pages.map((p) => [p.url, p]));
const cats = plan.batches.batch1.map((b) => ({ re: new RegExp(b.rel, 'i'), ex: b.exclude ? new RegExp(b.exclude, 'i') : null, url: b.url }));
const brandPages = pages.filter((p) => p.url.startsWith('/brands/') && p.url !== '/brands/').map((p) => ({ p, key: p.url.split('/')[2].split('-')[0] }));
const ACCP = [[/lock/i, '/accessories/locks/'], [/helmet/i, '/accessories/helmets/'], [/(bag|basket|pannier)/i, '/accessories/bags-baskets/'], [/(rack|trailer|carrier)/i, '/accessories/racks-trailers/'], [/(mudguard|stand)/i, '/accessories/mudguards-stands/'], [/(phone)/i, '/accessories/phone-holders/'], [/(tool|repair|wash|clean|lube|pump|inflator|multi ?tool)/i, '/accessories/tools-care/'], [/(rain|poncho|clothing)/i, '/accessories/rain-clothing/'], [/(light|lamp)/i, '/accessories/lights/'], [/(saddle|seat|handlebar)/i, '/accessories/saddles-handlebars/'], [/accessor/i, '/accessories/']];
const used = new Set(); for (const p of pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
const log = []; // every eligible keyword gets exactly one line
const displaced = [];
function target(r) {
  const k = r.k;
  const acc = ACCP.find(([re]) => re.test(k));
  if (acc && byUrl[acc[1]]) return [byUrl[acc[1]], 'accessory'];
  const t = toks(k);
  const bp = brandPages.find((b) => t.includes(b.key));
  if (bp) { const rest = t.filter((x) => x !== bp.key && !bp.key.split('-').includes(x)); const extra = rest.filter((x) => !GENERIC.has(x) && !/^\d+$/.test(x) && x !== 'steps'); return extra.length ? [null, 'hold: brand model word not in the catalogue (' + extra.join(' ') + ')'] : [bp.p, 'brand']; }
  for (const c of cats) if (c.re.test(k) && !(c.ex && c.ex.test(k)) && byUrl[c.url]) return [byUrl[c.url], 'category'];
  return [null, 'hold: no page covers this topic yet'];
}
const rec = (r) => ({ keyword: r.k, volume: r.v, kd: r.kd, intent: r.i });
for (const r of L.eligible) {
  const [p, kind] = target(r);
  if (!p) { log.push({ k: r.k, v: r.v, to: 'HOLD', why: kind }); continue; }
  if (used.has(nk(r.k))) { log.push({ k: r.k, v: r.v, to: 'HOLD', why: 'already placed meanwhile' }); continue; }
  // 1) empty FAQ slot  2) swap into secondary if higher than the lowest stored secondary  3) swap into FAQ if higher than the lowest FAQ
  if (p.faq.length < 5) { p.faq.push(rec(r)); used.add(nk(r.k)); log.push({ k: r.k, v: r.v, to: 'FAQ ' + p.url, why: 'empty slot' }); continue; }
  const lowS = p.secondary.reduce((a, b) => (b.volume < a.volume ? b : a));
  if (p.secondary.length < 5) { p.secondary.push(rec(r)); used.add(nk(r.k)); log.push({ k: r.k, v: r.v, to: 'SECONDARY ' + p.url, why: 'empty slot' }); continue; }
  if (r.v > lowS.volume * 1.2) {
    p.secondary.splice(p.secondary.indexOf(lowS), 1, rec(r)); used.add(nk(r.k)); log.push({ k: r.k, v: r.v, to: 'SECONDARY ' + p.url, why: 'swapped for "' + lowS.keyword + '" ' + lowS.volume });
    // displaced secondary goes to FAQ if it beats the lowest FAQ, otherwise it is logged
    const lowF = p.faq.reduce((a, b) => (b.volume < a.volume ? b : a));
    if (lowS.volume > lowF.volume) { p.faq.splice(p.faq.indexOf(lowF), 1, lowS); displaced.push({ k: lowF.keyword, v: lowF.volume, from: p.url, why: 'FAQ replaced by displaced secondary "' + lowS.keyword + '"' }); } else displaced.push({ k: lowS.keyword, v: lowS.volume, from: p.url, why: 'secondary replaced by "' + r.k + '"' });
    continue;
  }
  const lowF = p.faq.reduce((a, b) => (b.volume < a.volume ? b : a));
  if (r.v > lowF.volume * 1.2) { p.faq.splice(p.faq.indexOf(lowF), 1, rec(r)); used.add(nk(r.k)); log.push({ k: r.k, v: r.v, to: 'FAQ ' + p.url, why: 'swapped for "' + lowF.keyword + '" ' + lowF.volume }); displaced.push({ k: lowF.keyword, v: lowF.volume, from: p.url, why: 'FAQ replaced by "' + r.k + '"' }); continue; }
  log.push({ k: r.k, v: r.v, to: 'HOLD', why: 'page ' + p.url + ' is full and every stored keyword has equal or higher volume' });
}
const placed = log.filter((x) => x.to !== 'HOLD').length;
const hold = log.filter((x) => x.to === 'HOLD');
console.log('eligible', L.eligible.length, '| logged', log.length, '| placed', placed, '| hold', hold.length, '| displaced (logged)', displaced.length);
if (log.length !== L.eligible.length) throw new Error('LEDGER MISMATCH: a keyword was dropped');
const left = pages.filter((p) => p.secondary.length < 5 || p.faq.length < 5).length;
console.log('pages still short of 5 secondary or 5 FAQ:', left);
fs.writeFileSync('.image-work/placement-en.json', JSON.stringify({ log, displaced }, null, 1));
if (write) { fs.copyFileSync(pf, 'data/keywords/en-live.pre-placement.json'); fs.writeFileSync(pf, JSON.stringify(D, null, 1)); console.log('written'); }

// ---- step 2: product level for keywords the pages could not take (products with an empty slot; brand/model words must match the product) ----
if (process.argv.includes('--products')) {
  const P = JSON.parse(fs.readFileSync('data/keywords/en-products.json', 'utf8'));
  const CATMAP = { '/electric-bikes/electric-mountain-bikes/': 'E-MTB', '/electric-bikes/city-commuter-e-bikes/': 'E-City', '/electric-bikes/trekking-e-bikes/': 'E-Trekking', '/electric-bikes/speed-pedelecs/': 'Speed-Pedelec', '/electric-bikes/cargo-e-bikes/': 'Cargo-E-Bike', '/electric-bikes/folding-e-bikes/': 'Falt-E-Bike', '/electric-bikes/gravel-road-e-bikes/': 'E-Gravel', '/electric-bikes/kids-e-bikes/': 'E-Kinder' };
  const prods = Object.entries(P.products);
  const ptoks = (e) => new Set(toks(e.name).concat(toks(e.brand)));
  const usedP = new Set(); for (const [, e] of prods) for (const k of [e.primary, ...(e.secondary || []), ...(e.faq || [])]) if (k) usedP.add(nk(k.keyword));
  let moved = 0;
  for (const x of log.filter((y) => y.to === 'HOLD')) {
    const r = L.eligible.find((e) => e.k === x.k); const t = toks(r.k);
    if (usedP.has(nk(r.k))) continue;
    const bp = brandPages.find((b) => t.includes(b.key));
    let cand = [];
    if (bp) { const extra = t.filter((w) => w !== bp.key && !GENERIC.has(w) && !/^\d+$/.test(w)); cand = prods.filter(([, e]) => toks(e.brand).includes(bp.key) && extra.every((w) => ptoks(e).has(w))); if (extra.length && !cand.length) { x.why += ' | no product of that brand has that model word'; continue; } }
    else { const m = Object.entries(CATMAP).find(([u]) => cands(r.k, u)); if (m) cand = prods.filter(([, e]) => e.category === m[1]); }
    function cands(k, u) { const c = cats.find((q) => q.url === u); return c && c.re.test(k) && !(c.ex && c.ex.test(k)); }
    const open = cand.filter(([, e]) => (e.faq || []).length < 5 || e.secondary.length < 5).slice(0, 40);
    if (!open.length) { x.why += ' | no matching product has an open slot'; continue; }
    for (const [, e] of open) { e.faq = e.faq || []; if (e.secondary.length < 5 && (r.i === 'T' || r.i === 'C')) e.secondary.push(rec(r)); else e.faq.push(rec(r)); }
    usedP.add(nk(r.k)); x.to = 'PRODUCTS (' + open.length + ')'; x.why = 'page full; placed on matching products with an open slot'; moved++;
  }
  console.log('moved to products:', moved, '| still hold:', log.filter((y) => y.to === 'HOLD').length);
  fs.writeFileSync('.image-work/placement-en.json', JSON.stringify({ log, displaced }, null, 1));
  if (write) { fs.copyFileSync('data/keywords/en-products.json', 'data/keywords/en-products.pre-placement.json'); fs.writeFileSync('data/keywords/en-products.json', JSON.stringify(P, null, 1)); console.log('products written'); }
}
