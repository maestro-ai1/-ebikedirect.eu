// Sets primary, 5 secondary and 5 FAQ keywords of the German page /zubehoer/gps-fahrradcomputer/ from REFRESHED German bank rows only (de_refreshed_keys.json).
// Golden Keyword Rule: primary Transactional with the highest volume (Commercial when the best Transactional is below half of it); secondaries Transactional or Commercial; FAQ may be any intent;
// KD 28 or below (30 at volume 1,000+); volume 10+; one keyword = one URL (nothing already used on another German page or product).
// usage: node scripts/_de-gps-page.cjs [--write]
const fs = require('fs');
const root = 'C:/electric bikes europe/03-keywords/by-market/de';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nk = (s) => norm(s).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const REF = new Set(JSON.parse(fs.readFileSync(root + '/de_refreshed_keys.json', 'utf8')));
const REL = /(fahrradcomputer|radcomputer|bike computer|e bike computer|ebike computer|gps fahrrad|fahrrad gps|fahrradnavi|fahrrad navi)/;
const EX = new RegExp('(bosch|kiox|nyon|intuvia|purion|test|vergleich|beste|bestenliste|anleitung|einstell|uhrzeit|zeit |cateye|sigma|hammerhead|karoo|bryton|coros|igpsport|xoss|magene|dashboard|app\\b|reset|update|akku|wechseln|display|brose|yamaha|shimano|bedienungs|pdf|gebraucht|ebay|amazon|decathlon|aldi|lidl|tchibo|kaufland)', 'i');
const de = JSON.parse(fs.readFileSync('data/keywords/de.json', 'utf8'));
const prods = JSON.parse(fs.readFileSync('data/keywords/products.json', 'utf8')).products;
const used = new Set();
for (const p of de.pages) { if (p.url === '/zubehoer/gps-fahrradcomputer/') continue; for (const k of [p.primary, ...(p.secondary || []), ...(p.faq || [])]) if (k) used.add(nk(k.keyword)); }
for (const e of Object.values(prods)) for (const k of [e.primary, ...(e.secondary || []), ...(e.faq || [])]) if (k && k.source !== 'name') used.add(nk(k.keyword));
const rows = [];
for (const l of fs.readFileSync(root + '/de_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); if (!REF.has(k)) continue; const n = norm(k);
  const v = +p[2] || 0; const kd = p[3] === '' ? null : +p[3]; const i = IT(p[1]);
  if (!REL.test(n) || EX.test(n) || used.has(nk(k)) || kd === null || kd > (v >= 1000 ? 30 : 28) || v < 10) continue;
  rows.push({ keyword: k, volume: v, kd, intent: i });
}
rows.sort((a, b) => b.volume - a.volume);
const T = rows.filter((r) => r.intent === 'T'), C = rows.filter((r) => r.intent === 'C');
const tc = rows.filter((r) => r.intent === 'T' || r.intent === 'C');
let primary = T[0] || C[0];
if (T[0] && C[0] && C[0].volume >= 2 * T[0].volume) primary = C[0];
const rest = tc.filter((r) => r !== primary);
const secondary = rest.slice(0, 5);
const faq = rows.filter((r) => r !== primary && !secondary.includes(r)).slice(0, 5);
console.log('primary', JSON.stringify(primary)); console.log('secondary', secondary.map((r) => r.keyword + ' ' + r.volume + r.intent).join(' | ')); console.log('faq', faq.map((r) => r.keyword + ' ' + r.volume + r.intent).join(' | '));
console.log('unplaced eligible', rows.filter((r) => r !== primary && !secondary.includes(r) && !faq.includes(r)).map((r) => r.keyword + ' ' + r.volume).join(' | '));
if (process.argv.includes('--write')) {
  const pg = de.pages.find((p) => p.url === '/zubehoer/gps-fahrradcomputer/');
  pg.primary = { ...primary, source: 'bank' }; pg.secondary = secondary; pg.faq = faq;
  fs.writeFileSync('data/keywords/de.json', JSON.stringify(de, null, 1)); console.log('written');
}
