// inventory of Semrush files in Downloads that are not in the bank yet (any date), grouped by seed
const fs = require('fs');
const DL = 'C:/Users/UsER/Downloads';
const rawDir = 'C:/electric bikes europe/03-keywords/raw-semrush/de';
const inBank = new Set(fs.readdirSync(rawDir).map((f) => f.toLowerCase()));
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c == '"') { if (l[i + 1] == '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c == '"') q = true; else if (c == ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const files = fs.readdirSync(DL).filter((f) => /_all-keywords_de_\d{4}-\d\d-\d\d( \(\d+\))?\.csv$/i.test(f));
const dates = {};
const bySeed = {};
const all = new Map();
for (const f of files) {
  const date = (f.match(/_de_(\d{4}-\d\d-\d\d)/) || [])[1];
  dates[date] = (dates[date] || 0) + 1;
  if (date === '2026-11-01') continue;
  const m = f.match(/^(.*)_all-keywords_de_(\d{4}-\d\d-\d\d)(?: \((\d+)\))?\.csv$/);
  const bankName = m[3] ? `${m[1]}-v${+m[3] + 1}_all-keywords_de_${m[2]}.csv`.toLowerCase() : f.toLowerCase();
  const t = fs.readFileSync(DL + '/' + f, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const h = pl(t[0]).map((x) => x.trim().toLowerCase());
  const ki = h.indexOf('keyword'), ii = h.indexOf('intent'), vi = h.indexOf('volume'), di = h.indexOf('keyword difficulty');
  const seed = m[1];
  const rows = t.slice(1).map(pl);
  const e = (bySeed[seed] ||= { files: 0, rows: 0, newToBank: 0, date: m[2] });
  e.files++; e.rows += rows.length;
  if (!inBank.has(bankName)) e.newToBank++;
  if (inBank.has(bankName)) continue;
  for (const p of rows) { const k = (p[ki] || '').toLowerCase().trim(); if (!k) continue; const r = { k, intent: p[ii] || '', vol: +p[vi] || 0, kd: p[di] === '' ? null : +p[di], seed }; if (!all.has(k) || r.vol > all.get(k).vol) all.set(k, r); }
}
console.log('files by date:', JSON.stringify(dates));
const seeds = Object.keys(bySeed);
const round1 = ['cube-stereo-hybrid-one44', 'cube-ams', 'cube-reaction', 'cube-supreme', 'cube-stereo-hybrid-one22', 'cube-kathmandu', 'cube-cargo', 'cube-trike', 'cube-stereo-hybrid-one77', 'ktm-macina-lycan', 'ktm-macina-city', 'ktm-macina-team', 'ktm-macina-chacana', 'ktm-macina-aera', 'ktm-macina-style', 'ktm-macina-prowler', 'ktm-macina-tour', 'specialized-turbo-vado', 'specialized-turbo-levo'];
const want = ['cannondale-tesoro', 'cannondale-mavaro', 'cannondale-moterra', 'orbea-wild', 'trek-powerfly', 'trek-rail', 'trek-charter', 'riese-und-müller-charger5', 'riese-und-müller-nevo5', 'riese-und-müller-swing5', 'kalkhoff-image', 'kalkhoff-entice', 'kalkhoff-endeavour', 'giant-explore', 'giant-newtour', 'giant-anytour', 'hercules-rob', 'hercules-futura', 'conway-cairon', 'conway-xyron', 'gazelle-miss', 'gazelle-grenoble', 'gazelle-arroyo', 'focus-thron2', 'focus-jam2', 'flyer-g1', 'urban-arrow-familynext', 'winora-yakun', 'raymon-durok', 'ktm-macina-kapoho', 'kettler-comfort', 'haibike-adventr', 'ghost-asx'];
const norm = (s) => s.toLowerCase().normalize('NFC');
const have = new Set(seeds.map(norm));
console.log('seeds with files (not Round 1 / brand exports):', seeds.filter((s) => !round1.includes(s)).length);
console.log('Round 2A seeds missing:', want.filter((w) => !have.has(norm(w))));
console.log('seeds found that are not in Round 2A:', seeds.filter((s) => !want.map(norm).includes(norm(s)) && !round1.includes(s)));
for (const s of seeds.filter((s) => !round1.includes(s))) console.log('  ', s.padEnd(30), 'files', bySeed[s].files, 'rows', bySeed[s].rows, 'new files', bySeed[s].newToBank);
const rows = [...all.values()];
const band = (v) => (v === 0 ? '0' : v < 10 ? '1-9' : v < 50 ? '10-49' : '50+');
const bands = {}; for (const r of rows) bands[band(r.vol)] = (bands[band(r.vol)] || 0) + 1;
const tcLow = rows.filter((r) => r.vol < 10 && /Transactional|Commercial/.test(r.intent)).length;
console.log('unique keywords in the not-yet-banked files:', rows.length, '| by volume band:', JSON.stringify(bands), '| T/C with volume below 10:', tcLow);
