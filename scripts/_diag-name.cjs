// Why do name-based products have no bank primary? counts refreshed T/C rows (vol>=10, KD<=28) mentioning brand + a model word.
const fs = require('fs');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' ');
const toks = (s) => norm(s).split(/[^a-z0-9.]+/).filter(Boolean);
const bank = [];
for (const l of fs.readFileSync(root + '/03-keywords/by-market/uk/uk_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); if (!REF.has(k)) continue; const kd = p[3] === '' ? null : +p[3]; const v = +p[2] || 0; if (kd === null || kd > 28 || v < 10) continue; if (!/Transactional|Commercial/.test(p[1])) continue; if (new RegExp(require('./_lang-plan-en.cjs').guard, 'i').test(k)) continue; bank.push({ k, t: toks(k), v, i: p[1] }); }
const D = require('../data/keywords/en-products.json').products;
const GEN = new Set('bike bikes e plus pro wh zoll inch gen mit und the hybrid sport one sl race ex fe lite sx st abs move advance electric ebike'.split(' '));
let none = 0, someUsed = 0, nameN = 0; const ex = [];
const mains = new Set(Object.values(D).map((e) => e.primary.keyword));
for (const [s, e] of Object.entries(D)) {
  if (e.primary.source !== 'name' || e.category === 'Zubehör') continue; nameN++;
  const bt = toks(e.brand); const mt = toks(e.name).filter((t) => !bt.includes(t) && !GEN.has(t) && t.length > 2 && !/^\d+$/.test(t));
  const rows = bank.filter((b) => bt.every((t) => b.t.includes(t)) && b.t.some((t) => mt.includes(t)));
  if (!rows.length) { none++; if (ex.length < 8) ex.push(e.name); } else { const free = rows.filter((r) => !mains.has(r.k)); if (!free.length) someUsed++; }
}
console.log('name-based bikes', nameN, '| no refreshed row with brand+model word', none, '| rows exist but all taken as main elsewhere', someUsed);
console.log('examples with no rows:', ex.join(' ; '));
