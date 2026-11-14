// Candidate keywords for the English products. Chunks of 100 for Semrush Bulk Analysis + Update metrics, most valuable first:
//  1. accessory types (locks, pumps, helmets, lights, bags, racks ...) with buying templates
//  2. model families of bikes that still use the product name as main keyword, biggest family first (brand + 2 or 3 model words x plain / e bike / price)
// Keywords already refreshed are skipped.   usage: node scripts/_cands-products.cjs
const fs = require('fs');
const root = 'C:/electric bikes europe';
const REF = new Set(JSON.parse(fs.readFileSync(root + '/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const prods = require('../data/keywords/en-products.json').products;
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' ').replace(/\+/g, ' plus ');
const toks = (s) => norm(s).split(/[^a-z0-9.]+/).filter(Boolean);
const DROP = /^(wh|zoll|inch|pouces|\d{3,4}|27\.5|27|28|29|26|24|20|16|fe|gen|mit|und)$/;
const out = [];
const add = (k) => { if (k.length < 80 && !REF.has(k) && !out.includes(k)) out.push(k); };
// 1. accessory types
const types = ['bike lock', 'bicycle lock', 'ebike lock', 'e bike lock', 'folding lock', 'folding bike lock', 'chain lock', 'bike chain lock', 'frame lock', 'bike frame lock', 'd lock', 'abus lock', 'abus bike lock', 'bike helmet', 'ebike helmet', 'e bike helmet', 'electric bike helmet', 'smart bike helmet', 'cycle helmet', 'bike light', 'bike lights', 'ebike lights', 'bicycle light', 'front bike light', 'rear bike light', 'bike bell', 'bicycle bell', 'saddle bag', 'bike saddle bag', 'pannier bag', 'bike pannier bag', 'bike basket', 'bicycle basket', 'bike mudguards', 'bicycle mudguards', 'mudguard set', 'bike kickstand', 'bike side stand', 'child bike seat', 'bike pump', 'electric bike pump', 'electric air pump', 'portable bike pump', 'mini bike pump', 'bike puncture repair kit', 'bike repair kit', 'bike chain wax', 'bike chain lube', 'bike cleaning kit', 'bike chain cleaner', 'bike brush set', 'bike foam cleaner', 'bike hip bag', 'bike waist bag', 'bike phone mount', 'bike phone holder', 'bike vibration dampener', 'rain cover for bike', 'cargo bike rain cover', 'bike handlebar mount', 'bike stem mount', 'bike patch kit', 'bike tyre repair', 'bike charging port cover'];
for (const t of types) { add(t); add(t + ' for sale'); add('buy ' + t); add(t + ' uk'); }
// 2. bike families, biggest first
const fam = new Map();
for (const e of Object.values(prods)) {
  if (e.primary.source !== 'name' || e.category === 'Zubehör') continue;
  const brand = toks(e.brand).filter((x) => x !== 'and');
  const model = toks(e.name).filter((t) => !brand.includes(t) && !DROP.test(t) && t !== 'and');
  if (!model.length) continue;
  const key = brand.join(' ') + '|' + model.slice(0, 2).join(' ');
  const f = fam.get(key) || { b: brand.join(' '), m2: model.slice(0, 2).join(' '), m3s: new Set(), n: 0 };
  f.n++; f.m3s.add(model.slice(0, 3).join(' ')); fam.set(key, f);
}
for (const f of [...fam.values()].sort((a, b) => b.n - a.n)) {
  for (const m of new Set([f.m2, ...f.m3s])) { add(`${f.b} ${m}`); add(`${f.b} ${m} e bike`); add(`${f.b} ${m} price`); }
}
const chunks = []; for (let i = 0; i < out.length; i += 100) chunks.push(out.slice(i, i + 100));
fs.writeFileSync('.image-work/en-cands-products.json', JSON.stringify({ chunks }));
console.log('candidates', out.length, 'chunks', chunks.length, '| accessory-type candidates first');
