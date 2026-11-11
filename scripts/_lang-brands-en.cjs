// English (UK database) batch 2 selection: brand pages (every stocked brand + 3 motor makers), accessory group pages and the brands hub.
// Brand pages take clean brand + category keywords only (brand token + bike vocabulary, no model names, no other brand, no guard words).
// usage: node scripts/_lang-brands-en.cjs   -> adds the pages to data/keywords/en-live.json
const fs = require('fs');
const lang = 'en';
const root = 'C:/electric bikes europe';
const plan = require('./_lang-plan.cjs')[lang];
const prodMap = require('../data/keywords/products.json').products;
const live = JSON.parse(fs.readFileSync(`data/keywords/${lang}-live.json`, 'utf8'));
live.pages = live.pages.filter((p) => !/^\/(brands|accessories)\//.test(p.url));
const nk = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const GUARD = new RegExp(plan.guard, 'i');
const cfg = require(root + '/02-site-architecture/cfg_en.js');
const bank = [];
for (const l of fs.readFileSync(`${root}/03-keywords/by-market/${plan.bankDir}/${plan.bankDir}_master_merged.csv`, 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0;
  if (kd === null || kd > 28 || vol < plan.floor) continue;
  bank.push({ keyword: p[0].toLowerCase(), intent: IT(p[1]), volume: vol, kd });
}
bank.sort((a, b) => b.volume - a.volume);
const used = new Set();
for (const p of live.pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
const VOC = new RegExp('^(' + plan.vocab + ')$', 'i');
const BADTAIL = new Set(['for', 'to', 'the', 'a', 'and', 'with', 'in', 'of']);
const NOTSOLD = new RegExp(plan.notSold, 'i');
const brands = [...new Set(Object.values(prodMap).filter((p) => p.category !== 'Zubehör').map((p) => p.brand))].sort();
const slug = (b) => b.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const display = (kw, brandName) => {
  let s = kw.replace(/\bktm\b/, 'KTM').replace(/\bqio\b/, 'QiO').replace(/\bmtb\b/, 'MTB').replace(/\bemtb\b/, 'eMTB').replace(/\buk\b/, 'UK');
  const bn = brandName.replace(/^(Bosch|Shimano|Yamaha) .*$/, '$1');
  if (/riese/i.test(bn)) s = s.replace(/riese (and |&)?m(ü|u)ller/i, 'Riese & Müller');
  else if (bn) s = s.replace(new RegExp('\\b' + norm(bn).replace(/[&.]/g, '').replace(/\s+/g, ' ') + '\\b', 'i'), bn);
  return cap(s);
};
const entries = [];
const brandDefs = brands.map((b) => ({ name: b, url: `/brands/${slug(b)}/`, dePath: `/marken/${slug(b)}`, toks: norm(b).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter(Boolean).filter((x) => x !== 'und'), extra: '' }));
brandDefs.push({ name: 'Bosch motors', brandName: 'Bosch', url: '/brands/bosch/', dePath: '/marken/bosch', toks: ['bosch'], extra: 'motor|motors|system|performance|line|cx|active|smart|battery|kiox|nyon|purion|cargo|speed|sx|gen' });
brandDefs.push({ name: 'Shimano STEPS', brandName: 'Shimano', url: '/brands/shimano/', dePath: '/marken/shimano', toks: ['shimano'], extra: 'steps|ep8|ep801|motor|motors|battery|e6100|e7000|e8000' });
brandDefs.push({ name: 'Yamaha motors', brandName: 'Yamaha', url: '/brands/yamaha-motor/', dePath: '/marken/yamaha-motor', toks: ['yamaha'], extra: 'motor|motors|battery|pw|pwx|syncdrive' });
const otherBrandRe = (self) => new RegExp('\\b(' + brands.concat(['bosch', 'shimano', 'yamaha', 'nakamura', 'halfords', 'decathlon', 'raleigh', 'carrera', 'boardman']).filter((b) => !self.toks.includes(norm(b).split(/[^a-z0-9]+/)[0])).map((b) => norm(b).replace(/[&]/g, ' ').trim().split(/\s+/)[0]).filter((x) => x && x !== 'und').join('|') + ')\\b', 'i');
for (const d of brandDefs) {
  const bn = d.brandName || d.name;
  const others = otherBrandRe(d);
  const extraRe = d.extra ? new RegExp('^(' + d.extra + ')$', 'i') : null;
  const pool = bank.filter((r) => {
    if (GUARD.test(r.keyword) || (cfg.RETAIL && cfg.RETAIL.test(r.keyword)) || (cfg.JUNK && cfg.JUNK.test(r.keyword)) || NOTSOLD.test(r.keyword)) return false;
    if (used.has(nk(r.keyword))) return false;
    const k = norm(r.keyword); const tk = k.split(/[^a-z0-9]+/).filter(Boolean);
    if (new Set(tk).size !== tk.length) return false;
    if (BADTAIL.has(tk[tk.length - 1])) return false;
    if (!d.toks.every((t) => tk.includes(t) || (t === 'muller' && tk.includes('mueller')))) return false;
    if (others.test(k.replace(new RegExp(d.toks.join('|'), 'g'), ' '))) return false;
    return tk.every((t) => d.toks.includes(t) || VOC.test(t) || (extraRe && extraRe.test(t)) || (/riese/i.test(bn) && /^(muller|mueller|riese)$/.test(t)));
  });
  const bestTC = pool.find((r) => r.intent === 'T') || pool.find((r) => r.intent === 'C');
  const bestN = pool.find((r) => r.intent === 'N');
  let primary = (bestTC && bestN && bestN.volume >= bestTC.volume * 2 && bestN.volume >= 500) ? bestN : (bestTC || pool[0] || null);
  let source = 'bank';
  if (!primary) { primary = { keyword: norm(bn).replace(/&/g, ' ').replace(/\s+/g, ' ').trim() + ' electric bikes', intent: 'T', volume: 0, kd: null }; source = 'name'; }
  else used.add(nk(primary.keyword));
  const sec = [], faq = [];
  if (source === 'bank') {
    for (const r of pool) { if (sec.length >= 5) break; if (!used.has(nk(r.keyword)) && (r.intent === 'T' || r.intent === 'C')) { sec.push(r); used.add(nk(r.keyword)); } }
    for (const r of pool) { if (faq.length >= 5) break; if (!used.has(nk(r.keyword))) { faq.push(r); used.add(nk(r.keyword)); } }
  }
  const disp = source === 'name' ? bn + ' electric bikes' : display(primary.keyword, bn);
  entries.push({ display: disp, url: d.url, dePath: d.dePath, name: d.name, type: 'brand', source, primary: { ...primary, source }, secondary: sec, faq });
}
// ---- accessory groups
const BIKE = '(bike|bicycle|cycle|ebike)';
const ACC = [
  { url: '/accessories/locks/', de: 'schloesser', name: 'Bike locks', rel: '(' + String.fromCharCode(92) + 'block' + String.fromCharCode(92) + 'b|locks|d lock|chain lock|folding lock|padlock|anti theft)', ex: '(car|motorbike|scooter|door|house|combination key|key replacement|alarm)' },
  { url: '/accessories/helmets/', de: 'helme', name: 'Helmets', rel: 'helmets?', ex: '(motorbike|motorcycle|biker|ski|snow|climbing|riding|horse|kids|baby|toddler|camera|bluetooth)' },
  { url: '/accessories/bags-baskets/', de: 'taschen-koerbe', name: 'Bags and baskets', rel: '(pannier|basket|bike bag|saddle bag|handlebar bag|frame bag|top tube bag)', ex: '(motorbike|dog|child|backpack)' },
  { url: '/accessories/racks-trailers/', de: 'gepaecktraeger-anhaenger', name: 'Racks, seats and trailers', rel: '(luggage rack|rear rack|pannier rack|bike rack|child seat|baby seat|bike trailer|cargo trailer|front rack)', ex: '(car|roof|tow ?bar|boot|van|caravan|motorbike|dog)' },
  { url: '/accessories/mudguards-stands/', de: 'schutzbleche-staender', name: 'Mudguards and stands', rel: '(mudguards?|mud guards?|fenders?|kickstand|bike stand|parking stand)', ex: '(car|motorbike|scooter|child)' },
  { url: '/accessories/phone-holders/', de: 'handyhalter', name: 'Phone holders', rel: '(phone (holder|mount)|smartphone (holder|mount)|phone cradle)', ex: '(motorbike|car|desk|table|dash)' },
  { url: '/accessories/tools-care/', de: 'werkzeug-pflege', name: 'Tools and care', rel: '(pump|multi ?tool|repair kit|puncture repair|chain lube|lubricant|degreaser|bike cleaner|bike wash|chain cleaner)', ex: '(car|motorbike|scooter|pool|garden|compressor|shock|fork|suspension)' },
  { url: '/accessories/rain-clothing/', de: 'regenschutz-bekleidung', name: 'Rain protection', rel: '(rain cover|rain jacket|waterproof|rain cape|poncho|overshoes?|bike cover)', ex: '(motorbike|car|baby|pram|tent|boot)' },
  { url: '/accessories/lights/', de: 'beleuchtung', name: 'Bike lights', rel: '(bike lights?|front light|rear light|headlight|reflector|bike lamp)', ex: '(motorbike|car|helmet|head ?torch|party|string)' },
  { url: '/accessories/saddles-handlebars/', de: 'sattel-lenker', name: 'Saddles and handlebars', rel: '(saddle|handlebar (grips|tape)|bike grips|bike bell|seat post)', ex: '(motorbike|horse|bag|pouch|cover|shorts|scooter)' },
  { url: '/accessories/', de: null, name: 'E-bike accessories', rel: '(accessor)', ex: '(motorbike|car|scooter|kitchen|phone case)' },
];
for (const a of ACC) {
  const rel = new RegExp(a.rel, 'i'), ex = new RegExp(a.ex, 'i'), bike = new RegExp(BIKE, 'i');
  const pool = bank.filter((r) => rel.test(r.keyword) && !ex.test(r.keyword) && bike.test(r.keyword) && !(GUARD.test(r.keyword) && !/helmet|lock|light|bell/.test(a.rel)) && !(cfg.RETAIL && cfg.RETAIL.test(r.keyword)) && !(cfg.JUNK && cfg.JUNK.test(r.keyword)) && !NOTSOLD.test(r.keyword) && !(a.url === '/accessories/' && new RegExp(plan.brands, 'i').test(r.keyword)) && !used.has(nk(r.keyword)));
  const clean = pool.filter((r) => !/(second ?hand|used|review|test|vs|finance|\$|under \d)/i.test(r.keyword));
  const primary = clean.find((r) => r.intent === 'T') || clean.find((r) => r.intent === 'C') || clean[0] || null;
  if (primary) used.add(nk(primary.keyword));
  const sec = [], faq = [];
  for (const r of clean) { if (sec.length >= 5) break; if (!used.has(nk(r.keyword)) && (r.intent === 'T' || r.intent === 'C')) { sec.push(r); used.add(nk(r.keyword)); } }
  for (const r of clean) { if (faq.length >= 5) break; if (!used.has(nk(r.keyword))) { faq.push(r); used.add(nk(r.keyword)); } }
  const source = primary ? 'bank' : 'name';
  const prim = primary || { keyword: a.name.toLowerCase() + ' for electric bikes', intent: 'T', volume: 0, kd: null };
  entries.push({ display: primary ? display(primary.keyword, '') : a.name + ' for electric bikes', url: a.url, dePath: a.de ? '/zubehoer/' + a.de : '/zubehoer', name: a.name, type: 'accessory', source, primary: { ...prim, source }, secondary: sec, faq });
}
// ---- brands hub
{
  const rows = [];
  for (const r of bank) { if (/^(best |top )?(electric bike|e bike|ebike|electric bicycle|e-bike)s? brands?$/.test(r.keyword) || /^(electric bike|e bike|ebike|electric bicycle|e-bike) (brands?|manufacturers?|makes?)$/.test(r.keyword) || /^(brands? of|makes? of) (electric bikes?|e bikes?|ebikes?)$/.test(r.keyword)) { if (!used.has(nk(r.keyword)) && !GUARD.test(r.keyword)) { used.add(nk(r.keyword)); rows.push(r); } } }
  const primary = rows.find((r) => r.intent === 'C' || r.intent === 'T') || rows[0];
  if (primary) {
    const rest = rows.filter((r) => r !== primary);
    const sec = rest.filter((r) => r.intent === 'C' || r.intent === 'T').slice(0, 5);
    const faq = rest.filter((r) => !sec.includes(r)).slice(0, 5);
    entries.push({ display: display(primary.keyword, ''), url: '/brands/', dePath: '/marken', name: 'Brands', type: 'hub', source: 'bank', primary: { ...primary, source: 'bank' }, secondary: sec, faq });
  } else entries.push({ display: 'Electric bike brands', url: '/brands/', dePath: '/marken', name: 'Brands', type: 'hub', source: 'name', primary: { keyword: 'electric bike brands', intent: 'T', volume: 0, kd: null, source: 'name' }, secondary: [], faq: [] });
}
for (const e of entries) { const i = live.pages.findIndex((x) => x.url === e.url); if (i >= 0) live.pages[i] = e; else live.pages.push(e); }
fs.writeFileSync(`data/keywords/${lang}-live.json`, JSON.stringify(live, null, 1));
for (const e of entries) console.log(e.type.padEnd(9), e.url.padEnd(40), e.source.padEnd(5), '|', e.display, '|', e.primary.keyword, e.primary.volume + '/' + e.primary.intent, '| S', e.secondary.length, 'F', e.faq.length);
