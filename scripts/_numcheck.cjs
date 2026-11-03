const dump = require('../.image-work/products-dump.json');
const byslug = Object.fromEntries(dump.map((p) => [p.slug, p]));
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\bone (\d{2,3})\b/g, 'one$1').trim().split(' ').filter(Boolean);
const prods = require('../data/keywords/products.json').products;
const rows = [];
let primBad = 0, secBad = 0, tot = 0;
for (const [s, e] of Object.entries(prods)) {
  const p = byslug[s] || {};
  const allowed = new Set([...tok(e.name), ...tok(String(p.batteryStandardWh || '')), ...tok(JSON.stringify(p.specs || {}))].filter((t) => /^\d+$/.test(t)));
  const own = new Set(tok(e.name).filter((t) => /^\d+$/.test(t)));
  for (const [kind, k] of [['PRIMARY', e.primary], ...(e.secondary || []).map((k) => ['sec', k]), ...(e.faq || []).map((k) => ['faq', k])]) {
    if (!k) continue; tot++;
    const nums = tok(k.keyword).filter((t) => /^\d{2,4}$/.test(t) && !(+t >= 2022 && +t <= 2028));
    const ok = kind === 'PRIMARY' ? own : allowed;
    if (nums.some((n) => !ok.has(n))) { rows.push([e.brand, kind, e.name, k.keyword, k.volume, nums.filter((n) => !ok.has(n)).join(',')]); if (kind === 'PRIMARY') primBad++; else secBad++; }
  }
}
console.log('keywords checked', tot, '| number not in the bike name: PRIMARY', primBad, 'secondary/faq', secBad);
for (const r of rows.slice(0, 40)) console.log(r.join(' | '));
