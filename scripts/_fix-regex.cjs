const fs = require('fs');
const f = 'lib/mapped-pages.ts';
const L = fs.readFileSync(f, 'utf8').split('\n');
const nl = L[90].endsWith('\r') ? '\r' : '';
const i = L.findIndex((l) => l.startsWith('const LOW_FRAME'));
L[i] = 'const LOW_FRAME = /(damen|wave|tiefeinsteiger|tiefeinstieg|easy entry|trapez|\\blow\\b|lowstep|step-through|stepthrough|\\blady\\b)/;' + nl;
L[i + 1] = 'const HIGH_FRAME = /(diamant|diamond|herren|\\bgent\\b)/;' + nl;
fs.writeFileSync(f, L.join('\n'));
console.log(L[i], L[i + 1]);
