// Full outcome list of the 221 eligible English keywords (placed or hold with reason). Output: reports/KEYWORD-PLACEMENT-en-<date>.html
const fs = require('fs');
const { log, displaced } = require('../.image-work/placement-en.json');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const td = 'style="padding:5px 9px;border-bottom:1px solid #e5e8ec;font-size:13px"';
const cls = (x) => x.to !== 'HOLD' ? 'PLACED' : /model word not in the catalogue/.test(x.why) ? 'HOLD: model the shop does not sell (to-source list)' : /no page covers/.test(x.why) ? 'HOLD: needs a new page (owner decision)' : 'HOLD: page full, variant or equal volume (needs a sub-page or owner decision)';
const g = {}; log.forEach((x) => (g[cls(x)] = g[cls(x)] || []).push(x));
const sum = Object.entries(g).map(([k, a]) => `<tr><td ${td}>${esc(k)}</td><td ${td} align="right"><b>${a.length}</b></td></tr>`).join('');
const rows = (a) => a.map((x) => `<tr><td ${td}>${esc(x.k)}</td><td ${td} align="right">${x.v}</td><td ${td}>${esc(x.to)}</td><td ${td}>${esc(x.why)}</td></tr>`).join('');
const html = `<!doctype html><meta charset="utf-8"><title>English placement ledger</title><body style="margin:0;background:#F8F9FA;color:#131A22;font-family:Segoe UI,Arial,sans-serif"><div style="max-width:1000px;margin:0 auto;padding:24px 16px">
<h1 style="font-size:24px">English: the 221 eligible keywords, every one accounted for</h1><p style="font-size:13px;color:#555">Total ${log.length}. Displaced stored keywords are listed at the bottom, so nothing is lost silently.</p>
<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e8ec">${sum}</table>
${Object.entries(g).map(([k, a]) => `<h2 style="font-size:16px;margin-top:24px">${esc(k)} (${a.length})</h2><table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e8ec"><tr><td ${td}><b>Keyword</b></td><td ${td}><b>Vol</b></td><td ${td}><b>Where</b></td><td ${td}><b>Why</b></td></tr>${rows(a)}</table>`).join('')}
<h2 style="font-size:16px;margin-top:24px">Stored keywords displaced by a swap (${displaced.length})</h2><table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e8ec">${displaced.map((x) => `<tr><td ${td}>${esc(x.k)}</td><td ${td}>${x.v}</td><td ${td}>${esc(x.from)}</td><td ${td}>${esc(x.why)}</td></tr>`).join('')}</table></div>`;
const out = 'C:/electric bikes europe/02-site-architecture/reports/KEYWORD-PLACEMENT-en-' + new Date().toISOString().slice(0, 10) + '.html';
fs.writeFileSync(out, html); console.log(out, Object.fromEntries(Object.entries(g).map(([k, a]) => [k, a.length])));
