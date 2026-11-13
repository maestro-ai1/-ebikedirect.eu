// Golden Keyword Rule: primary is Transactional; when the Transactional options are low or missing a Commercial/Navigational primary is allowed
// (Navigational on brand pages only when its volume is clearly higher). This script measures that for every non-T page and product of one language:
// best RELEVANT Transactional alternative in the refreshed bank (KD<=30, not used elsewhere). A fallback is accepted when the primary has at least 2x its volume (or no T alternative exists).
// Output: data/keywords/m2-<lang>.json  { "<url>": { primary, intent, volume, bestT, tVolume, ratio } } for accepted fallbacks, plus "_rejected" for pages where a T alternative is close and should replace the primary.
// usage: node scripts/_m2-fallbacks.cjs en
const fs = require('fs');
const lang = process.argv[2] || 'en';
const root = 'C:/electric bikes europe';
const bankDir = { en: 'uk', fr: 'fr' }[lang];
const pl = (l) => { const o = []; let f = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ',') { o.push(f); f = ''; } else f += c; } o.push(f); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const bank = [];
for (const l of fs.readFileSync(`${root}/03-keywords/by-market/${bankDir}/${bankDir}_master_merged.csv`, 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const kd = p[3] === '' ? null : +p[3]; const v = +p[2] || 0; if (kd === null || kd > 30 || v < 10) continue; bank.push({ k: p[0].toLowerCase(), i: IT(p[1]), v, kd }); }
const live = require(`../data/keywords/${lang}-live.json`).pages;
const prods = require(`../data/keywords/${lang}-products.json`).products;
const used = new Set();
for (const p of live) for (const k of [p.primary, ...p.secondary, ...p.faq]) if (k) used.add(nk(k.keyword));
for (const e of Object.values(prods)) for (const k of [e.primary, ...e.secondary, ...e.faq]) if (k) used.add(nk(k.keyword));
const BIKE = /\b(bike|bikes|bicycle|bicycles|cycle|cycles|ebike|ebikes|e bike|e bikes|pedelec)\b/;
const BAD = /(gravel|cyclocross|road|bmx|motorcycle|scooter|quad|go kart|car\b|dirt|helmet|boots|decathlon|halfords|tesco|argos|asda|amazon|near me|smyths|currys)/;
const MAN = {
  '/electric-bikes/trekking-e-bikes/': (k) => /(trekking|touring|long distance)/.test(k) && BIKE.test(k),
  '/electric-bikes/cargo-e-bikes/': (k) => /(cargo|family)/.test(k) && BIKE.test(k),
  '/electric-bikes/kids-e-bikes/': (k) => /(kids?|child|childs|children|junior|teen|youth)/.test(k) && BIKE.test(k) && /(electric|e bike|ebike)/.test(k) && !/(car|motor|dirt|quad)/.test(k),
  '/electric-bikes/womens-e-bikes/': (k) => /(women|ladies|female)/.test(k) && BIKE.test(k),
  '/accessories/phone-holders/': (k) => /(phone|mobile)/.test(k) && /(holder|mount)/.test(k),
  '/accessories/tools-care/': (k) => /(repair|puncture|tool|lube|wax|clean|maintenance)/.test(k) && BIKE.test(k),
  '/brands/': (k) => /(brands?|manufacturers?|makers?|companies)/.test(k) && BIKE.test(k),
};
const stop = new Set(['und', 'and', 'e', 'bike', 'zoll', 'wh', 'plus', 'pro', 'the']);
const toks = (s) => norm(s).replace(/&/g, ' ').split(/[^a-z0-9]+/).filter((t) => t && t.length > 1 && !stop.has(t) && !/^\d+$/.test(t));
const ALLB = [...new Set(Object.values(prods).map((e) => e.brand).concat(['trek', 'giant', 'bosch', 'shimano', 'yamaha']).flatMap((b) => toks(b)))];
const OTHER = (own) => { const o = ALLB.filter((b) => !own.includes(b)); return o.length ? new RegExp('\\b(' + o.join('|') + ')\\b') : /$^/; };
const out = {}, rejected = {};
function check(url, entry, relFn, own) {
  const oth = OTHER(own || []);
  const pr = entry.primary; if (!pr || pr.intent === 'T' || pr.source === 'name') return;
  const best = bank.filter((b) => b.i === 'T' && !BAD.test(b.k) && relFn(b.k) && !oth.test(norm(b.k)) && !used.has(nk(b.k))).sort((a, b) => b.v - a.v)[0];
  const rec = { primary: pr.keyword, intent: pr.intent, volume: pr.volume, bestT: best ? best.k : null, tVolume: best ? best.v : 0, ratio: best ? +(pr.volume / best.v).toFixed(1) : null };
  if (!best || pr.volume >= 2 * best.v) out[url] = rec; else rejected[url] = rec;
}
for (const p of live) {
  const slug = p.url;
  let rel = MAN[slug];
  if (!rel) { const t = toks(p.name || slug.replace(/-/g, ' ')); rel = (k) => t.every((x) => new RegExp('\\b' + x + '\\b').test(norm(k))); }
  check('/' + lang + p.url.replace(/\/$/, ''), p, rel, MAN[slug] ? [] : toks(p.name || slug.replace(/-/g, ' ')));
}
for (const [slug, e] of Object.entries(prods)) {
  const t = toks(e.name); const brand = toks(e.brand); const model = t.filter((x) => !brand.includes(x));
  check('/' + lang + '/shop/' + slug, e, (k) => { const nkk = norm(k); return brand.every((b) => new RegExp('\\b' + b + '\\b').test(nkk)) && model.filter((m) => new RegExp('\\b' + m + '\\b').test(nkk)).length >= Math.min(2, model.length); }, t);
}
fs.writeFileSync(`data/keywords/m2-${lang}.json`, JSON.stringify({ accepted: out, rejected }, null, 1));
console.log('accepted fallbacks', Object.keys(out).length, '| T alternative is close (replace the primary):', Object.keys(rejected).length);
for (const [u, r] of Object.entries(rejected)) console.log('  ', u, '|', r.primary, r.intent, r.volume, '| best T:', r.bestT, r.tVolume);
