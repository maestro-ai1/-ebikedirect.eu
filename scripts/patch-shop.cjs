// One-off: /shop uses 9 products per page, the standard product card and a brand list that follows the catalogue.
const fs = require('fs');
const f = 'app/[locale]/shop/page.tsx';
let s = fs.readFileSync(f, 'utf8');
function must(cond, msg) { if (!cond) { console.log('FAILED:', msg); process.exit(1); } }

s = s.replace('const itemsPerPage = 6;', 'const itemsPerPage = 9;');
must(s.includes('const itemsPerPage = 9;'), 'itemsPerPage');

const b1 = s.indexOf('const brands = [');
const b2 = s.indexOf('];', b1);
must(b1 > 0 && b2 > b1, 'brands list');
s = s.slice(0, b1) + "const brands = ['all', ...Array.from(new Set(PRODUCTS.filter((p) => p.category !== 'Zubehör').map((p) => p.brand))).sort((a, b) => a.localeCompare(b, 'de'))" + s.slice(b2);

s = s.replace('<ShopProductCard key={product.id} product={product} />', '<ProductCard key={product.id} product={product} alt={`${product.name} kaufen`} />');
must(s.includes('<ProductCard key={product.id}'), 'card usage');

const fn = s.indexOf('function ShopProductCard(');
must(fn > 0, 'old card');
s = s.slice(0, fn).trimEnd() + '\n';

s = s.replace("import { PRODUCTS } from '@/lib/products';", "import { PRODUCTS } from '@/lib/products';\nimport { ProductCard } from '@/components/shop/product-card';");
must(s.includes("import { ProductCard }"), 'import');
fs.writeFileSync(f, s);
console.log('shop page patched, lines:', s.split('\n').length);
