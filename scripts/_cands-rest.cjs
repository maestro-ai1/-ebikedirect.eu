// Remaining candidates not yet refreshed: unfinished bike-family chunks + extra accessory types the secondary pool lacks (racks, stands, multitool, rain cover, foam sprayer ...).
const fs = require('fs');
const REF = new Set(JSON.parse(fs.readFileSync('C:/electric bikes europe/03-keywords/by-market/uk/uk_refreshed_keys.json', 'utf8')));
const old = require('../.image-work/en-cands-products.json').chunks.flat();
const types = ['bike rack', 'bicycle rack', 'rear bike rack', 'bike luggage rack', 'ebike rack', 'rear pannier rack', 'front bike rack', 'bike carrier', 'bike side stand', 'bike kickstand', 'bicycle kickstand', 'bike stand', 'bike multitool', 'bike multi tool', 'bicycle multi tool', 'bike tool kit', 'bike foam sprayer', 'bike wash', 'bike cleaner', 'bike degreaser', 'bike chain lube', 'dry chain lube', 'wet chain lube', 'bike puncture patch kit', 'bike tyre patch kit', 'puncture repair kit', 'co2 bike inflator', 'bike rain cover', 'bike cover', 'cargo bike cover', 'bike waterproof charging', 'bike phone case', 'bike mount for phone', 'bike light set', 'usb bike light', 'bike reflective lights', 'folding helmet', 'kids bike helmet', 'child bike seat rear', 'bike child seat'];
const out = [];
const add = (k) => { k = k.toLowerCase(); if (!REF.has(k) && !out.includes(k)) out.push(k); };
for (const k of old) add(k);
for (const t of types) { add(t); add(t + ' for sale'); add('buy ' + t); add(t + ' uk'); }
const chunks = []; for (let i = 0; i < out.length; i += 100) chunks.push(out.slice(i, i + 100));
fs.writeFileSync('.image-work/en-cands-rest.json', JSON.stringify({ chunks }));
console.log('candidates', out.length, 'chunks', chunks.map((c) => c.length).join(','));
