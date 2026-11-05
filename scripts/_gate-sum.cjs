const r = require('../.image-work/gate-results.json').results;
const by = {}; for (const x of r) { const k = x.type + ' | ' + x.rule; (by[k] ||= { p: 0, f: 0, ex: [] }); if (x.ok) by[k].p++; else { by[k].f++; if (by[k].ex.length < 2) by[k].ex.push(x.url + ' ' + String(x.note).slice(0, 60)); } }
let P = 0, F = 0; const bad = [];
for (const [k, v] of Object.entries(by)) { P += v.p; F += v.f; if (v.f) bad.push([k, v.p, v.f, v.ex.join(' ; ')]); }
console.log('checks', P + F, 'pass', P, 'fail', F, 'pct', (100 * P / (P + F)).toFixed(1));
bad.sort((a, b) => b[2] - a[2]).forEach((b) => console.log(b[2], 'fail /', b[1], 'pass |', b[0], '|', b[3]));
