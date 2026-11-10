const fs = require('fs');
let t = fs.readFileSync('app/sitemap.ts', 'utf8');
if (!t.includes("'/fr/shop/")) {
  t = t.replace("  const base = routes.flatMap(", "  const frProducts = PRODUCTS.map((p) => ({ url: `${baseUrl}/fr/shop/${p.slug}`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8, alternates: { languages: Object.fromEntries((l10nAlternates(`/shop/${p.slug}`, 'fr', baseUrl) || []).map((a) => [a.hreflang, a.url])) } }));\n  const base = routes.flatMap(");
  t = t.replace("return [...base, ...translated];", "return [...base, ...translated, ...frProducts];");
}
fs.writeFileSync('app/sitemap.ts', t);
console.log(t.includes('frProducts'));
