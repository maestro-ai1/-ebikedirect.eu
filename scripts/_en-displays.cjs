// English page headings carry the exact primary keyword (Golden Keyword Rule). Run after every regeneration of data/keywords/en-live.json.
const fs = require('fs');
const f = 'data/keywords/en-live.json'; const d = JSON.parse(fs.readFileSync(f, 'utf8'));
const n = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const SPECIAL = { 'riese and muller': 'Riese and Müller', 'riese & muller': 'Riese & Müller' };
const cap = (kw) => { if (SPECIAL[kw]) return SPECIAL[kw]; const w = kw.split(' ').map((x) => ({ emtb: 'eMTB', mtb: 'MTB', uk: 'UK', ktm: 'KTM', qio: 'QiO', abus: 'ABUS' }[x] || x)); return /^(eMTB|MTB|UK|KTM|QiO|ABUS)$/.test(w[0]) ? w.join(' ') : w.join(' ').replace(/^./, (c) => c.toUpperCase()); };
let c = 0; for (const p of d.pages) { if (!n(p.display).includes(n(p.primary.keyword))) { p.display = cap(p.primary.keyword); c++; } }
fs.writeFileSync(f, JSON.stringify(d, null, 1)); console.log('headings aligned to the primary keyword:', c);
