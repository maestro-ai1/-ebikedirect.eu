const fs = require('fs');
const f = 'scripts/onpage-gate.mjs';
let t = fs.readFileSync(f, 'utf8');
if (!t.includes('l10nByPath')) {
  t = t.replace("const famByPath = new Map();", "// translated pages (data/keywords/<lang>-live.json): keyed by their full public path, e.g. /fr/velos-electriques/vtt-electrique\nconst l10nByPath = new Map();\nfor (const lang of ['fr', 'nl', 'it', 'es', 'pt']) { try { for (const p of require('../data/keywords/' + lang + '-live.json').pages) l10nByPath.set('/' + lang + p.url.replace(/\\/$/, ''), p); } catch { /* language not built yet */ } }\nconst famByPath = new Map();");
  t = t.replace("  const f = famByPath.get(path); if (f)", "  const l = l10nByPath.get(path); if (l) return { primary: l.primary, secondary: l.secondary || [], faq: l.faq || [], name: l.name };\n  const f = famByPath.get(path); if (f)");
  t = t.replace("  if (/^\\/shop\\/.+/.test(p)) return prods", "  if (l10nByPath.has(p)) return 'translated ' + l10nByPath.get(p).type;\n  if (/^\\/shop\\/.+/.test(p)) return prods");
  t = t.replace("const SALES = new Set(['product', 'category', 'brand', 'family', 'accessory category', 'home']);", "const SALES = new Set(['product', 'category', 'brand', 'family', 'accessory category', 'home', 'translated category', 'translated brand', 'translated accessory']);");
}
fs.writeFileSync(f, t);
console.log(t.includes("'translated ' +"), t.includes('l10nByPath.get(path)'), t.includes("'translated category'"));
