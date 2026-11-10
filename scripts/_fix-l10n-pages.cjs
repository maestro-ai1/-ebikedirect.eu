const fs = require('fs');
let t = fs.readFileSync('lib/l10n-pages.ts', 'utf8');
t = t.replace("import { PRODUCTS } from '@/lib/products';\nconst PRODUCT_SLUGS = new Set(PRODUCTS.map((p) => p.slug));\nconst isFrProduct = (path: string) => /^\/shop\/[^/]+$/.test(norm0(path)) && PRODUCT_SLUGS.has(norm0(path).slice(6));\n", "// every product page exists in French (batch 3); the shop route returns 404 for unknown slugs, so the path pattern is enough here\nconst isFrProduct = (path: string) => /^\/shop\/[^/]+$/.test(norm0(path));\n");
fs.writeFileSync('lib/l10n-pages.ts', t);
console.log(!t.includes("from '@/lib/products'"));
