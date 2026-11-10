// Batch 2 selection for one language: brand pages (every stocked brand + the 3 motor makers) and accessory group pages.
// Brand pages take clean brand + category keywords only (brand token + bike vocabulary, no model names, no other brand, no guard words).
// usage: node scripts/_lang-brands.cjs fr   -> adds the pages to data/keywords/<lang>-live.json
const fs = require('fs');
const lang = process.argv[2];
const root = 'C:/electric bikes europe';
const plan = require('./_lang-plan.cjs')[lang];
const prodMap = require('../data/keywords/products.json').products;
const live = fs.existsSync(`data/keywords/${lang}-live.json`) ? JSON.parse(fs.readFileSync(`data/keywords/${lang}-live.json`, 'utf8')) : { locale: lang, pages: [] };
live.pages = live.pages.filter((p) => !/^\/(marques|accessoires)\//.test(p.url));
const map = require(`../data/keywords/${lang}.json`).pages;
const nk = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const GUARD = new RegExp(plan.guard, 'i');
const cfg = require(root + '/02-site-architecture/cfg_' + lang + '.js');
const bank = [];
for (const l of fs.readFileSync(`${root}/03-keywords/by-market/${lang}/${lang}_master_merged.csv`, 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0;
  if (kd === null || kd > 28 || vol < plan.floor) continue;
  bank.push({ keyword: p[0].toLowerCase(), intent: IT(p[1]), volume: vol, kd });
}
bank.sort((a, b) => b.volume - a.volume);
const used = new Set();
for (const p of live.pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
const VOC = new RegExp('^(' + plan.vocab + ')$', 'i');
const BADTAIL = new Set(['en', 'de', 'du', 'des', 'd', 'la', 'le', 'les', 'un', 'une', 'pour', 'et', 'a']);
const brands = [...new Set(Object.values(prodMap).filter((p) => p.category !== 'Zubehör').map((p) => p.brand))].sort();
const slug = (b) => b.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/&/g, ' und ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const DISP = { abus: 'ABUS', ktm: 'KTM', qio: 'QiO', velo: 'vélo', velos: 'vélos', electrique: 'électrique', electriques: 'électriques', vtt: 'VTT', vtc: 'VTC', vae: 'VAE', bicyclette: 'bicyclette' };
const display = (kw, brandName) => {
  let t = kw.split(' ').map((w) => DISP[w] || w);
  let s = t.join(' ');
  const bn = brandName.replace(' (motor)', '');
  const re = new RegExp('\\b' + norm(bn).replace(/[&.]/g, '').replace(/\s+/g, '[ &]+') + '\\b', 'i');
  if (/r(ie|ei)se/i.test(bn)) s = s.replace(/riese[ &]+muller|riese[ &]+müller/i, 'Riese & Müller');
  else s = s.replace(re, bn);
  return cap(s);
};
const entries = [];
const brandDefs = brands.map((b) => ({ name: b, url: `/marques/${slug(b)}/`, dePath: `/marken/${slug(b)}`, type: 'brand', toks: norm(b).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter(Boolean).filter((x) => x !== 'und').map((x) => x), extra: '' }));
brandDefs.push({ name: 'Moteur Bosch', brandName: 'Bosch', url: '/marques/bosch/', dePath: '/marken/bosch', type: 'brand', toks: ['bosch'], extra: 'moteur|batterie|performance|line|cx|active|smart|system|kiox|nyon|purion|intuvia|gen|plus|cargo|speed|sx' });
brandDefs.push({ name: 'Shimano STEPS', brandName: 'Shimano', url: '/marques/shimano/', dePath: '/marken/shimano', type: 'brand', toks: ['shimano'], extra: 'steps|ep8|ep801|moteur|batterie|e6100|e7000|e8000' });
brandDefs.push({ name: 'Moteur Yamaha', brandName: 'Yamaha', url: '/marques/yamaha-motor/', dePath: '/marken/yamaha-motor', type: 'brand', toks: ['yamaha'], extra: 'moteur|batterie|pw|pwx|pw-x2|syncdrive' });
const otherBrandRe = (self) => new RegExp('\\b(' + brands.concat(['bosch', 'shimano', 'yamaha', 'nakamura', 'decathlon', 'lapierre', 'bianchi', 'canyon', 'fiido']).filter((b) => !self.toks.includes(norm(b).split(/[^a-z0-9]+/)[0])).map((b) => norm(b).replace(/[&]/g, ' ').trim().split(/\s+/)[0]).filter((x) => x && x !== 'und').join('|') + ')\\b', 'i');
for (const d of brandDefs) {
  const bn = d.brandName || d.name;
  const others = otherBrandRe(d);
  const extraRe = d.extra ? new RegExp('^(' + d.extra + ')$', 'i') : null;
  const toks = d.toks.map((t) => (t === 'et' ? 'muller' : t));
  const pool = bank.filter((r) => {
    if (GUARD.test(r.keyword) || (cfg.RETAIL && cfg.RETAIL.test(r.keyword)) || (cfg.JUNK && cfg.JUNK.test(r.keyword))) return false;
    if (used.has(nk(r.keyword))) return false;
    const k = norm(r.keyword); const tk = k.split(/[^a-z0-9]+/).filter(Boolean);
    if (new Set(tk).size !== tk.length) return false;
    if (BADTAIL.has(tk[tk.length - 1])) return false;
    if (!toks.every((t) => tk.includes(t))) return false;
    if (others.test(k.replace(new RegExp(toks.join('|'), 'g'), ' '))) return false;
    return tk.every((t) => toks.includes(t) || VOC.test(t) || (extraRe && extraRe.test(t)) || (/^riese$|^muller$|^et$/.test(t) && /riese/i.test(bn)));
  });
  let primary = null;
  const bestTC = pool.find((r) => r.intent === 'T') || pool.find((r) => r.intent === 'C');
  const bestN = pool.find((r) => r.intent === 'N');
  if (bestTC && bestN && bestN.volume >= bestTC.volume * 2 && bestN.volume >= 500) primary = bestN; else primary = bestTC || pool[0] || null;
  let source = 'bank';
  if (!primary) { primary = { keyword: norm(bn).replace(/&/g, ' ').replace(/\s+/g, ' ').trim() + ' velo electrique', intent: 'T', volume: 0, kd: null }; source = 'name'; }
  else used.add(nk(primary.keyword));
  const sec = [], faq = [];
  if (source === 'bank') {
    for (const r of pool) { if (sec.length >= 5) break; if (!used.has(nk(r.keyword)) && (r.intent === 'T' || r.intent === 'C')) { sec.push(r); used.add(nk(r.keyword)); } }
    for (const r of pool) { if (faq.length >= 5) break; if (!used.has(nk(r.keyword))) { faq.push(r); used.add(nk(r.keyword)); } }
  }
  const disp = source === 'name' ? (d.brandName || d.name).replace(/^Moteur /, '') + ' vélo électrique' : display(primary.keyword, bn);
  entries.push({ display: disp, url: d.url, dePath: d.dePath, name: d.name, type: 'brand', source, primary: { ...primary, source }, secondary: sec, faq });
}
// ---- accessory groups
const BIKE = '(v[ée]lo|vtt|vtc|bike|cycl)';
const ACC = [
  { url: '/accessoires/antivols/', de: 'schloesser', name: 'Antivols', rel: '(antivol|cadenas)', ex: '(moto|voiture|auto|maison|trott|scooter|serrure|casque|alarme)', display: null },
  { url: '/accessoires/casques/', de: 'helme', name: 'Casques', rel: '\\bcasques?\\b', ex: '(moto|ski|audio|bluetooth|cross|b[ée]b[ée]|airsoft|intercom|camera)', display: null },
  { url: '/accessoires/sacoches-paniers/', de: 'taschen-koerbe', name: 'Sacoches et paniers', rel: '(sacoche|panier|sac [àa] v[ée]lo)', ex: '(moto|bandouli|dos)', display: null },
  { url: '/accessoires/porte-bagages/', de: 'gepaecktraeger-anhaenger', name: 'Porte-bagages et remorques', rel: '(porte[ -]?bagages?|remorque|si[èe]ge (enfant|b[ée]b[ée]))', ex: '(voiture|auto|toit|attelage|hayon|caravane|moto)', display: null },
  { url: '/accessoires/garde-boues-bequilles/', de: 'schutzbleche-staender', name: 'Garde-boue et béquilles', rel: '(garde[ -]?boues?|b[ée]quilles?)', ex: '(moto|voiture|trott|scooter|enfant)', display: null },
  { url: '/accessoires/supports-telephone/', de: 'handyhalter', name: 'Supports de téléphone', rel: '(support|porte)[ -]?(t[ée]l[ée]phone|smartphone|portable|gps)', ex: '(moto|voiture|auto|bureau|table|ventilation)', display: null },
  { url: '/accessoires/outils-entretien/', de: 'werkzeug-pflege', name: 'Outils et entretien', rel: '(pompe|outil|kit (de )?r[ée]paration|nettoyant|lubrifiant|graisse|huile|d[ée]graissant|entretien)', ex: '(moto|voiture|auto|fourche|suspension|amortisseur|compresseur|piscine|jardin|bain)', display: null },
  { url: '/accessoires/pluie-vetements/', de: 'regenschutz-bekleidung', name: 'Pluie et vêtements', rel: '(pluie|imperm[ée]able|poncho|cape)', ex: '(moto|voiture|auto|housse de transport|b[ée]b[ée]|parapluie)', display: null },
  { url: '/accessoires/eclairage/', de: 'beleuchtung', name: 'Éclairage', rel: '([ée]clairage|lampe|phare|feu arri[èe]re|feu avant|catadioptre)', ex: '(moto|voiture|auto|casque|frontale|salon|jardin|led strip)', display: null },
  { url: '/accessoires/selles-guidons/', de: 'sattel-lenker', name: 'Selles, guidons et poignées', rel: '(selle|guidon|poign[ée]es?|tige de selle|sonnette)', ex: '(moto|cheval|voiture|trott|scooter|sacoche|sac |panier)', display: null },
  { url: '/accessoires/', de: null, name: 'Accessoires vélo électrique', rel: '(accessoire)', ex: '(moto|voiture|auto|trott|cuisine|coiffure|t[ée]l[ée]phone)', display: null },
];
for (const a of ACC) {
  const rel = new RegExp(a.rel, 'i'), ex = new RegExp(a.ex, 'i'), bike = new RegExp(BIKE, 'i');
  const pool = bank.filter((r) => rel.test(r.keyword) && !ex.test(r.keyword) && bike.test(r.keyword) && !GUARD.test(r.keyword) && !(cfg.RETAIL && cfg.RETAIL.test(r.keyword)) && !(cfg.JUNK && cfg.JUNK.test(r.keyword)) && !(plan.notSold && new RegExp(plan.notSold, 'i').test(r.keyword)) && !(plan.brands && new RegExp(plan.brands, 'i').test(r.keyword).valueOf() && !/(abus)/i.test(r.keyword)) && !used.has(nk(r.keyword)));
  const primary = pool.find((r) => r.intent === 'T') || pool.find((r) => r.intent === 'C') || pool[0] || null;
  if (primary) used.add(nk(primary.keyword));
  const sec = [], faq = [];
  for (const r of pool) { if (sec.length >= 5) break; if (!used.has(nk(r.keyword)) && (r.intent === 'T' || r.intent === 'C')) { sec.push(r); used.add(nk(r.keyword)); } }
  for (const r of pool) { if (faq.length >= 5) break; if (!used.has(nk(r.keyword))) { faq.push(r); used.add(nk(r.keyword)); } }
  const source = primary ? 'bank' : 'name';
  const prim = primary || { keyword: norm(a.name).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' velo', intent: 'T', volume: 0, kd: null };
  const dispAcc = primary ? display(primary.keyword, '') : a.name + ' vélo';
  entries.push({ display: dispAcc, url: a.url, dePath: a.de ? '/zubehoer/' + a.de : '/zubehoer', name: a.name, type: 'accessory', source, primary: { ...prim, source }, secondary: sec, faq });
}
for (const e of entries) { const i = live.pages.findIndex((x) => x.url === e.url); if (i >= 0) live.pages[i] = e; else live.pages.push(e); }
fs.writeFileSync(`data/keywords/${lang}-live.json`, JSON.stringify(live, null, 1));
for (const e of entries) console.log(e.type.padEnd(9), e.url.padEnd(38), e.source.padEnd(5), '|', e.display, '|', e.primary.keyword, e.primary.volume + '/' + e.primary.intent, '| S', e.secondary.length, 'F', e.faq.length);
