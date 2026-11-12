// Writes the refreshed Semrush UK values (.image-work/en-refresh/chunk-*.csv, rows marked "Now") into the UK master bank and keeps a list of refreshed keywords.
// Rule (owner 2026-11-11): selected keywords are always refreshed; a keyword in uk_refreshed_keys.json carries live metrics, the rest of the bank is the monthly export.
// usage: node scripts/_uk-apply-refresh.cjs
const fs = require('fs');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const NAMES = { T: 'Transactional', C: 'Commercial', N: 'Navigational', I: 'Informational' };
const fresh = new Map();
for (const f of fs.readdirSync('.image-work/en-refresh').filter((x) => /^chunk-.+\.csv$/.test(x)).sort()) for (const l of fs.readFileSync('.image-work/en-refresh/' + f, 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); if (/Now/i.test(p[4])) fresh.set(p[0].toLowerCase(), { intent: p[1], vol: +p[2], kd: p[3] }); }
const bankF = 'C:/electric bikes europe/03-keywords/by-market/uk/uk_master_merged.csv';
const keysF = 'C:/electric bikes europe/03-keywords/by-market/uk/uk_refreshed_keys.json';
const lines = fs.readFileSync(bankF, 'utf8').split(/\r?\n/);
const seen = new Set(); let upd = 0;
for (let i = 1; i < lines.length; i++) {
  if (!lines[i]) continue; const p = pl(lines[i]); const k = p[0].toLowerCase(); const f = fresh.get(k); if (!f) continue;
  seen.add(k); p[1] = f.intent.split('').map((c) => NAMES[c]).filter(Boolean).join(', ') || p[1]; p[2] = String(f.vol); p[3] = f.kd; upd++;
  lines[i] = p.map((x) => (/[",]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x)).join(',');
}
let added = 0;
for (const [k, f] of fresh) if (!seen.has(k)) { lines.push([/[",]/.test(k) ? '"' + k + '"' : k, '"' + f.intent.split('').map((c) => NAMES[c]).join(', ') + '"', f.vol, f.kd, '', 'refresh-2026-11-11'].join(',')); added++; }
fs.writeFileSync(bankF, lines.join('\n'));
const old = fs.existsSync(keysF) ? JSON.parse(fs.readFileSync(keysF, 'utf8')) : [];
const all = new Set([...old, ...fresh.keys()]);
fs.writeFileSync(keysF, JSON.stringify([...all]));
console.log('refreshed keywords', fresh.size, '| bank rows updated', upd, '| added', added, '| total refreshed on file', all.size);
