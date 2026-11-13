// Finds text that is identical on a translated page and on its German original (= left untranslated), without relying on a word list.
// usage: node scripts/_en-dup-de.cjs <lang> [base=http://localhost:3100] [step=1]   (step=N checks every Nth product page)
const lang = process.argv[2] || 'en';
const base = process.argv[3] || 'http://localhost:3100';
const step = +process.argv[4] || 1;
const live = require('../data/keywords/' + lang + '-live.json').pages;
const prods = Object.keys(require('../data/keywords/' + lang + '-products.json').products);
const names = new Set(); // product and brand names legitimately appear unchanged
for (const e of Object.values(require('../data/keywords/' + lang + '-products.json').products)) { names.add(e.brand.toLowerCase()); names.add(e.name.toLowerCase()); }
const pairs = [['/' + lang, ''], ['/' + lang + '/about', '/about'], ['/' + lang + '/faq', '/faq'], ['/' + lang + '/contact', '/contact']];
for (const p of live) pairs.push(['/' + lang + p.url.replace(/\/$/, ''), p.dePath ? p.dePath.replace(/\/$/, '') : null]);
prods.forEach((s, i) => { if (i % step === 0) pairs.push(['/' + lang + '/shop/' + s, '/shop/' + s]); });
const lines = async (u) => { const r = await fetch(base + u); if (r.status !== 200) return null; const h = await r.text(); const body = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head[\s\S]*?<\/head>/g, ' ').replace(/<[^>]+>/g, '\n'); return body.split('\n').map((x) => x.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()).filter((x) => x.length > 3); };
const seen = new Map(); let i = 0, n = 0;
const work = async () => { while (i < pairs.length) { const [t, d] = pairs[i++]; if (!d && d !== '') continue; try { const [a, b] = await Promise.all([lines(t), lines(d || '/')]); if (!a || !b) continue; n++; const bs = new Set(b); for (const x of a) { if (!bs.has(x)) continue; const k = x.toLowerCase(); if (names.has(k) || !/[a-zA-Zäöüß]{4,}/.test(x) || /^[\d\s.,€%+/:-]+$/.test(x)) continue; (seen.get(x) || seen.set(x, []).get(x)).push(t); } } catch (e) { /* skip */ } } };
Promise.all(Array.from({ length: 8 }, work)).then(() => {
  console.log('page pairs compared', n);
  const out = [...seen.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [k, v] of out.filter(([k]) => !/(Bosch|Shimano|Yamaha|Specialized|Mahle|Pinion|Giant|Panasonic|Avinox|Schwalbe|Mivice|Brose|Kiox|Fazua|Rohloff|Enviolo|SRAM|Magura|Suntour|RockShox|Fox|Maxxis|Continental|Trustpilot|ebike|Kollwitz|sales@|Berlin)/i.test(k)).slice(0, 120)) console.log(String(v.length).padStart(5), '"' + k.slice(0, 110) + '"', v[0]);
  console.log('distinct shared lines:', out.length);
});
