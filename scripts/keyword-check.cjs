// Checks the German keyword mapping against the catalogue: every product and every brand hub has a primary keyword,
// and no keyword is used on two URLs (pages, hubs, categories and products together).
// node scripts/keyword-check.cjs   (needs .image-work/products-dump.json from scripts/dump-products.cjs)
const fs = require('fs');
const de = JSON.parse(fs.readFileSync('data/keywords/de.json', 'utf8'));
const pk = JSON.parse(fs.readFileSync('data/keywords/products.json', 'utf8')).products;
const products = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8'));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');

const owner = new Map(); // normalised keyword -> url
const dup = [];
function claim(kw, url, role) {
  const k = norm(kw);
  if (owner.has(k) && owner.get(k) !== url) dup.push(`${kw} (${role}) on ${url} and ${owner.get(k)}`);
  else owner.set(k, url);
}
for (const p of de.pages) {
  if (p.primary) claim(p.primary.keyword, p.url, 'primary');
  (p.secondary || []).forEach((s) => claim(s.keyword, p.url, 'secondary'));
  (p.faq || []).forEach((s) => claim(s.keyword, p.url, 'faq'));
}
// model-family pages: main, secondary and FAQ keywords
const famFile = 'data/keywords/families.json';
if (fs.existsSync(famFile)) {
  for (const f of JSON.parse(fs.readFileSync(famFile, 'utf8')).families) {
    claim(f.primary.keyword, f.path, 'family primary');
    f.secondary.forEach((s) => claim(s.keyword, f.path, 'family secondary'));
    f.faq.forEach((s) => claim(s.keyword, f.path, 'family faq'));
  }
}
let noPrimary = 0, bankPrimary = 0, nameOnly = 0, withSec = 0;
const missing = [];
for (const p of products.filter((x) => x.category !== 'Zubehör')) {
  const e = pk[p.slug];
  if (!e) { missing.push(p.slug); continue; }
  if (!e.primary || !e.primary.keyword) { noPrimary++; continue; }
  if (e.primary.source === 'bank') { bankPrimary++; claim(e.primary.keyword, '/shop/' + p.slug, 'product primary'); } else nameOnly++;
  if (e.secondary && e.secondary.length) withSec++;
  (e.secondary || []).forEach((s) => claim(s.keyword, '/shop/' + p.slug, 'product secondary'));
  (e.faq || []).forEach((s) => claim(s.keyword, '/shop/' + p.slug, 'product faq'));
}
const brands = [...new Set(products.filter((x) => x.category !== 'Zubehör').map((x) => x.brand))];
const slug = (b) => b.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const noHub = brands.filter((b) => !de.pages.some((p) => p.url.replace(/\/$/, '') === '/marken/' + slug(b)));
console.log('bikes in catalogue:', products.filter((x) => x.category !== 'Zubehör').length);
console.log('bikes without any mapping entry:', missing.length, missing.slice(0, 5).join(', '));
console.log('bikes with a bank primary keyword:', bankPrimary, '| name-based primary only:', nameOnly, '| with at least one secondary:', withSec);
console.log('brands in catalogue:', brands.length, '| brands without a keyword-map hub entry:', noHub.length, noHub.join(', '));
console.log('keywords used on two URLs:', dup.length);
dup.slice(0, 20).forEach((d) => console.log('  ' + d));
process.exit(dup.length || missing.length ? 1 : 0);
