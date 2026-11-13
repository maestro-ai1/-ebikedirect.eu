// Fills missing secondary keywords (to 5) of the English brand / category / accessory / hub pages from the REFRESHED UK bank only:
// Transactional or Commercial, KD <= 28 (<= 30 for volume >= 1000), volume >= 10, relevant to the page, not used by any other page or product (one keyword = one URL).
// Also swaps a page's primary for a relevant Transactional keyword that has at least half of its volume (Golden Keyword Rule), moving the old primary to the secondaries.
// usage: node scripts/_pages-secondaries.cjs [--dry]
const fs = require('fs');
const dry = process.argv.includes('--dry');
const root = 'C:/electric bikes europe';
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const plan = require('./_lang-plan-en.cjs');
const GUARD = new RegExp(plan.guard, 'i');
const GUARD_ACC = new RegExp(plan.guard.split('|').filter((x) => x !== '\\bkit\\b').join('|'), 'i'); // kits (repair, cleaning, tool) are sold in the accessory groups
const bank = [];
for (const l of fs.readFileSync(root + '/03-keywords/by-market/uk/uk_master_merged.csv', 'utf8').split(/\r?\n/).slice(1)) {
  if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); if (!REF.has(k)) continue;
  const kd = p[3] === '' ? null : +p[3]; const v = +p[2] || 0; const i = IT(p[1]);
  if (kd === null || !/^(T|C)$/.test(i) || kd > (v >= 1000 ? 30 : 28)) continue;
  if (/(motorcycle|scooter|quad|go kart|\bcar\b|dirt|helmet|boots|decathlon|halfords|tesco|argos|asda|amazon|near me|smyths|currys|second hand|used|jobs|manual|review)/.test(k)) continue;
  bank.push({ keyword: k, intent: i, volume: v, kd, g1: GUARD.test(k), g2: GUARD_ACC.test(k) });
}
bank.sort((a, b) => b.volume - a.volume);
const file = 'data/keywords/en-live.json';
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const prods = JSON.parse(fs.readFileSync('data/keywords/en-products.json', 'utf8')).products;
const used = new Set();
for (const p of d.pages) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
for (const e of Object.values(prods)) for (const k of [e.primary, ...e.secondary, ...e.faq]) if (k) used.add(nk(k.keyword));
const brandToks = [...new Set(Object.values(prods).map((e) => e.brand).flatMap((b) => norm(b).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter((t) => t.length > 2 && t !== 'and' && t !== 'und')).concat(['trek', 'giant', 'bosch', 'shimano', 'yamaha', 'brompton']))];
const BIKE = /\b(bike|bikes|bicycle|bicycles|cycle|cycles|ebike|ebikes|e bike|e bikes|pedelec|pedelecs)\b/;
const MAN = {
  '/electric-bikes/speed-pedelecs/': (k) => /(speed pedelec|pedelec|45 ?km|45kmh|fast (e|electric)|28 ?mph|s pedelec|speed (e|electric)|class 3)/.test(k),
  '/electric-bikes/kids-e-bikes/': (k) => /(kids?|child|childs|children|junior|teen|teenage|youth)/.test(k) && BIKE.test(k) && /(electric|e bike|ebike)/.test(k),
  '/accessories/racks-trailers/': (k) => /(rack|trailer|child seat|pannier|carrier|luggage)/.test(k) && (BIKE.test(k) || /pannier/.test(k)) && !/(roof|car|van|tow|hitch|boot|motorbike|motorcycle|wall|storage)/.test(k),
  '/accessories/phone-holders/': (k) => /(phone|mobile)/.test(k) && /(holder|mount)/.test(k),
  '/accessories/tools-care/': (k) => /(repair|puncture|tool|lube|wax|clean|maintenance|pump)/.test(k) && BIKE.test(k),
  '/brands/': (k) => /(brands?|manufacturers?|makers?|companies|makes)/.test(k) && BIKE.test(k),
};
const stop = new Set(['and', 'und', 'bike', 'bikes', 'ebikes', 'e', 'motor', 'motors', 'steps', 'plus', 'pro']);
const brandRel = (name) => { const t = norm(name).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter((x) => x && !stop.has(x)); return { t, fn: (k) => { const n = norm(k); return t.every((x) => new RegExp('\\b' + x + '\\b').test(n)); } }; };
const log = [];
for (const p of d.pages) {
  const isBrand = p.type === 'brand'; let rel, own = [];
  if (MAN[p.url]) rel = MAN[p.url];
  else if (isBrand) { const b = brandRel(p.name); rel = b.fn; own = b.t; }
  else continue;
  const other = brandToks.filter((b) => !own.includes(b));
  const oth = other.length ? new RegExp('\\b(' + other.join('|') + ')\\b') : /$^/;
  const isAcc = p.url.startsWith('/accessories/');
  const cand = bank.filter((b) => !/(gravel|cyclocross|road|bmx)/.test(b.keyword) && !(isAcc ? b.g2 : b.g1) && rel(b.keyword) && !oth.test(norm(b.keyword)) && !used.has(nk(b.keyword)));
  // primary swap: a relevant T keyword with >= half the volume of a non-T primary
  if (p.primary && p.primary.intent !== 'T') {
    const t = cand.find((b) => b.intent === 'T' && b.volume * 2 >= p.primary.volume);
    if (t && !(p.url === '/electric-bikes/kids-e-bikes/')) {
      const old = p.primary; p.primary = { keyword: t.keyword, intent: 'T', volume: t.volume, kd: t.kd, source: 'bank' }; used.add(nk(t.keyword));
      if (/^(T|C)$/.test(old.intent) && old.kd !== null && old.kd <= 28) p.secondary.unshift({ keyword: old.keyword, intent: old.intent, volume: old.volume, kd: old.kd });
      log.push(`${p.url}: primary ${old.keyword} (${old.intent} ${old.volume}) -> ${t.keyword} (T ${t.volume})`);
    }
  }
  let added = 0;
  // tier 1: volume >= 10; tier 2 (brand pages only, when still short): refreshed T/C keywords with volume 0 that Semrush still classifies
  for (const c of cand.filter((x) => x.volume >= 10)) { if (p.secondary.length >= 5) break; if (used.has(nk(c.keyword))) continue; p.secondary.push({ keyword: c.keyword, intent: c.intent, volume: c.volume, kd: c.kd }); used.add(nk(c.keyword)); added++; }
  p.secondary = p.secondary.slice(0, 5);
  if (isBrand && p.secondary.length < 5) { for (const c of cand.filter((x) => x.volume < 10)) { if (p.secondary.length >= 5) break; if (used.has(nk(c.keyword))) continue; p.secondary.push({ keyword: c.keyword, intent: c.intent, volume: c.volume, kd: c.kd }); used.add(nk(c.keyword)); added++; log.push('   (zero-volume tier) ' + p.url + ' + ' + c.keyword); } }
  if (added || p.secondary.length < 5) log.push(`${p.url}: +${added} secondaries -> ${p.secondary.length} ${p.secondary.length < 5 ? '(STILL SHORT, need more Semrush data)' : ''}`);
}
console.log(log.join('\n'));
if (!dry) { fs.copyFileSync(file, 'data/keywords/en-live.pre-pages-secondaries.json'); fs.writeFileSync(file, JSON.stringify(d, null, 1)); console.log('written'); }
