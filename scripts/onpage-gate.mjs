// On-page SEO gate: crawls the LIVE site (sitemap URLs) and scores every rule of the onpage-seo-gate skill per page type.
// usage: node scripts/onpage-gate.mjs [base=https://ebikedirect.eu]   -> .image-work/gate-results.json (the HTML report is built by build-gate-report.cjs)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = (process.argv[2] || 'https://ebikedirect.eu').replace(/\/$/, '');
const host = new URL(base).host;
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/&amp;/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const decode = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const strip = (h) => h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ');
const text = (h) => decode(strip(h).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const pathOf = (u) => { try { const x = new URL(u, base); if (x.host !== host) return null; let p = x.pathname.replace(/\/+$/, ''); return p || '/'; } catch { return null; } };

// ---- stored keyword data ----
const prods = require('../data/keywords/products.json').products;
const dePages = require('../data/keywords/de.json').pages;
const families = require('../data/keywords/families.json').families || [];
const pageByPath = new Map();
for (const p of Array.isArray(dePages) ? dePages : Object.values(dePages)) pageByPath.set(pathOf(p.url) || '/', p);
const famByPath = new Map(); for (const f of Array.isArray(families) ? families : Object.values(families)) famByPath.set(pathOf(f.path), f);
const keywordOf = (path, type) => {
  if (type === 'product') { const e = prods[path.replace(/^\/shop\//, '')]; return e ? { primary: e.primary, secondary: e.secondary || [], faq: e.faq || [], name: e.name } : null; }
  const f = famByPath.get(path); if (f) return { primary: f.primary, secondary: f.secondary || [], faq: f.faq || [], name: f.name };
  const p = pageByPath.get(path); if (p) return { primary: p.primary, secondary: p.secondary || [], faq: p.faq || [], name: p.name };
  return null;
};
// the bank as exported, to confirm that a stored primary really exists in it
const bank = new Set();
try { const L = fs.readFileSync('C:/electric bikes europe/03-keywords/by-market/de/de_master_merged.csv', 'utf8').split(/\r?\n/); for (let i = 1; i < L.length; i++) { const k = L[i].split(',')[0]; if (k) bank.add(norm(k)); } } catch { /* bank file not available */ }

// ---- page types ----
const typeOf = (p) => {
  if (p === '/') return 'home';
  if (/^\/(fr|nl|it|es|pt)$/.test(p)) return 'language stub';
  if (/^\/shop\/.+/.test(p)) return prods[p.replace(/^\/shop\//, '')] ? 'product' : 'accessory product';
  if (/\/page\/\d+$/.test(p)) return 'pagination';
  if (/^\/e-bikes\/[^/]+$/.test(p)) return 'category';
  if (/^\/marken\/[^/]+\/[^/]+$/.test(p)) return 'family';
  if (/^\/marken\/[^/]+$/.test(p)) return 'brand';
  if (/^\/zubehoer\/[^/]+$/.test(p)) return 'accessory category';
  if (/^\/blog\/[^/]+$/.test(p)) return 'blog post';
  return 'other';
};

// ---- crawl ----
const xml = await (await fetch(base + '/sitemap.xml')).text();
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => pathOf(m[1])).filter(Boolean))];
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; onpage-gate/1.0)' };
const pages = new Map();
let idx = 0;
async function get(url, tries = 2) { for (let t = 0; t < tries; t++) { try { const r = await fetch(base + url, { headers: UA, signal: AbortSignal.timeout(30000) }); if (r.ok || r.status === 404) return { status: r.status, html: await r.text() }; } catch { /* retry */ } } return { status: 0, html: '' }; }
function parse(url, status, html) {
  const type = typeOf(url);
  const title = decode((html.match(/<title>([^<]*)/) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const body = strip(html);
  const heads = [...strip(main).matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ l: +m[1], t: text(m[2]) }));
  const allHeads = [...body.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({ l: +m[1], t: text(m[2]) }));
  const ctxHtml = strip(main).replace(/<(header|nav|footer)[\s\S]*?<\/\1>/gi, ' ');
  const links = [...ctxHtml.matchAll(/<a\s[^>]*href="([^"#]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({ href: m[1], text: text(m[2]) }));
  const internal = [], external = [];
  for (const l of links) { if (/^(mailto:|tel:|javascript:)/.test(l.href)) continue; const p = pathOf(l.href); if (p !== null) { if (!/\.(png|jpe?g|webp|svg|ico|css|js|xml|pdf)$/i.test(p)) internal.push({ p, text: l.text }); } else if (/^https?:/.test(l.href)) external.push({ u: l.href, text: l.text }); }
  const imgs = [...strip(main).matchAll(/<img\s[^>]*>/g)].map((m) => ({ alt: decode((m[0].match(/ alt="([^"]*)"/) || [])[1] ?? null) , has: / alt="/.test(m[0]) }));
  const ld = []; for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { try { const o = JSON.parse(m[1]); for (const x of [].concat(o['@graph'] || o)) ld.push(x); } catch { /* bad json */ } }
  const mainText = text(main);
  const words = mainText.split(/\s+/).filter(Boolean).length;
  const firstH1 = main.search(/<h1/);
  const afterH1 = firstH1 >= 0 ? main.slice(firstH1) : main;
  const para = [...strip(afterH1).matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => text(m[1])).find((t) => t.length >= 60) || '';
  return { url, type, status, title, desc, canonical, heads, allHeads, internal, external, imgs, ld, words, para, mainText, hasToc: /Inhaltsverzeichnis|Inhalt<|table-of-contents|Das erwartet Sie/i.test(html), hasUpdated: /Aktualisiert|zuletzt aktualisiert|Stand:|dateModified/i.test(html) };
}
async function worker() { while (idx < urls.length) { const u = urls[idx++]; const r = await get(u); pages.set(u, parse(u, r.status, r.html)); } }
console.log('crawling', urls.length, 'pages on', base);
await Promise.all(Array.from({ length: 6 }, worker));

// ---- inbound contextual links ----
const inbound = new Map();
for (const pg of pages.values()) for (const l of new Set(pg.internal.map((x) => x.p))) { if (l === pg.url) continue; (inbound.get(l) || inbound.set(l, new Set()).get(l)).add(pg.url); }

// ---- external links ----
const extAll = new Map();
for (const pg of pages.values()) for (const e of pg.external) { if (!extAll.has(e.u)) extAll.set(e.u, []); extAll.get(e.u).push(pg.url); }
const extStatus = new Map();
let ei = 0; const extList = [...extAll.keys()];
async function ew() { while (ei < extList.length) { const u = extList[ei++]; let s = 0; try { let r = await fetch(u, { method: 'HEAD', headers: UA, redirect: 'follow', signal: AbortSignal.timeout(12000) }); if (r.status === 405 || r.status === 400) r = await fetch(u, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(12000) }); s = r.status; } catch { s = 0; } extStatus.set(u, s); } }
console.log('checking', extList.length, 'external links');
await Promise.all(Array.from({ length: 6 }, ew));
const COMPETITORS = /(amazon\.|fahrrad-xxl|bike24|rose\.de|bike-discount|fahrrad\.de|bikester|lucky-bike|mount7|bikes\.de|decathlon|ebay\.|kleinanzeigen|otto\.de|idealo|zalando|cyclingstore|r2-bike|stadler|fahrrad-kunze|radwelt)/i;
const GENERIC = /^(hier|mehr|klicken sie hier|click here|link|weiterlesen|mehr erfahren|read more|hier klicken|mehr lesen|zum artikel)$/i;

// ---- score ----
const dupTitles = new Map(), dupDescs = new Map(), dupH1 = new Map();
for (const pg of pages.values()) { if (pg.type === 'language stub') continue; const h1 = (pg.heads.find((h) => h.l === 1) || {}).t || ''; for (const [m, v] of [[dupTitles, pg.title], [dupDescs, pg.desc], [dupH1, h1]]) { const k = norm(v); if (k) (m.get(k) || m.set(k, []).get(k)).push(pg.url); } }
const allKw = new Map(); // stored keyword -> owners (one keyword = one URL)
const addKw = (u, k) => { if (!k || !k.keyword) return; const key = norm(k.keyword).split(' ').sort().join(' '); (allKw.get(key) || allKw.set(key, new Set()).get(key)).add(u); };
for (const [slug, e] of Object.entries(prods)) for (const k of [e.primary, ...(e.secondary || []), ...(e.faq || [])]) addKw('/shop/' + slug, k);
for (const [pth, p] of pageByPath) for (const k of [p.primary, ...(p.secondary || []), ...(p.faq || [])]) addKw(pth, k);
for (const [pth, f] of famByPath) for (const k of [f.primary, ...(f.secondary || []), ...(f.faq || [])]) if (k && !k.heldNowBy) addKw(pth, k);
const dupKw = [...allKw.entries()].filter(([, v]) => v.size > 1);

const results = [];
const rec = (pg, id, ok, note) => { results.push({ url: pg.url, type: pg.type, rule: id, ok, note: note || '' }); };
const SALES = new Set(['product', 'category', 'brand', 'family', 'accessory category', 'home']);
const firstParas = new Map();
for (const pg of pages.values()) { if (pg.type === 'product') { const k = norm(pg.para).split(' ').slice(0, 12).join(' '); (firstParas.get(k) || firstParas.set(k, []).get(k)).push(pg.url); } }
for (const pg of pages.values()) {
  if (pg.type === 'language stub' || pg.type === 'pagination') continue;
  const kw = keywordOf(pg.url, pg.type);
  const pn = kw && kw.primary ? norm(kw.primary.keyword) : '';
  const nameBased = pg.type === 'product' && kw && kw.primary.source === 'name';
  const lead = nameBased ? norm(kw.name) : pn;
  const h1s = pg.heads.filter((h) => h.l === 1);
  const first = pg.allHeads[0];
  const bodyN = norm(pg.mainText);
  rec(pg, 'page returns 200', pg.status === 200, pg.status);
  rec(pg, 'canonical present', !!pg.canonical);
  if (kw && kw.primary) {
    // mapping (stored data)
    if (pg.type === 'product') rec(pg, 'M1 primary is a bank keyword (name-based fallback counts as miss)', kw.primary.source === 'bank' && (bank.size ? bank.has(pn) || kw.primary.volume === 0 : true), nameBased ? 'name-based fallback' : '');
    if (pg.type === 'product' && kw.primary.source === 'bank') { rec(pg, 'M2 main keyword intent is Transactional', kw.primary.intent === 'T', kw.primary.intent); rec(pg, 'M2b main keyword intent is T or C', /^(T|C)$/.test(kw.primary.intent), kw.primary.intent); rec(pg, 'M3 main keyword volume above 0', kw.primary.volume > 0, kw.primary.volume); rec(pg, 'M4 main keyword KD at most 28', kw.primary.kd == null || kw.primary.kd <= 28, kw.primary.kd); }
    if (pg.type !== 'product') { rec(pg, 'M2 main keyword intent is Transactional', kw.primary.intent === 'T', kw.primary.intent); rec(pg, 'M3 main keyword volume above 0', kw.primary.volume > 0, kw.primary.volume); }
    const key = norm(kw.primary.keyword).split(' ').sort().join(' ');
    rec(pg, 'M5 main keyword used on this URL only', !allKw.get(key) || allKw.get(key).size <= 1);
    const sec = kw.secondary || [];
    rec(pg, 'M6 five secondary keywords stored', sec.length >= 5, sec.length + ' stored');
    rec(pg, 'M6b stored secondaries are all T or C', sec.every((k) => /^(T|C)$/.test(k.intent)));
    const vis = sec.filter((k) => bodyN.includes(norm(k.keyword))).length;
    rec(pg, 'M6c at least half of the stored secondaries are visible on the page', sec.length === 0 ? null : vis >= Math.ceil(sec.length / 2), vis + ' of ' + sec.length);
    // headings that carry keywords
    rec(pg, 'H3 H1 contains the main keyword', !!h1s[0] && norm(h1s[0].t).includes(lead), h1s[0] ? h1s[0].t : '');
    const h23 = pg.heads.filter((h) => h.l === 2 || h.l === 3).map((h) => norm(h.t)).join(' | ');
    const inH = sec.filter((k) => h23.includes(norm(k.keyword))).length;
    rec(pg, 'H6 H2/H3 carry at least two of the secondaries (or all when fewer are stored)', sec.length === 0 ? null : inH >= Math.min(2, sec.length), inH + ' in headings');
    // title / meta
    rec(pg, 'T2 title starts with the main keyword (or the product name when the keyword is name-based)', norm(pg.title).startsWith(lead) || (pg.type === 'product' && norm(pg.title).startsWith(norm(kw.name))), pg.title);
    rec(pg, 'T4 description contains the main keyword', norm(pg.desc).includes(lead) || (pg.type === 'product' && norm(pg.desc).includes(norm(kw.name))), '');
    rec(pg, 'T5 main keyword in the first paragraph', norm(pg.para).includes(lead) || (pg.type === 'product' && norm(pg.para).includes(norm(kw.name))), '');
  }
  // headings
  rec(pg, 'H1 exactly one H1', h1s.length === 1, h1s.length + ' h1');
  rec(pg, 'H2 the H1 is the first heading in the document', !!first && first.l === 1, first ? 'h' + first.l + ': ' + first.t.slice(0, 40) : 'no heading');
  let skip = false; for (let i = 1; i < pg.heads.length; i++) if (pg.heads[i].l - pg.heads[i - 1].l > 1) skip = true;
  rec(pg, 'H4 no skipped heading levels', !skip);
  const h2n = pg.heads.filter((h) => h.l === 2).length;
  if (!['policies', 'other'].includes(pg.type)) rec(pg, pg.type === 'blog post' ? 'H5 at least 8 H2 (blogs)' : 'H5 at least 3 H2', h2n >= (pg.type === 'blog post' ? 8 : 3), h2n + ' h2');
  // title / meta
  rec(pg, 'T1 title at most 60 characters', pg.title.length > 0 && pg.title.length <= 60, pg.title.length);
  rec(pg, 'T3 description 110 to 158 characters', pg.desc.length >= 110 && pg.desc.length <= 158, pg.desc.length);
  const h1t = norm((h1s[0] || {}).t);
  rec(pg, 'T6 title, description and H1 unique on the site', (dupTitles.get(norm(pg.title)) || []).length <= 1 && (dupDescs.get(norm(pg.desc)) || []).length <= 1 && (dupH1.get(h1t) || []).length <= 1, '');
  // links
  const inb = (inbound.get(pg.url) || new Set()).size;
  if (pg.url !== '/') rec(pg, 'L1 at least 3 contextual inbound links', inb >= 3, inb + ' inbound');
  const outI = new Set(pg.internal.map((x) => x.p).filter((p) => p !== pg.url)).size;
  if (!['policies', 'other', 'language stub'].includes(pg.type)) rec(pg, pg.type === 'product' ? 'L2 at least 3 contextual internal outbound links' : 'L2 at least 5 contextual internal outbound links', outI >= (pg.type === 'product' ? 3 : 5), outI + ' outbound');
  const authority = pg.external.filter((e) => !COMPETITORS.test(e.u));
  if (pg.type === 'blog post') rec(pg, 'L3 at least 2 outbound authority links (blogs)', authority.length >= 2, authority.length + ' links');
  if (pg.type === 'product') rec(pg, 'L3 at least 1 outbound authority link (products)', authority.length >= 1, authority.length + ' links');
  const dead = pg.external.filter((e) => [404, 410].includes(extStatus.get(e.u)) || (extStatus.get(e.u) || 0) >= 500).length;
  if (pg.external.length) rec(pg, 'L4 no dead external links (404/5xx; 403 is bot-block)', dead === 0, dead + ' dead');
  rec(pg, 'L5 no competitor retailer links', !pg.external.some((e) => COMPETITORS.test(e.u)));
  rec(pg, 'L6 no generic anchor text', ![...pg.internal, ...pg.external].some((l) => GENERIC.test(l.text.trim())));
  // images
  if (pg.imgs.length) {
    rec(pg, 'I1 every image has alt text', pg.imgs.every((i) => i.has && i.alt), pg.imgs.filter((i) => !(i.has && i.alt)).length + ' missing');
    const alts = pg.imgs.map((i) => norm(i.alt)).filter(Boolean);
    rec(pg, 'I3 no duplicate alt text on the page', new Set(alts).size === alts.length);
    if (kw && kw.primary && ['product', 'brand', 'category', 'family'].includes(pg.type)) rec(pg, 'I2 main keyword (or product name) in an image alt', alts.some((a) => a.includes(lead) || (pg.type === 'product' && a.includes(norm(kw.name)))));
  }
  // schema
  const types = pg.ld.map((x) => [].concat(x['@type']).join(','));
  if (pg.url !== '/') rec(pg, 'S1 BreadcrumbList schema', types.some((t) => /BreadcrumbList/.test(t)));
  if (pg.type === 'product') { const pr = pg.ld.find((x) => /Product/.test([].concat(x['@type']).join(','))); rec(pg, 'S2 Product schema with Offer', !!pr && !!pr.offers); }
  if (pg.type === 'blog post') rec(pg, 'S3 BlogPosting schema', types.some((t) => /BlogPosting/.test(t)));
  const faq = pg.ld.find((x) => /FAQPage/.test([].concat(x['@type']).join(',')));
  if (faq) rec(pg, 'S4 FAQPage schema with at least 5 questions', (faq.mainEntity || []).length >= 5, (faq.mainEntity || []).length + ' questions');
  // blog
  if (pg.type === 'blog post') {
    rec(pg, 'B1 at least 1,500 words', pg.words >= 1500, pg.words + ' words');
    rec(pg, 'B2 table of contents', pg.hasToc);
    rec(pg, 'B3 visible updated date', pg.hasUpdated);
    rec(pg, 'B4 five FAQs', !!faq && (faq.mainEntity || []).length >= 5, faq ? (faq.mainEntity || []).length + ' questions' : 'no FAQ');
    rec(pg, 'B5 links to products or collections', pg.internal.some((x) => /^\/(shop|e-bikes|marken)\//.test(x.p)));
  }
  // product
  if (pg.type === 'product') {
    rec(pg, 'P1 at least 400 words', pg.words >= 400, pg.words + ' words');
    const k12 = norm(pg.para).split(' ').slice(0, 12).join(' ');
    rec(pg, 'P2 opening paragraph is not shared with other products', (firstParas.get(k12) || []).length <= 1, (firstParas.get(k12) || []).length + ' share it');
    rec(pg, 'P3 no unconfirmed stock claim in title or description ("sofort lieferbar", "ab Lager")', !/sofort lieferbar|ab lager/i.test(pg.title + ' ' + pg.desc), 'stock is not confirmed by the owner');
  }
}
const typeCount = {}; for (const pg of pages.values()) typeCount[pg.type] = (typeCount[pg.type] || 0) + 1;
const blogs = [...pages.values()].filter((p) => p.type === 'blog post').map((p) => ({ url: p.url, words: p.words, h2: p.heads.filter((h) => h.l === 2).length, ext: p.external.length, inbound: (inbound.get(p.url) || new Set()).size, title: p.title }));
const extBad = [...extStatus.entries()].filter(([u, s]) => [404, 410].includes(s) || s >= 500 || s === 0).map(([u, s]) => ({ u, s, on: [...new Set(extAll.get(u))].slice(0, 3) }));
fs.writeFileSync('.image-work/gate-results.json', JSON.stringify({ base, when: new Date().toISOString(), pages: pages.size, typeCount, results, dupKw: dupKw.map(([k, v]) => ({ k, urls: [...v] })), blogs, extBad, extTotal: extList.length, extStatusCounts: [...extStatus.values()].reduce((a, s) => { a[s] = (a[s] || 0) + 1; return a; }, {}), dupTitles: [...dupTitles.values()].filter((v) => v.length > 1).length, dupDescs: [...dupDescs.values()].filter((v) => v.length > 1).length, dupH1: [...dupH1.values()].filter((v) => v.length > 1).length }));
console.log('pages crawled', pages.size, '| types', JSON.stringify(typeCount));
console.log('rule results', results.length, '| duplicate keywords across URLs:', dupKw.length, '| external links', extList.length, 'bad', extBad.length);
