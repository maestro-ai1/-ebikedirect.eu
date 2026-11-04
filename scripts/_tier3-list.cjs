// every bike whose main keyword has volume 0 (tier 3): the owner-agreed last tier; printed so the wording can be reviewed
const prods = require('../data/keywords/products.json').products;
const rows = Object.entries(prods).filter(([, e]) => e.primary.source === 'bank' && e.primary.volume === 0);
console.log('bikes with a volume-0 main keyword (tier 3):', rows.length);
const by = {}; for (const [, e] of rows) by[e.brand] = (by[e.brand] || 0) + 1;
console.log('by brand:', JSON.stringify(by));
for (const [s, e] of rows) console.log((e.name + ' | ' + e.primary.keyword + ' | KD ' + e.primary.kd + ' | ' + e.primary.intent));
const low = Object.entries(prods).filter(([, e]) => e.primary.source === 'bank' && e.primary.volume > 0 && e.primary.volume < 50);
console.log('bikes with a main keyword of volume 10-49 (relaxed floor):', low.length);
