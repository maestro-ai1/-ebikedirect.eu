const fs = require('fs');
const cat = {};
for (const f of fs.readdirSync('lib').filter((x) => /^catalog-.*\.ts$/.test(x))) { const s = fs.readFileSync('lib/' + f, 'utf8'); const i = s.indexOf('= ['); if (i < 0) continue; try { for (const p of JSON.parse(s.slice(i + 2, s.lastIndexOf('];') + 1))) cat[p.slug] = p; } catch (e) { /* skip */ } }
const kw = require('../data/keywords/products.json').products;
const B = Object.values(cat).filter((p) => p.category !== 'Zubehör' && kw[p.slug]);
const LOW = /(damen|wave|tiefeinsteiger|tiefeinstieg|easy entry|trapez|\blow\b|lowstep|step-through|stepthrough|\blady\b)/;
const HIGH = /(diamant|diamond|herren|\bgent\b)/;
for (const mode of ['name+sizes', 'name+sizes+rahmen']) {
  const t = (p) => (p.name + ' ' + ((p.options || {}).frameSizes || []).join(' ') + (mode.endsWith('rahmen') ? ' ' + ((p.specs || {}).Rahmen || '') : '')).toLowerCase();
  console.log(mode, 'damen', B.filter((p) => LOW.test(t(p)) && !HIGH.test(t(p))).length, 'herren', B.filter((p) => HIGH.test(t(p)) && !LOW.test(t(p))).length);
}
const R = B.filter((p) => HIGH.test(((p.specs || {}).Rahmen || '').toLowerCase())).slice(0, 8).map((p) => p.name + ' :: ' + p.specs.Rahmen);
console.log(R.join('\n'));
