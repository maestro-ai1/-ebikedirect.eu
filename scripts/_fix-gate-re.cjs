const fs = require('fs');
let t = fs.readFileSync('scripts/onpage-gate.mjs', 'utf8');
const bad = '/^/(fr|nl|it|es|pt)//';
const good = String.raw`/^\/(fr|nl|it|es|pt)\//`;
t = t.split(bad).join(good);
fs.writeFileSync('scripts/onpage-gate.mjs', t);
console.log('fixed', t.includes(good), !t.includes(bad));
