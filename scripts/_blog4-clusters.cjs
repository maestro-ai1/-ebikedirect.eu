const fs = require('fs');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const used = new Map(); const add = (k, u) => { if (k) used.set(norm(k), u); };
const de = JSON.parse(fs.readFileSync('data/keywords/de.json', 'utf8'));
for (const p of de.pages) { if (p.primary) add(p.primary.keyword, p.url); (p.secondary || []).forEach((s) => add(s.keyword, p.url)); (p.faq || []).forEach((s) => add(s.keyword, p.url)); }
for (const f of JSON.parse(fs.readFileSync('data/keywords/families.json', 'utf8')).families) { add(f.primary.keyword, f.path); f.secondary.forEach((s) => add(s.keyword, f.path)); f.faq.forEach((s) => add(s.keyword, f.path)); }
const pk = JSON.parse(fs.readFileSync('data/keywords/products.json', 'utf8')).products;
for (const [slug, e] of Object.entries(pk)) { if (e.primary) add(e.primary.keyword, '/shop/' + slug); (e.secondary || []).forEach((s) => add(s.keyword, '/shop/' + slug)); (e.faq || []).forEach((s) => add(s.keyword, '/shop/' + slug)); }
// existing posts: primary + every heading (H1/H2/H3) normalised, to catch secondary and FAQ keywords already used
const d = 'content/blog/de/'; const heads = [];
for (const f of fs.readdirSync(d)) { const t = fs.readFileSync(d + f, 'utf8'); const m = t.match(/^primary: (.+)$/m); if (m) add(m[1], 'blog:' + f); for (const h of t.matchAll(/^#{2,3} (.+)$/gm)) heads.push(h[1].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ')); }
const hay = ' ' + heads.join(' | ') + ' ';
const c = require('../.image-work/blog-clusters.json');
const want = ['fahrradschloss zahlenschloss','klickpedale rennrad','fahrradkörbe für klickfix','fahrrad korb','fahrradständer hinterrad','fahrrad nachrüsten mit motor','reifen fahrrad spikes','schaltung fahrrad','bremsen fahrrad','schutzblech rennrad'];
const out = {};
for (const p of c.posts) if (want.includes(p.seed)) {
  out[p.seed] = p.kws.map((k) => { const nk = k.k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); return { ...k, used: used.get(norm(k.k)) || '', inHead: hay.includes(' ' + nk + ' ') || hay.includes(' ' + nk + 's ') }; });
  const u = out[p.seed].filter((k) => k.used || k.inHead);
  console.log('\n##', p.seed, p.kws.length, p.url, '| excluded', u.length, u.map((k) => k.k).join(', '));
  console.log(out[p.seed].filter((k) => !k.used && !k.inHead).slice(0, 24).map((k) => k.k + ' ' + k.vol + '/' + k.kd).join(' | '));
}
fs.writeFileSync('.image-work/blog4-clusters.json', JSON.stringify(out, null, 1));
