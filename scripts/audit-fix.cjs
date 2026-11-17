// Applies the fixes of the mapping audit that need no new Semrush data. Reads the audit CSV (scripts/audit-mapping.cjs), and for every flagged keyword:
//  - removes it from its page or product (guard word, brand not sold, off-topic accessory keyword, below volume/KD limit, brand name missing, not in the bank);
//  - a flagged page primary is replaced by the best clean Transactional (else Commercial) keyword already stored on the same page;
//  - a product primary that is Informational, Navigational or below volume 10 becomes the name-based Transactional fallback and the old keyword moves to the FAQ when it fits.
// Every removed keyword is written to .image-work/audit-fix-removed-<market>.json (the hold list), so nothing is lost. Backups: <file>.pre-auditfix.
// usage: node scripts/audit-fix.cjs [--dry]
const fs = require('fs');
const dry = process.argv.includes('--dry');
const date = new Date().toISOString().slice(0, 10);
const csvF = `C:/electric bikes europe/02-site-architecture/reports/MAPPING-AUDIT-keywords-${date}.csv`;
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const rows = fs.readFileSync(csvF, 'utf8').split('\n').slice(1).filter(Boolean).map(pl).map((x) => ({ market: x[0], type: x[1], url: x[2], role: x[4], kw: x[5], intent: x[6], vol: +x[7], kd: x[8], bi: x[9], issues: x[13].split(' ').filter(Boolean) }));
const REMOVE = new Set(['F3', 'G1', 'G2', 'S3', 'F2', 'F4', 'K3']);
const FILES = { de: { live: 'data/keywords/de.json', prods: 'data/keywords/products.json', base: '', root: 'pages' }, fr: { live: 'data/keywords/fr-live.json', prods: 'data/keywords/fr-products.json', base: '/fr', root: 'pages' }, en: { live: 'data/keywords/en-live.json', prods: 'data/keywords/en-products.json', base: '/en', root: 'pages' } };
const kdOk = (v, kd) => kd === '' || kd == null || +kd <= (v >= 1000 ? 30 : 28);
const only = ((process.argv.find((a) => a.startsWith('--market=')) || '').split('=')[1] || '').split(',').filter(Boolean);
const summary = {};
for (const [mk, F] of Object.entries(FILES)) {
  if (only.length && !only.includes(mk)) continue;
  const live = JSON.parse(fs.readFileSync(F.live, 'utf8')); const prods = JSON.parse(fs.readFileSync(F.prods, 'utf8'));
  const pageBy = new Map(live.pages.map((p) => [F.base + p.url, p])); const prodBy = (u) => prods.products[u.split('/shop/')[1]];
  const mine = rows.filter((r) => r.market === mk); const removed = []; const unresolved = []; let promoted = 0, converted = 0, dropped = 0;
  const entryOf = (r) => (r.url.includes('/shop/') ? prodBy(r.url) : pageBy.get(r.url));
  // group by entry
  const byUrl = new Map(); for (const r of mine) { if (!byUrl.has(r.url)) byUrl.set(r.url, []); byUrl.get(r.url).push(r); }
  for (const [url, rs] of byUrl) {
    const e = entryOf(rs[0]); if (!e) continue; const isProd = url.includes('/shop/');
    const bad = (role, kw) => rs.some((r) => r.role === role && r.kw === kw && r.issues.some((c) => REMOVE.has(c)));
    // secondary and faq removals
    for (const role of ['secondary', 'faq']) { const keep = []; for (const k of e[role] || []) { if (bad(role, k.keyword)) { removed.push({ url, role, keyword: k.keyword, volume: k.volume, kd: k.kd, intent: k.intent, why: rs.find((r) => r.role === role && r.kw === k.keyword).issues.filter((c) => REMOVE.has(c)).join(' ') }); dropped++; } else keep.push(k); } e[role] = keep; }
    // primary
    const pr = e.primary; if (!pr) continue; const pr0 = rs.find((r) => r.role === 'primary');
    const primaryBad = pr0 && (pr0.issues.some((c) => REMOVE.has(c)) || (isProd && pr.source !== 'name' && (pr0.issues.includes('P2') || pr0.issues.includes('P3'))) || (!isProd && pr0.issues.includes('P2')));
    if (primaryBad) {
      if (isProd) {
        const nm = pr.keyword; removed.push({ url, role: 'primary', keyword: nm, volume: pr.volume, kd: pr.kd, intent: pr.intent, why: pr0.issues.join(' ') + ' (primary became name-based)' });
        const label = mk === 'de' ? ' kaufen' : '';
        e.primary = { keyword: mk === 'de' ? e.name.toLowerCase() + label : mk === 'fr' ? 'acheter ' + e.name.toLowerCase() : 'buy ' + e.name.toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' };
        const stillOk = !pr0.issues.some((c) => ['G1', 'G2', 'F3', 'F4', 'K3'].includes(c)) && +pr.volume >= 10 && kdOk(+pr.volume, pr.kd);
        if (stillOk && (e.faq || []).length < 5) e.faq.push({ keyword: pr.keyword, volume: pr.volume, kd: pr.kd, intent: pr.intent }); converted++;
      } else {
        const softOnly = pr0.issues.every((c) => c === 'P2');
        const cands = [...(e.secondary || []), ...(e.faq || [])].filter((k) => (k.intent === 'T' || k.intent === 'C') && +k.volume >= 10 && kdOk(+k.volume, k.kd) && (!softOnly || +k.volume >= 0.25 * +pr.volume)).sort((a, b) => (a.intent === b.intent ? b.volume - a.volume : a.intent === 'T' ? -1 : 1));
        if (cands.length || !pr0.issues.every((c) => c === 'P2')) removed.push({ url, role: 'primary', keyword: pr.keyword, volume: pr.volume, kd: pr.kd, intent: pr.intent, why: pr0.issues.join(' ') });
        if (cands.length) { const n = cands[0]; e.secondary = (e.secondary || []).filter((k) => k !== n); e.faq = (e.faq || []).filter((k) => k !== n); e.primary = { ...n, source: 'bank' }; promoted++; }
        else if (pr0.issues.every((c) => c === 'P2')) { unresolved.push({ url, keyword: pr.keyword, intent: pr.intent, volume: pr.volume, why: 'Informational primary, no Transactional or Commercial keyword on the page: needs one from Semrush' }); } else { e.primary = { keyword: (e.name || '').toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }; converted++; }
      }
    }
  }
  summary[mk] = { flaggedRows: mine.filter((r) => r.issues.some((c) => REMOVE.has(c) || c === 'P2' || c === 'P3')).length, removed: dropped, primariesPromoted: promoted, primariesToNameBased: converted, primariesLeftNeedingTC: unresolved.length };
  if (!dry) { fs.copyFileSync(F.live, F.live + '.pre-auditfix'); fs.copyFileSync(F.prods, F.prods + '.pre-auditfix'); fs.writeFileSync(F.live, JSON.stringify(live, null, 1)); fs.writeFileSync(F.prods, JSON.stringify(prods, null, 1)); fs.writeFileSync(`.image-work/audit-fix-removed-${mk}.json`, JSON.stringify(removed, null, 1)); fs.writeFileSync(`.image-work/audit-fix-unresolved-${mk}.json`, JSON.stringify(unresolved, null, 1)); }
}
console.log(JSON.stringify(summary, null, 1)); console.log(dry ? 'dry run, nothing written' : 'written, backups .pre-auditfix');
