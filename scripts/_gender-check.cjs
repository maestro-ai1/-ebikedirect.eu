// keywords with damen/herren/unisex words on bikes: list them with the bike name and its frame-form evidence (name words, frame sizes in the catalogue)
const fs = require('fs');
const prods = require('../data/keywords/products.json').products;
const cat = {};
for (const f of fs.readdirSync('lib').filter((x) => /^catalog-.*\.ts$/.test(x))) {
  const src = fs.readFileSync('lib/' + f, 'utf8');
  const i = src.indexOf('= [');
  if (i < 0) continue;
  try { const arr = JSON.parse(src.slice(i + 2, src.lastIndexOf('];') + 1)); for (const p of arr) cat[p.slug] = p; } catch { /* generated catalogs only */ }
}
const LOW = /\b(low|lowstep|step|stepthru|stepthrough|through|wave|trapez|tiefeinsteiger|tiefeinstieg|easy entry|fe|lst|sta|damen|miss|lady|us)\b/i;
const HIGH = /\b(diamant|diamond|herren|dd|high|gent|classic|mid)\b/i;
const rows = [];
for (const [s, e] of Object.entries(prods)) {
  const p = cat[s];
  const sizes = p ? JSON.stringify(p.options && p.options.frameSizes || []) : '';
  for (const [kind, k] of [['PRIMARY', e.primary], ...(e.secondary || []).map((k) => ['sec', k]), ...(e.faq || []).map((k) => ['faq', k])]) {
    if (!k) continue;
    const w = k.keyword.toLowerCase();
    const dam = /\b(damen|damenrad|damenfahrrad|tiefeinsteiger|lady|frauen)\b/.test(w), her = /\b(herren|herrenrad|herrenfahrrad|diamant|männer|maenner)\b/.test(w);
    if (!dam && !her) continue;
    const nm = e.name + ' ' + sizes;
    const low = LOW.test(e.name) || /easy entry|tiefeinsteiger|low/i.test(sizes), high = HIGH.test(e.name) || /classic/i.test(sizes);
    let verdict = 'unknown';
    if (dam && low && !high) verdict = 'ok'; else if (her && high && !low) verdict = 'ok';
    else if (dam && high && !low) verdict = 'CONFLICT (damen keyword, diamond bike)'; else if (her && low && !high) verdict = 'CONFLICT (herren keyword, low-step bike)';
    rows.push([verdict, e.brand, kind, e.name, k.keyword, k.volume]);
  }
}
const by = {}; for (const r of rows) by[r[0]] = (by[r[0]] || 0) + 1;
console.log('damen/herren keywords on bikes:', rows.length, JSON.stringify(by));
for (const r of rows.filter((r) => r[0].startsWith('CONFLICT')).slice(0, 25)) console.log(r.join(' | '));
console.log('--- unknown (no frame-form evidence), first 25:');
for (const r of rows.filter((r) => r[0] === 'unknown').slice(0, 25)) console.log(r.join(' | '));
