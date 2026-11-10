// Maps the 50 accessory products to bank keywords (Golden Keyword Rule: 1 primary + up to 5 secondary + up to 5 FAQ, one keyword = one URL).
// Only keywords that really describe the product are used: brand + product type, or a clean generic type phrase (no other brand, no other bike type, no unrelated words).
// Products with nothing relevant keep the unique product-name fallback.
// usage: node scripts/_acc-list.cjs && node scripts/_acc-map.cjs [--write]   (--write adds the entries to data/keywords/products.json)
const fs = require('fs');
const acc = JSON.parse(fs.readFileSync('.image-work/acc-list.json', 'utf8')).filter((a) => a.category === 'Zubehör');
const nrm = (s) => s.toLowerCase().normalize('NFC');
const nk = (s) => nrm(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const used = new Set();
const add = (k) => { if (k) used.add(nk(k)); };
for (const p of require('../data/keywords/de.json').pages) { add(p.primary && p.primary.keyword); (p.secondary || []).forEach((s) => add(s.keyword)); (p.faq || []).forEach((s) => add(s.keyword)); }
const prodJson = require('../data/keywords/products.json').products;
for (const [slug, p] of Object.entries(prodJson)) { if (p.category === 'Zubehör') continue; add(p.primary.keyword); p.secondary.forEach((s) => add(s.keyword)); p.faq.forEach((s) => add(s.keyword)); }
for (const p of require('../data/keywords/families.json').families) { add(p.primary && p.primary.keyword); (p.secondary || []).forEach((s) => add(s.keyword)); (p.faq || []).forEach((s) => add(s.keyword)); }
for (const f of fs.readdirSync('content/blog/de')) { const t = fs.readFileSync('content/blog/de/' + f, 'utf8'); const m = t.match(/^primary:\s*(.+)$/m); if (m) add(m[1].trim()); }
const bank = [];
for (const l of fs.readFileSync('../03-keywords/by-market/de/de_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const vol = +p[2] || 0;
  if (kd === null || kd > 28 || vol < 10) continue;
  bank.push({ k: nrm(p[0]), intent: IT(p[1]), vol, kd });
}
// product type -> exact words of that type
const TYPES = [
  ['kettenschloss', ['kettenschloss', 'kettenschlösser']], ['rahmenschloss', ['rahmenschloss', 'rahmenschlösser']], ['faltschloss', ['faltschloss', 'faltschlösser']],
  ['handyhalterung', ['handyhalterung', 'handyhalter', 'handyhalterungen']], ['helm', ['helm', 'fahrradhelm', 'fahrradhelme', 'helme']],
  ['luftpumpe', ['akkupumpe', 'luftpumpe', 'fahrradpumpe', 'fahrradpumpen']], ['gepaecktasche', ['gepäcktasche', 'gepäcktaschen', 'gepäckträgertasche', 'gepäckträgertaschen']],
  ['huefttasche', ['hüfttasche', 'hüfttaschen', 'bauchtasche']], ['regenschutz', ['regenschutz', 'regenverdeck']], ['kindersitz', ['kindersitz', 'kindersitze']],
  ['gepaecktraeger', ['gepäckträger', 'frontgepäckträger']], ['schutzblech', ['schutzblech', 'schutzbleche']], ['seitenstaender', ['seitenständer', 'fahrradständer']],
  ['minipumpe', ['minipumpe', 'minipumpen', 'handpumpe']], ['multitool', ['multitool', 'fahrradwerkzeug']], ['reparaturset', ['flickzeug', 'reparaturset', 'pannenset']],
  ['satteltasche', ['satteltasche', 'satteltaschen']], ['klingel', ['fahrradklingel', 'fahrradklingeln', 'klingel', 'klingeln']],
];
const NAMETYPE = [['kettenschloss', 'kettenschloss'], ['rahmenschloss', 'rahmenschloss'], ['faltschloss', 'faltschloss'], ['handyhalterung', 'handyhalterung'], ['smart helm', 'helm'], ['elektrische luftpumpe', 'luftpumpe'], ['minipumpe', 'minipumpe'],
  ['gepäcktasche', 'gepaecktasche'], ['hüfttasche', 'huefttasche'], ['regenschutz', 'regenschutz'], ['kindersitz', 'kindersitz'], ['gepäckträger', 'gepaecktraeger'], ['schutzblech', 'schutzblech'], ['seitenständer', 'seitenstaender'],
  ['multitool', 'multitool'], ['flickzeug', 'reparaturset'], ['reparaturset', 'reparaturset'], ['satteltasche', 'satteltasche'], ['klingel', 'klingel']];
const typeFor = (name) => { const n = nrm(name); const hit = NAMETYPE.find(([w]) => n.includes(w)); return hit ? TYPES.find((t) => t[0] === hit[1]) : null; };
const MOD = new Set(['elektro', 'elektrisch', 'elektrische', 'elektrisches', 'akku', 'fahrrad', 'fahrräder', 'e', 'bike', 'bikes', 'ebike', 'ebikes', 'pedelec', 'kaufen', 'günstig', 'set', 'hinten', 'vorne', 'hinterrad', 'vorderrad', 'für', 'mit', 'und', 'am', 'zum']);
const BAN = /(reifen|einsteck|universal|ladekopf|test|erfahrung|anleitung|reparier|reparatur|schlüssel|nachbestell|ersatz|selber|bauen|diy|gebraucht|kinder|mtb|mountainbike|gravel|rennrad|schuh|damen|herren|rad werkzeug)/;
const slugNums = (name) => new Set(nrm(name).split(/[^a-z0-9äöüß]+/).filter((w) => /\d/.test(w)));
const claimed = new Set();
const free = (b) => !used.has(nk(b.k)) && !claimed.has(nk(b.k));
const entry = (b) => ({ keyword: b.k, volume: b.vol, kd: b.kd, intent: b.intent });
const out = {}; const rep = [];
for (const a of acc) {
  const brand = nrm(a.brand); const brandToks = brand.split(/[- ]+/);
  const ty = typeFor(a.name);
  const nums = slugNums(a.name);
  const clean = (b, requireBrand) => {
    if (!(ty && ty[0] === 'luftpumpe') && /(akku|elektr)/.test(b.k)) return false;
    if (/hinten|hinterrad/.test(nrm(a.name)) && /(vorne|vorderrad|front)/.test(b.k)) return false;
    if (/(vorne|front)/.test(nrm(a.name)) && /(hinten|hinterrad)/.test(b.k)) return false;
    if (!/(hinten|hinterrad|vorne|vorderrad|front)/.test(nrm(a.name)) && /(hinten|hinterrad|vorne|vorderrad|front)/.test(b.k)) return false;
    if (!nrm(a.name).includes('kette') && /kette/.test(b.k)) return false;
    if (BAN.test(b.k) || /[^a-z0-9äöüß .-]/.test(b.k)) return false;
    const toks = b.k.split(/[^a-zäöüß0-9]+/).filter(Boolean);
    if (toks.some((t) => /\d/.test(t) && !nums.has(t))) return false;
    if (!toks.length || !toks.some((t) => ty && ty[1].includes(t))) return false;
    return toks.every((t) => MOD.has(t) || (ty && ty[1].includes(t)) || brandToks.includes(t) || (requireBrand && !/^\d/.test(t) && true) && false);
  };
  const hasBrand = (b) => brandToks.every((t) => b.k.includes(t));
  let pool = [];
  if (ty) {
    const typeWord = (b) => b.k.split(/[^a-zäöüß0-9]+/).some((t) => ty[1].includes(t) || ty[1].some((w) => t.endsWith(w)));
    const brandC = bank.filter((b) => free(b) && hasBrand(b) && typeWord(b) && (nrm(a.name).includes('kette') || !/kette/.test(b.k.replace(/kettenschloss/g, ''))) && !BAN.test(b.k) && !b.k.split(/[^a-z0-9äöüß]+/).some((t) => /\d/.test(t) && !nums.has(t))).sort((x, y) => y.vol - x.vol);
    const genC = bank.filter((b) => free(b) && !hasBrand(b) && clean(b)).sort((x, y) => y.vol - x.vol);
    pool = [...brandC, ...genC];
  }
  const tc = pool.filter((b) => b.intent === 'T' || b.intent === 'C');
  const pr0 = tc.find((b) => hasBrand(b)) || tc[0];
  let primary, secondary = [], faq = [];
  if (pr0) {
    claimed.add(nk(pr0.k)); primary = { ...entry(pr0), source: 'bank' };
    const rest = pool.filter((b) => b !== pr0 && !claimed.has(nk(b.k)));
    const sec = rest.filter((b) => b.intent === 'T' || b.intent === 'C').slice(0, 5); sec.forEach((b) => claimed.add(nk(b.k)));
    const fq = rest.filter((b) => !sec.includes(b) && !claimed.has(nk(b.k))).slice(0, 5); fq.forEach((b) => claimed.add(nk(b.k)));
    secondary = sec.map(entry); faq = fq.map(entry);
  } else primary = { keyword: nrm(a.name) + ' kaufen', volume: 0, kd: null, intent: 'T', source: 'name' };
  out[a.slug] = { name: a.name, brand: a.brand, category: 'Zubehör', primary, secondary, faq };
  rep.push(a.slug + ' | ' + primary.source + ' | ' + primary.keyword + ' (' + primary.volume + '/' + primary.intent + ') | sec ' + secondary.length + ' [' + secondary.map((s) => s.keyword).join('; ') + '] | faq ' + faq.length);
}
rep.forEach((r) => console.log(r));
const nb = Object.values(out).filter((o) => o.primary.source === 'bank').length;
console.log('accessories', acc.length, '| bank primary', nb, '| name fallback', acc.length - nb, '| with 5 secondary', Object.values(out).filter((o) => o.secondary.length >= 5).length, '| with 5 faq', Object.values(out).filter((o) => o.faq.length >= 5).length);
if (process.argv.includes('--write')) {
  const file = 'data/keywords/products.json'; const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [s, e] of Object.entries(out)) j.products[s] = e;
  fs.writeFileSync(file, JSON.stringify(j, null, 2)); console.log('written to', file);
}
