// Wires the Bulls e-bikes (lib/catalog-bulls.ts) into the site. Idempotent.
// 1 product registry (lib/products.ts), 2 name-based keyword entries for de/fr/en (primary "<name> kaufen" / "acheter <name>" / "buy <name>", source "name").
// Bank-based primaries and secondaries follow after the Semrush refresh of the Bulls keywords (none of the 654 Bulls bank rows is refreshed yet).
const fs = require('fs');
const edit = (f, fn) => { const a = fs.readFileSync(f, 'utf8'); const b = fn(a); if (b !== a) fs.writeFileSync(f, b); return b !== a; };
const res = {};
res.registry = edit('lib/products.ts', (s) => {
  if (s.includes('BULLS_NEW_PRODUCTS')) return s;
  s = s.replace("import { CUBE_NEW_PRODUCTS } from './catalog-cube';", "import { CUBE_NEW_PRODUCTS } from './catalog-cube';\nimport { BULLS_NEW_PRODUCTS } from './catalog-bulls';");
  return s.replace('...ORBEA_NEW_PRODUCTS]', '...ORBEA_NEW_PRODUCTS, ...BULLS_NEW_PRODUCTS]');
});
const src = fs.readFileSync('lib/catalog-bulls.ts', 'utf8');
const list = JSON.parse(src.slice(src.indexOf('Product[] = ') + 'Product[] = '.length, src.lastIndexOf(';')));
const FILES = [['data/keywords/products.json', (n) => n.toLowerCase() + ' kaufen'], ['data/keywords/fr-products.json', (n) => 'acheter ' + n.toLowerCase()], ['data/keywords/en-products.json', (n) => 'buy ' + n.toLowerCase()]];
res.keywords = {};
for (const [f, kw] of FILES) {
  const J = JSON.parse(fs.readFileSync(f, 'utf8')); let n = 0;
  for (const p of list) if (!J.products[p.slug]) { J.products[p.slug] = { name: p.name, brand: 'Bulls', category: p.category, primary: { keyword: kw(p.name), intent: 'T', volume: 0, kd: null, source: 'name' }, secondary: [], faq: [] }; n++; }
  if (n) fs.writeFileSync(f, JSON.stringify(J, null, 1));
  res.keywords[f] = n;
}
console.log(JSON.stringify(res), 'products', list.length);
