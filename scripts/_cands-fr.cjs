// Candidate keywords for the French products (Semrush Keyword Overview bulk, db=fr, chunks of 100). Same logic as the English generator.
//  1. accessory types with buying templates  2. model families of products that still use the product name as main keyword (brand + 1-3 model words x plain / velo electrique / prix)
// Skips keywords already refreshed (03-keywords/by-market/fr/fr_refreshed_keys.json when present).   usage: node scripts/_cands-fr.cjs -> .image-work/fr-cands.json
const fs = require('fs');
const root = 'C:/electric bikes europe';
const rf = root + '/03-keywords/by-market/fr/fr_refreshed_keys.json';
const REF = new Set(fs.existsSync(rf) ? JSON.parse(fs.readFileSync(rf, 'utf8')) : []);
const prods = require('../data/keywords/fr-products.json').products;
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' ').replace(/\+/g, ' plus ');
const toks = (s) => norm(s).split(/[^a-z0-9.]+/).filter(Boolean);
const DROP = /^(wh|zoll|inch|pouces|\d{3,4}|27\.5|27|28|29|26|24|20|16|fe|gen|mit|und|et)$/;
const out = []; const add = (k) => { k = k.replace(/\s+/g, ' ').trim(); if (k.length > 5 && k.length < 80 && !REF.has(k) && !out.includes(k)) out.push(k); };
const types = ['antivol velo', 'antivol velo electrique', 'antivol pliant', 'antivol chaine velo', 'antivol u velo', 'antivol abus', 'cadenas velo', 'casque velo', 'casque velo electrique', 'casque velo ville', 'casque velo femme', 'casque velo enfant', 'pompe velo', 'pompe a velo', 'pompe velo electrique', 'eclairage velo', 'phare velo', 'feu arriere velo', 'lumiere velo', 'sacoche velo', 'sacoche velo electrique', 'sacoche porte bagages', 'panier velo', 'panier velo avant', 'porte bagage velo', 'porte bagages velo electrique', 'remorque velo', 'remorque velo enfant', 'garde boue velo', 'garde boue velo electrique', 'bequille velo', 'bequille velo electrique', 'support telephone velo', 'support smartphone velo', 'kit reparation velo', 'kit crevaison velo', 'outil velo', 'multi outils velo', 'huile chaine velo', 'lubrifiant velo', 'nettoyant velo', 'poncho velo', 'veste pluie velo', 'cape de pluie velo', 'selle velo', 'selle velo confortable', 'siege enfant velo', 'siege bebe velo', 'sonnette velo', 'sonnette velo electrique', 'housse de pluie velo', 'chargeur velo electrique', 'batterie velo electrique', 'moteur velo electrique'];
for (const t of types) { add(t); add(t + ' pas cher'); add('acheter ' + t); add(t + ' prix'); }
const fam = new Map();
for (const e of Object.values(prods)) {
  if (e.primary.source !== 'name' || e.category === 'Zubehör') continue;
  const brand = toks(e.brand).filter((x) => x !== 'and' && x !== 'et');
  const model = toks(e.name).filter((t) => !brand.includes(t) && !DROP.test(t));
  if (!model.length) continue;
  const key = brand.join(' ') + '|' + model.slice(0, 2).join(' ');
  const f = fam.get(key) || { b: brand.join(' '), m2: model.slice(0, 2).join(' '), m3s: new Set(), n: 0 };
  f.n++; f.m3s.add(model.slice(0, 3).join(' ')); fam.set(key, f);
}
for (const f of [...fam.values()].sort((a, b) => b.n - a.n)) {
  add(`${f.b} ${f.m2}`); add(`${f.b} ${f.m2} velo electrique`); add(`${f.b} ${f.m2} prix`);
  for (const m3 of f.m3s) { if (m3 !== f.m2) { add(`${f.b} ${m3}`); add(`${f.b} ${m3} prix`); } }
}
const chunks = []; for (let i = 0; i < out.length; i += 100) chunks.push(out.slice(i, i + 100));
fs.writeFileSync('.image-work/fr-cands.json', JSON.stringify({ chunks }));
console.log('candidates', out.length, 'chunks', chunks.length, 'families', fam.size, '| sample', out.slice(60, 66).join(' ; '));
