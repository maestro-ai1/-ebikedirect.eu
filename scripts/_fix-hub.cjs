const fs = require('fs');
let t = fs.readFileSync('scripts/_fr-hub.cjs', 'utf8');
t = t.replace("  if (used.has(nk(k))) continue;\n  rows.push", "  if (used.has(nk(k))) continue;\n  used.add(nk(k));\n  rows.push");
fs.writeFileSync('scripts/_fr-hub.cjs', t);
