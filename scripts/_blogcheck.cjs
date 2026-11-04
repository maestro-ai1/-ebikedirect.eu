const fs = require('fs'); const d = 'content/blog/de/';
const files = fs.readdirSync(d).filter((f) => f.endsWith('.md'));
const slugs = new Set(files.map((f) => fs.readFileSync(d + f, 'utf8').match(/^slug: (.+)$/m)[1]));
const prods = new Set(Object.keys(require('../data/keywords/products.json').products));
for (const f of files) { const t = fs.readFileSync(d + f, 'utf8').replace(/\r/g, ''); const m = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/); const meta = Object.fromEntries(m[1].split('\n').map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()])); const body = m[2];
  const words = body.replace(/[#|*_>\-\[\]()`]/g, ' ').split(/\s+/).filter(Boolean).length;
  const bad = [...body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)].map((x) => x[1]).filter((s) => !slugs.has(s));
  const badShop = [...body.matchAll(/\]\(\/shop\/([a-z0-9-]+)\)/g)].map((x) => x[1]).filter((s) => s && !prods.has(s));
  console.log(f.slice(0, 28), 'words', words, '| H2', (body.match(/^## /gm) || []).length, '| faq', (body.split(/## Häufige Fragen/)[1] || '').split('\n### ').length - 1, '| title', meta.seoTitle.length, '| desc', meta.description.length, '| ext', (body.match(/\]\(https?:/g) || []).length, '| deadblog', bad.join(',') || '-', '| badshop', badShop.join(',') || '-'); }
