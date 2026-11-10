const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-brands.cjs', 'utf8');
t = t.replace(/display: d\.type === 'brand' && \/\^Moteur\|STEPS\/\.test\(d\.name\) && source === 'name' \? d\.name : disp,/, 'display: disp,');
fs.writeFileSync('scripts/_lang-brands.cjs', t);
console.log(t.includes('display: disp,'));
