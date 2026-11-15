// Candidates for the English products that still use the product name as main keyword: the cleaned model name (no Wh, inch, motor words) in three searchable forms.
// Skips keywords already refreshed. usage: node scripts/_cands-names.cjs  -> .image-work/en-cands-names.json (chunks of 100)
const fs = require('fs');
const REF = new Set(JSON.parse(fs.readFileSync('C:/electric bikes europe/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const D = require('../data/keywords/en-products.json').products;
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, ' and ').replace(/\+/g, ' plus ');
const DROP = /^(wh|zoll|inch|inches|pouces|\d{3}|\d{4}|27\.5|27|28|29|26|24|20|16|und|mit)$/;
const out = []; const seen = new Set();
const add = (k) => { k = k.replace(/\s+/g, ' ').trim(); if (k.length < 6 || k.length > 70 || REF.has(k) || seen.has(k)) return; seen.add(k); out.push(k); };
for (const e of Object.values(D)) {
  if (e.primary.source !== 'name' || e.category === 'Zubehör') continue;
  const brand = norm(e.brand).replace(/[^a-z0-9 ]+/g, ' ').trim();
  const toks = norm(e.name).replace(/[^a-z0-9. ]+/g, ' ').split(' ').filter(Boolean).filter((t) => !DROP.test(t));
  const clean = toks.join(' ');
  if (!clean.startsWith(brand.split(' ')[0])) add(`${brand} ${clean}`); else add(clean);
  add(clean + ' e bike'); add(clean + ' price');
  const short = toks.slice(0, Math.min(toks.length, 4)).join(' ');
  if (short !== clean) { add(short); add(short + ' e bike'); }
}
const chunks = []; for (let i = 0; i < out.length; i += 100) chunks.push(out.slice(i, i + 100));
fs.writeFileSync('.image-work/en-cands-names.json', JSON.stringify({ chunks }));
console.log('candidates', out.length, 'chunks', chunks.length, '| sample:', out.slice(0, 6).join(' ; '));
