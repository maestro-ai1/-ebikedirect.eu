import fs from 'fs';
import { PRODUCTS } from '../lib/products';
import { localName } from '../lib/l10n-names';
for (const lg of ['fr', 'en']) {
  const f = `data/keywords/${lg}-products.json`;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  let n = 0;
  for (const p of PRODUCTS) { const e = d.products[p.slug]; if (!e) continue; const nn = localName(lg, p.name); if (e.name !== nn) { e.name = nn; n++; } }
  fs.writeFileSync(f, JSON.stringify(d, null, 1));
  console.log(lg, 'names updated', n);
}
