// French model-family seed list (batch 3b): one Semrush search per brand + model family for the bikes that still use the product-name fallback in French.
// usage: node scripts/_fr-seeds.cjs   -> .image-work/fr-seeds.json (+ prints a summary)
const fs = require('fs');
const prods = require('../data/keywords/products.json').products;
const frp = require('../data/keywords/fr-products.json').products;
const strip = (s) => s.toLowerCase().normalize('NFC').replace(/ß/g, 'ss');
const tok = (s) => strip(s).replace(/[^a-z0-9äöü]+/g, ' ').trim().split(' ').filter(Boolean);
const GEN = new Set('e bike bikes ebike ebikes elektro pedelec kaufen preis plus gen wh zoll lowstep step through belt fully hardtail d'.split(' '));
const TWO = new Set(['hybrid', 'electric', 'x', 'fold', 'compact', 'city', 'urban', 'pro', 'sport', 'tour', 'trail', 'g', 'c']);
const BRAND_SEED = { 'Riese & Müller': 'riese et müller', 'Urban Arrow': 'urban arrow', 'QiO': 'qio' };
const fam = {};
for (const [slug, e] of Object.entries(prods)) {
  if (e.category === 'Zubehör') continue;
  if (frp[slug] && frp[slug].primary.source === 'bank') continue;
  const bt = new Set(tok(e.brand.replace('&', 'und')));
  const words = tok(e.name).filter((t) => !bt.has(t) && !GEN.has(t) && !/^\d+$/.test(t));
  const first = words[0]; if (!first) continue;
  const take = TWO.has(first) && words[1] ? [first, words[1]] : [first];
  const seed = `${BRAND_SEED[e.brand] || strip(e.brand)} ${take.join(' ')}`.replace(/\s+/g, ' ').trim();
  const f = (fam[e.brand] ||= {});
  const g = (f[seed] ||= { bikes: 0, ex: [], items: [] });
  g.bikes++; if (g.ex.length < 3) g.ex.push(e.name); g.items.push({ e, words });
}
for (const [brand, groups] of Object.entries(fam)) {
  for (const [seed, g] of Object.entries(groups)) {
    if (g.bikes < 15) continue;
    delete groups[seed];
    for (const { e, words } of g.items) {
      const deeper = words[1] === 'hybrid' && words[2] ? [words[0], 'hybrid', words[2]] : words[1] ? [words[0], words[1]] : [words[0]];
      const s2 = `${BRAND_SEED[e.brand] || strip(e.brand)} ${deeper.join(' ')}`.replace(/\s+/g, ' ').trim();
      const g2 = (groups[s2] ||= { bikes: 0, ex: [], items: [] });
      g2.bikes++; if (g2.ex.length < 3) g2.ex.push(e.name); g2.items.push({ e, words });
    }
  }
}
// brands with no French demand at all in the bank (QiO, Hercules, Husqvarna) are skipped
const SKIP = new Set(['QiO', 'Hercules', 'Husqvarna']);
const list = [];
for (const [brand, groups] of Object.entries(fam)) { if (SKIP.has(brand)) continue; for (const [seed, g] of Object.entries(groups)) list.push({ seed, brand, bikes: g.bikes, ex: g.ex }); }
list.sort((a, b) => b.bikes - a.bikes);
fs.writeFileSync('.image-work/fr-seeds.json', JSON.stringify(list, null, 1));
console.log('seeds', list.length, '| bikes covered', list.reduce((n, x) => n + x.bikes, 0), '| top:', list.slice(0, 12).map((x) => x.seed + ' (' + x.bikes + ')').join(', '));
