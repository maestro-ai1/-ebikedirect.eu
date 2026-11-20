// Step A (owner go-ahead 2026-11-20): on live pages where a fitting stored T/C keyword has 2x or more the primary volume, that keyword becomes the primary
// (and the page display label that drives title and H1); the old primary takes its slot in secondary or FAQ, so nothing is lost and no keyword repeats.
// usage: node scripts/tc-swap.cjs fr,en [--dry]   (input: .image-work/tc-audit.json from .image-work/_tc-audit.cjs; writes .image-work/tc-swap-<m>.json as the change log; backups .pre-tcswap)
const fs = require('fs');
const dry = process.argv.includes('--dry');
const mk = (process.argv[2] || 'fr,en').split(',');
const FILES = { fr: 'data/keywords/fr-live.json', en: 'data/keywords/en-live.json', de: 'data/keywords/de.json' };
// pages whose bigger keyword does not describe what the page sells (read one by one, see the audit report)
const NOFIT = new Set(['/fr/velos-electriques/vtt-electrique/', '/en/accessories/rain-clothing/']);
const rows = JSON.parse(fs.readFileSync('.image-work/tc-audit.json', 'utf8')).filter((r) => r.kind === 'page' && mk.includes(r.m));
for (const m of mk) {
  const f = FILES[m]; const d = JSON.parse(fs.readFileSync(f, 'utf8')); const log = [];
  for (const r of rows.filter((x) => x.m === m)) {
    if (NOFIT.has('/' + m + r.id)) continue;
    const p = d.pages.find((x) => x.url === r.id); if (!p) { console.log('page missing', m, r.id); continue; }
    let arr = null, idx = -1;
    for (const role of ['secondary', 'faq']) { const i = (p[role] || []).findIndex((k) => k.keyword.toLowerCase() === r.bk.toLowerCase()); if (i >= 0) { arr = p[role]; idx = i; break; } }
    if (!arr) { console.log('candidate missing', m, r.id, r.bk); continue; }
    const cand = arr[idx]; const old = p.primary;
    if (+cand.volume < 2 * Math.max(+old.volume || 0, 1)) continue;
    const oldEntry = { keyword: old.keyword, volume: old.volume, kd: old.kd, intent: old.intent };
    arr[idx] = oldEntry;
    p.primary = { keyword: cand.keyword, volume: cand.volume, kd: cand.kd, intent: cand.intent, source: 'bank' };
    const was = p.display; p.display = cand.keyword.charAt(0).toUpperCase() + cand.keyword.slice(1);
    log.push({ url: r.id, from: old.keyword + ' ' + old.intent + ' ' + old.volume, to: cand.keyword + ' ' + cand.intent + ' ' + cand.volume + ' KD ' + cand.kd, displayWas: was, displayNow: p.display });
  }
  console.log(m, log.length, 'swaps'); for (const x of log) console.log('  ', x.url, '|', x.from, '=>', x.to);
  if (!dry) { fs.copyFileSync(f, f + '.pre-tcswap'); fs.writeFileSync(f, JSON.stringify(d, null, 1)); fs.writeFileSync(`.image-work/tc-swap-${m}.json`, JSON.stringify(log, null, 1)); }
}
console.log(dry ? 'dry run, nothing written' : 'written, backups .pre-tcswap');
