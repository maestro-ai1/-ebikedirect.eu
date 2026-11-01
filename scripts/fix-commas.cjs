// One-off: adds the missing trailing commas before the new E-Gravel entries in lib/product-seo.ts.
const fs = require('fs');
const f = 'lib/product-seo.ts';
const lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i + 1].startsWith("  'E-Gravel':") && !lines[i].trimEnd().endsWith(',')) lines[i] = lines[i].trimEnd() + ',';
}
fs.writeFileSync(f, lines.join('\n'));
console.log('commas fixed');
