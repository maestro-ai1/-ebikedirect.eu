// Merges the approved drafts into the site data (2026-11-01). Always starts from the original files in .image-work/wire-backup,
// so the script can be run again.
//  - data/keywords/products.json: the bikes of de-product-keyword-map-v2.0-draft.json replace their v1.0 entry. Bikes not in the draft keep their
//    v1.0 entry, minus every keyword that the new map (or a brand page) now uses, so no keyword sits on two URLs.
//  - data/keywords/de.json: brand pages get the keywords of de-brand-hub-topup-v1.0-draft.csv appended to secondary / faq
const fs = require('fs');
const root = 'C:/electric bikes europe';
const kwDir = root + '/ebikedirect-site/data/keywords';
const bak = root + '/ebikedirect-site/.image-work/wire-backup';
fs.mkdirSync(bak, { recursive: true });
for (const f of ['products.json', 'de.json']) {
  if (!fs.existsSync(`${bak}/${f}.before-wire`)) fs.copyFileSync(`${kwDir}/${f}`, `${bak}/${f}.before-wire`);
}
const prod = JSON.parse(fs.readFileSync(`${bak}/products.json.before-wire`, 'utf8'));
const de = JSON.parse(fs.readFileSync(`${bak}/de.json.before-wire`, 'utf8'));
const draft = JSON.parse(fs.readFileSync(root + '/02-site-architecture/de-product-keyword-map-v2.0-draft.json', 'utf8')).products;
const ref = k => ({ keyword: k.k, volume: k.vol, kd: k.kd, intent: k.intent });

// brand pages first (their keywords are taken)
function pl(l) { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c == '"') { if (l[i + 1] == '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c == '"') q = true; else if (c == ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; }
const sl = b => b.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('&', 'und').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pages = Array.isArray(de.pages) ? de.pages : Object.values(de.pages);
let added = 0;
for (const l of fs.readFileSync(root + '/02-site-architecture/de-brand-hub-topup-v1.0-draft.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue;
  const [brand, role, keyword, vol, kd, intent] = pl(l);
  const pg = pages.find(p => p.url.replace(/\/?$/, '/') === '/marken/' + sl(brand) + '/');
  if (!pg) { console.log('no page for', brand); continue; }
  const arr = role === 'secondary' ? (pg.secondary = pg.secondary || []) : (pg.faq = pg.faq || []);
  if (arr.some(k => k.keyword === keyword)) continue;
  arr.push({ keyword, volume: +vol, kd: +kd, intent });
  added++;
}
fs.writeFileSync(kwDir + '/de.json', JSON.stringify(de, null, 1));
console.log('brand page keywords added:', added);

// products
const nk = (x) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const taken = new Set();
for (const p of pages) { if (p.primary) taken.add(nk(p.primary.keyword)); (p.secondary || []).forEach(k => taken.add(nk(k.keyword))); (p.faq || []).forEach(k => taken.add(nk(k.keyword))); }
for (const d of Object.values(draft)) for (const k of [d.primary, ...d.secondary, ...d.faq]) taken.add(nk(k.k));
let n = 0, stripped = 0, reverted = 0;
for (const [slug, e] of Object.entries(prod.products)) {
  const d = draft[slug];
  if (d) { prod.products[slug] = { name: d.name, brand: d.brand, category: d.category, primary: { ...ref(d.primary), source: 'bank' }, secondary: d.secondary.map(ref), faq: d.faq.map(ref) }; n++; continue; }
  // not in the new map: keep the old entry without keywords that are now used elsewhere
  const keep = arr => (arr || []).filter(k => { if (taken.has(nk(k.keyword))) { stripped++; return false; } taken.add(nk(k.keyword)); return true; });
  if (e.primary && e.primary.source === 'bank') {
    if (taken.has(nk(e.primary.keyword))) { e.primary = { keyword: (e.name + ' kaufen').toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }; reverted++; }
    else taken.add(nk(e.primary.keyword));
  }
  e.secondary = keep(e.secondary);
  e.faq = keep(e.faq);
}
prod.status = 'product-map-v2.0 wired 2026-11-01 (bikes with a model keyword; others keep the name-based primary)';
fs.writeFileSync(kwDir + '/products.json', JSON.stringify(prod, null, 1));
console.log('products rewritten from the new map:', n, '| old-entry keywords removed (now used elsewhere):', stripped, '| old primaries reverted to name:', reverted);
