// Usage: node scripts/_specs.cjs slug1 slug2 ...  prints the stored spec rows of those products
const fs = require('fs');
const files = fs.readdirSync('data').filter((f) => /catalog|product/i.test(f));
console.log('data files:', files.join(', '));
const slugs = process.argv.slice(2);
let cat = null;
for (const f of files) {
  try { const j = JSON.parse(fs.readFileSync('data/' + f, 'utf8')); const arr = Array.isArray(j) ? j : j.products; if (Array.isArray(arr) && arr[0] && arr[0].slug) { cat = arr; console.log('using', f, arr.length); break; } } catch {}
}
if (cat) for (const s of slugs) { const p = cat.find((x) => x.slug === s); console.log('\n##', s, p ? Object.keys(p).join(',') : 'NOT FOUND'); if (p) console.log(JSON.stringify(p.specs || p.attributes || p, null, 0).slice(0, 1800)); }
