// Gives every English product 5 secondary keywords from a pool shared inside its model family (owner decision 2026-11-13).
// Pool = REFRESHED UK bank rows, Transactional/Commercial, KD <= 28 (<= 30 at volume >= 1000), volume >= 10, never the MAIN keyword of any page or product.
// STRICT TOKEN WHITELIST: every word of a secondary must be the brand, a word of this product's own name, a generic buying/bike word,
// or a word of the product's own category (accessory: its own type). So "cube kids bike" or "specialized turbo levo" can never land on another model.
// Tiers: A brand + own model word, B brand only (brand-level), C category/type only (no brand).
// usage: node scripts/_product-secondaries.cjs [--dry]   PEEK=slug,slug prints samples.
const fs = require('fs');
const dry = process.argv.includes('--dry');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' ');
const toks = (s) => norm(s).split(/[^a-z0-9.]+/).filter(Boolean);
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const plan = require('./_lang-plan-en.cjs');
const GUARD = new RegExp(plan.guard, 'i');
// accessories: same guard but without the accessory-word group (lock, pump, light ...) and without kit, which are the accessory types themselves
const GUARD_ACC = new RegExp(plan.guard.slice(0, plan.guard.indexOf('|\\b(stem|')).replace('|\\bkit\\b|\\bkits\\b', '') + ')', 'i');
const BADX = /(motorcycle|scooter|quad|go kart|\bcar\b|dirt|motorbike|biker|boots|decathlon|halfords|tesco|argos|asda|amazon|near me|smyths|currys|second hand|used|jobs|manual|review|cyclocross|bmx)/;
const GENERIC = new Set('bike bikes e ebike ebikes electric bicycle bicycles cycle cycles for sale price prices buy uk deals deal shop dealer online best cheap new pedelec pedelecs sales store a the with in of and'.split(' '));
const CATW = { 'E-MTB': 'mountain mtb emtb full suspension hardtail'.split(' '), 'E-Trekking': 'trekking touring long distance'.split(' '), 'E-City': 'city commuter urban commuting'.split(' '), 'Speed-Pedelec': 'speed 45 km h kmh mph fast'.split(' '), 'Cargo-E-Bike': 'cargo family load'.split(' '), 'Falt-E-Bike': 'folding fold compact'.split(' '), 'E-Gravel': 'gravel'.split(' '), 'E-Kinder': 'kids kid children child childs junior teen teens teenage youth'.split(' ') };
const ALLCATW = new Set(Object.values(CATW).flat());
const ACCT = [[/lock|schloss/i, 'lock locks|folding chain frame'], [/pump|luftpumpe/i, 'pump pumps|air'], [/phone|handy/i, 'phone|mobile holder mount'], [/light|licht/i, 'light lights lamp|'], [/helm|helmet/i, 'helmet|'], [/bag|tasche/i, 'bag bags pannier panniers basket|'], [/rack|gep.cktr/i, 'rack carrier|luggage'], [/mudguard|schutzblech/i, 'mudguard mudguards fender|'], [/bell|klingel/i, 'bell|'], [/seat|sitz/i, 'seat|child'], [/clean|lube|wax|oil|reinig|schmier|ketten/i, 'cleaning clean lube lubricant wax degreaser oil|chain'], [/repair|flick|panne/i, 'repair puncture patch|kit tyre'], [/stand|st.nder/i, 'stand kickstand|']];
const bank = [];
for (const l of fs.readFileSync(root + '/03-keywords/by-market/uk/uk_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); if (!REF.has(k)) continue;
  const kd = p[3] === '' ? null : +p[3]; const v = +p[2] || 0; const i = IT(p[1]);
  if (kd === null || v < 10 || !/^(T|C|I)$/.test(i) || kd > (v >= 1000 ? 30 : 28) || BADX.test(k)) continue;
  bank.push({ keyword: k, intent: i, volume: v, kd, t: toks(k), g1: GUARD.test(k), g2: GUARD_ACC.test(k) });
}
bank.sort((a, b) => b.volume - a.volume);
const pf = 'data/keywords/en-products.json';
const D = JSON.parse(fs.readFileSync(pf, 'utf8'));
const live = require('../data/keywords/en-live.json').pages;
const mains = new Set(); for (const p of live) mains.add(nk(p.primary.keyword)); for (const e of Object.values(D.products)) mains.add(nk(e.primary.keyword));
let faqShort = 0;
const report = { short: [], full: 0 }; const cache = new Map();
for (const [slug, e] of Object.entries(D.products)) {
  const isAcc = e.category === 'Zubehör';
  const brand = toks(e.brand).filter((t) => t !== 'and');
  const nameT = new Set(toks(e.name));
  const distinct = [...nameT].filter((t) => !brand.includes(t) && !GENERIC.has(t) && !/^\d/.test(t) && !/^(wh|zoll|inch|pouces|hybrid|turbo|sport|pro|comp|plus|race|hpc|slx|evo|elite|expert|team|one|sl|ex|st|advance|fe|gen|premium|performance|exc|slt|tm|at)$/.test(t) && t.length > 2);
  const accSpec = isAcc ? ((ACCT.find(([re]) => re.test(e.name.toLowerCase().replace(e.brand.toLowerCase(), ''))) || [, '|'])[1]).split('|') : ['', ''];
  const fam = brand.join(' ') + '|' + distinct.slice(0, 2).join(' ') + '|' + e.category + '|' + accSpec[0];
  if (!cache.has(fam)) {
    const mainW = new Set(isAcc ? accSpec[0].split(' ').filter(Boolean) : []);
    const catw = new Set(isAcc ? [...accSpec[0].split(' '), ...accSpec[1].split(' ')].filter(Boolean) : (CATW[e.category] || []));
    const allowedBrand = new Set([...brand, ...GENERIC, ...catw]);
    const ownModel = new Set(distinct.slice(0, 2));
    const okTok = (t, withName) => allowedBrand.has(t) || (withName && ownModel.has(t)) || (withName && /^\d+(\.\d+)?$/.test(t) && nameT.has(t));
    const common = (b) => !(isAcc ? b.g2 : b.g1) && !mains.has(nk(b.keyword)) && !b.t.some((t) => ALLCATW.has(t) && !catw.has(t));
    const hasBrand = (b) => brand.every((x) => b.t.includes(x));
    const A = bank.filter((b) => common(b) && hasBrand(b) && b.t.some((t) => ownModel.has(t)) && b.t.every((t) => okTok(t, true)));
    const BIKEW = /^(bike|bikes|bicycle|bicycles|cycle|cycles|ebike|ebikes|e|electric|pedelec|pedelecs)$/;
    const B = bank.filter((b) => common(b) && hasBrand(b) && !b.t.some((t) => ownModel.has(t)) && b.t.every((t) => okTok(t, false)) && (isAcc ? b.t.some((t) => mainW.has(t)) : b.t.some((t) => BIKEW.test(t))));
    const C = bank.filter((b) => common(b) && !brand.some((x) => b.t.includes(x)) && b.t.every((t) => GENERIC.has(t) || catw.has(t)) && (isAcc ? (b.t.some((t) => mainW.has(t)) && !b.t.some((t) => /^(e|ebike|ebikes|electric|pedelec|pedelecs)$/.test(t))) : (b.t.some((t) => catw.has(t)) && b.t.some((t) => /^(e|ebike|ebikes|electric|emtb|pedelec|pedelecs)$/.test(t)))));
    const seen = new Set(); const pool = [];
    for (const arr of [A, B, C]) for (const b of arr) { const k = nk(b.keyword); if (seen.has(k)) continue; seen.add(k); pool.push({ keyword: b.keyword, intent: b.intent, volume: b.volume, kd: b.kd }); }
    cache.set(fam, pool);
  }
  const poolAll = cache.get(fam);
  const poolTC = poolAll.filter((k) => k.intent === 'T' || k.intent === 'C');
  e.secondary = poolTC.slice(0, 5);
  const secK = new Set(e.secondary.map((k) => k.keyword));
  const brandFirst = (k) => !brand.some((x) => k.keyword.split(" ").includes(x)) || k.keyword.startsWith(brand[0] + " ");
  e.faq = poolAll.filter((k) => !secK.has(k.keyword) && brandFirst(k)).slice(0, 5);
  if (e.faq.length < 5) faqShort++;
  if (e.secondary.length >= 5) report.full++; else report.short.push(slug + ' ' + e.secondary.length);
}
console.log('FAQ keywords short (<5):', faqShort);
console.log('products', Object.keys(D.products).length, '| with 5 secondaries', report.full, '| short', report.short.length, '| families', cache.size);
for (const s of (process.env.PEEK || '').split(',').filter(Boolean)) { const e = D.products[s]; if (e) console.log(s, '|', e.primary.keyword, '=>', e.secondary.map((k) => k.keyword + ' ' + k.intent + k.volume).join('; ')); }
if (!dry) { fs.copyFileSync(pf, 'data/keywords/en-products.pre-secondaries.json'); fs.writeFileSync(pf, JSON.stringify(D, null, 1)); console.log('written'); }
