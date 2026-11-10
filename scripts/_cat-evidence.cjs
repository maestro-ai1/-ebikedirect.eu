// counts evidence in the full catalogue for candidate filter pages (damen, herren, tiefeinsteiger, carbon, light, wheel size, sale)
const fs = require('fs');
const cat = {};
for (const f of fs.readdirSync('lib').filter((x) => /^catalog-.*\.ts$/.test(x))) {
  const src = fs.readFileSync('lib/' + f, 'utf8'); const i = src.indexOf('= [');
  if (i < 0) continue;
  try { const arr = JSON.parse(src.slice(i + 2, src.lastIndexOf('];') + 1)); for (const p of arr) cat[p.slug] = p; } catch (e) { console.log('skip', f); }
}
const kw = require('../data/keywords/products.json').products;
const B = Object.values(cat).filter((p) => p.category !== 'Zubehör' && kw[p.slug]);
console.log('bikes', B.length);
const sizes = (p) => JSON.stringify((p.options && p.options.frameSizes) || []);
const specKeys = {}; B.forEach((p) => Object.keys(p.specs || {}).forEach((k) => { specKeys[k] = (specKeys[k] || 0) + 1; }));
console.log(Object.entries(specKeys).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, n]) => k + ':' + n).join(' | '));
const t = (p) => (p.name + ' ' + sizes(p) + ' ' + JSON.stringify(p.specs || {})).toLowerCase();
const c = (f) => B.filter(f).length;
const LOW = /(low|wave|tiefeinsteiger|tiefeinstieg|easy entry|trapez|step|damen|lady)/, HIGH = /(diamant|diamond|herren|gent|classic|high)/;
console.log('low-step evidence', c((p) => LOW.test(t(p)) && !HIGH.test(t(p))), '| diamond evidence', c((p) => HIGH.test(t(p)) && !LOW.test(t(p))), '| both', c((p) => HIGH.test(t(p)) && LOW.test(t(p))));
console.log('carbon', c((p) => /carbon/.test(t(p))), '| weight<=22', c((p) => p.weightKg > 0 && p.weightKg <= 22), '| weight<=24', c((p) => p.weightKg > 0 && p.weightKg <= 24), '| weight>0', c((p) => p.weightKg > 0));
for (const z of ['20', '24', '26', '27,5', '28', '29']) console.log('zoll', z, c((p) => new RegExp('(^|[^0-9,])' + z + '[ -]?(zoll|"|inch)', 'i').test(t(p) + ' ' + (p.description || '').toLowerCase())));
console.log('sale', c((p) => p.originalPrice && p.originalPrice > p.price), '| instock flag', c((p) => p.inStock));
console.log('sample specs', JSON.stringify(B[5].specs).slice(0, 500), sizes(B[5]));
