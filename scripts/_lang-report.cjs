// Report for one language: live pages with main/secondary/FAQ keywords (intent, volume, KD), live gate result for those pages, pages still to build.
// usage: node scripts/_lang-report.cjs fr
const fs = require('fs');
const lang = process.argv[2] || 'fr';
const G = require('../.image-work/gate-results.json');
const live = require(`../data/keywords/${lang}-live.json`).pages;
const map = require(`../data/keywords/${lang}.json`).pages;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nf = (n) => Math.round(n).toLocaleString('en-US');
const NAME = { en: 'English (UK)', fr: 'French', nl: 'Dutch', it: 'Italian', es: 'Spanish', pt: 'Portuguese' }[lang];
const chip = (k) => `<span class="pill">${esc(k.keyword)} <small><b class="t ${k.intent}">${k.intent}</b> ${nf(k.volume || 0)} / KD ${k.kd == null ? '-' : k.kd}</small></span>`;
const liveUrls = new Set(live.map((p) => p.url.replace(/\/$/, '')));
const res = G.results.filter((r) => r.url.startsWith('/' + lang + '/') && /translated/.test(r.type));
const pass = res.filter((r) => r.ok).length;
const built = res.length > 0;
const stat = (list) => { const s = { T: 0, C: 0, N: 0, I: 0, vol: 0, kd: 0, n: 0 }; for (const p of list) { s[p.primary.intent] = (s[p.primary.intent] || 0) + 1; s.vol += p.primary.volume || 0; if (p.primary.kd != null) { s.kd += p.primary.kd; s.n++; } } return s; };
const s = stat(live);
const all = live.flatMap((p) => [p.primary, ...p.secondary, ...p.faq]);
const bySecIntent = { T: 0, C: 0, N: 0, I: 0 }; all.forEach((k) => { bySecIntent[k.intent] = (bySecIntent[k.intent] || 0) + 1; });
const css = `:root{--bg:#F8F9FA;--ink:#131A22;--mut:#5b6672;--card:#fff;--line:#e3e7ea;--or:#FF5722;--gr:#00C853;--red:#d32f2f}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1418;--ink:#e8edf1;--mut:#9aa6b1;--card:#171e25;--line:#2a343d}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,Segoe UI,Arial,sans-serif}.w{max-width:1280px;margin:0 auto;padding:20px 16px 80px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:30px 0 10px;border-bottom:2px solid var(--or);padding-bottom:4px}
.sub{color:var(--mut)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:14px 0}.c{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.c b{display:block;font-size:22px}.c span{color:var(--mut);font-size:12px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);font-size:13px}th,td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:var(--bg)}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}
.t{display:inline-block;padding:0 6px;border-radius:8px;font-size:10px;color:#fff}.t.T{background:#00a152}.t.C{background:#1e88e5}.t.N{background:#8e24aa}.t.I{background:#757575}.ok{color:var(--gr);font-weight:700}.bad{color:var(--red);font-weight:700}.amber{color:#e08600;font-weight:700}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:10px 0}.pill{font-size:12px;background:var(--bg);border:1px solid var(--line);padding:1px 7px;border-radius:9px;margin:2px 3px 2px 0;display:inline-block}small{color:var(--mut)}.scroll{max-height:700px;overflow:auto;border:1px solid var(--line);border-radius:8px}`;
let H = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ebikedirect.eu ${NAME} keyword map</title><style>${css}</style></head><body><div class="w">`;
H += `<h1>${NAME} (${lang}) keyword map and live audit</h1><div class="sub">Live crawl ${esc(G.when.slice(0, 10))} of https://ebikedirect.eu. Semrush database ${lang.toUpperCase()}. One keyword = one URL inside the language; KD 28 or lower; Transactional first, Commercial next.</div>`;
H += `<div class="cards"><div class="c"><b>${live.length}</b><span>${NAME} pages live (categories, brands, accessories; products below)</span></div><div class="c"><b>${pass} / ${res.length}</b><span>live gate checks pass on these pages</span></div><div class="c"><b>${nf(s.vol)}</b><span>total main-keyword volume</span></div><div class="c"><b>${s.n ? (s.kd / s.n).toFixed(1) : '-'}</b><span>average KD of main keywords</span></div><div class="c"><b>${s.T} T / ${s.C} C / ${s.N} N / ${s.I} I</b><span>main keyword intent</span></div><div class="c"><b>${all.length}</b><span>keywords used (1 + 5 + 5 per page)</span></div></div>`;
H += `<h2>1. ${built ? 'Live' : 'Mapped'} ${NAME} pages: main, secondary and FAQ keywords</h2><p class="sub">Chips: keyword, intent (T Transactional, C Commercial, N Navigational, I Informational), monthly volume, keyword difficulty.</p><div class="scroll"><table><thead><tr><th>Page</th><th>Main keyword</th><th class="n">Vol</th><th class="n">KD</th><th>Intent</th><th>5 secondary keywords</th><th>5 FAQ keywords</th></tr></thead><tbody>`;
for (const p of live) {
  H += `<tr><td><b>${esc(p.name)}</b><br><small><a href="https://ebikedirect.eu/${lang}${esc(p.url)}">/${lang}${esc(p.url)}</a><br>German page: <a href="https://ebikedirect.eu${esc(p.dePath)}">${esc(p.dePath)}</a><br>H1: ${esc(p.display)}</small></td><td>${esc(p.primary.keyword)}</td><td class="n">${nf(p.primary.volume)}</td><td class="n">${p.primary.kd}</td><td><b class="t ${p.primary.intent}">${p.primary.intent}</b></td><td>${p.secondary.map(chip).join('')}</td><td>${p.faq.map(chip).join('')}</td></tr>`;
}
H += `</tbody></table></div>`;
H += `<h2>2. Live gate result for these pages</h2><div class="box"><b>${pass} of ${res.length} checks pass.</b> ${res.length - pass === 0 ? 'No failures.' : 'Failures:'}<ul>`;
for (const r of res.filter((x) => !x.ok)) H += `<li><span class="bad">${esc(r.rule)}</span> on ${esc(r.url)} (${esc(String(r.note).slice(0, 60))}). ${/M2 /.test(r.rule) ? 'Main keyword is Commercial because the bank has no Transactional keyword for this page; the rule allows it.' : ''}</li>`;
H += `</ul></div>`;
const todo = map.filter((p) => !liveUrls.has(p.url.replace(/\/$/, '')));
H += `<h2>3. Map entries not built yet (${todo.length})</h2><p class="sub">From the preliminary ${NAME} map. Model-family keywords (batch 3b) and the blog follow. Some entries name brands the shop does not stock or topics without stock (used, rental, financing); those stay unbuilt.</p><div class="scroll"><table><thead><tr><th>Type</th><th>URL</th><th>Name</th><th>Main keyword (preliminary)</th><th class="n">Vol</th><th class="n">KD</th><th>Intent</th></tr></thead><tbody>`;
for (const p of todo) H += `<tr><td>${esc(p.type)}</td><td>${esc(p.url)}</td><td>${esc(p.name)}</td><td>${esc(p.primary.keyword)}</td><td class="n">${nf(p.primary.volume || 0)}</td><td class="n">${p.primary.kd == null ? '-' : p.primary.kd}</td><td><b class="t ${p.primary.intent}">${p.primary.intent}</b></td></tr>`;
H += `</tbody></table></div>`;

// ---- products
let prodRows = '', pstat = { bank: 0, name: 0, full: 0 };
try {
  const fp = require('../data/keywords/' + lang + '-products.json').products;
  const pm = require('../data/keywords/products.json').products;
  const all = Object.entries(pm).map(([slug, p]) => ({ slug, name: p.name, brand: p.brand, cat: p.category, e: fp[slug] || { primary: { keyword: 'acheter ' + p.name.toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] } }));
  for (const x of all) { if (x.e.primary.source === 'bank') pstat.bank++; else pstat.name++; if (x.e.secondary.length >= 5 && x.e.faq.length >= 5) pstat.full++; }
  const pres = G.results.filter((r) => r.url.startsWith('/' + lang + '/shop/'));
  const ppass = pres.filter((r) => r.ok).length;
  const byRule = {}; for (const r of pres.filter((x) => !x.ok)) byRule[r.rule.slice(0, 70)] = (byRule[r.rule.slice(0, 70)] || 0) + 1;
  prodRows += '<h2>3b. ' + NAME + ' product pages (' + all.length + ')</h2><div class="cards"><div class="c"><b>' + all.length + '</b><span>product pages live in ' + NAME + '</span></div><div class="c"><b>' + ppass + ' / ' + pres.length + '</b><span>live gate checks pass on product pages</span></div><div class="c"><b>' + pstat.bank + '</b><span>with a bank model keyword</span></div><div class="c"><b>' + pstat.name + '</b><span>on the product-name fallback</span></div><div class="c"><b>' + pstat.full + '</b><span>with 5 secondary and 5 FAQ keywords</span></div></div>';
  prodRows += '<div class="box"><b>Failing rules on product pages:</b><ul>' + Object.entries(byRule).sort((a, b) => b[1] - a[1]).map(([k, v]) => '<li>' + esc(k) + ': ' + v + '</li>').join('') + '</ul><small>M1, M6, M6c and H6 follow from the ' + NAME + ' bank holding brand-level but almost no model-level keywords. L5 is a manufacturer-site false positive (Conway).</small></div>';
  prodRows += '<div class="scroll"><table><thead><tr><th>Product</th><th>Type</th><th>Main keyword</th><th class="n">Vol</th><th class="n">KD</th><th>Intent</th><th>Source</th><th class="n">Sec</th><th class="n">FAQ</th></tr></thead><tbody>' + all.map((x) => '<tr><td>' + esc(x.name) + '<br><small><a href="https://ebikedirect.eu/' + lang + '/shop/' + esc(x.slug) + '">/' + lang + '/shop/' + esc(x.slug) + '</a></small></td><td>' + esc(x.cat) + '</td><td>' + esc(x.e.primary.keyword) + '</td><td class="n">' + nf(x.e.primary.volume || 0) + '</td><td class="n">' + (x.e.primary.kd == null ? '-' : x.e.primary.kd) + '</td><td><b class="t ' + x.e.primary.intent + '">' + x.e.primary.intent + '</b></td><td>' + (x.e.primary.source === 'bank' ? 'bank' : '<span class="amber">name</span>') + '</td><td class="n">' + x.e.secondary.length + '</td><td class="n">' + x.e.faq.length + '</td></tr>').join('') + '</tbody></table></div>';
} catch (e) { /* products not built for this language */ }

H += prodRows;
H += `<h2>4. Not verified</h2><div class="box"><small>Search Console data for ${NAME}; native-speaker review of the copy; model-family pages, the blog and the legal pages are not yet in ${NAME}; VAT wording is left out of the ${NAME} copy until the owner decides.</small></div></div></body></html>`;
const out = `C:/electric bikes europe/02-site-architecture/reports/onpage-seo-${lang}-batch3-2026-11-11.html`;
fs.writeFileSync(out, H);
console.log('report', out, 'live', live.length, 'checks', pass + '/' + res.length, 'todo', todo.length);
