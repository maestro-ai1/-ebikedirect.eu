const r = require('../.image-work/gate-results.json').results;
const rules = process.argv.slice(2);
for (const x of r) { if (x.ok || !/^\/en(\/|$)/.test(x.url)) continue; if (rules.some((k) => x.rule.startsWith(k))) console.log(x.rule.split(' ')[0], x.type, x.url, x.note); }
