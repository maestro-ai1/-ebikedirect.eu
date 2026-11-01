// Moves the family-page keywords off the product pages (one keyword = one URL). Run after wire-keywords.cjs and map_families.js.
// A product that loses its main keyword gets its first remaining secondary keyword as the new main one, or the name-based keyword.
const fs = require('fs');
const root = 'C:/electric bikes europe/ebikedirect-site';
const nk = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const fam = JSON.parse(fs.readFileSync(root + '/data/keywords/families.json', 'utf8')).families;
const claimed = new Set();
for (const f of fam) for (const k of [f.primary, ...f.secondary, ...f.faq]) if (k) claimed.add(nk(k.keyword));
const file = root + '/data/keywords/products.json';
const prod = JSON.parse(fs.readFileSync(file, 'utf8'));
let removedSec = 0, promoted = 0, reverted = 0;
for (const e of Object.values(prod.products)) {
  const before = e.secondary.length + e.faq.length;
  e.secondary = e.secondary.filter((k) => !claimed.has(nk(k.keyword)));
  e.faq = e.faq.filter((k) => !claimed.has(nk(k.keyword)));
  removedSec += before - e.secondary.length - e.faq.length;
  if (e.primary.source === 'bank' && claimed.has(nk(e.primary.keyword))) {
    if (e.secondary.length) {
      const next = e.secondary.shift();
      e.primary = { keyword: next.keyword, volume: next.volume, kd: next.kd, intent: next.intent, source: 'bank' };
      promoted++;
    } else {
      e.primary = { keyword: (e.name + ' kaufen').toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' };
      reverted++;
    }
  }
}
fs.writeFileSync(file, JSON.stringify(prod, null, 1));
console.log('family keywords claimed:', claimed.size, '| removed from product secondary/FAQ:', removedSec, '| product main keyword replaced by its next secondary:', promoted, '| fell back to name-based:', reverted);
