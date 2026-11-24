// Adds name-based keyword entries (de/fr/en) for every product of a brand found in a generated catalog file. Idempotent.
// usage: node scripts/wire-brand-keywords.cjs <Brand> <lib/catalog-file.ts>   e.g. node scripts/wire-brand-keywords.cjs Diamant lib/catalog-xxl.ts
// Bank-based primaries and secondaries follow after the Semrush refresh of the brand's keywords.
const fs = require('fs');
const [brand, file] = process.argv.slice(2);
const src = fs.readFileSync(file, 'utf8');
const list = JSON.parse(src.slice(src.indexOf('Product[] = ') + 'Product[] = '.length, src.lastIndexOf(';'))).filter((p) => p.brand === brand);
const FILES = [['data/keywords/products.json', (n) => n.toLowerCase() + ' kaufen'], ['data/keywords/fr-products.json', (n) => 'acheter ' + n.toLowerCase()], ['data/keywords/en-products.json', (n) => 'buy ' + n.toLowerCase()]];
const res = {};
for (const [f, kw] of FILES) {
  const J = JSON.parse(fs.readFileSync(f, 'utf8')); let n = 0;
  for (const p of list) if (!J.products[p.slug]) { J.products[p.slug] = { name: p.name, brand, category: p.category, primary: { keyword: kw(p.name), intent: 'T', volume: 0, kd: null, source: 'name' }, secondary: [], faq: [] }; n++; }
  if (n) fs.writeFileSync(f, JSON.stringify(J, null, 1));
  res[f] = n;
}
console.log(brand, 'products', list.length, JSON.stringify(res));
