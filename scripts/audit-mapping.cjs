// Full audit of the keyword mapping against the Golden Keyword Rule, for Germany (de), France (fr) and the UK (en).
// Every stored keyword (primary, secondary, FAQ) of every page and product is compared with its market bank: intent, volume, KD, refreshed or stale, guard words, brands not sold, duplicates.
// Output: reports/MAPPING-AUDIT-<date>.html (scorecard, findings, every page and product with intent, volume, KD) and MAPPING-AUDIT-keywords-<date>.csv (every keyword).
// usage: node scripts/audit-mapping.cjs
const fs = require('fs');
const root = 'C:/electric bikes europe';
const repDir = root + '/02-site-architecture/reports';
const date = new Date().toISOString().slice(0, 10);
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const nk = (s) => norm(s).replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const planFr = require('./_lang-plan.cjs').fr, planEn = require('./_lang-plan-en.cjs');
const DE_GUARD = /(gebraucht|\btest\b|testbericht|erfahrung|bewertung|leasing|mieten|ausleihen|bedienungsanleitung|anleitung|reparatur|werkstatt|in der n.he|ebay|amazon|decathlon|aldi|lidl|tchibo|kaufland|mediamarkt|saturn|\botto\b|bike24|fahrrad xxl|rose bikes)/i;
const DE_NOTSOLD = /(bianchi|canyon|cowboy|vanmoof|lapierre|moustache|riverside|btwin|rockrider|elops|decathlon|fiido|rad power|aventon|raleigh|carrera|boardman|cateye|sigma|hammerhead|karoo|bryton|coros)/i;
const M = {
  de: { name: 'Germany', dir: 'de', file: 'de_master_merged.csv', ref: 'de_refreshed_keys.json', live: () => require('../data/keywords/de.json').pages, prods: () => require('../data/keywords/products.json').products, guard: DE_GUARD, notSold: DE_NOTSOLD, base: '' },
  fr: { name: 'France', dir: 'fr', file: 'fr_master_merged.csv', ref: 'fr_refreshed_keys.json', live: () => require('../data/keywords/fr-live.json').pages, prods: () => require('../data/keywords/fr-products.json').products, guard: new RegExp(planFr.guard, 'i'), notSold: new RegExp(planFr.notSold, 'i'), base: '/fr' },
  en: { name: 'United Kingdom', dir: 'uk', file: 'uk_master_merged.csv', ref: 'uk_refreshed_keys.json', live: () => require('../data/keywords/en-live.json').pages, prods: () => require('../data/keywords/en-products.json').products, guard: new RegExp(planEn.guard, 'i'), notSold: new RegExp(planEn.notSold, 'i'), base: '/en' },
};
// accessory pages and products legitimately use accessory words (lock, rack, bell ...): for them only the hard guard applies
const HARD = { de: /(gebraucht|\btest\b|testbericht|erfahrung|bewertung|leasing|mieten|ausleihen|bedienungsanleitung|ebay|amazon|decathlon|aldi|lidl|tchibo|kaufland|mediamarkt|saturn|\botto\b|bike24)/i, fr: /(occasion|reconditionn|location|louer|leasing|\btest\b|\bavis\b|notice|manuel|decathlon|leboncoin|troc|intersport|feu vert|norauto|carrefour|leclerc|cdiscount|auchan|comparatif|comparaison)/i, en: /(second.?hand|\bused\b|rental|\bhire\b|leasing|finance|review|\btest\b|halfords|decathlon|argos|ebay|amazon|near me|manual)/i };
const planRel = (file) => { const o = {}; for (const line of fs.readFileSync(file, 'utf8').split('\n')) { const m = /\{ url: '([^']+)'.*?\brel: (.*?), ex: (.*?)(?:, display: .*?)?\s*\},?\s*$/.exec(line.replace(/ rel: /, ' \brel: ')); if (!m) continue; try { o[m[1]] = { rel: new RegExp(new Function('return ' + m[2])(), 'i'), ex: new RegExp(new Function('return ' + m[3])(), 'i') }; } catch (e) {} } return o; };
// a relevance match counts only when it starts a word (so 'blocks' does not count as 'lock')
const fitOK = (re, kw) => { const g = new RegExp(re.source, 'gi'); let m; while ((m = g.exec(kw))) { if (m.index === 0 || !/[a-z0-9À-ſ]/i.test(kw[m.index - 1])) return true; if (m[0].length === 0) g.lastIndex++; } return false; };
const FIT = { fr: planRel(__dirname + '/_lang-brands.cjs'), en: planRel(__dirname + '/_lang-brands-en.cjs'), de: {} };
const RULES = {
  P1: ['Primary is a bank keyword (not a name-based fallback)', 'gap'], P2: ['Primary intent is Transactional or Commercial (Navigational only on brand pages)', 'violation'], P3: ['Primary volume at least 10', 'violation'], P4: ['Primary KD within the limit (28, or 30 at volume 1,000+)', 'violation'], P5: ['No stored T/C keyword that fits the page has 2x or more the primary volume (the biggest fitting T/C keyword is the primary)', 'violation'],
  S1: ['Five secondary keywords stored', 'gap'], S2: ['Secondary keywords are Transactional or Commercial', 'violation'], S3: ['Secondary volume at least 10 and KD within the limit', 'violation'],
  F1: ['Five FAQ keywords stored', 'gap'], F2: ['FAQ keyword volume at least 10 and KD within the limit', 'violation'],
  K1: ['Stored intent, volume and KD equal the bank row', 'violation'], K2: ['Keyword is refreshed (live Semrush data, not the monthly export)', 'stale'], K3: ['Keyword exists in the bank', 'violation'],
  U1: ['A primary keyword is used on no other URL', 'violation'], U2: ['A page keyword (non-product) is used on one URL only', 'violation'],
  G1: ['No guard word (second-hand, review, retailer, local service ...)', 'violation'], F3: ['Accessory page keyword fits the accessory group (relevance and exclusion words of the plan)', 'violation'], F4: ['Brand page keyword contains the brand name', 'violation'], G2: ['No brand the shop does not sell', 'violation'],
};
const out = {}; const csv = ['country,type,url,name,role,keyword,intent,volume,kd,bank_intent,bank_volume,bank_kd,refreshed,issues'];
for (const [code, m] of Object.entries(M)) {
  const bank = new Map(); for (const l of fs.readFileSync(`${root}/03-keywords/by-market/${m.dir}/${m.file}`, 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); bank.set(p[0].toLowerCase(), { i: IT(p[1]), v: +p[2] || 0, kd: p[3] === '' ? null : +p[3] }); }
  const ref = new Set(JSON.parse(fs.readFileSync(`${root}/03-keywords/by-market/${m.dir}/${m.ref}`, 'utf8')));
  const rows = []; // one per URL
  const builtDe = code === 'de' && fs.existsSync('.image-work/de-built.json') ? new Set(JSON.parse(fs.readFileSync('.image-work/de-built.json', 'utf8')).built.map((x) => x.url)) : null;
  const NOT_BUILT = builtDe ? m.live().filter((p) => !builtDe.has(p.url)) : [];
  for (const p of m.live().filter((p) => !builtDe || builtDe.has(p.url))) rows.push({ type: p.type, url: m.base + p.url, name: p.name, brandPage: p.type === 'brand', primary: p.primary, secondary: p.secondary || [], faq: p.faq || [], kind: 'page' });
  for (const [slug, e] of Object.entries(m.prods())) rows.push({ type: e.category === 'Zubehör' ? 'accessory product' : 'product', url: m.base + '/shop/' + slug, name: e.name, brandPage: false, primary: e.primary, secondary: e.secondary || [], faq: e.faq || [], kind: 'product' });
  // usage map for duplicate checks
  const use = new Map(); const addUse = (k, r, role) => { const key = nk(k.keyword); if (!use.has(key)) use.set(key, []); use.get(key).push({ url: r.url, role, kind: r.kind }); };
  for (const r of rows) { if (r.primary && r.primary.source !== 'name') addUse(r.primary, r, 'primary'); for (const k of r.secondary) addUse(k, r, 'secondary'); for (const k of r.faq) addUse(k, r, 'faq'); }
  const NEWSLUGS = new Set([...fs.readFileSync(__dirname + '/../lib/catalog-gps.ts', 'utf8').matchAll(/"slug": "([^"]+)"/g), ...fs.readFileSync(__dirname + '/../lib/catalog-5d.ts', 'utf8').matchAll(/"slug": "([^"]+)"/g)].map((x) => x[1]));
  const NEWPAGES = /(gps-fahrradcomputer|gps-velo|bike-computers|trinkflaschen-flaschenhalter|porte-bidons-gourdes|bottles-cages|zubehoer\/pedale|accessoires\/pedales|accessories\/pedals|luftpumpen-inflatoren|pompes-gonfleurs|pumps-inflators)/;
  for (const r of rows) r.isNew = r.kind === 'product' ? NEWSLUGS.has(r.url.split('/shop/')[1]) : NEWPAGES.test(r.url);
  const counts = {}; const ex = {}; const flag = (r, role, k, c, detail) => { counts[c] = (counts[c] || 0) + 1; (ex[c] ||= []).push({ url: r.url, role, kw: k && k.keyword, detail }); return c; };
  const limitKd = (v) => (v >= 1000 ? 30 : 28);
  for (const r of rows) {
    r.issues = []; const check = (k, role) => {
      const iss = []; const kw = k.keyword.toLowerCase(); const b = bank.get(kw); const name = k.source === 'name' || (!b && !(+k.volume > 0));
      if (name) { r.keys.push({ role, k, b: null, refreshed: false, iss: [] }); return; }
      if (!b) iss.push(flag(r, role, k, 'K3')); else {
        if (b.i !== (k.intent || '-') && !(b.i === '-' && !k.intent) || b.v !== +k.volume || (b.kd !== null && b.kd !== +k.kd)) iss.push(flag(r, role, k, 'K1', `stored ${k.intent}/${k.volume}/${k.kd} bank ${b.i}/${b.v}/${b.kd}`));
        if (!ref.has(kw)) iss.push(flag(r, role, k, 'K2'));
      }
      const intent = b ? b.i : k.intent; const vol = b ? b.v : +k.volume; const kd = b ? b.kd : k.kd;
      if (role === 'primary') { if (!(intent === 'T' || intent === 'C' || (intent === 'N' && r.brandPage))) iss.push(flag(r, role, k, 'P2', intent)); if (vol < 10) iss.push(flag(r, role, k, 'P3', vol)); if (kd !== null && kd > limitKd(vol)) iss.push(flag(r, role, k, 'P4', 'KD ' + kd)); }
      if (role === 'secondary') { if (!(intent === 'T' || intent === 'C')) iss.push(flag(r, role, k, 'S2', intent)); if (vol < 10 || (kd !== null && kd > limitKd(vol))) iss.push(flag(r, role, k, 'S3', vol + '/' + kd)); }
      if (role === 'faq' && (vol < 10 || (kd !== null && kd > limitKd(vol)))) iss.push(flag(r, role, k, 'F2', vol + '/' + kd));
      const acc = /accessory/.test(r.type) || /accessor|zubeh/.test(r.url); const gd = acc ? HARD[code] : m.guard; if (gd.test(kw)) iss.push(flag(r, role, k, 'G1', (kw.match(gd) || [])[0])); const fp = FIT[code][r.url.slice(m.base.length)]; if (r.kind === 'page' && fp && (!fitOK(fp.rel, kw) || fp.ex.test(kw))) iss.push(flag(r, role, k, 'F3', 'does not fit ' + r.url)); if (r.type === 'brand') { const tok = norm(r.url.replace(/\/$/, '').split('/').pop()).split('-')[0]; if (tok && !norm(kw).includes(tok.slice(0, 5))) iss.push(flag(r, role, k, 'F4', 'brand ' + tok)); } if (m.notSold.test(kw)) iss.push(flag(r, role, k, 'G2', (kw.match(m.notSold) || [])[0]));
      const u = use.get(nk(k.keyword)) || [];
      if (role === 'primary' && u.some((x) => x.url !== r.url)) iss.push(flag(r, role, k, 'U1', u.filter((x) => x.url !== r.url).slice(0, 3).map((x) => x.url).join(' ')));
      if (r.kind === 'page' && role !== 'primary' && u.some((x) => x.url !== r.url && x.kind === 'page')) iss.push(flag(r, role, k, 'U2', u.filter((x) => x.url !== r.url && x.kind === 'page').slice(0, 2).map((x) => x.url).join(' ')));
      r.keys.push({ role, k, b, refreshed: ref.has(kw), iss });
    };
    r.keys = [];
    if (r.primary) { const pb = bank.get(r.primary.keyword.toLowerCase()); if (r.primary.source === 'name' || (!pb && !(+r.primary.volume > 0))) { flag(r, 'primary', r.primary, 'P1'); r.primary.source = 'name'; } check(r.primary, 'primary'); }
    for (const k of r.secondary) check(k, 'secondary'); for (const k of r.faq) check(k, 'faq');
    // P5 (owner rule 2026-11-20): a stored Transactional or Commercial keyword that fits the page, is inside the KD limit and has 2x or more the primary volume must be the primary
    if (r.kind === 'page' && r.primary && r.keys.length && r.keys[0].role === 'primary') {
      const pv = r.primary.source === 'name' ? 0 : +r.primary.volume || 0; const fp5 = FIT[code][r.url.slice(m.base.length)]; const acc5 = /accessory/.test(r.type) || /accessor|zubeh/.test(r.url);
      const P5X = { '/velos-electriques/vtt-electrique/': /pneu|piece|pas cher/i, '/accessories/rain-clothing/': /./, '/marken/bosch/': /fahrradcomputer/i, '/zubehoer/werkzeug-pflege/': /pumpe/i }; // read one by one: the shop does not sell tyres, covers (5d pending), Bosch computers; pumps have their own page
      const pool = [...r.secondary, ...r.faq].filter((k) => !(P5X[r.url.slice(m.base.length)] || /^$/).test(k.keyword)).filter((k) => (k.intent === 'T' || k.intent === 'C') && +k.volume >= 100 && (k.kd == null || k.kd === '' || +k.kd <= limitKd(+k.volume)) && !(acc5 ? HARD[code] : m.guard).test(k.keyword) && !m.notSold.test(k.keyword) && (!fp5 || (fitOK(fp5.rel, k.keyword.toLowerCase()) && !fp5.ex.test(k.keyword.toLowerCase())))).sort((a, b) => b.volume - a.volume);
      if (pool.length && +pool[0].volume >= 2 * Math.max(pv, 1)) { const c = flag(r, 'primary', r.primary, 'P5', `"${pool[0].keyword}" ${pool[0].intent} ${pool[0].volume} is ${pv ? (pool[0].volume / pv).toFixed(1) + 'x' : 'bigger than'} the primary (${pv})`); r.keys[0].iss.push(c); }
    }
    if (r.secondary.length < 5) flag(r, 'secondary', null, 'S1', r.secondary.length + ' of 5'); if (r.faq.length < 5) flag(r, 'faq', null, 'F1', r.faq.length + ' of 5');
    r.codes = [...new Set([...(r.primary && r.primary.source === 'name' ? ['P1'] : []), ...(r.secondary.length < 5 ? ['S1'] : []), ...(r.faq.length < 5 ? ['F1'] : []), ...r.keys.flatMap((x) => x.iss)])];
    for (const x of r.keys) csv.push([code, r.type, r.url, '"' + r.name.replace(/"/g, '""') + '"', x.role, '"' + x.k.keyword.replace(/"/g, '""') + '"', x.k.intent || '', x.k.volume, x.k.kd == null ? '' : x.k.kd, x.b ? x.b.i : '', x.b ? x.b.v : '', x.b && x.b.kd != null ? x.b.kd : '', x.k.source === 'name' ? 'name-based' : x.refreshed ? 'yes' : 'no', '"' + x.iss.join(' ') + '"'].join(','));
  }
  const nKeys = rows.reduce((a, r) => a + r.keys.length, 0), bankKeys = rows.reduce((a, r) => a + r.keys.filter((x) => x.k.source !== 'name').length, 0);
  const intents = rows.reduce((a, r) => { if (r.primary) { const x = r.keys[0]; const i = r.primary.source === 'name' ? 'name' : x && x.b ? x.b.i : r.primary.intent; a[i] = (a[i] || 0) + 1; } return a; }, {});
  const dup = {}; for (const [k, a] of use) { const urls = [...new Set(a.map((x) => x.url))]; if (urls.length > 1) dup[k] = urls; }
  out[code] = { notBuilt: NOT_BUILT, newRows: rows.filter((r) => r.isNew), m, rows, counts, ex, nKeys, bankKeys, intents, refreshedShare: bankKeys ? rows.reduce((a, r) => a + r.keys.filter((x) => x.k.source !== 'name' && x.refreshed).length, 0) / bankKeys : 0, pages: rows.filter((r) => r.kind === 'page').length, products: rows.filter((r) => r.kind === 'product').length };
}
// ---------- HTML
const css = '<style>:root{--bg:#F8F9FA;--ink:#131A22;--or:#FF5722;--gr:#00C853;--line:#e5e8ec;--mut:#555}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,Segoe UI,Arial,sans-serif}.w{max-width:1180px;margin:0 auto;padding:24px 16px 80px}h1{font-size:26px;margin:0 0 6px}h2{font-size:19px;margin:34px 0 8px}h3{font-size:15px;margin:22px 0 6px}table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);margin:8px 0}th{text-align:left;padding:6px 8px;border-bottom:2px solid var(--ink);font-size:11px;text-transform:uppercase;color:var(--mut);position:sticky;top:0;background:#fff}td{padding:5px 8px;border-bottom:1px solid var(--line);font-size:12px;vertical-align:top}.k{white-space:nowrap}.cards{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.c{background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px 16px;min-width:150px}.c b{font-size:24px;display:block}.c span{font-size:12px;color:var(--mut)}.bad{color:#c62828;font-weight:700}.ok{color:#00A843;font-weight:700}.warn{color:#b26a00;font-weight:700}small{color:var(--mut)}details{background:#fff;border:1px solid var(--line);border-radius:8px;margin:8px 0;padding:6px 12px}summary{cursor:pointer;font-weight:700;font-size:14px;padding:4px 0}.t{display:inline-block;min-width:16px;text-align:center;border-radius:3px;padding:0 3px;font-size:10px;font-weight:700;color:#fff}.tT{background:#00A843}.tC{background:#1976d2}.tN{background:#8e24aa}.tI{background:#9e9e9e}.tn{background:#FF5722}.chip{display:inline-block;background:#fff3ee;border:1px solid #ffd0bd;border-radius:4px;padding:0 5px;margin:1px;font-size:10px}</style>';
const tag = (i) => `<span class="t t${i === '-' || !i ? 'n' : i}">${i || '?'}</span>`;
const kwCell = (x) => { const i = x.k.source === 'name' ? 'n' : (x.b ? x.b.i : x.k.intent); const v = x.k.source === 'name' ? 0 : (x.b ? x.b.v : x.k.volume); const kd = x.k.source === 'name' ? '' : (x.b ? x.b.kd : x.k.kd); const cls = x.iss.length ? 'bad' : (x.refreshed || x.k.source === 'name' ? '' : 'warn'); return `<span class="${cls}">${esc(x.k.keyword)}</span> ${tag(i)} <small>${v}${kd !== '' && kd != null ? ' / KD ' + kd : ''}${x.k.source !== 'name' && !x.refreshed ? ' / stale' : ''}</small>`; };
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mapping audit ${date}</title>${css}</head><body><div class="w"><h1>Keyword mapping audit: Germany, France, United Kingdom</h1><div><small>${date} | every stored keyword of every page and product checked against the Golden Keyword Rule and against its market bank (Semrush export plus live refresh) | volume = monthly searches, KD = keyword difficulty, intent T Transactional, C Commercial, N Navigational, I Informational, n name-based (no bank keyword)</small></div>`;
// scorecard
h += '<h2>1. Scorecard</h2><table><tr><th>Measure</th>' + Object.values(out).map((o) => `<th>${o.m.name}</th>`).join('') + '</tr>';
const row = (label, f) => `<tr><td>${label}</td>${Object.values(out).map((o) => `<td>${f(o)}</td>`).join('')}</tr>`;
h += row('Pages / products audited', (o) => `${o.pages} / ${o.products}` + (o.notBuilt.length ? ` <small>(+ ${o.notBuilt.length} map entries for pages not built, excluded)</small>` : '')) + row('Keywords stored (bank keywords / name-based)', (o) => `${o.bankKeys.toLocaleString('en')} / ${(o.nKeys - o.bankKeys).toLocaleString('en')}`) + row('Share of bank keywords that are refreshed', (o) => `<b class="${o.refreshedShare > 0.9 ? 'ok' : o.refreshedShare > 0.5 ? 'warn' : 'bad'}">${(100 * o.refreshedShare).toFixed(1)}%</b>`) + row('Primary intent mix', (o) => Object.entries(o.intents).sort((a, b) => b[1] - a[1]).map(([i, n]) => `${tag(i)} ${n}`).join(' '));
for (const c of Object.keys(RULES)) { h += row(`<b>${c}</b> ${RULES[c][0]}`, (o) => { const n = o.counts[c] || 0; return n ? `<span class="${RULES[c][1] === 'violation' ? 'bad' : 'warn'}">${n.toLocaleString('en')}</span>` : '<span class="ok">0</span>'; }); }
h += '</table><p><small>Violation = breaks the rule as written. Gap = the rule cannot be met yet with the data (name-based primary, fewer than five keywords). Stale = keyword not refreshed in Semrush yet.</small></p>';
// verdict
h += '<h2>2. Verdict and what to fix first</h2>';
const ACTION = {
  de: 'The German mapping was built before the refresh rule: almost nothing is refreshed, so volumes, KD and intents may have moved. Needs the full Semrush refresh of every stored keyword (' + out.de.counts.K2.toLocaleString('en') + ' are stale), then a remap with the same flow as English and French. Until then German is the weakest market for the golden rule.',
  fr: 'French is refreshed and clean on guards, brands and duplicates. Open work: Transactional or Commercial primaries for the five Informational pages, a refresh for the four stale keywords, the four off-topic accessory keywords, and more secondary and FAQ keywords for products (needs the remaining Semrush batches).',
  en: 'English is refreshed and clean on duplicates and intents. Open work: the off-topic accessory keywords (brake blocks on the locks page), the unsold brand primary on the lights page, zero-volume keywords on the QiO brand page, and more keywords for products (needs Semrush batches).'
};
for (const [code, o] of Object.entries(out)) {
  const viol = Object.keys(RULES).filter((c) => RULES[c][1] === 'violation' && o.counts[c]); const nviol = viol.reduce((a, c) => a + o.counts[c], 0);
  h += '<div class="c" style="margin:10px 0;min-width:0"><b style="font-size:17px">' + o.m.name + ': ' + (100 * o.refreshedShare).toFixed(1) + '% of bank keywords refreshed, ' + nviol.toLocaleString('en') + ' rule violations, ' + (o.counts.P1 || 0).toLocaleString('en') + ' name-based primaries</b><span>' + ACTION[code] + '</span>';
  h += '<ul style="font-size:12px;line-height:1.6;margin:8px 0 0">' + viol.map((c) => '<li><b>' + c + '</b> ' + RULES[c][0] + ': <span class="bad">' + o.counts[c] + '</span>. Examples: ' + (o.ex[c] || []).slice(0, 4).map((x) => esc(x.kw || '') + ' (' + esc(x.url) + ')').join('; ') + '</li>').join('') + (viol.length ? '' : '<li class="ok">no violations</li>') + '</ul></div>';
}
// findings
h += '<h2>3. Findings by rule, with examples</h2>';
for (const [code, o] of Object.entries(out)) {
  h += `<details><summary>${o.m.name}: ${Object.entries(o.counts).map(([c, n]) => `${c} ${n}`).join(' | ') || 'no findings'}</summary>`;
  for (const c of Object.keys(RULES)) { const e = o.ex[c]; if (!e) continue; h += `<h3>${c}: ${RULES[c][0]} (${e.length})</h3><table><tr><th>URL</th><th>Role</th><th>Keyword</th><th>Detail</th></tr>${e.slice(0, 25).map((x) => `<tr><td>${esc(x.url)}</td><td>${x.role}</td><td>${esc(x.kw || '')}</td><td>${esc(x.detail || '')}</td></tr>`).join('')}</table>${e.length > 25 ? `<small>${e.length - 25} more in the CSV.</small>` : ''}`; }
  h += '</details>';
}
// pages
h += '<h2>4. Every page: primary, five secondary, five FAQ (intent, volume, KD)</h2>';
for (const [code, o] of Object.entries(out)) {
  h += `<h3>${o.m.name} (${o.pages} pages)</h3><table><tr><th>URL</th><th>Primary</th><th>Secondary</th><th>FAQ</th><th>Issues</th></tr>`;
  for (const r of o.rows.filter((x) => x.kind === 'page')) { const k = r.keys; const pk = k.filter((x) => x.role === 'primary'), sk = k.filter((x) => x.role === 'secondary'), fk = k.filter((x) => x.role === 'faq'); h += `<tr><td>${esc(r.url)}<br><small>${esc(r.type)}</small></td><td>${pk.map(kwCell).join('')}</td><td>${sk.map(kwCell).join('<br>')}</td><td>${fk.map(kwCell).join('<br>')}</td><td>${r.codes.map((c) => `<span class="chip">${c}</span>`).join('')}</td></tr>`; }
  h += '</table>';
}
// items added in the last days, per country, with their own issue counts
h += '<h2>4b. Items added in the last two days (GPS group and Stage A), counted separately</h2><table><tr><th>Market</th><th>Pages</th><th>Products</th><th>Name-based primaries (P1)</th><th>Fewer than 5 secondary (S1)</th><th>Fewer than 5 FAQ (F1)</th><th>Rule violations</th></tr>';
for (const [code, o] of Object.entries(out)) { const nr = o.newRows; const c = (k) => nr.filter((r) => r.codes.includes(k)).length; const viol = nr.filter((r) => r.codes.some((k) => RULES[k] && RULES[k][1] === 'violation')).length; h += '<tr><td>' + o.m.name + '</td><td>' + nr.filter((r) => r.kind === 'page').length + '</td><td>' + nr.filter((r) => r.kind === 'product').length + '</td><td>' + c('P1') + '</td><td>' + c('S1') + '</td><td>' + c('F1') + '</td><td>' + viol + '</td></tr>'; }
h += '</table><p><small>These are gaps (no refreshed demand keywords yet, Semrush batches pending), not rule violations, unless the violations column says otherwise.</small></p>';
// German map entries for pages that are not built
h += '<h2>4c. German keyword-map entries for pages that are NOT built (404), excluded from every count above</h2><p><small>The Nov 10 final audit lists these as deliberately not built (no stock, no confirmed offer, brands not stocked). Their keywords are parked in the map. Some can move to pages that exist now, for example the pedal and pump keywords.</small></p><table><tr><th>URL</th><th>Type</th><th>Parked primary (intent, volume, KD)</th></tr>';
for (const p of out.de.notBuilt) h += '<tr><td>' + esc(p.url) + '</td><td>' + p.type + '</td><td>' + (p.primary ? esc(p.primary.keyword) + ' ' + tag(p.primary.intent) + ' <small>' + p.primary.volume + ' / KD ' + p.primary.kd + '</small>' : '') + '</td></tr>';
h += '</table>';
// products: one page per country (keeps the main report small enough for the browser pane)
h += '<h2>5. Every product (one page per country; every keyword with intent, volume, KD is also in the CSV)</h2><ul>';
for (const [code, o] of Object.entries(out)) {
  const pr = o.rows.filter((x) => x.kind === 'product'); const pf = 'MAPPING-AUDIT-products-' + code + '-' + date + '.html';
  let ph = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Products ' + o.m.name + '</title>' + css + '</head><body><div class="w"><h1>' + o.m.name + ': ' + pr.length + ' products</h1><p><small>Primary with intent, volume and KD, secondary and FAQ counts, issue codes (see the main audit for the rule list). <a href="MAPPING-AUDIT-' + date + '.html">Back to the main audit</a></small></p><table><tr><th>Product</th><th>Primary</th><th>S</th><th>F</th><th>Issues</th></tr>';
  for (const r of pr) { const pk = r.keys.filter((x) => x.role === 'primary'); ph += '<tr><td>' + esc(r.name) + '<br><small>' + esc(r.url) + '</small></td><td>' + pk.map(kwCell).join('') + '</td><td>' + r.secondary.length + '</td><td>' + r.faq.length + '</td><td>' + r.codes.map((c) => '<span class="chip">' + c + '</span>').join('') + '</td></tr>'; }
  ph += '</table></div></body></html>'; fs.writeFileSync(repDir + '/' + pf, ph);
  h += '<li><a href="' + pf + '">' + o.m.name + ': ' + pr.length + ' products</a> (' + Math.round(ph.length / 1024) + ' KB)</li>';
}
h += '</ul>';
h += '<h2>6. Rule definitions used</h2><table><tr><th>Code</th><th>Rule</th><th>Type</th></tr>' + Object.entries(RULES).map(([c, [t, ty]]) => `<tr><td>${c}</td><td>${t}</td><td>${ty}</td></tr>`).join('') + '</table><p><small>Not verified by this audit: Search Console performance, the visual quality of images, whether a keyword fits its page by meaning (a separate fit check exists for French), and German brand pages built before the refresh rule was introduced.</small></p></div></body></html>';
const f = `${repDir}/MAPPING-AUDIT-${date}.html`; fs.writeFileSync(f, h); fs.writeFileSync(`${repDir}/MAPPING-AUDIT-keywords-${date}.csv`, csv.join('\n'));
fs.writeFileSync('.image-work/audit-summary.json', JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, o]) => [k, { pages: o.pages, products: o.products, nKeys: o.nKeys, bankKeys: o.bankKeys, refreshed: o.refreshedShare, intents: o.intents, counts: o.counts }])), null, 1));
console.log(f); for (const [k, o] of Object.entries(out)) console.log(k, 'pages', o.pages, 'products', o.products, 'keywords', o.nKeys, 'refreshed', (100 * o.refreshedShare).toFixed(1) + '%', JSON.stringify(o.intents), JSON.stringify(o.counts));
