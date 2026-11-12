// All English keywords currently selected (pages + products), deduplicated: the list to refresh in Semrush UK.
const fs = require('fs');
const out = new Map();
const add = (k) => { if (k && k.keyword && !/^buy /.test(k.keyword)) out.set(k.keyword.toLowerCase(), k); };
for (const p of require('../data/keywords/en-live.json').pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) add(k);
for (const e of Object.values(require('../data/keywords/en-products.json').products)) for (const k of [e.primary, ...e.secondary, ...e.faq]) add(k);
const list = [...out.keys()];
fs.writeFileSync('.image-work/en-kwlist.json', JSON.stringify(list));
console.log('selected English keywords', list.length);
