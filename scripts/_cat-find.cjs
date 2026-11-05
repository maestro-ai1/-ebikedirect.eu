// Usage: node scripts/_cat-find.cjs "<regex on motor>" [max]
const fs = require('fs');
const files = fs.readdirSync('lib').filter((f) => /^catalog-.*\.ts$/.test(f));
const re = new RegExp(process.argv[2], 'i'); const max = +process.argv[3] || 8;
const g = (t, key) => { const m = t.match(new RegExp('"' + key + '": ("[^"]*"|[0-9.]+)')); return m ? m[1].replace(/"/g, '') : ''; };
let n = 0;
for (const f of files) {
  const t = fs.readFileSync('lib/' + f, 'utf8'); const rr = /"slug": "([^"]+)"/g; let m; const idx = [];
  while ((m = rr.exec(t))) idx.push([m[1], m.index]);
  idx.forEach(([slug, i], k) => { const b = t.slice(i, k + 1 < idx.length ? idx[k + 1][1] : i + 6000); if (re.test(g(b, 'motor')) && n < max) { n++; console.log(slug, '|', g(b, 'name'), '|', g(b, 'category'), '|', g(b, 'motor'), '|', g(b, 'torqueNm') + ' Nm', '|', g(b, 'weightKg') + ' kg', '|', g(b, 'price') + ' EUR'); } });
}
console.log('matches shown', n);
