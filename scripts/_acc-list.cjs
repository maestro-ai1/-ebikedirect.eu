// lists the accessory products (catalogue entries with no products.json keyword entry): slug | brand | category | name
const fs = require('fs');
const kw = require('../data/keywords/products.json').products;
const files = fs.readdirSync('lib').filter((f) => /^catalog-.*[.]ts$/.test(f));
const out = [];
for (const f of files) {
  const t = fs.readFileSync('lib/' + f, 'utf8');
  const re = /"slug": "([^"]+)"/g; let m;
  while ((m = re.exec(t))) {
    const s = m[1]; if (kw[s]) continue;
    const j = t.indexOf('"slug": "', m.index + 10); const b = t.slice(m.index, j > 0 ? j : m.index + 3000);
    const g = (k) => { const a = b.indexOf('"' + k + '": "'); if (a < 0) return ''; const st = a + k.length + 5; return b.slice(st, b.indexOf('"', st)); };
    out.push({ slug: s, brand: g('brand'), category: g('category'), name: g('name'), file: f });
  }
}
fs.writeFileSync('.image-work/acc-list.json', JSON.stringify(out, null, 1));
console.log(out.length);
out.forEach((o) => console.log(o.slug + ' | ' + o.brand + ' | ' + o.category + ' | ' + o.name));
