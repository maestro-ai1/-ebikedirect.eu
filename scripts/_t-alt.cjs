// For pages whose primary is not Transactional: best Transactional alternatives in the refreshed UK bank (KD<=28), not used by another page.
const fs = require('fs');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const bank = [];
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
for (const l of fs.readFileSync(root + '/03-keywords/by-market/uk/uk_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; bank.push({ k: p[0].toLowerCase(), i: IT(p[1]), v: +p[2] || 0, kd, ref: REF.has(p[0].toLowerCase()) }); }
const live = require('../data/keywords/en-live.json').pages;
const used = new Map(); for (const p of live) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.set(nk(k.keyword), p.path || p.slug || p.url);
const re = new RegExp(process.argv[2], 'i'), ex = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
const c = bank.filter((b) => re.test(b.k) && !(ex && ex.test(b.k)) && b.i === 'T' && b.kd !== null && b.kd <= 30).sort((a, b) => b.v - a.v).slice(0, 14);
for (const b of c) console.log(String(b.v).padStart(6), 'KD' + b.kd, b.ref ? 'REF' : 'old', b.k, used.has(nk(b.k)) ? '[USED ' + used.get(nk(b.k)) + ']' : '');
