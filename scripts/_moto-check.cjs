// strict: every KTM keyword on a product page that carries a 2-4 digit number (not a year) must use a number from that bike's own name
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const mo = /\b(duke|superduke|exc|exc-f|rc|smc|smt|sxf|sx-f|adventure|enduro|supermoto|lc4|cento|rally)\b/i;
const hits = [];
const prods = require('../data/keywords/products.json').products;
let ktm = 0, kw = 0;
for (const [s, e] of Object.entries(prods)) {
  if (e.brand !== 'KTM') continue;
  ktm++;
  const own = new Set(tok(e.name).filter((t) => /^\d+$/.test(t)));
  for (const k of [e.primary, ...(e.secondary || []), ...(e.faq || [])]) {
    if (!k) continue; kw++;
    const nums = tok(k.keyword).filter((t) => /^\d{2,4}$/.test(t) && !(+t >= 2022 && +t <= 2028));
    if (nums.some((n) => !own.has(n)) || mo.test(k.keyword)) hits.push([s, k.keyword, k.volume]);
  }
}
console.log('KTM bikes', ktm, 'keywords', kw, '| suspicious motorcycle-style keywords:', hits.length);
for (const h of hits) console.log(h.join(' | '));
