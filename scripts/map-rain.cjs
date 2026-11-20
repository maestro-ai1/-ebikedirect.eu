// Golden Keyword Rule mapping of the rain-clothing accessory page (de/fr/en) and of the 7 AGU rain-gear products, from the REFRESHED banks only.
// Page: primary = highest-volume Transactional that fits; a Commercial one replaces it when it has 2x or more the volume (rule P5) or when no Transactional exists; 5 secondaries = next T/C by volume; 5 FAQ = next by volume (any intent).
// Product: name-based primary stays (unique per product); 5 secondaries (T/C) and 5 FAQ from the keyword family of the product (shared inside a family, never a page primary).
// usage: node scripts/map-rain.cjs [--dry]
const fs = require('fs');
const dry = process.argv.includes('--dry');
const root = 'C:/electric bikes europe/03-keywords/by-market/';
const pl = (l) => { const o = []; let s = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { s += '"'; i++; } else q = false; } else s += c; } else if (c === '"') q = true; else if (c === ',') { o.push(s); s = ''; } else s += c; } o.push(s); return o; };
const IT = (x) => (/Transactional/.test(x) ? 'T' : /Commercial/.test(x) ? 'C' : /Navigational/.test(x) ? 'N' : /Informational/.test(x) ? 'I' : '-');
const HEAD = /^agu (velo|cyclisme|bekleidung|fahrradbekleidung)$/i;
const UNSOLD = /(castelli|gore|shimano|sidi|endura|vaude|northwave|giro|specialized|bontrager|assos|rapha|sportful|pearl izumi|showers pass|altura|proviz|btwin|b.twin|rockbros|lidl|aldi|rose|decathlon|dhb|ale|craft|sealskinz|lusso|chrome|ortlieb|vaude|jack wolfskin|tchibo)\b/i;
const nk = (x) => x.toLowerCase().split(/[^a-zäöüßéèêàçôûîœ0-9]+/).filter(Boolean).sort().join(' ');
const kdOk = (v, kd) => kd == null || kd <= (v >= 1000 ? 30 : 28);
const M = {
  de: { dir: 'de', file: 'de_master_merged.csv', ref: 'de_refreshed_keys.json', live: 'data/keywords/de.json', prods: 'data/keywords/products.json', page: '/zubehoer/regenschutz-bekleidung/',
    fit: /(regen|überschuh|ueberschuh|poncho|cape|wasserdicht|^agu )/i, no: /(rennrad|gravel|mtb|kinder|hund|abdeck|hülle|huelle|tasche|handschuh|gebraucht|test|erfahrung|ebay|amazon|decathlon|leasing|mieten|motorrad|auto|wander|computer|fahrradschuh)/i,
    fam: { 'agu-langarm-regenponcho-urban-outdoor': /(poncho|cape)/i, 'agu-original-premium-regenjacke': /(jacke|mantel)/i, 'agu-rainguard-regenjacke': /(jacke|mantel)/i, 'agu-rainguard-regenhose': /hose/i, 'agu-original-regenanzug-essential': /(anzug|jacke|hose|bekleidung)/i, 'agu-tech-regen-ueberschuhe-commuter-hi-vis': /(überschuh|ueberschuh|schuh|overshoes)/i, 'agu-winter-regen-ueberschuhe-commuter': /(überschuh|ueberschuh|schuh|overshoes)/i } },
  fr: { dir: 'fr', file: 'fr_master_merged.csv', ref: 'fr_refreshed_keys.json', live: 'data/keywords/fr-live.json', prods: 'data/keywords/fr-products.json', page: '/accessoires/pluie-vetements/',
    fit: /(pluie|poncho|cape|imperm|surchaussure|couvre|k.?way|surpantalon|^agu )/i, no: /(sacoche|sac |housse|cargo|longtail|casquette|gant|moto|auto|voiture|b[eé]b[eé]|chien|occasion|avis|test|amazon|decathlon|leclerc|location)/i,
    fam: { 'agu-langarm-regenponcho-urban-outdoor': /(poncho|cape)/i, 'agu-original-premium-regenjacke': /(veste|imperm|coupe|k.?way)/i, 'agu-rainguard-regenjacke': /(veste|imperm|coupe|k.?way)/i, 'agu-rainguard-regenhose': /(pantalon|surpantalon)/i, 'agu-original-regenanzug-essential': /(ensemble|tenue|veste|pantalon|vetement|vêtement)/i, 'agu-tech-regen-ueberschuhe-commuter-hi-vis': /(surchaussure|couvre)/i, 'agu-winter-regen-ueberschuhe-commuter': /(surchaussure|couvre)/i } },
  en: { dir: 'uk', file: 'uk_master_merged.csv', ref: 'uk_refreshed_keys.json', live: 'data/keywords/en-live.json', prods: 'data/keywords/en-products.json', page: '/accessories/rain-clothing/',
    fit: /(rain|waterproof|poncho|cape|overshoe|shoe cover|overtrouser)/i, no: /(gloves?|mitts?|shoes$|cycling shoes|disposable|bag|pannier|cover for|bike cover|running|hiking|golf|kids|girls|boys|dog|baby|second.?hand|used|review|test|ebay|amazon|halfords|decathlon|argos|hire|rental|mens? only|motorcycle|motorbike|uk$)/i,
    fam: { 'agu-langarm-regenponcho-urban-outdoor': /(poncho|cape)/i, 'agu-original-premium-regenjacke': /jacket/i, 'agu-rainguard-regenjacke': /jacket/i, 'agu-rainguard-regenhose': /(trouser|overtrouser|pants)/i, 'agu-original-regenanzug-essential': /(suit|jacket|trouser)/i, 'agu-tech-regen-ueberschuhe-commuter-hi-vis': /(overshoe|shoe cover)/i, 'agu-winter-regen-ueberschuhe-commuter': /(overshoe|shoe cover)/i } },
};
const log = {}; const exhausted = {}; const PFX = { de: '', fr: '/fr', en: '/en' };
for (const [m, c] of Object.entries(M)) {
  const ref = new Set(JSON.parse(fs.readFileSync(root + c.dir + '/' + c.ref, 'utf8'))); const rows = [];
  for (const l of fs.readFileSync(root + c.dir + '/' + c.file, 'utf8').split(/\r?\n/).slice(1)) { if (!l) continue; const p = pl(l); const k = p[0].toLowerCase(); const v = +p[2] || 0, kd = p[3] === '' ? null : +p[3]; if (!ref.has(k) || v < 10 || !kdOk(v, kd) || !c.fit.test(k) || c.no.test(k) || UNSOLD.test(k) || HEAD.test(k)) continue; rows.push({ keyword: k, intent: IT(p[1]), volume: v, kd }); }
  rows.sort((a, b) => b.volume - a.volume);
  const T = rows.filter((r) => r.intent === 'T'), C = rows.filter((r) => r.intent === 'C');
  let prim = T[0] || C[0]; if (T[0] && C[0] && C[0].volume >= 2 * T[0].volume) prim = C[0];
  const rest = rows.filter((r) => r !== prim && nk(r.keyword) !== nk(prim.keyword)); const sec = rest.filter((r) => r.intent === 'T' || r.intent === 'C').sort((a, b) => b.volume - a.volume).slice(0, 5); const faq = rest.filter((r) => !sec.includes(r)).slice(0, 5);
  log[m] = { primary: prim, secondary: sec, faq };
  console.log(`== ${m} page ${c.page}\n  PRIMARY ${prim.keyword} ${prim.intent} ${prim.volume} KD ${prim.kd}\n  SECONDARY ${sec.map((r) => r.keyword + ' ' + r.intent + ' ' + r.volume).join(' | ')}${sec.length < 5 ? '  <<< only ' + sec.length : ''}\n  FAQ ${faq.map((r) => r.keyword + ' ' + r.intent + ' ' + r.volume).join(' | ')}`);
  // products
  const prodLog = {};
  for (const [slug, re] of Object.entries(c.fam)) { const pool = rows.filter((r) => re.test(r.keyword) && nk(r.keyword) !== nk(prim.keyword)); const ps = pool.filter((r) => r.intent === 'T' || r.intent === 'C').slice(0, 5); const pf = pool.filter((r) => !ps.includes(r)).slice(0, 5); prodLog[slug] = { secondary: ps, faq: pf }; if (ps.length < 5) exhausted[PFX[m] + '/shop/' + slug] = { available: ps.length, note: 'all eligible T/C keywords of the refreshed bank are stored; fewer than five exist' }; console.log(`  ${slug.slice(4, 30).padEnd(26)} sec ${ps.length}: ${ps.map((r) => r.keyword + ' ' + r.volume).join(', ')} | faq ${pf.length}`); }
  if (!dry) {
    const L = JSON.parse(fs.readFileSync(c.live, 'utf8')); const pg = L.pages.find((x) => x.url === c.page); fs.copyFileSync(c.live, c.live + '.pre-rainmap');
    const old = pg.primary; pg.primary = { keyword: prim.keyword, volume: prim.volume, kd: prim.kd, intent: prim.intent, source: 'bank' }; pg.secondary = sec.map((r) => ({ keyword: r.keyword, volume: r.volume, kd: r.kd, intent: r.intent })); pg.faq = faq.map((r) => ({ keyword: r.keyword, volume: r.volume, kd: r.kd, intent: r.intent })); if (pg.display !== undefined) pg.display = prim.keyword.charAt(0).toUpperCase() + prim.keyword.slice(1);
    fs.writeFileSync(c.live, JSON.stringify(L, null, 1)); log[m].was = old;
    const P = JSON.parse(fs.readFileSync(c.prods, 'utf8')); fs.copyFileSync(c.prods, c.prods + '.pre-rainmap');
    for (const [slug, v] of Object.entries(prodLog)) { const e = P.products[slug]; e.secondary = v.secondary.map((r) => ({ keyword: r.keyword, volume: r.volume, kd: r.kd, intent: r.intent })); e.faq = v.faq.map((r) => ({ keyword: r.keyword, volume: r.volume, kd: r.kd, intent: r.intent })); }
    fs.writeFileSync(c.prods, JSON.stringify(P, null, 1));
  }
}
fs.writeFileSync('data/keywords/m6-exhausted.json', JSON.stringify(exhausted, null, 1));
fs.writeFileSync('.image-work/map-rain-log.json', JSON.stringify(log, null, 1)); console.log(dry ? 'dry run, nothing written' : 'written; backups .pre-rainmap');
