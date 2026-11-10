// probe: model-level French keywords per bike (brand + distinctive model tokens) and the language of the spec values
const fs = require('fs');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const bank = [];
for (const l of fs.readFileSync(root + '/03-keywords/by-market/fr/fr_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0; if (kd === null || kd > 28 || vol < 20) continue; bank.push({ k: norm(p[0]), raw: p[0], vol, kd, intent: p[1] }); }
const cat = {};
for (const f of fs.readdirSync('lib').filter((x) => /^catalog-.*\.ts$/.test(x))) { const s = fs.readFileSync('lib/' + f, 'utf8'); const i = s.indexOf('= ['); if (i < 0) continue; try { for (const p of JSON.parse(s.slice(i + 2, s.lastIndexOf('];') + 1))) cat[p.slug] = p; } catch (e) { /* skip */ } }
const kw = require('../data/keywords/products.json').products;
const bikes = Object.values(cat).filter((p) => p.category !== 'Zubehör' && kw[p.slug]);
const GEN = new Set(['bike', 'e', 'plus', 'pro', 'wh', 'zoll', 'gen', 'mit', 'und', 'the', 'hybrid', 'sport', 'one', 'cx', 'sl', 'race', 'exc', 'slx', 'slt', 'ex', 'fe', 'lite', 'sx', 'st']);
let hit = 0; const byBrand = {};
for (const p of bikes) {
  const toks = norm(p.name).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter(Boolean);
  const brand = norm(p.brand).split(/[^a-z0-9]+/)[0];
  const model = toks.filter((t) => t !== brand && t.length > 2 && !/^\d+$/.test(t) && !GEN.has(t)).slice(0, 3);
  const found = model.length ? bank.filter((b) => b.k.includes(brand) && model.some((m) => b.k.split(/[^a-z0-9]+/).includes(m))) : [];
  if (found.length) { hit++; byBrand[p.brand] = (byBrand[p.brand] || 0) + 1; }
}
console.log('bikes', bikes.length, 'with >=1 French model keyword', hit, JSON.stringify(byBrand));
// language of spec values
const GER = /(\b(mit|und|für|hydraulische|nabenschaltung|kettenschaltung|gänge|gang|scheibenbremse|felgenbremse|federgabel|starrgabel|aluminium|rahmen|beleuchtung|gepäckträger|schutzblech|optional|inklusive|ohne|akku|reichweite)\b|[äöüß])/i;
let ger = 0, tot = 0; const keys = {};
for (const p of bikes) for (const [k, v] of Object.entries(p.specs || {})) { tot++; if (GER.test(v)) { ger++; keys[k] = (keys[k] || 0) + 1; } }
console.log('spec values', tot, 'German-looking', ger, JSON.stringify(keys));
console.log(Object.entries(cat['gazelle-paris-c7'].specs).map(([k, v]) => k + ': ' + v).join(' | '));
console.log(Object.entries(bikes[40].specs).map(([k, v]) => k + ': ' + v).join(' | '));
