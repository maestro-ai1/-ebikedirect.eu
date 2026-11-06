// node scripts/_acc-extract.cjs slug...  prints name/description/specs of entries from any lib/catalog-*.ts
const fs = require('fs');
const files = fs.readdirSync('lib').filter((f) => /^catalog-.*[.]ts$/.test(f));
const field = (b, k) => { const a = b.indexOf('"' + k + '": "'); if (a < 0) return ''; let i = a + k.length + 5, o = ''; while (i < b.length && !(b[i] === '"' && b[i - 1] !== String.fromCharCode(92))) { o += b[i]; i++; } return o; };
for (const s of process.argv.slice(2)) {
  for (const f of files) {
    const t = fs.readFileSync('lib/' + f, 'utf8'); const i = t.indexOf('"slug": "' + s + '"');
    if (i < 0) continue; const j = t.indexOf('"slug": "', i + 10); const b = t.slice(i, j > 0 ? j : i + 4000);
    const k = b.indexOf('"specs"'); const sp = k >= 0 ? b.slice(k, k + 700).replace(/\s+/g, ' ') : '';
    console.log('\n##', s, '|', field(b, 'name'), '|', field(b, 'description').slice(0, 600), '\n', sp); break;
  }
}
