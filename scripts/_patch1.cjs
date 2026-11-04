const fs = require('fs');
let t = fs.readFileSync('lib/products.ts', 'utf8');
t = t.replace("import { ORBEA_NEW_PRODUCTS } from './catalog-orbea';", "import { ORBEA_NEW_PRODUCTS } from './catalog-orbea';\nimport { REMOVED_PRODUCTS } from './removed-products';");
t = t.replace("  const key = norm(`${p.brand} ${p.name}`);", "  if (REMOVED_PRODUCTS[p.slug]) return false;\n  const key = norm(`${p.brand} ${p.name}`);");
fs.writeFileSync('lib/products.ts', t);
let c = fs.readFileSync('next.config.ts', 'utf8');
c = c.replace("import type {NextConfig} from 'next';", "import type {NextConfig} from 'next';\nimport {REMOVED_PRODUCTS} from './lib/removed-products';");
c = c.replace("  output: 'standalone',", "  async redirects() {\n    return Object.entries(REMOVED_PRODUCTS).flatMap(([from, to]) => [\n      {source: `/shop/${from}`, destination: `/shop/${to}`, permanent: true},\n      {source: `/:locale(fr|nl|it|es|pt)/shop/${from}`, destination: `/:locale/shop/${to}`, permanent: true}\n    ]);\n  },\n  output: 'standalone',");
fs.writeFileSync('next.config.ts', c);
const s = require('./../data/image-sources.json'); const R = require('fs').readFileSync('lib/removed-products.ts', 'utf8').match(/'([a-z0-9-]+)':/g).map((x) => x.slice(1, -2));
let n = 0; for (const k of Object.keys(s)) if (R.includes(k)) { delete s[k]; n++; }
fs.writeFileSync('data/image-sources.json', JSON.stringify(s, null, 2)); console.log('sources removed', n, R);
for (const r of R) fs.rmSync('public/products/' + r, { recursive: true, force: true });
