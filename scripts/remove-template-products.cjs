// One-off: removes the placeholder TEMPLATE_PRODUCTS (stock photos from outside the Image Rule, unverified specs) from lib/products.ts.
const fs = require('fs');
const f = 'lib/products.ts';
let s = fs.readFileSync(f, 'utf8');
const a = s.indexOf('const TEMPLATE_PRODUCTS: Product[] = [');
const b = s.indexOf('export const PRODUCTS');
if (a < 0 || b < 0 || b < a) { console.log('markers not found'); process.exit(1); }
s = s.slice(0, a) + s.slice(b);
s = s.replace(', ...TEMPLATE_PRODUCTS]', ']');
fs.writeFileSync(f, s);
console.log('removed', (b - a), 'characters; remaining lines:', s.split('\n').length);
