// Usage: node scripts/_cat-extract.cjs slug...   |   node scripts/_cat-extract.cjs --motors
const fs = require('fs');
const files = fs.readdirSync('lib').filter((f) => /^catalog-.*\.ts$/.test(f));
const blocks = [];
for (const f of files) {
  const t = fs.readFileSync('lib/' + f, 'utf8');
  const re = /"slug": "([^"]+)"/g; let m; const idx = [];
  while ((m = re.exec(t))) idx.push([m[1], m.index]);
  idx.forEach(([slug, i], k) => blocks.push({ slug, txt: t.slice(i, k + 1 < idx.length ? idx[k + 1][1] : i + 6000) }));
}
const g = (t, key) => { const m = t.match(new RegExp('"' + key + '": ("[^"]*"|[0-9.]+)')); return m ? m[1].replace(/"/g, '') : ''; };
if (process.argv[2] === '--motors') {
  const agg = {};
  for (const b of blocks) { const cat = g(b.txt, 'category'); if (cat === 'Zubehör') continue; const mo = g(b.txt, 'motor').replace(/^: /, ''); const tq = g(b.txt, 'torqueNm'); const k = mo + ' | ' + tq; (agg[k] = agg[k] || []).push(b.slug); }
  Object.entries(agg).sort((a, b) => b[1].length - a[1].length).slice(0, 45).forEach(([k, v]) => console.log(v.length, k, '| e.g.', v[0]));
} else for (const s of process.argv.slice(2)) {
  const b = blocks.find((x) => x.slug === s); if (!b) { console.log('NOT FOUND', s); continue; }
  const sp = b.txt.slice(b.txt.indexOf('"specs"'), b.txt.indexOf('"isFeatured"'));
  console.log('\n##', s, '| name', g(b.txt, 'name'), '| price', g(b.txt, 'price'), '| kg', g(b.txt, 'weightKg'), '| Nm', g(b.txt, 'torqueNm'), '| Wh', g(b.txt, 'batteryStandardWh'));
  console.log(sp.replace(/\s+/g, ' ').slice(0, 900));
}
