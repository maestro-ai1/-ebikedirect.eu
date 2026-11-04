const fs = require('fs');
const dir = 'C:/electric bikes europe/03-keywords/by-market/de/';
const rows = [];
for (const d of ['2026-11-03', '2026-11-04']) {
  const f = dir + `de_new_model_keywords_${d}.csv`;
  if (!fs.existsSync(f)) continue;
  for (const l of fs.readFileSync(f, 'utf8').split(/\r?\n/).slice(1)) { const m = l.match(/^(.*?),(\d+),(\d*),([^,]*),(.*)$/); if (m) rows.push({ k: m[1].replace(/"/g, ''), vol: +m[2], kd: m[3] === '' ? null : +m[3], intent: m[4], seed: m[5] }); }
}
// the 11-03 file also holds Round 1 rows (written earlier) when re-run; keep only seeds of Round 2A
const r1 = /^(cube|ktm-macina-(lycan|city|team|chacana|aera|style|prowler|tour)|specialized-turbo-(vado|levo))/;
const r2 = rows.filter((r) => !r1.test(r.seed));
const band = (v) => (v === 0 ? '0' : v < 10 ? '1-9' : v < 50 ? '10-49' : '50+');
const t = {};
for (const r of r2) { const b = band(r.vol); const o = (t[b] ||= { n: 0, T: 0, C: 0, N: 0, I: 0, kd28: 0 }); o.n++; o[r.intent] = (o[r.intent] || 0) + 1; if (r.kd != null && r.kd <= 28) o.kd28++; }
console.log('Round 2A keywords new to the bank:', r2.length);
for (const [b, o] of Object.entries(t)) console.log('volume', b.padEnd(6), 'n', String(o.n).padStart(5), '| T', o.T, 'C', o.C, 'N', o.N, 'I', o.I, '| KD<=28:', o.kd28);
const ex = r2.filter((r) => r.vol === 0 && /^(T|C)/.test(r.intent) && r.kd != null && r.kd <= 28).slice(0, 14);
console.log('sample zero-volume T/C:'); for (const r of ex) console.log('  ', r.intent, r.kd, r.k);
