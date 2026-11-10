const fs = require('fs');
const cat = {};
for (const f of fs.readdirSync('lib').filter((x) => /^catalog-.*\.ts$/.test(x))) { const s = fs.readFileSync('lib/' + f, 'utf8'); const i = s.indexOf('= ['); if (i < 0) continue; try { for (const p of JSON.parse(s.slice(i + 2, s.lastIndexOf('];') + 1))) cat[p.slug] = p; } catch (e) {} }
const kw = require('../data/keywords/products.json').products;
const GER = /(\b(mit|und|für|hydraulische|nabenschaltung|kettenschaltung|gänge|gang|scheibenbremse|felgenbremse|federgabel|starrgabel|aluminium|rahmen|beleuchtung|gepäckträger|schutzblech|optional|inklusive|ohne|akku|reichweite|bis|oder|zoll)\b|[äöüß])/i;
const freq = {}; let tot = 0, ger = 0;
for (const p of Object.values(cat)) { if (p.category === 'Zubehör' || !kw[p.slug]) continue; for (const [k, v] of Object.entries(p.specs || {})) { tot++; if (!GER.test(v)) continue; ger++; for (const w of v.toLowerCase().split(/[^a-zäöüß]+/).filter((x) => x.length > 2)) freq[k + ':' + w] = (freq[k + ':' + w] || 0) + 1; } }
const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 90);
console.log(top.map(([w, n]) => w + ' ' + n).join(' | '));
// distinct full values for Rahmen/Schaltung/Bremsen with German markers, top 25 each
for (const key of ['Rahmen', 'Schaltung', 'Bremsen', 'Display', 'Drehmoment', 'Gabel']) { const c = {}; for (const p of Object.values(cat)) { if (p.category === 'Zubehör' || !kw[p.slug]) continue; const v = (p.specs || {})[key]; if (v && GER.test(v)) c[v] = (c[v] || 0) + 1; } console.log('\n' + key, Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([v, n]) => n + 'x ' + v).join(' || ')); }
