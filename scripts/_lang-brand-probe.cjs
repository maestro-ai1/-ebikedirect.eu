// probe: how many clean brand + category keywords the language bank holds per stocked brand (KD <= 28, volume >= floor)
const fs = require('fs');
const lang = process.argv[2] || 'fr';
const root = 'C:/electric bikes europe';
const plan = require('./_lang-plan.cjs')[lang];
const brands = [...new Set(Object.values(require('../data/keywords/products.json').products).filter((p) => p.category !== 'Zubehör').map((p) => p.brand))];
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const bank = [];
for (const l of fs.readFileSync(root + '/03-keywords/by-market/' + (plan.bankDir || lang) + '/' + (plan.bankDir || lang) + '_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0; if (kd === null || kd > 28 || vol < plan.floor) continue; bank.push({ k: p[0].toLowerCase(), intent: p[1], vol, kd }); }
const VOC = new RegExp('^(' + plan.vocab + ')$', 'i');
const GUARD = new RegExp(plan.guard, 'i');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
for (const b of brands.sort()) {
  const bt = norm(b).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter(Boolean).map((x) => (x === 'und' ? 'et' : x));
  const hits = bank.filter((r) => { const k = norm(r.k); if (GUARD.test(r.k)) return false; const toks = k.split(/[^a-z0-9]+/).filter(Boolean); return bt.every((t) => toks.includes(t) || toks.includes(t === 'et' ? 'und' : t)) && toks.every((t) => bt.includes(t) || VOC.test(t)); });
  console.log(b.padEnd(18), 'clean', String(hits.length).padStart(3), hits.slice(0, 4).map((h) => h.k + ' ' + h.vol + '/' + (/Transactional/.test(h.intent) ? 'T' : /Commercial/.test(h.intent) ? 'C' : /Navigational/.test(h.intent) ? 'N' : 'I')).join(' ; '));
}
