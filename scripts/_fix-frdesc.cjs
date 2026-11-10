const fs = require('fs');
let t = fs.readFileSync('lib/l10n-product.ts', 'utf8');
const D = '$';
const a = D + '{lead} : ' + D + '{p.name}';
const b = D + '{lead}';
const n = t.split(a).length - 1;
t = t.split(a).join(b);
fs.writeFileSync('lib/l10n-product.ts', t);
console.log('replaced', n);
