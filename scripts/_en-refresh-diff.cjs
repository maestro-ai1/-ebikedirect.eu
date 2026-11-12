// Compares the refreshed Semrush UK values (.image-work/en-refresh/chunk-*.csv) with the stored English keyword data.
const fs = require('fs');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const fresh = new Map();
for (const f of fs.readdirSync('.image-work/en-refresh').filter((x) => /^chunk-\d+\.csv$/.test(x))) for (const l of fs.readFileSync('.image-work/en-refresh/' + f, 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); if (/Now/i.test(p[4])) fresh.set(p[0].toLowerCase(), { vol: +p[2], kd: p[3] === '' ? null : +p[3], intent: p[1] }); }
const IT = (s) => (s.includes('T') ? 'T' : s.includes('C') ? 'C' : s.includes('N') ? 'N' : s.includes('I') ? 'I' : '-');
let n = 0, volCh = 0, kdCh = 0, intCh = 0, kdBad = 0; const bad = [], intLost = [];
const seen = new Map();
const scan = (where, k, role) => { if (!k || !k.keyword) return; const f = fresh.get(k.keyword.toLowerCase()); if (!f) return; n++; if (f.vol !== k.volume) volCh++; if (f.kd !== k.kd) kdCh++; const ni = IT(f.intent); if (ni !== k.intent) intCh++; if (f.kd != null && f.kd > 28) { kdBad++; bad.push(where + ' ' + role + ' "' + k.keyword + '" KD ' + k.kd + '->' + f.kd + ' vol ' + k.volume + '->' + f.vol); } if ((role === 'primary' || role === 'secondary') && ni !== 'T' && ni !== 'C' && (k.intent === 'T' || k.intent === 'C')) intLost.push(where + ' ' + role + ' "' + k.keyword + '" ' + k.intent + '->' + ni + ' (' + f.intent + ')'); };
for (const p of require('../data/keywords/en-live.json').pages) { scan(p.url, p.primary, 'primary'); p.secondary.forEach((k) => scan(p.url, k, 'secondary')); p.faq.forEach((k) => scan(p.url, k, 'faq')); }
for (const [s, e] of Object.entries(require('../data/keywords/en-products.json').products)) { scan(s, e.primary, 'primary'); e.secondary.forEach((k) => scan(s, k, 'secondary')); e.faq.forEach((k) => scan(s, k, 'faq')); }
console.log('refreshed keywords found in data:', fresh.size, '| uses:', n, '| volume changed:', volCh, '| KD changed:', kdCh, '| intent class changed:', intCh);
console.log('now KD above 28:', kdBad); bad.slice(0, 60).forEach((x) => console.log('  ', x));
console.log('T/C lost (primary/secondary):', intLost.length); intLost.slice(0, 40).forEach((x) => console.log('  ', x));
fs.writeFileSync('.image-work/en-refresh/fresh.json', JSON.stringify([...fresh]));
