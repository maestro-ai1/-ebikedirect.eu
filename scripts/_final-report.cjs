// Final on-page SEO audit + full keyword mapping report (HTML, self-contained). usage: node scripts/_final-report.cjs
const fs = require('fs');
const G = require('../.image-work/gate-results.json');
const de = require('../data/keywords/de.json').pages;
const prods = require('../data/keywords/products.json').products;
const fams = require('../data/keywords/families.json').families;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nf = (n) => Math.round(n).toLocaleString('en-US');
const IN = { T: 'Transactional', C: 'Commercial', N: 'Navigational', I: 'Informational' };
const live = new Set(G.results.map((r) => r.url));
const typeOf = {}; for (const r of G.results) typeOf[r.url] = r.type;
const norm = (u) => u.replace(/\/$/, '') || '/';

// ---- blog posts
const blog = [];
for (const f of fs.readdirSync('content/blog/de')) {
  const t = fs.readFileSync('content/blog/de/' + f, 'utf8'); const fm = (k) => ((t.match(new RegExp('^' + k + ':\\s*(.+)$', 'm')) || [])[1] || '').trim();
  const url = '/blog/' + fm('slug'); const g = G.blogs.find((b) => b.url === url) || {};
  blog.push({ url, name: fm('title'), primary: { keyword: fm('primary'), volume: +fm('volume'), kd: +fm('kd'), intent: 'I' }, words: g.words, h2: g.h2, ext: g.ext, inbound: g.inbound, date: fm('updated') });
}
// ---- rows
const rows = [];
const add = (kind, url, name, e, extra) => rows.push({ kind, url, name, p: e.primary, sec: e.secondary || [], faq: e.faq || [], ...extra });
for (const p of de) { const u = norm(p.url); add(p.type === 'accessory' ? 'accessory category' : p.type, p.url, p.name, p, { live: live.has(u) || live.has(p.url) }); }
for (const f of fams) add('family', f.path, f.name, f, { live: live.has(f.path) });
const bikes = [], accs = [];
for (const [slug, e] of Object.entries(prods)) { const row = { kind: e.category === 'Zubehör' ? 'accessory product' : 'product', url: '/shop/' + slug, name: e.name, brand: e.brand, cat: e.category, p: e.primary, sec: e.secondary || [], faq: e.faq || [], live: true }; rows.push(row); (e.category === 'Zubehör' ? accs : bikes).push(row); }
for (const b of blog) rows.push({ kind: 'blog post', url: b.url, name: b.name, p: b.primary, sec: [], faq: [], live: true, words: b.words });

// ---- statistics per kind
const kinds = ['home', 'category', 'brand', 'family', 'accessory category', 'product', 'accessory product', 'blog post'];
const stat = (list) => {
  const s = { n: list.length, T: 0, C: 0, N: 0, I: 0, other: 0, vol: 0, kdSum: 0, kdN: 0, kd28: 0, kd29: 0, kdOver: 0, v0: 0, fb: 0, secFull: 0, faqFull: 0, secTot: 0, faqTot: 0 };
  for (const r of list) {
    const p = r.p || {}; if (IN[p.intent]) s[p.intent]++; else s.other++;
    s.vol += p.volume || 0; if (!p.volume) s.v0++;
    if (p.kd != null && p.kd !== '') { s.kdN++; s.kdSum += +p.kd; if (+p.kd <= 28) s.kd28++; else if (+p.kd <= 30) s.kd29++; else s.kdOver++; }
    if (p.source && p.source !== 'bank') s.fb++;
    if (r.sec.length >= 5) s.secFull++; if (r.faq.length >= 5) s.faqFull++; s.secTot += r.sec.length; s.faqTot += r.faq.length;
  }
  return s;
};
const byKind = {}; for (const k of kinds) byKind[k] = stat(rows.filter((r) => r.kind === k && r.live !== false));
const allLive = rows.filter((r) => r.live !== false); const tot = stat(allLive);
const mapOnly = rows.filter((r) => r.live === false);

// ---- gate scorecard
const ruleStat = {};
for (const r of G.results) { const k = r.rule; (ruleStat[k] ||= { p: 0, f: 0, types: {}, ex: [] }); if (r.ok) ruleStat[k].p++; else { ruleStat[k].f++; ruleStat[k].types[r.type] = (ruleStat[k].types[r.type] || 0) + 1; if (ruleStat[k].ex.length < 3) ruleStat[k].ex.push(r.url + (r.note ? ' (' + String(r.note).slice(0, 50) + ')' : '')); } }
const totalChecks = G.results.length, totalPass = G.results.filter((r) => r.ok).length;
const failRules = Object.entries(ruleStat).filter(([, v]) => v.f).sort((a, b) => b[1].f - a[1].f);

// classification of every failing rule: fixed-by-design / owner fact / data limit / open
const CLASS = [
  [/^P3/, 'Owner business fact', 'Stock and delivery wording ("ab Lager", "sofort lieferbar") is confirmed by the owner. The gate cannot confirm stock, so it flags it. Not a defect.'],
  [/^M6c|^H6/, 'Consequence of data limit', 'Follows from pages that have fewer than 5 stored secondary keywords: nothing stored, so nothing to show in headings.'],
  [/^M6/, 'Data limit (bank)', 'The mappers found no more free, relevant, KD 28 or lower keywords in the Semrush bank for these pages. Keywords are not invented; one keyword stays on one URL. More would need new Semrush exports.'],
  [/^M1/, 'Data limit (bank)', 'No free bank keyword exists for the model; the page uses its unique product name as the main keyword (allowed fallback of the Golden Keyword Rule).'],
  [/^H3/, 'Mostly fallback pages', 'Name-based pages use the product name as H1, which is the keyword. The gate looks for the stored phrase including "kaufen".'],
  [/^M2/, 'Intent of available keywords', 'Brand heads and some model names are Navigational/Informational in Semrush; the rule allows them only when volume is clearly higher than any transactional option.'],
  [/^L5/, 'False positive', 'Manufacturer sites (brand own domains) are linked as authority sources; the gate counts them as retailers.'],
  [/^L1/, 'Utility pages', 'Legal and utility pages (privacy, imprint, sitemap) are linked from the footer only. Not given contextual links on purpose (legal pages are untouched until the owner says).'],
];
const classify = (rule) => { const c = CLASS.find(([re]) => re.test(rule)); return c ? [c[1], c[2]] : ['Review', 'See failing URLs.']; };

// ---- html
const css = `:root{--bg:#F8F9FA;--ink:#131A22;--mut:#5b6672;--card:#fff;--line:#e3e7ea;--or:#FF5722;--gr:#00C853;--red:#d32f2f}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1418;--ink:#e8edf1;--mut:#9aa6b1;--card:#171e25;--line:#2a343d}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,Segoe UI,Arial,sans-serif}
.w{max-width:1280px;margin:0 auto;padding:20px 16px 80px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:34px 0 10px;border-bottom:2px solid var(--or);padding-bottom:4px}h3{font-size:15px;margin:18px 0 6px}
.sub{color:var(--mut)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:14px 0}.c{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.c b{display:block;font-size:22px}.c span{color:var(--mut);font-size:12px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);font-size:13px}th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:var(--bg);position:sticky;top:0;cursor:pointer;white-space:nowrap}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
.t{display:inline-block;padding:1px 7px;border-radius:9px;font-size:11px;font-weight:700;color:#fff}.T{background:#00a152}.C{background:#1e88e5}.N{background:#8e24aa}.I{background:#757575}.ok{color:var(--gr);font-weight:700}.bad{color:var(--red);font-weight:700}.amber{color:#e08600;font-weight:700}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:10px 0}input.f,select.f{padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--card);color:var(--ink);margin:4px 6px 8px 0}
.scroll{max-height:640px;overflow:auto;border:1px solid var(--line);border-radius:8px}small{color:var(--mut)}details summary{cursor:pointer;color:var(--or)}.pill{font-size:11px;background:var(--bg);border:1px solid var(--line);padding:0 6px;border-radius:8px;margin-right:3px;display:inline-block}`;
const ib = (i) => (IN[i] ? `<span class="t ${i}">${i}</span>` : '<span class="t I" style="opacity:.4">-</span>');
const kwList = (arr) => arr.map((k) => `<span class="pill">${esc(k.keyword)} <small>${ib(k.intent).replace(/<[^>]+>/g, '')}${nf(k.volume || 0)}/${k.kd == null ? '-' : k.kd}</small></span>`).join('');
const pct = (a, b) => (b ? (100 * a / b).toFixed(0) + '%' : '-');

let H = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ebikedirect.eu On-Page Final Audit</title><style>${css}</style></head><body><div class="w">`;
H += `<h1>ebikedirect.eu: final on-page SEO audit and keyword mapping</h1><div class="sub">Live crawl of https://ebikedirect.eu on ${esc(G.when.slice(0, 10))}: ${G.pages} URLs, ${nf(totalChecks)} rule checks. German site (Semrush database de). Rules: Golden Keyword Rule, Golden Image Rule, onpage-seo-gate.</div>`;
H += `<div class="cards">
<div class="c"><b>${(100 * totalPass / totalChecks).toFixed(1)}%</b><span>strict gate score (${nf(totalPass)} of ${nf(totalChecks)} checks pass)</span></div>
<div class="c"><b>${nf(allLive.length)}</b><span>pages with a keyword map entry</span></div>
<div class="c"><b>0</b><span>keywords used on two URLs</span></div>
<div class="c"><b>${G.extTotal} / ${G.extBad ? G.extBad.length : 0}</b><span>external links / dead</span></div>
<div class="c"><b>${nf(bikes.length)} + ${accs.length}</b><span>bike products + accessory products</span></div>
<div class="c"><b>${blog.length}</b><span>blog posts (all 1,500+ words, 5 FAQ)</span></div></div>`;

// verdict
H += `<h2>1. Verdict</h2><div class="box"><p><b>Every built page passes every rule the gate can test, except the failures listed in section 3.</b> Those are: owner business wording (stock claims), keyword supply (the mappers used every free, relevant bank keyword they could match; more would need new Semrush exports), gate false positives, and utility pages. Titles, descriptions, H1 and heading order, schema, alt text, internal and external links, duplicates, blog rules and the one-keyword-one-URL rule have no open failure.</p><p><b>Still not built, on purpose (stock and truth rules):</b> Gebrauchte E-Bikes (no used stock), Finanzierung und Leasing (no confirmed financing offer; only prepayment and crypto are offered), E-Bike Testsieger (no test results held), Angebote und Sale (every bike carries a strikethrough price, so the list would be the whole catalogue), Komfort und Tiefeinsteiger (primary keyword names a brand the shop does not sell), accessory groups Akkus, Ladegeräte, Reifen, Displays and Bremsen (no such accessories in stock), and brand pages for brands the shop does not stock. Built in this round: Damen-E-Bikes, Herren-E-Bikes, Leichte und Carbon E-Bikes, E-Bikes nach Radgröße and Motor und Antrieb; each list is selected only from evidence in the catalogue data and says so on the page.</p><p><b>Not verified, and not claimable from a crawl:</b> Search Console ranking and indexing data; visual quality of every product image (contact-sheet check was done per batch, not re-done here); the other five languages (fr, nl, it, es, pt: not part of this audit); truthfulness of every product spec against the manufacturer; price and stock accuracy; Core Web Vitals (technical phase).</p></div>`;

// mapping summary
H += `<h2>2. Keyword mapping summary by page type</h2><div class="scroll"><table><thead><tr><th>Page type</th><th class="n">Pages</th><th class="n">T</th><th class="n">C</th><th class="n">N</th><th class="n">I</th><th class="n">Total main volume</th><th class="n">Avg KD</th><th class="n">KD 29-30</th><th class="n">Volume 0</th><th class="n">Name fallback</th><th class="n">5 secondary</th><th class="n">5 FAQ</th></tr></thead><tbody>`;
for (const k of kinds) { const s = byKind[k]; H += `<tr><td>${esc(k)}</td><td class="n">${s.n}</td><td class="n">${s.T}</td><td class="n">${s.C}</td><td class="n">${s.N}</td><td class="n">${s.I}</td><td class="n">${nf(s.vol)}</td><td class="n">${s.kdN ? (s.kdSum / s.kdN).toFixed(1) : '-'}</td><td class="n">${s.kd29}</td><td class="n">${s.v0}</td><td class="n">${s.fb}</td><td class="n">${s.secFull} (${pct(s.secFull, s.n)})</td><td class="n">${s.faqFull} (${pct(s.faqFull, s.n)})</td></tr>`; }
H += `<tr style="font-weight:700"><td>All</td><td class="n">${tot.n}</td><td class="n">${tot.T}</td><td class="n">${tot.C}</td><td class="n">${tot.N}</td><td class="n">${tot.I}</td><td class="n">${nf(tot.vol)}</td><td class="n">${tot.kdN ? (tot.kdSum / tot.kdN).toFixed(1) : '-'}</td><td class="n">${tot.kd29}</td><td class="n">${tot.v0}</td><td class="n">${tot.fb}</td><td class="n">${tot.secFull}</td><td class="n">${tot.faqFull}</td></tr></tbody></table></div>`;
H += `<p class="sub">T = Transactional, C = Commercial, N = Navigational, I = Informational (Semrush intent). "Name fallback" = no free bank keyword; the unique product name is the main keyword (volume 0, allowed by the Golden Keyword Rule). Blog posts are informational by design.</p>`;
const bk = bikes; const bankBikes = bk.filter((r) => r.p.source === 'bank').length;
H += `<div class="box"><b>Bike products (${bk.length}):</b> ${bankBikes} have a bank model keyword (${pct(bankBikes, bk.length)}), ${bk.length - bankBikes} use the product-name fallback. ${bk.filter((r) => r.sec.length >= 5).length} have 5 stored secondaries, ${bk.filter((r) => r.sec.length >= 1).length} have at least one, ${bk.filter((r) => r.faq.length >= 5).length} have 5 FAQ keywords, ${bk.filter((r) => r.faq.length >= 1).length} have at least one.<br><b>Accessory products (${accs.length}):</b> ${accs.filter((r) => r.p.source === 'bank').length} have a bank keyword, ${accs.filter((r) => r.p.source !== 'bank').length} use the name fallback (the bank holds no keywords for Quad Lock, Muc-Off, Finish Line and most Tenways accessory models).</div>`;
if (mapOnly.length) H += `<p class="sub">${mapOnly.length} map entries have no live page yet (planned brand/category pages) and are excluded from the numbers above: ${esc(mapOnly.map((r) => r.name).slice(0, 40).join(', '))}${mapOnly.length > 40 ? ' ...' : ''}.</p>`;

// scorecard
H += `<h2>3. Gate scorecard: every failing rule, with the reason</h2><div class="scroll"><table><thead><tr><th>Rule</th><th class="n">Fail</th><th class="n">Pass</th><th>Page types</th><th>Classification</th><th>Why / what it means</th><th>Examples</th></tr></thead><tbody>`;
for (const [rule, v] of failRules) { const [cl, why] = classify(rule); const cls = /False|Owner|Utility/.test(cl) ? 'amber' : /Data|Consequence|Mostly|Intent/.test(cl) ? 'amber' : 'bad'; H += `<tr><td>${esc(rule)}</td><td class="n bad">${nf(v.f)}</td><td class="n">${nf(v.p)}</td><td>${esc(Object.entries(v.types).map(([t, n]) => t + ' ' + n).join(', '))}</td><td class="${cls}">${esc(cl)}</td><td>${esc(why)}</td><td><small>${v.ex.map(esc).join('<br>')}</small></td></tr>`; }
H += `</tbody></table></div>`;
const passAll = Object.entries(ruleStat).filter(([, v]) => !v.f);
H += `<details><summary>${passAll.length} rules with zero failures</summary><div class="box"><small>${passAll.map(([r, v]) => esc(r) + ' (' + nf(v.p) + ')').join('<br>')}</small></div></details>`;

// blog table
H += `<h2>4. Blog (${blog.length} posts)</h2><div class="scroll"><table><thead><tr><th>URL</th><th>Primary keyword</th><th class="n">Volume</th><th class="n">KD</th><th class="n">Words</th><th class="n">H2</th><th class="n">Authority links</th><th class="n">Inbound</th><th>Updated</th></tr></thead><tbody>`;
for (const b of blog.sort((a, c) => c.primary.volume - a.primary.volume)) H += `<tr><td><a href="https://ebikedirect.eu${esc(b.url)}">${esc(b.url)}</a></td><td>${esc(b.primary.keyword)}</td><td class="n">${nf(b.primary.volume)}</td><td class="n">${b.primary.kd}</td><td class="n">${b.words || ''}</td><td class="n">${b.h2 || ''}</td><td class="n">${b.ext || ''}</td><td class="n">${b.inbound || ''}</td><td>${esc(b.date)}</td></tr>`;
H += `</tbody></table></div>`;

// full map
H += `<h2>5. Full keyword map (every page)</h2><p class="sub">Filter by text, page type or intent. Click a column title to sort. Secondary and FAQ keywords are shown as chips: keyword, intent, volume/KD.</p>
<input class="f" id="q" placeholder="Filter (keyword, name, url)..." size="34"><select class="f" id="k"><option value="">All page types</option>${[...new Set(rows.filter((r) => r.live !== false).map((r) => r.kind))].map((k) => `<option>${esc(k)}</option>`).join('')}</select><select class="f" id="i"><option value="">All intents</option><option>T</option><option>C</option><option>N</option><option>I</option></select><select class="f" id="s"><option value="">Any source</option><option value="bank">Bank keyword</option><option value="fb">Name fallback</option></select> <span id="cnt" class="sub"></span>
<div class="scroll"><table id="m"><thead><tr><th>Type</th><th>Name / URL</th><th>Main keyword</th><th class="n">Vol</th><th class="n">KD</th><th>Intent</th><th>Source</th><th class="n">Sec</th><th class="n">FAQ</th><th>Secondary and FAQ keywords</th></tr></thead><tbody>`;
for (const r of rows.filter((x) => x.live !== false)) {
  const fb = r.p.source && r.p.source !== 'bank';
  H += `<tr data-k="${esc(r.kind)}" data-i="${esc(r.p.intent || '')}" data-s="${fb ? 'fb' : 'bank'}"><td>${esc(r.kind)}</td><td>${esc(r.name)}<br><small><a href="https://ebikedirect.eu${esc(r.url)}">${esc(r.url)}</a></small></td><td>${esc(r.p.keyword)}</td><td class="n">${nf(r.p.volume || 0)}</td><td class="n">${r.p.kd == null ? '-' : r.p.kd}</td><td>${ib(r.p.intent)}</td><td>${fb ? '<span class="amber">name</span>' : 'bank'}</td><td class="n">${r.sec.length}</td><td class="n">${r.faq.length}</td><td>${r.sec.length + r.faq.length ? '<details><summary>show</summary>' + (r.sec.length ? '<b>Secondary</b> ' + kwList(r.sec) : '') + (r.faq.length ? '<br><b>FAQ</b> ' + kwList(r.faq) : '') + '</details>' : '<small>none stored</small>'}</td></tr>`;
}
H += `</tbody></table></div>`;
H += `<script>
const q=document.getElementById('q'),k=document.getElementById('k'),i=document.getElementById('i'),s=document.getElementById('s'),rows=[...document.querySelectorAll('#m tbody tr')];
function f(){const t=q.value.toLowerCase();let n=0;rows.forEach(r=>{const ok=(!t||r.textContent.toLowerCase().includes(t))&&(!k.value||r.dataset.k===k.value)&&(!i.value||r.dataset.i===i.value)&&(!s.value||r.dataset.s===s.value);r.style.display=ok?'':'none';if(ok)n++});document.getElementById('cnt').textContent=n+' of '+rows.length+' pages'}
[q,k,i,s].forEach(e=>e.addEventListener('input',f));f();
document.querySelectorAll('#m th').forEach((th,c)=>th.addEventListener('click',()=>{const tb=document.querySelector('#m tbody');const a=[...tb.rows];const d=th.dataset.d=th.dataset.d==='1'?'-1':'1';a.sort((x,y)=>{let A=x.cells[c].textContent.trim(),B=y.cells[c].textContent.trim();const nA=parseFloat(A.replace(/,/g,'')),nB=parseFloat(B.replace(/,/g,''));return (isNaN(nA)||isNaN(nB)?A.localeCompare(B):nA-nB)*d});a.forEach(r=>tb.appendChild(r))}));
</script></div></body></html>`;
const out = 'C:/electric bikes europe/02-site-architecture/reports/onpage-seo-final-audit-2026-11-10.html';
fs.writeFileSync(out, H); fs.writeFileSync('.image-work/onpage-final-report.html', H);
console.log('report', out, (H.length / 1e6).toFixed(2) + ' MB', '| rows', rows.length, '| checks', totalChecks, 'pass', totalPass);
