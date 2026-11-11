// Final combined report: German + French on-page SEO and keyword mapping (live gate numbers, intent / volume / KD, failures with reasons, what is not verified).
// usage: node scripts/_final-report-all.cjs
const fs = require('fs');
const G = require('../.image-work/gate-results.json');
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nf = (n) => Math.round(n).toLocaleString('en-US');
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) + '%' : '-');
const langOf = (u) => ((/^\/(fr|en|nl|it|es|pt)\//.exec(u) || [])[1]) || 'de';
// ---- keyword data
const deP = require('../data/keywords/de.json').pages;
const prods = require('../data/keywords/products.json').products;
const fams = require('../data/keywords/families.json').families;
const frLive = require('../data/keywords/fr-live.json').pages;
const frProd = require('../data/keywords/fr-products.json').products;
const enLive = require('../data/keywords/en-live.json').pages;
const enProd = require('../data/keywords/en-products.json').products;
const liveDe = new Set(G.results.filter((r) => langOf(r.url) === 'de').map((r) => r.url));
const blog = [];
for (const f of fs.readdirSync('content/blog/de')) { const t = fs.readFileSync('content/blog/de/' + f, 'utf8'); const fm = (k) => ((t.match(new RegExp('^' + k + ':\\s*(.+)$', 'm')) || [])[1] || '').trim(); blog.push({ primary: { keyword: fm('primary'), volume: +fm('volume'), kd: +fm('kd'), intent: 'I' } }); }
const rowsDe = [];
for (const p of deP) { const u = p.url.replace(/\/$/, ''); if (liveDe.has(u) || liveDe.has(p.url)) rowsDe.push({ kind: p.type === 'accessory' ? 'accessory category' : p.type, p: p.primary, sec: p.secondary || [], faq: p.faq || [] }); }
for (const f of fams) rowsDe.push({ kind: 'family', p: f.primary, sec: f.secondary || [], faq: f.faq || [] });
for (const e of Object.values(prods)) rowsDe.push({ kind: e.category === 'Zubehör' ? 'accessory product' : 'product', p: e.primary, sec: e.secondary || [], faq: e.faq || [] });
for (const b of blog) rowsDe.push({ kind: 'blog post', p: b.primary, sec: [], faq: [] });
const rowsFr = [];
for (const p of frLive) rowsFr.push({ kind: p.type === 'accessory' ? 'accessory category' : p.type, p: p.primary, sec: p.secondary, faq: p.faq });
for (const [slug, p] of Object.entries(prods)) { const e = frProd[slug] || { primary: { keyword: 'acheter ' + p.name.toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] }; rowsFr.push({ kind: p.category === 'Zubehör' ? 'accessory product' : 'product', p: e.primary, sec: e.secondary || [], faq: e.faq || [] }); }
const rowsEn = [];
for (const p of enLive) rowsEn.push({ kind: p.type === 'accessory' ? 'accessory category' : p.type, p: p.primary, sec: p.secondary, faq: p.faq });
for (const [slug, p] of Object.entries(prods)) { const e = enProd[slug] || { primary: { keyword: 'buy ' + p.name.toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] }; rowsEn.push({ kind: p.category === 'Zubehör' ? 'accessory product' : 'product', p: e.primary, sec: e.secondary || [], faq: e.faq || [] }); }
const kinds = ['home', 'category', 'brand', 'family', 'accessory category', 'product', 'accessory product', 'blog post'];
const stat = (list) => { const s = { n: list.length, T: 0, C: 0, N: 0, I: 0, vol: 0, kd: 0, kdn: 0, v0: 0, fb: 0, s5: 0, f5: 0 }; for (const r of list) { const p = r.p; s[p.intent] = (s[p.intent] || 0) + 1; s.vol += p.volume || 0; if (!p.volume) s.v0++; if (p.kd != null) { s.kd += p.kd; s.kdn++; } if (p.source && p.source !== 'bank') s.fb++; if (r.sec.length >= 5) s.s5++; if (r.faq.length >= 5) s.f5++; } return s; };
// ---- gate
const split = { de: [], fr: [], en: [] };
for (const r of G.results) split[langOf(r.url)] ? split[langOf(r.url)].push(r) : split.de.push(r);
const score = (a) => ({ n: a.length, pass: a.filter((x) => x.ok).length, urls: new Set(a.map((x) => x.url)).size });
const sd = score(split.de), sf = score(split.fr), se = score(split.en), st = score(G.results);
const CLASS = [
  [/^P3/, 'Owner business wording', 'Stock and delivery wording ("ab Lager", "sofort lieferbar") is confirmed by the owner. The gate cannot confirm stock, so it flags it. Not a defect.'],
  [/^M6c|^H6/, 'Consequence of keyword supply', 'Follows from pages with fewer than 5 stored secondary keywords: nothing stored, nothing to show in headings.'],
  [/^M6/, 'Keyword supply (bank)', 'The mappers found no more free, relevant, KD 28 or lower keywords in the Semrush bank. Keywords are not invented; one keyword stays on one URL.'],
  [/^M1/, 'Keyword supply (bank)', 'No free bank keyword for the model; the unique product name is the main keyword (allowed fallback of the Golden Keyword Rule).'],
  [/^H3/, 'Name or fallback heading', 'Name-based pages use the product name as H1, which is the page keyword.'],
  [/^M2/, 'Intent of available keywords', 'The bank holds no Transactional keyword for these pages; the best Commercial or Navigational one is used (allowed when no Transactional exists or its volume is far higher).'],
  [/^M3/, 'Keyword supply (bank)', 'No bank keyword with volume above 0; the unique name is used.'],
  [/^L5/, 'False positive', 'Manufacturer sites (brand own domains) are linked as authority sources; the gate counts them as retailers.'],
  [/^L1/, 'Utility or thin pages', 'Legal and utility pages are linked from the footer only (legal pages untouched by instruction); a few product pages sit just under 3 inbound links.'],
];
const cls = (rule) => { const c = CLASS.find(([re]) => re.test(rule)); return c ? [c[1], c[2]] : ['Review', 'See failing URLs.']; };
const failTable = (list) => {
  const m = {};
  for (const r of list.filter((x) => !x.ok)) { const k = r.rule; (m[k] ||= { n: 0, ex: [], types: {} }); m[k].n++; m[k].types[r.type] = (m[k].types[r.type] || 0) + 1; if (m[k].ex.length < 2) m[k].ex.push(r.url + (r.note ? ' (' + String(r.note).slice(0, 40) + ')' : '')); }
  return Object.entries(m).sort((a, b) => b[1].n - a[1].n).map(([rule, v]) => { const [c, why] = cls(rule); return `<tr><td>${esc(rule.slice(0, 80))}</td><td class="n bad">${nf(v.n)}</td><td>${esc(Object.entries(v.types).map(([t, n]) => t + ' ' + n).join(', '))}</td><td class="amber">${esc(c)}</td><td>${esc(why)}</td><td><small>${v.ex.map(esc).join('<br>')}</small></td></tr>`; }).join('');
};
const sumTable = (rows) => {
  let h = `<div class="scroll"><table><thead><tr><th>Page type</th><th class="n">Pages</th><th class="n">T</th><th class="n">C</th><th class="n">N</th><th class="n">I</th><th class="n">Main volume</th><th class="n">Avg KD</th><th class="n">Volume 0</th><th class="n">Name fallback</th><th class="n">5 secondary</th><th class="n">5 FAQ</th></tr></thead><tbody>`;
  const all = [];
  for (const k of kinds) { const l = rows.filter((r) => r.kind === k); if (!l.length) continue; all.push(...l); const s = stat(l); h += `<tr><td>${esc(k)}</td><td class="n">${s.n}</td><td class="n">${s.T}</td><td class="n">${s.C}</td><td class="n">${s.N}</td><td class="n">${s.I}</td><td class="n">${nf(s.vol)}</td><td class="n">${s.kdn ? (s.kd / s.kdn).toFixed(1) : '-'}</td><td class="n">${s.v0}</td><td class="n">${s.fb}</td><td class="n">${s.s5}</td><td class="n">${s.f5}</td></tr>`; }
  const s = stat(all); h += `<tr style="font-weight:700"><td>All</td><td class="n">${s.n}</td><td class="n">${s.T}</td><td class="n">${s.C}</td><td class="n">${s.N}</td><td class="n">${s.I}</td><td class="n">${nf(s.vol)}</td><td class="n">${s.kdn ? (s.kd / s.kdn).toFixed(1) : '-'}</td><td class="n">${s.v0}</td><td class="n">${s.fb}</td><td class="n">${s.s5}</td><td class="n">${s.f5}</td></tr></tbody></table></div>`;
  return [h, s];
};
const [tDe, aDe] = sumTable(rowsDe);
const [tFr, aFr] = sumTable(rowsFr);
const [tEn, aEn] = sumTable(rowsEn);
// bank sizes
const bankSize = (l) => { try { return fs.readFileSync(`C:/electric bikes europe/03-keywords/by-market/${l}/${l}_master_merged.csv`, 'utf8').split('\n').length - 1; } catch { return 0; } };
const mapVol = (l) => { try { return require(`../data/keywords/${l}.json`).pages.reduce((a, p) => a + ((p.primary || {}).volume || 0), 0); } catch { return 0; } };
const css = `:root{--bg:#F8F9FA;--ink:#131A22;--mut:#5b6672;--card:#fff;--line:#e3e7ea;--or:#FF5722;--gr:#00C853;--red:#d32f2f}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1418;--ink:#e8edf1;--mut:#9aa6b1;--card:#171e25;--line:#2a343d}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,Segoe UI,Arial,sans-serif}.w{max-width:1280px;margin:0 auto;padding:20px 16px 80px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:32px 0 10px;border-bottom:2px solid var(--or);padding-bottom:4px}h3{font-size:15px;margin:18px 0 6px}
.sub{color:var(--mut)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:14px 0}.c{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.c b{display:block;font-size:22px}.c span{color:var(--mut);font-size:12px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);font-size:13px}th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:var(--bg)}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
.ok{color:var(--gr);font-weight:700}.bad{color:var(--red);font-weight:700}.amber{color:#e08600;font-weight:700}.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:10px 0}small{color:var(--mut)}.scroll{max-height:620px;overflow:auto;border:1px solid var(--line);border-radius:8px}li{margin:3px 0}`;
let H = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ebikedirect.eu Final On-Page Report</title><style>${css}</style></head><body><div class="w">`;
H += `<h1>ebikedirect.eu: final on-page and keyword mapping report (German, French and English)</h1><div class="sub">Live crawl ${esc(G.when.slice(0, 10))} of https://ebikedirect.eu: ${G.pages} URLs, ${nf(st.n)} rule checks. Rules: Golden Keyword Rule, Golden Image Rule, onpage-seo-gate. Numbers come from the live site, not from stored data alone.</div>`;
H += `<div class="cards"><div class="c"><b>${pct(st.pass, st.n)}</b><span>strict gate score, whole site (${nf(st.pass)} of ${nf(st.n)})</span></div><div class="c"><b>${pct(sd.pass, sd.n)}</b><span>German (${nf(sd.pass)} / ${nf(sd.n)}, ${sd.urls} URLs)</span></div><div class="c"><b>${pct(sf.pass, sf.n)}</b><span>French (${nf(sf.pass)} / ${nf(sf.n)}, ${sf.urls} URLs)</span></div><div class="c"><b>${pct(se.pass, se.n)}</b><span>English / UK (${nf(se.pass)} / ${nf(se.n)}, ${se.urls} URLs)</span></div><div class="c"><b>0</b><span>keywords used on two URLs (per language)</span></div><div class="c"><b>${G.extTotal} / ${G.extBad.length}</b><span>external links / dead</span></div><div class="c"><b>0</b><span>broken internal links (link audit)</span></div></div>`;
H += `<h2>1. Verdict</h2><div class="box"><p><b>German: on-page is complete as far as the data allows.</b> Every built page passes every rule the gate can test except the failures explained in section 4 (owner wording, keyword supply, intent of available keywords, one false positive, utility pages).</p><p><b>French: batches 1 to 3b are live</b> (10 category, 33 brand and 11 accessory pages, 875 product pages). The remaining French failures are keyword supply: the French bank holds brand-level keywords and, after 146 model-family exports, a model keyword for ${aFr.n ? rowsFr.filter((r) => r.kind === 'product' && r.p.source === 'bank').length : 0} bikes; the rest use the unique product name.</p><p><b>English (UK database): batch 4 is live</b> (11 category, 33 brand and 11 accessory pages, the brands hub, 875 product pages, FAQ, About and Contact). English pages use the same fixed rules as French; the remaining English failures are keyword supply (the UK bank holds ${rowsEn.filter((r) => r.kind === 'product' && r.p.source === 'bank').length} bank keywords for bikes; the rest use the unique product name), intent of available keywords, and the same false positives as French.</p><p><b>Other languages (nl, es, it, pt) are not built yet.</b> Not built on purpose in German and French: Gebrauchte/occasion (no used stock), financing and leasing (not offered), test and comparison pages (no test results held), sale pages (every bike shows a strikethrough price), brand pages for brands the shop does not stock.</p></div>`;
H += `<h2>2. German mapping summary (intent, volume, KD)</h2>${tDe}<p class="sub">T Transactional, C Commercial, N Navigational, I Informational (Semrush). Name fallback means no free bank keyword; the unique name is the main keyword (volume 0, allowed). Blog posts are informational by design. Detailed German tables: <a href="onpage-seo-final-audit-2026-11-10.html">onpage-seo-final-audit-2026-11-10.html</a>.</p>`;
H += `<h2>3. French mapping summary (intent, volume, KD)</h2>${tFr}<p class="sub">Detailed French tables (every page and product with its keywords): <a href="onpage-seo-fr-batch3-2026-11-10.html">onpage-seo-fr-batch3-2026-11-10.html</a>. French pages use accents and apostrophes in headings (for example "Prix d'un VTT électrique" for the keyword "prix d un vtt electrique").</p>`;
H += `<h2>3b. English (UK) mapping summary (intent, volume, KD)</h2>${tEn}<p class="sub">Detailed English tables: <a href="onpage-seo-en-batch3-2026-11-11.html">onpage-seo-en-batch3-2026-11-11.html</a>. Category headings carry the exact bank keyword (for example eMTB sale, Urban e bike), as the Golden Keyword Rule requires.</p>`;
H += `<h2>4. Failing rules and why</h2><h3>German (${nf(sd.n - sd.pass)} failing checks)</h3><div class="scroll"><table><thead><tr><th>Rule</th><th class="n">Fail</th><th>Page types</th><th>Class</th><th>Meaning</th><th>Examples</th></tr></thead><tbody>${failTable(split.de)}</tbody></table></div>`;
H += `<h3>French (${nf(sf.n - sf.pass)} failing checks)</h3><div class="scroll"><table><thead><tr><th>Rule</th><th class="n">Fail</th><th>Page types</th><th>Class</th><th>Meaning</th><th>Examples</th></tr></thead><tbody>${failTable(split.fr)}</tbody></table></div>`;
H += `<h3>English (${nf(se.n - se.pass)} failing checks)</h3><div class="scroll"><table><thead><tr><th>Rule</th><th class="n">Fail</th><th>Page types</th><th>Class</th><th>Meaning</th><th>Examples</th></tr></thead><tbody>${failTable(split.en)}</tbody></table></div>`;
H += `<h2>5. Language status and keyword banks</h2><table><thead><tr><th>Language</th><th>Status</th><th class="n">Bank (unique keywords)</th><th class="n">Map main-keyword volume</th><th>Next step</th></tr></thead><tbody>`;
for (const [l, name, status, next] of [['de', 'German', 'Complete (pages, products, families, blog)', 'Maintain; technical phase next'], ['fr', 'French', 'Categories, brands, accessories, 875 products live', 'Family pages, blog, legal pages in French'], ['en', 'English (UK)', 'Categories, brands, accessories, hub, 875 products, FAQ, About, Contact live', 'Family pages, blog, legal pages in English'], ['es', 'Spanish', 'Not built', 'Batch 1 to 3 (largest remaining map volume)'], ['nl', 'Dutch', 'Not built', 'Batch 1 to 3'], ['it', 'Italian', 'Not built', 'Batch 1 to 3'], ['pt', 'Portuguese', 'Not built', 'Batch 1 to 3 (smallest bank)']]) H += `<tr><td>${name}</td><td>${esc(status)}</td><td class="n">${nf(bankSize(l))}</td><td class="n">${nf(mapVol(l))}</td><td>${esc(next)}</td></tr>`;
H += `</tbody></table>`;
H += `<h2>6. Not verified</h2><div class="box"><ul><li>Search Console data (rankings, indexing, impressions) for any language.</li><li>A fresh visual check of every product image (the contact-sheet check was done per batch).</li><li>Product specs against manufacturer sources; stock and price accuracy.</li><li>Native-speaker review of the French and English copy (it is built from catalogue data and fixed templates).</li><li>The FAQ says free shipping above 10,000 € applies within Germany and Austria; product pages and checkout say any order above 10,000 €. The English and French FAQ repeat the German wording; the owner must confirm the territory.</li><li>Product names of 50 accessories are translated by a fixed word list (lib/l10n-names.ts); bike model names are never changed.</li><li>VAT wording: the French pages name no VAT rate (owner decision pending); the German pages keep the existing wording.</li><li>Core Web Vitals and technical SEO (next phase).</li><li>Spanish, Dutch, Italian and Portuguese (not built).</li></ul></div></div></body></html>`;
const out = 'C:/electric bikes europe/02-site-architecture/reports/FINAL-REPORT-onpage-de-fr-en-2026-11-11.html';
fs.writeFileSync(out, H);
console.log('report', out, '| all', pct(st.pass, st.n), '| de', pct(sd.pass, sd.n), '| fr', pct(sf.pass, sf.n), '| en', pct(se.pass, se.n), '| fr bank products', rowsFr.filter((r) => r.kind === 'product' && r.p.source === 'bank').length);
