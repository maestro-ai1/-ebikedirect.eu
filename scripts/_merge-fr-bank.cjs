// merges new Semrush exports (raw-semrush/<lang>/*_<date>.csv) into by-market/<lang>/<lang>_master_merged.csv (keyword,intent,volume,kd,cpc_usd,source_seeds)
// usage: node scripts/_merge-bank.cjs fr 2026-11-10
const fs = require('fs');
const lang = process.argv[2], date = process.argv[3];
const root = 'C:/electric bikes europe/03-keywords';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const esc = (s) => (/[",\n]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : s);
const masterPath = `${root}/by-market/${lang}/${lang}_master_merged.csv`;
if (!fs.existsSync(masterPath + '.before-' + date)) fs.copyFileSync(masterPath, masterPath + '.before-' + date);
const lines = fs.readFileSync(masterPath, 'utf8').split(/\r?\n/);
const header = lines[0];
const master = new Map();
for (const l of lines.slice(1)) { if (!l) continue; const p = pl(l); master.set(p[0], { k: p[0], intent: p[1], vol: +p[2] || 0, kd: p[3], cpc: p[4], seeds: new Set((p[5] || '').split('|').filter(Boolean)) }); }
const before = master.size;
const dir = `${root}/raw-semrush/${lang}`;
let files = 0, added = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(`_${lang}_${date}.csv`) && !/^husqvarna/.test(x))) {
  files++;
  const seed = f.replace(/_all-keywords.*$/, '');
  for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split(/\r?\n/).slice(1)) {
    if (!l) continue; const p = pl(l); const k = (p[0] || '').toLowerCase().trim(); if (!k) continue;
    const e = master.get(k);
    if (e) { e.seeds.add(seed); if ((+p[2] || 0) > e.vol) e.vol = +p[2] || 0; if (!e.kd && p[3]) e.kd = p[3]; if (!e.intent && p[1]) e.intent = p[1]; }
    else { master.set(k, { k, intent: p[1], vol: +p[2] || 0, kd: p[3], cpc: p[4], seeds: new Set([seed]) }); added++; }
  }
}
const all = [...master.values()].sort((a, b) => b.vol - a.vol);
fs.writeFileSync(masterPath, [header, ...all.map((r) => [esc(r.k), esc(r.intent), r.vol, r.kd, r.cpc, esc([...r.seeds].join('|'))].join(','))].join('\n'));
console.log(lang, 'files', files, '| bank before', before, 'after', master.size, 'new', added);
