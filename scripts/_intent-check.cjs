const prods = require('../data/keywords/products.json').products;
const IN = { T: 'Transactional', C: 'Commercial', N: 'Navigational', I: 'Informational', '-': 'unclassified' };
const prim = {}, sec = {}, faq = {};
let bank = 0, total = 0;
for (const e of Object.values(prods)) {
  total++;
  if (e.primary.source !== 'bank') continue;
  bank++;
  const i = e.primary.intent || '-';
  prim[i] = (prim[i] || 0) + 1;
  for (const k of e.secondary || []) sec[k.intent || '-'] = (sec[k.intent || '-'] || 0) + 1;
  for (const k of e.faq || []) faq[k.intent || '-'] = (faq[k.intent || '-'] || 0) + 1;
}
const fmt = (o) => Object.entries(o).map(([k, v]) => `${IN[k] || k} ${v}`).join(', ');
console.log('bikes', total, '| with a bank main keyword:', bank, '| name-based:', total - bank);
console.log('MAIN keyword intent:', fmt(prim));
console.log('SECONDARY keyword intent:', fmt(sec));
console.log('FAQ keyword intent:', fmt(faq));
