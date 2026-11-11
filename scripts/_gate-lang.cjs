const r = require('../.image-work/gate-results.json').results;
const lg = (u) => (/^\/(fr|en|nl|it|es|pt)(\/|$)/.exec(u) || [])[1] || 'de';
const by = {}, tot = {};
for (const x of r) { const l = lg(x.url); (tot[l] ||= { p: 0, f: 0 }); x.ok ? tot[l].p++ : tot[l].f++; if (!x.ok && l === (process.argv[2] || 'en')) { const k = x.type + ' | ' + x.rule; (by[k] ||= { n: 0, ex: [] }); by[k].n++; if (by[k].ex.length < 2) by[k].ex.push(x.url + ' ' + String(x.note || '').slice(0, 80)); } }
for (const [l, v] of Object.entries(tot)) console.log(l, 'checks', v.p + v.f, 'fail', v.f, (100 * v.p / (v.p + v.f)).toFixed(1) + '%');
Object.entries(by).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) => console.log(v.n, k, '|', v.ex.join(' ; ')));
