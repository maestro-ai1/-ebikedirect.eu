// Refines the keyword set of the pages of ONE language that are being built in a batch: guard words and not-sold brands out,
// top-up from the language bank (KD <= 28, relevant by the category regex of the map engine config), one keyword = one URL inside the language.
// usage: node scripts/_lang-pages.cjs fr batch1     -> data/keywords/<lang>-live.json (pages with 1 primary + up to 5 secondary + up to 5 FAQ)
const fs = require('fs');
const lang = process.argv[2], batch = process.argv[3];
const root = 'C:/electric bikes europe';
const cfg = require(root + '/02-site-architecture/cfg_' + lang + '.js');
const plan = require('./_lang-plan.cjs')[lang];
const BATCH = plan.batches[batch];
const map = require('../data/keywords/' + lang + '.json').pages;
const nk = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const GUARD = new RegExp(plan.guard, 'i');
const REF = process.env.REFRESHED_ONLY ? new Set(JSON.parse(fs.readFileSync('C:/electric bikes europe/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8'))) : null;
const bank = [];
const idx = new Map(); // every bank row by keyword (all KD): stored map keywords are re-read from the bank so refreshed Semrush values always win

for (const l of fs.readFileSync(root + '/03-keywords/by-market/' + (plan.bankDir || lang) + '/' + (plan.bankDir || lang) + '_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0;
  idx.set(p[0].toLowerCase(), { keyword: p[0].toLowerCase(), intent: IT(p[1]), volume: vol, kd });
  if (kd === null || kd > 28 || vol < (plan.floor || 50)) continue;
  if (REF && !REF.has(p[0].toLowerCase())) continue;
  bank.push({ keyword: p[0].toLowerCase(), intent: IT(p[1]), volume: vol, kd });
}
bank.sort((a, b) => b.volume - a.volume);
const ownPage = (b) => map.find((m) => m.url.replace(/\/$/, '') === b.replace(/\/$/, ''));
const targetUrls = new Set(BATCH.map((t) => t.mapUrl));
const used = new Set();
for (const p of map) { if (targetUrls.has(p.url)) continue; for (const k of [p.primary, ...(p.secondary || []), ...(p.faq || [])]) if (k) used.add(nk(k.keyword)); }
// also reserve the keywords of pages in this batch that were already decided earlier in the batch
const out = [];
const bad = (k) => GUARD.test(k) || (cfg.RETAIL && cfg.RETAIL.test(k)) || (cfg.JUNK && cfg.JUNK.test(k)) || (plan.notSold && new RegExp(plan.notSold, 'i').test(k)) || (plan.brands && new RegExp(plan.brands, 'i').test(k));
for (const t of BATCH) {
  const own = ownPage(t.mapUrl) || { primary: null, secondary: [], faq: [] };
  const claim = (k) => { used.add(nk(k.keyword)); return k; };
  const fresh = (k) => { const b = idx.get(k.keyword.toLowerCase()); return b ? { ...k, intent: b.intent, volume: b.volume, kd: b.kd } : k; };
  const keep = (arr) => (arr || []).map(fresh).filter((k) => (!REF || REF.has(k.keyword.toLowerCase())) && !bad(k.keyword) && !used.has(nk(k.keyword)) && k.kd != null && (k.kd <= 28 || (k.kd <= 30 && k.volume >= 1000)));
  const ownP = own.primary ? fresh(own.primary) : null;
  let primary = ownP && (!REF || REF.has(ownP.keyword.toLowerCase())) && ownP.kd != null && ownP.kd <= 28 && !bad(ownP.keyword) && !used.has(nk(ownP.keyword)) && (ownP.intent === 'T' || ownP.intent === 'C') ? ownP : null;
  const rel0 = new RegExp(t.rel, 'i'); const ELEC = new RegExp(plan.elec, 'i'); const rel = { test: (k) => rel0.test(k) && (t.needElectric === false || ELEC.test(k)) }; const exclude = t.exclude ? new RegExp(t.exclude, 'i') : null;
  const pool = bank.filter((b) => rel.test(b.keyword) && !(exclude && exclude.test(b.keyword)) && !bad(b.keyword) && !used.has(nk(b.keyword)));
  if (!primary) { const pe = pool.filter((b) => ELEC.test(b.keyword)); const c = pe.find((b) => b.intent === 'T') || pe.find((b) => b.intent === 'C') || pool.find((b) => b.intent === 'T') || pool.find((b) => b.intent === 'C') || pool[0]; if (c) primary = c; }
  if (primary) claim(primary);
  let secondary = keep(own.secondary).filter((k) => (k.intent === 'T' || k.intent === 'C') && rel.test(k.keyword) && !(exclude && exclude.test(k.keyword)));
  secondary.forEach(claim);
  for (const b of pool) { if (secondary.length >= 5) break; if ((b.intent === 'T' || b.intent === 'C') && !used.has(nk(b.keyword))) secondary.push(claim(b)); }
  let faq = keep(own.faq).filter((k) => rel.test(k.keyword) && !(exclude && exclude.test(k.keyword)));
  faq.forEach(claim);
  for (const b of pool) { if (faq.length >= 5) break; if (!used.has(nk(b.keyword))) faq.push(claim(b)); }
  out.push({ display: t.display, url: t.url, dePath: t.dePath, name: t.name, type: t.type || 'category', primary, secondary: secondary.slice(0, 5), faq: faq.slice(0, 5) });
}
const file = 'data/keywords/' + lang + '-live.json';
const cur = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { locale: lang, pages: [] };
for (const p of out) { const i = cur.pages.findIndex((x) => x.url === p.url); if (i >= 0) cur.pages[i] = p; else cur.pages.push(p); }
fs.writeFileSync(file, JSON.stringify(cur, null, 1));
for (const p of out) console.log(p.url, '| P:', p.primary ? p.primary.keyword + ' ' + p.primary.volume + '/' + p.primary.kd + p.primary.intent : 'NONE', '| S', p.secondary.length, '| F', p.faq.length);
