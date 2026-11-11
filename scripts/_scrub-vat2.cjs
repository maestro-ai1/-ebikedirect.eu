const fs = require('fs');
const P = require('./_scrub-vat-data.cjs');
const setKey = (o, k, v) => { for (const key of Object.keys(o)) { if (key === k && typeof o[key] === 'string') o[key] = v; else if (o[key] && typeof o[key] === 'object') setKey(o[key], k, v); } };
for (const [l, v] of Object.entries(P)) {
  const f = 'messages/' + l + '.json';
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [k, val] of Object.entries(v)) setKey(j, k, val);
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log('done');
