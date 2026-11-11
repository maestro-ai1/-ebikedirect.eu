const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-report.cjs', 'utf8');
if (!t.includes('const built =')) {
  t = t.replace("const pass = res.filter((r) => r.ok).length;", "const pass = res.filter((r) => r.ok).length;\nconst built = res.length > 0;");
  t = t.replace("`<div class=\"c\"><b>${live.length}</b><span>${NAME} pages live (categories, brands, accessories; products below)</span></div><div class=\"c\"><b>${pass} / ${res.length}</b><span>live gate checks pass on these pages</span></div>", "`<div class=\"c\"><b>${live.length}</b><span>${NAME} pages ${built ? 'live' : 'mapped (not built yet)'} (categories, brands, accessories, hub)</span></div><div class=\"c\"><b>${built ? pass + ' / ' + res.length : 'not built'}</b><span>${built ? 'live gate checks pass on these pages' : 'live gate check runs after the pages are built'}</span></div>");
  t = t.replace("<h2>1. Live ${NAME} pages: main, secondary and FAQ keywords</h2>", "<h2>1. ${built ? 'Live' : 'Mapped'} ${NAME} pages: main, secondary and FAQ keywords</h2>");
  t = t.replace(/onpage-seo-\$\{lang\}-batch3-2026-11-10\.html/, "onpage-seo-${lang}-batch3-2026-11-11.html");
}
fs.writeFileSync('scripts/_lang-report.cjs', t);
console.log(t.includes('built ?'));
