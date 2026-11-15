// HTML report of the English keyword ledger (reads .image-work/ledger-en.json written by _ledger-en.cjs). Output: reports/KEYWORD-LEDGER-en-<date>.html
const fs = require('fs');
const L = require('../.image-work/ledger-en.json');
const plan = require('./_lang-plan-en.cjs');
const live = require('../data/keywords/en-live.json').pages;
const prods = require('../data/keywords/en-products.json').products;
const sold = new Set(Object.values(prods).map((e) => e.brand.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// suggested destination for an eligible, unused keyword
const cats = plan.batches.batch1.map((b) => ({ re: new RegExp(b.rel, 'i'), ex: b.exclude ? new RegExp(b.exclude, 'i') : null, url: b.mapUrl || b.url, name: b.name }));
const ACC = /(multi ?tool|wash|poncho|inflator|rain cover|phone case|accessor|mud ?guard|lock|pump|light|bell|helmet|basket|bag)/i;
function dest(r) {
  const k = r.k;
  if (ACC.test(k)) return ['accessory page or product', 'accessory'];
  const brand = [...sold].find((b) => b.length > 2 && new RegExp('\\b' + b + '\\b', 'i').test(k));
  if (brand) return [/\b(e bikes?|ebikes?|emtb|electric|bikes?|bicycles?)\b/.test(k) && k.split(' ').length <= 3 ? 'brand page secondary or FAQ (' + brand + ')' : 'model of ' + brand + ' that is not in the catalogue, or a family page', 'brand'];
  for (const c of cats) if (c.re.test(k) && !(c.ex && c.ex.test(k))) return ['category page: ' + c.name, 'category'];
  return ['hold: no page for it yet', 'hold'];
}
const rows = L.eligible.map((r) => ({ ...r, d: dest(r) }));
const byKind = rows.reduce((a, r) => { a[r.d[1]] = (a[r.d[1]] || 0) + 1; return a; }, {});
const used = (L.sum['used: main'] || 0) + (L.sum['used: secondary'] || 0) + (L.sum['used: faq'] || 0);
const th = 'style="text-align:left;padding:6px 10px;border-bottom:2px solid #131A22;font-size:12px;text-transform:uppercase;color:#555"';
const td = 'style="padding:6px 10px;border-bottom:1px solid #e5e8ec;font-size:13px"';
const sumRows = Object.entries(L.sum).sort((a, b) => b[1] - a[1]).map(([b, n]) => `<tr><td ${td}>${esc(b)}</td><td ${td} align="right"><b>${n.toLocaleString('en')}</b></td><td ${td} align="right">${(100 * n / L.total).toFixed(1)}%</td></tr>`).join('');
const eligRows = rows.map((r) => `<tr><td ${td}>${esc(r.k)}</td><td ${td}>${r.i}</td><td ${td} align="right">${r.v.toLocaleString('en')}</td><td ${td} align="right">${r.kd}</td><td ${td}>${esc(r.d[0])}</td></tr>`).join('');
const samples = Object.entries(L.samples).map(([b, a]) => `<h3 style="margin:18px 0 6px;font-size:14px">${esc(b)}</h3><div style="font-size:12px;color:#555">${a.map((r) => esc(r.k) + ' (' + r.i + ' ' + r.v + (r.kd !== null ? ', KD ' + r.kd : '') + ')').join(' &middot; ')}</div>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>English keyword ledger audit</title></head>
<body style="margin:0;background:#F8F9FA;color:#131A22;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
<div style="max-width:980px;margin:0 auto;padding:24px 16px 60px;">
<h1 style="font-size:26px;margin:0 0 6px">English keyword ledger: what was built, what was not</h1>
<div style="color:#555;font-size:13px">Every refreshed Semrush UK keyword (${L.total.toLocaleString('en')}) in exactly one bucket. Data: the stored English maps (56 pages, 875 products) against the refreshed bank. Date ${new Date().toISOString().slice(0, 10)}.</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin:20px 0">
<div style="background:#fff;border:1px solid #e5e8ec;border-radius:10px;padding:14px 18px"><div style="font-size:28px;font-weight:800;color:#00A843">${used.toLocaleString('en')}</div><div style="font-size:12px;color:#555">refreshed keywords built into pages and products<br>(main ${L.sum['used: main']}, secondary ${L.sum['used: secondary']}, FAQ ${L.sum['used: faq']})</div></div>
<div style="background:#fff;border:1px solid #e5e8ec;border-radius:10px;padding:14px 18px"><div style="font-size:28px;font-weight:800;color:#FF5722">${rows.length}</div><div style="font-size:12px;color:#555">eligible but NOT used<br>(Transactional or Commercial, KD within limit, volume 10+)</div></div>
<div style="background:#fff;border:1px solid #e5e8ec;border-radius:10px;padding:14px 18px"><div style="font-size:28px;font-weight:800">${(L.total - used - rows.length).toLocaleString('en')}</div><div style="font-size:12px;color:#555">excluded by a stated rule<br>(volume under 10, Informational, KD, guard words ...)</div></div></div>
<h2 style="font-size:18px">1. Where every refreshed keyword went</h2>
<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e8ec"><tr><th ${th}>Bucket</th><th ${th} align="right">Keywords</th><th ${th} align="right">Share</th></tr>${sumRows}</table>
<p style="font-size:13px;color:#555;margin-top:8px">Volume under 10 is the largest bucket: most model and name variants searched in Semrush have almost no demand, which is why many products keep their name as the main keyword. Informational keywords belong to the blog queue by rule, Navigational ones only to brand pages when clearly higher.</p>
<h2 style="font-size:18px;margin-top:28px">2. The real gap: ${rows.length} eligible keywords with no place</h2>
<p style="font-size:13px;color:#333">These pass every rule but none sits on a page. The reason in almost every case: category pages hold 1 main, 5 secondary and 5 FAQ keywords, so surplus variants ("mountain e bike" 880, "folding ebike uk" 1,000, "cargo bike uk" 390) found no slot. By suggested destination: ${Object.entries(byKind).map(([k, n]) => `<b>${n}</b> ${k}`).join(', ')}. By volume: 7 at 1,000+, 22 at 300 to 999, 39 at 100 to 299, 9 at 50 to 99, 144 at 10 to 49.</p>
<p style="font-size:13px;color:#333"><b>Proposed handling:</b> (a) where an unused keyword has higher volume than a stored secondary of the same page, swap it in (for example Cargo e-bikes stores "cargo ebike uk" 170 while "cargo bike uk" 390 is unused); (b) brand-level ones go to the brand page FAQ or secondary list; (c) accessory ones to the accessory pages; (d) the rest stay on a hold list with the reason, so nothing is lost. Nothing has been changed yet: this report only audits.</p>
<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e8ec"><tr><th ${th}>Keyword</th><th ${th}>Intent</th><th ${th} align="right">Volume</th><th ${th} align="right">KD</th><th ${th}>Suggested destination</th></tr>${eligRows}</table>
<h2 style="font-size:18px;margin-top:28px">3. Samples of the excluded buckets (highest volume first)</h2>${samples}
<h2 style="font-size:18px;margin-top:28px">4. Not verified</h2><ul style="font-size:13px;line-height:1.6"><li>Semrush data older than the refresh is not counted here (only rows marked "Now").</li><li>Whether each unused keyword fits the page it is suggested for is a proposal, not a check against Search Console.</li><li>The two last Semrush batches (108 model names) are not refreshed because of the hourly limit.</li></ul>
</div></body></html>`;
const out = `C:/electric bikes europe/02-site-architecture/reports/KEYWORD-LEDGER-en-${new Date().toISOString().slice(0, 10)}.html`;
fs.writeFileSync(out, html);
console.log('report', out, '| kinds', JSON.stringify(byKind));
