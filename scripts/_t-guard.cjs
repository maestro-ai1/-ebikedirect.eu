const plan = require('./_lang-plan-en.cjs');
const i0 = plan.guard.indexOf('|\\b(stem|');
console.log('idx', i0);
const g = plan.guard.slice(0, i0).replace('|\\bkit\\b|\\bkits\\b', '') + ')';
const R = new RegExp(g, 'i');
for (const t of ['bike lock for sale', 'bike helmet', 'bike repair kit', 'bike hire', 'second hand bike lock', 'bike pump uk', 'abus bike lock', 'bike lights']) console.log(t, R.test(t));
console.log(g.slice(-60));
