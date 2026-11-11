const fs = require('fs');
// 1. client: French H1 may carry the main keyword
let f = 'app/[locale]/shop/[slug]/product-client.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace("export interface FrView { lead: string; specs: [string, string][]; category: string }", "export interface FrView { lead: string; specs: [string, string][]; category: string; h1?: string }");
t = t.replace("                  {product.name}\n", "                  {fr && frView!.h1 ? frView!.h1 : product.name}\n");
fs.writeFileSync(f, t);
// 2. route: H1 = keyword + name when the name does not already contain the keyword
f = 'app/[locale]/shop/[slug]/page.tsx';
t = fs.readFileSync(f, 'utf8');
t = t.replace("frView={{ lead: built.lead, specs: built.specs, category: FR_CATEGORY_LABEL[product.category] || product.category }}", "frView={{ lead: built.lead, specs: built.specs, category: FR_CATEGORY_LABEL[product.category] || product.category, h1: frH1(product) }}");
t = t.replace("import { frTitle, frDescription,", "import { frH1, frTitle, frDescription,");
fs.writeFileSync(f, t);
// 3. l10n-product: frH1 + related with an inbound guarantee
f = 'lib/l10n-product.ts';
t = fs.readFileSync(f, 'utf8');
if (!t.includes('export function frH1')) {
  t = t.replace("// ---------- title and description", "const nz = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();\n/** H1: the product name; when the main keyword is not part of the name, the keyword leads: \"Cube nuroad race : Cube Nuroad Hybrid ...\". */\nexport function frH1(p: Product): string {\n  const e = frEntry(p);\n  if (e.primary.source !== 'bank') return p.name;\n  return nz(p.name).includes(nz(e.primary.keyword)) ? p.name : `${frDisplay(e.primary.keyword)} : ${p.name}`;\n}\n\n// ---------- title and description");
  // related lists with at least 3 inbound links per product
  t = t.replace("export function frRelated(p: Product): Product[] {", "function baseRelated(p: Product): Product[] {");
  t += `
// final related lists: every product is linked from at least 3 others (donors in the same category get extra links)
let RELATED: Record<string, Product[]> | null = null;
function related(): Record<string, Product[]> {
  if (RELATED) return RELATED;
  const R: Record<string, Product[]> = {};
  const inbound: Record<string, number> = {};
  for (const p of PRODUCTS) R[p.slug] = baseRelated(p);
  for (const p of PRODUCTS) for (const x of R[p.slug]) inbound[x.slug] = (inbound[x.slug] || 0) + 1;
  for (const p of PRODUCTS) {
    while ((inbound[p.slug] || 0) < 3) {
      const donor = (byCat[p.category] || []).find((d) => d.slug !== p.slug && R[d.slug].length < 7 && !R[d.slug].some((x) => x.slug === p.slug));
      if (!donor) break;
      R[donor.slug].push(p); inbound[p.slug] = (inbound[p.slug] || 0) + 1;
    }
  }
  RELATED = R;
  return R;
}
export function frRelated(p: Product): Product[] { return related()[p.slug] || []; }
`;
}
fs.writeFileSync(f, t);
console.log(t.includes('export function frH1'), t.includes('function related()'));
