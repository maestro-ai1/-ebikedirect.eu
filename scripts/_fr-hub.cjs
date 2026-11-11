// French brands hub page (/marques): keywords from the French bank (brand-overview terms only).
const fs = require('fs');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const live = JSON.parse(fs.readFileSync('data/keywords/fr-live.json', 'utf8'));
live.pages = live.pages.filter((p) => p.type !== 'hub');
const used = new Set(); for (const p of live.pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
const rows = [];
for (const l of fs.readFileSync(`${root}/03-keywords/by-market/fr/fr_master_merged.csv`, 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0; const k = p[0].toLowerCase();
  if (kd === null || kd > 28 || vol < 50) continue;
  if (!/^(meilleures? )?marques? (de )?v[ée]los? [ée]lectriques?$/.test(k) && !/^marque v[ée]lo [ée]lectrique$/.test(k) && !/^marques? (de )?v[ée]los? [ée]lectrique$/.test(k)) continue;
  if (used.has(nk(k))) continue;
  used.add(nk(k));
  rows.push({ keyword: k, intent: IT(p[1]), volume: vol, kd });
}
rows.sort((a, b) => b.volume - a.volume);
const primary = rows.find((r) => r.intent === 'C' || r.intent === 'T') || rows[0];
const rest = rows.filter((r) => r !== primary);
const secondary = rest.filter((r) => r.intent === 'C' || r.intent === 'T').slice(0, 5);
const faq = rest.filter((r) => !secondary.includes(r)).slice(0, 5);
live.pages.push({ display: 'Marque vélo électrique', url: '/marques/', dePath: '/marken', name: 'Marques', type: 'hub', source: 'bank', primary: { ...primary, source: 'bank' }, secondary, faq });
fs.writeFileSync('data/keywords/fr-live.json', JSON.stringify(live, null, 1));
console.log('hub primary', primary.keyword, primary.volume, primary.intent, '| S', secondary.map((s) => s.keyword).join('; '), '| F', faq.map((s) => s.keyword).join('; '));
