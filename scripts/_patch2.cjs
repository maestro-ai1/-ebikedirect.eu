const fs = require('fs');
let a = fs.readFileSync('components/seo/accessory-content.tsx', 'utf8');
a = a.replace("Häufige Fragen zu {titleCase(product.name.toLowerCase())}", "Häufige Fragen zu {product.name}").replace("import { titleCase } from '@/lib/product-seo';\n", '');
fs.writeFileSync('components/seo/accessory-content.tsx', a);
let p = fs.readFileSync('app/[locale]/shop/[slug]/page.tsx', 'utf8');
p = p.replace("import { ProductContent } from '@/components/seo/product-content';", "import { ProductContent } from '@/components/seo/product-content';\nimport { AccessoryContent } from '@/components/seo/accessory-content';");
p = p.replace("      {product.category !== 'Zubehör' && <ProductContent product={product} />}", "      {product.category !== 'Zubehör' && <ProductContent product={product} />}\n      {product.category === 'Zubehör' && <AccessoryContent product={product} />}");
fs.writeFileSync('app/[locale]/shop/[slug]/page.tsx', p);
