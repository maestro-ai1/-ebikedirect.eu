import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = 'https://ebikedirect.eu';
const prods = require('../data/keywords/products.json').products;
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+]+/g, ' ').trim(); // keep "+" so C7 and C7+ differ
const toks = (s) => norm(s).replace(/\+/g, ' plus ').split(/\s+/).filter(Boolean);
const decode = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
const strip = (h) => h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ');
const slugs = Object.keys(prods);
const rows = []; let i = 0;
async function w() { while (i < slugs.length) { const s = slugs[i++]; const e = prods[s]; let html = ''; try { html = await (await fetch(base + '/shop/' + s)).text(); } catch { continue; }
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const title = decode((html.match(/<title>([^<]*)/) || [])[1] || ''); const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const h1 = decode(strip((main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  const after = main.slice(Math.max(0, main.search(/<h1/))); const para = decode(strip(after).match(/<p[^>]*>([\s\S]{60,}?)<\/p>/)?.[1].replace(/<[^>]+>/g, ' ') || '').replace(/\s+/g, ' ').trim();
  const body = decode(strip(main).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  rows.push({ s, e, title, desc, h1, para, body }); } }
await Promise.all(Array.from({ length: 6 }, w));
console.log('products fetched', rows.length);
// exact duplicates (the plus sign counts)
const dup = (k) => { const m = new Map(); for (const r of rows) { const v = r[k].toLowerCase(); (m.get(v) || m.set(v, []).get(v)).push(r.s); } return [...m.values()].filter((v) => v.length > 1); };
console.log('exact duplicate titles:', dup('title').length, JSON.stringify(dup('title')).slice(0, 700));
console.log('exact duplicate descriptions:', dup('desc').length, '| exact duplicate H1:', dup('h1').length);
const para12 = new Map(); for (const r of rows) { const k = r.para.toLowerCase().split(' ').slice(0, 12).join(' '); (para12.get(k) || para12.set(k, []).get(k)).push(r.s); }
console.log('opening paragraphs shared by 2+ products (exact first 12 words):', [...para12.values()].filter((v) => v.length > 1).length, JSON.stringify([...para12.values()].filter((v) => v.length > 1)).slice(0, 500));
// same bike listed twice: identical sorted name tokens
const tk = new Map(); for (const r of rows) { const k = toks(r.e.name).sort().join(' '); (tk.get(k) || tk.set(k, []).get(k)).push(r.s); }
console.log('same name tokens, different slug (possible duplicate bikes):', JSON.stringify([...tk.values()].filter((v) => v.length > 1)));
// H1 and first paragraph against the main keyword, by token subset
let h1c = 0, h1t = 0, pc = 0, pt = 0, bank = 0; const missH1 = [];
for (const r of rows) { if (r.e.primary.source !== 'bank') continue; bank++; const kt = toks(r.e.primary.keyword).filter((t) => !['kaufen'].includes(t)); const h1n = norm(r.h1); if (norm(r.h1).includes(norm(r.e.primary.keyword))) h1c++; if (kt.every((t) => toks(r.h1).includes(t))) h1t++; else if (missH1.length < 8) missH1.push(`${r.h1} | ${r.e.primary.keyword}`); if (kt.every((t) => toks(r.para).includes(t))) pc++; }
console.log('bank-primary products:', bank, '| H1 contains the keyword phrase:', h1c, '| H1 contains every keyword word:', h1t, '| first paragraph contains every keyword word:', pc);
console.log('examples where the H1 lacks keyword words:\n  ' + missH1.join('\n  '));
// stock claims in the body
const stockBody = rows.filter((r) => /ab lager|sofort lieferbar|auf lager/i.test(r.body)).length;
const stockTitle = rows.filter((r) => /ab lager|sofort lieferbar/i.test(r.title + ' ' + r.desc)).length;
console.log('products with a stock claim in title/description:', stockTitle, '| in the page text:', stockBody, '| example title:', rows[0].title, '|', rows[0].desc.slice(0, 120));
const ex = rows.find((r) => /ab lager|sofort lieferbar|auf lager/i.test(r.body)); if (ex) { const m = ex.body.match(/.{70}(ab lager|sofort lieferbar|auf lager).{50}/i); console.log('body example:', m ? m[0] : ''); }
// Tenways first paragraph
const tw = rows.find((r) => /tenways/.test(r.s)); console.log('tenways example first paragraph:', tw.para.slice(0, 160), '| keyword:', tw.e.primary.keyword);
// accessory products
const xml = await (await fetch(base + '/sitemap.xml')).text();
const acc = [...xml.matchAll(/<loc>[^<]*\/shop\/([^<]+?)\/?<\/loc>/g)].map((m) => m[1]).filter((s) => !prods[s]);
const accRows = []; let j = 0;
async function w2() { while (j < acc.length) { const s = acc[j++]; const html = await (await fetch(base + '/shop/' + s)).text(); const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0]; const body = decode(strip(main).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' '); accRows.push({ s, words: body.split(' ').length, h2: (main.match(/<h2/g) || []).length, links: (main.match(/<a /g) || []).length }); } }
await Promise.all(Array.from({ length: 6 }, w2));
const ws = accRows.map((r) => r.words).sort((a, b) => a - b);
console.log('accessory product pages:', accRows.length, '| words min/median/max:', ws[0], ws[Math.floor(ws.length / 2)], ws[ws.length - 1], '| under 400 words:', accRows.filter((r) => r.words < 400).length, '| under 3 H2:', accRows.filter((r) => r.h2 < 3).length);

fs.writeFileSync('.image-work/gate-extra.json', JSON.stringify({
  products: rows.length,
  dupTitles: dup('title').length, dupDescs: dup('desc').length, dupH1: dup('h1').length,
  sharedOpening: [...para12.values()].filter((v) => v.length > 1).length,
  sameTokenPairs: [...tk.values()].filter((v) => v.length > 1),
  bankPrimary: bank, h1Phrase: h1c, h1Words: h1t, paraWords: pc,
  stockTitleDesc: stockTitle, stockBody: stockBody,
  accessory: { pages: accRows.length, minWords: ws[0], medianWords: ws[Math.floor(ws.length / 2)], maxWords: ws[ws.length - 1], under400: accRows.filter((r) => r.words < 400).length, under3h2: accRows.filter((r) => r.h2 < 3).length, noLinks: accRows.filter((r) => r.links < 20).length }
}));
console.log('saved .image-work/gate-extra.json');
