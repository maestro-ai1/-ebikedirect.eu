// keywords that should not carry a product page: "used", "test/review" style words, past model years, colours
const prods = require('../data/keywords/products.json').products;
const de = require('../data/keywords/de.json').pages;
const tok = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const BAD = new Set('test tests testbericht review reviews bewertung bewertungen erfahrung erfahrungen idealo specs spec datenblatt gebraucht used kaufberatung ersatzteile anleitung bedienungsanleitung handbuch pdf youtube video forum'.split(' '));
const bad = (k) => { const t = tok(k); const w = t.filter((x) => BAD.has(x)); const y = t.filter((x) => /^20\d\d$/.test(x) && +x <= 2025); return [...w, ...y]; };
const out = { primary: [], secondary: [], faq: [] };
for (const [s, e] of Object.entries(prods)) {
  const b = bad(e.primary.keyword); if (b.length && e.primary.source === 'bank') out.primary.push([e.name, e.primary.keyword, e.primary.volume, b.join(',')]);
  for (const k of e.secondary || []) { const x = bad(k.keyword); if (x.length) out.secondary.push([e.name, k.keyword, k.volume, x.join(',')]); }
  for (const k of e.faq || []) { const x = bad(k.keyword); if (x.length) out.faq.push([e.name, k.keyword, k.volume, x.join(',')]); }
}
const pages = Array.isArray(de) ? de : Object.values(de);
const pg = [];
for (const p of pages) { for (const [kind, k] of [['primary', p.primary], ...(p.secondary || []).map((k) => ['secondary', k])]) { if (!k) continue; const x = bad(k.keyword); if (x.length) pg.push([p.url, kind, k.keyword, x.join(',')]); } }
console.log('bike MAIN keywords with a used/test/review word or a year up to 2025:', out.primary.length);
for (const r of out.primary) console.log('  ', r.join(' | '));
console.log('bike SECONDARY keywords (T/C) with such a word:', out.secondary.length);
for (const r of out.secondary.slice(0, 12)) console.log('  ', r.join(' | '));
console.log('bike FAQ keywords with such a word:', out.faq.length, '(informational questions, usually fine; "gebraucht" and years need a look)');
console.log('page-level (home/category/brand/accessory) keywords with such a word:', pg.length); for (const r of pg.slice(0, 10)) console.log('  ', r.join(' | '));
