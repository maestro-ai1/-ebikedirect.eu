const fs = require('fs');
const f = 'scripts/onpage-gate.mjs';
let t = fs.readFileSync(f, 'utf8');
if (!t.includes('frProds')) {
  t = t.replace("const famByPath = new Map();", "let frProds = {}; try { frProds = require('../data/keywords/fr-products.json').products; } catch { /* batch 3 not built */ }\nconst frSlugOf = (p) => { const m = p.match(/^\\/fr\\/shop\\/(.+)$/); return m ? m[1] : null; };\nconst famByPath = new Map();");
  t = t.replace("const keywordOf = (path, type) => {\n", "const keywordOf = (path, type) => {\n  const fs0 = frSlugOf(path); if (fs0 && prods[fs0]) { const e = frProds[fs0] || { primary: { keyword: 'acheter ' + prods[fs0].name.toLowerCase(), source: 'name', volume: 0, intent: 'T' }, secondary: [], faq: [] }; return { primary: e.primary, secondary: e.secondary || [], faq: e.faq || [], name: prods[fs0].name }; }\n");
  t = t.replace("  if (l10nByPath.has(p)) return 'translated ' + l10nByPath.get(p).type;\n", "  if (l10nByPath.has(p)) return 'translated ' + l10nByPath.get(p).type;\n  { const s = frSlugOf(p); if (s) return prods[s] ? 'product' : 'other'; }\n");
  t = t.replace("kw.primary.source === 'bank' && (bank.size ? bank.has(pn) || kw.primary.volume === 0 : true)", "kw.primary.source === 'bank' && (pg.url.startsWith('/fr/') || (bank.size ? bank.has(pn) || kw.primary.volume === 0 : true))");
}
fs.writeFileSync(f, t);
console.log(t.includes('frProds'), t.includes("return prods[s] ? 'product'"), t.includes("pg.url.startsWith('/fr/')"));
