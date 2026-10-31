// Builds data/keywords/<locale>.json from the keyword bank in the project root.
// de: parsed from the approved-draft map (02-site-architecture/de-keyword-map-v0.2.md).
// other markets: no page map exists yet, so they get a head-term seed (home primary
// plus an on-topic transactional/commercial pool) taken from <cc>_golden_candidates.csv.
// Run from the repo root: node scripts/build-keywords.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bank = path.resolve(root, '..');
const outDir = path.join(root, 'data', 'keywords');
fs.mkdirSync(outDir, { recursive: true });

const SIG = {
  fr: /(v[ée]los?\s+[ée]lectriques?|v[ée]lo\s+[àa]\s+assistance|\bvae\b|vtt\s+[ée]lectrique|e[\s-]?bike|ebike|v[ée]lo\s+cargo)/i,
  it: /(bici(cletta)?\s+elettric|e[\s-]?bike|ebike|pedelec)/i,
  es: /(bici(cleta)?\s+el[ée]ctric|e[\s-]?bike|ebike)/i,
  nl: /(elektrische\s+fiets|e[\s-]?bike|ebike|bakfiets|speed\s+pedelec)/i,
  pt: /(bicicleta\s+el[ée]trica|e[\s-]?bike|ebike)/i,
  at: /(e[\s-]?bike|ebike|elektro[\s-]?(fahr|rad|bike|mountain|lasten|klapp)|elektrofahrrad|pedelec|lastenrad|e[\s-]?mtb)/i,
  ch: /(e[\s-]?bike|ebike|elektro[\s-]?(fahr|rad|velo|bike)|elektrovelo|pedelec|e[\s-]?mtb)/i,
};
const JUNK = /(auto\b|trottinette|patinete|scooter|roller|versicherung|ventilator|bbq|cinta de correr|draisienne|troc velo)/i;
const HOME = {
  fr: /^v[ée]los? [ée]lectriques?$|^v[ée]lo [ée]lectrique /i,
  nl: /^elektrische fietsen?$|^elektrische fiets /i,
  it: /^bici(cletta)? elettric/i,
  es: /^bici(cleta)? el[ée]ctric/i,
  pt: /^bicicletas? el[ée]tricas?$/i,
};
const COMPETITOR = /(decathlon|olx|worten|intersport|leclerc|amazon|lidl|aldi|carrefour|bol\.com|mediamarkt|fnac|boulanger|cdiscount|auchan|halfords|coolblue|gamma|troc|leboncoin|marktplaats|subito|wallapop|milanuncios|btwin|rockrider)/i;
const NOISE = /(\bbicycles?\b|bike e bike|electric bikes|\bfat bike bike\b|\bbike bike\b)/i;
const inRule = (vol, kd) => kd !== null && ((kd <= 28 && vol >= 50) || (kd >= 29 && kd <= 30 && vol >= 100));

function parseCsv(t) {
  const rows = [];
  let r = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { r.push(f); f = ''; }
    else if (c === '\n') { r.push(f.replace(/\r$/, '')); rows.push(r); r = []; f = ''; }
    else f += c;
  }
  if (f || r.length) { r.push(f); rows.push(r); }
  return rows;
}

const intentCode = (s) => (/Transactional/.test(s) ? 'T' : /Commercial/.test(s) ? 'C' : /Navigational/.test(s) ? 'N' : /Informational/.test(s) ? 'I' : '');

// ---------- DE: parse the page map ----------
function buildDe() {
  const md = fs.readFileSync(path.join(bank, '02-site-architecture', 'de-keyword-map-v0.2.md'), 'utf8').split('\n');
  const typeOf = { 'BRAND HUBS': 'brand', 'HOME PAGE': 'home', CATEGORIES: 'category', ACCESSORIES: 'accessory' };
  let type = '';
  const pages = [];
  let cur = null;
  const kwRe = /^(.+?) \(vol (\d+), KD (\d+|null), ([A-Z]?)\)/;
  for (const line of md) {
    const h1 = line.match(/^# (BRAND HUBS|HOME PAGE|CATEGORIES|ACCESSORIES)/);
    if (h1) { type = typeOf[h1[1]]; continue; }
    const h2 = line.match(/^## (\/\S*)\s+\((.+)\)\s*$/);
    if (h2) { cur = { url: h2[1], type, name: h2[2], primary: null, secondary: [], held: [] }; pages.push(cur); continue; }
    if (!cur) continue;
    let m = line.match(/^- Primary: \*\*(.+?)\*\* \(vol (\d+), KD (\d+|null), ([A-Z]?)\)/);
    if (m) { cur.primary = { keyword: m[1], volume: +m[2], kd: m[3] === 'null' ? null : +m[3], intent: m[4] }; continue; }
    m = line.match(/^- Secondary \d+: (.+)$/);
    if (m) {
      const k = m[1].match(kwRe);
      if (k) cur.secondary.push({ keyword: k[1], volume: +k[2], kd: k[3] === 'null' ? null : +k[3], intent: k[4] });
      continue;
    }
    m = line.match(/^- Held .*?: (.+)$/);
    if (m) cur.held = m[1].split('; ').map((s) => s.replace(/\s*\(.*\)$/, ''));
  }
  return { locale: 'de', market: 'DE (also serves AT and CH)', status: 'draft-map-v0.2', pages };
}

// ---------- other markets: head-term seed ----------
function buildSeed(locale, cc) {
  const p = path.join(bank, '03-keywords', 'by-market', cc, `${cc}_golden_candidates.csv`);
  const rows = parseCsv(fs.readFileSync(p, 'utf8')).slice(1).filter((r) => r[0]);
  const all = rows.map((r) => ({ keyword: r[0], intent: intentCode(r[1]), volume: +r[2] || 0, kd: r[3] === '' ? null : +r[3] }));
  const on = all.filter((x) => SIG[cc].test(x.keyword) && !JUNK.test(x.keyword) && !NOISE.test(x.keyword) && inRule(x.volume, x.kd));
  const byVol = [...on].sort((a, b) => b.volume - a.volume);
  const tc = byVol.filter((x) => (x.intent === 'T' || x.intent === 'C') && !COMPETITOR.test(x.keyword));
  const home = (HOME[cc] && byVol.find((x) => HOME[cc].test(x.keyword))) || byVol[0] || null;
  const pool = tc.filter((x) => !home || x.keyword !== home.keyword).slice(0, 60);
  return {
    locale,
    market: cc.toUpperCase(),
    status: 'seed-only: no page map yet, needs Semrush head terms + stock check',
    pages: home ? [{ url: '/', type: 'home', name: 'Home', primary: home, secondary: pool.slice(0, 5), held: [] }] : [],
    pool,
  };
}

const out = {
  de: buildDe(),
  fr: buildSeed('fr', 'fr'),
  nl: buildSeed('nl', 'nl'),
  it: buildSeed('it', 'it'),
  es: buildSeed('es', 'es'),
  pt: buildSeed('pt', 'pt'),
};
// AT and CH share the German site; their banks are kept as extra German pools.
out.de.regionalPools = {
  at: buildSeed('de', 'at').pool,
  ch: buildSeed('de', 'ch').pool,
};

for (const [loc, data] of Object.entries(out)) {
  fs.writeFileSync(path.join(outDir, `${loc}.json`), JSON.stringify(data, null, 1));
  const pg = data.pages.length;
  const withP = data.pages.filter((x) => x.primary).length;
  const full = data.pages.filter((x) => x.secondary.length >= 5).length;
  console.log(`${loc}: pages ${pg}, with primary ${withP}, with 5 secondaries ${full}, pool ${(data.pool || []).length}`);
}
