// French product keyword map (batch 3): model-level keywords from the French bank, one keyword = one URL inside French.
// A keyword is given to the product whose name contains the most of its model words; products without a free keyword keep the product name.
// usage: node scripts/_fr-products.cjs   -> data/keywords/fr-products.json
const fs = require('fs');
const root = 'C:/electric bikes europe';
const lang = process.argv[2] || 'fr';
const plan = require('./_lang-plan.cjs')[lang];
const BUY = { fr: 'acheter ', en: 'buy ' }[lang];
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nk = (s) => norm(s).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const GUARD = new RegExp(plan.guard, 'i');
const cfg = require(root + '/02-site-architecture/cfg_' + lang + '.js');
const VOC = new RegExp('^(' + plan.vocab + ')$', 'i');
const bank = [];
for (const l of fs.readFileSync(`${root}/03-keywords/by-market/${plan.bankDir || lang}/${plan.bankDir || lang}_master_merged.csv`, 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0;
  if (kd === null || kd > 28 || vol < 20) continue;
  bank.push({ keyword: p[0].toLowerCase(), intent: IT(p[1]), volume: vol, kd });
}
bank.sort((a, b) => b.volume - a.volume);
const live = require('../data/keywords/' + lang + '-live.json').pages;
const used = new Set(); for (const p of live) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
const prods = require('../data/keywords/products.json').products;
const entries = Object.entries(prods).filter(([, p]) => p.category !== 'Zubehör').map(([slug, p]) => ({ slug, ...p }));
const brands = [...new Set(entries.map((p) => p.brand))];
const GEN = new Set(['bike', 'bikes', 'e', 'plus', 'pro', 'wh', 'zoll', 'gen', 'mit', 'und', 'the', 'hybrid', 'sport', 'one', 'sl', 'race', 'ex', 'fe', 'lite', 'sx', 'st', 'abs', 'move', 'advance']);
const toks = (s) => norm(s).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter(Boolean);
const meta = entries.map((p) => {
  const bt = toks(p.brand).filter((x) => x !== 'und');
  const nt = toks(p.name);
  const model = nt.filter((t) => !bt.includes(t) && t.length > 2 && !/^\d+$/.test(t) && !GEN.has(t));
  return { ...p, bt, nt: new Set(nt), model: new Set(model) };
});
const otherBrandRe = new RegExp('\\b(' + brands.concat(['bosch', 'shimano', 'yamaha', 'nakamura', 'decathlon']).map((b) => norm(b).split(/[^a-z0-9]+/)[0]).filter((x) => x && x !== 'und').join('|') + ')\\b', 'i');
const assigned = new Map(); // slug -> [kw]
for (const m of meta) assigned.set(m.slug, []);
for (const kw of bank) {
  if (GUARD.test(kw.keyword) || (cfg.RETAIL && cfg.RETAIL.test(kw.keyword)) || (cfg.JUNK && cfg.JUNK.test(kw.keyword))) continue;
  if (used.has(nk(kw.keyword))) continue;
  const tk = toks(kw.keyword);
  if (new Set(tk).size !== tk.length) continue;
  // candidate products: same brand tokens, all non-brand non-vocab keyword tokens are product-name tokens, at least one distinctive model token
  let best = null, bestScore = 0;
  for (const m of meta) {
    if (!m.bt.every((t) => tk.includes(t))) continue;
    const rest = tk.filter((t) => !m.bt.includes(t) && !/^(riese|muller|et|and)$/.test(t));
    const modelHit = rest.filter((t) => m.model.has(t));
    if (!modelHit.length) continue;
    if (!rest.every((t) => m.nt.has(t) || VOC.test(t))) continue;
    const score = modelHit.length * 10 + rest.filter((t) => m.nt.has(t)).length;
    const cur = assigned.get(m.slug).length;
    const adj = score * 100 - cur; // most specific product first, then the one with fewest keywords
    if (adj > bestScore || !best) { if (!best || adj > bestScore) { best = m; bestScore = adj; } }
  }
  if (best && assigned.get(best.slug).length < 11) { assigned.get(best.slug).push(kw); used.add(nk(kw.keyword)); }
}
const out = {}; let bankCount = 0, full = 0;
for (const m of meta) {
  const a = assigned.get(m.slug);
  const tc = a.filter((k) => k.intent === 'T' || k.intent === 'C');
  const primaryBank = a.find((k) => k.intent === 'T') || a.find((k) => k.intent === 'C') || null;
  let primary, secondary = [], faq = [];
  if (primaryBank) {
    primary = { ...primaryBank, source: 'bank' }; bankCount++;
    const rest = a.filter((k) => k !== primaryBank);
    secondary = rest.filter((k) => k.intent === 'T' || k.intent === 'C').slice(0, 5);
    faq = rest.filter((k) => !secondary.includes(k)).slice(0, 5);
    if (secondary.length >= 5 && faq.length >= 5) full++;
  } else {
    primary = { keyword: BUY + norm(m.name).replace(/&/g, ' ').replace(/\s+/g, ' ').trim(), intent: 'T', volume: 0, kd: null, source: 'name' };
    faq = a.slice(0, 5);
  }
  out[m.slug] = { name: m.name, brand: m.brand, category: m.category, primary, secondary, faq };
}
fs.writeFileSync('data/keywords/' + lang + '-products.json', JSON.stringify({ locale: 'fr', products: out }, null, 1));
const claimed = [...assigned.values()].reduce((n, a) => n + a.length, 0);
console.log('bikes', meta.length, '| bank primary', bankCount, '| name fallback', meta.length - bankCount, '| full 1+5+5', full, '| keywords assigned', claimed);
const sample = meta.filter((m) => out[m.slug].primary.source === 'bank').slice(0, 12);
for (const m of sample) console.log(m.name.padEnd(46), '|', out[m.slug].primary.keyword, out[m.slug].primary.volume + '/' + out[m.slug].primary.intent, '| S', out[m.slug].secondary.length, 'F', out[m.slug].faq.length);
