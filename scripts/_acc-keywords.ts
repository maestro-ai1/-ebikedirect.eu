// Writes name-based keyword entries for the 50 accessories into fr-products.json and en-products.json (source 'name', the localized product name).
import fs from 'fs';
import { PRODUCTS } from '../lib/products';
import { localName } from '../lib/l10n-names';
for (const [lg, verb] of [['fr', 'acheter'], ['en', 'buy']] as const) {
  const f = `data/keywords/${lg}-products.json`;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  let n = 0;
  for (const p of PRODUCTS.filter((x) => x.category === 'Zubehör')) {
    if (d.products[p.slug] && d.products[p.slug].primary.source === 'bank') continue;
    d.products[p.slug] = { name: localName(lg, p.name), brand: p.brand, category: p.category, primary: { keyword: `${verb} ${localName(lg, p.name).toLowerCase()}`, intent: 'T', volume: 0, kd: null, source: 'name' }, secondary: [], faq: [] };
    n++;
  }
  fs.writeFileSync(f, JSON.stringify(d, null, 1));
  console.log(lg, n, Object.keys(d.products).length);
}
