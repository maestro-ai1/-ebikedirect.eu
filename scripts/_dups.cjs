const p = require('../data/keywords/products.json').products;
const tk = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const m = new Map();
for (const [s, e] of Object.entries(p)) { const k = tk(e.brand + ' ' + e.name); (m.get(k) || m.set(k, []).get(k)).push(s + ' | ' + e.name); }
for (const v of m.values()) if (v.length > 1) console.log(v);
