const fs = require('fs');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const used = new Map();
const add = (k, u) => { if (k) used.set(norm(k), u); };
const de = JSON.parse(fs.readFileSync('data/keywords/de.json', 'utf8'));
for (const p of de.pages) { if (p.primary) add(p.primary.keyword, p.url); (p.secondary || []).forEach((s) => add(s.keyword, p.url)); (p.faq || []).forEach((s) => add(s.keyword, p.url)); }
const fam = JSON.parse(fs.readFileSync('data/keywords/families.json', 'utf8')).families;
for (const f of fam) { add(f.primary.keyword, f.path); f.secondary.forEach((s) => add(s.keyword, f.path)); f.faq.forEach((s) => add(s.keyword, f.path)); }
const pk = JSON.parse(fs.readFileSync('data/keywords/products.json', 'utf8')).products;
for (const [slug, e] of Object.entries(pk)) { if (e.primary) add(e.primary.keyword, '/shop/' + slug); (e.secondary || []).forEach((s) => add(s.keyword, '/shop/' + slug)); (e.faq || []).forEach((s) => add(s.keyword, '/shop/' + slug)); }
const d = 'content/blog/de/';
for (const f of fs.readdirSync(d)) { const t = fs.readFileSync(d + f, 'utf8'); const m = t.match(/^primary: (.+)$/m); if (m) add(m[1], 'blog:' + f); }
const c = require('../.image-work/blog-clusters.json');
const want = ['elektro bike bosch motor', 'lastenrad hund', 'cube mountainbike mtb', 'e bike mtb', 'bosch charger e bike', 'e bike electric motor'];
const out = {};
for (const p of c.posts) if (want.includes(p.seed)) {
  out[p.seed] = p.kws.map((k) => ({ ...k, used: used.get(norm(k.k)) || '' }));
  const u = out[p.seed].filter((k) => k.used);
  console.log(p.seed, 'kws', p.kws.length, 'already used elsewhere:', u.length, u.map((k) => k.k + ' -> ' + k.used).join(' | '));
}
fs.writeFileSync('.image-work/blog1-clusters.json', JSON.stringify(out, null, 1));
