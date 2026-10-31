// Imports e-bike models of a brand from retailer product pages (Fahrrad XXL): model name, specs, the
// manufacturer's list price (UVP, footnote 1) and the studio photo. Descriptions are written here from
// the facts. Models without a stated UVP are skipped because our price rule needs the RRP.
//   node scripts/import-xxl.mjs list  <Brand>            -> shows the models found
//   node scripts/import-xxl.mjs fetch <Brand> [max=12]   -> downloads candidate photos, writes .image-work/xxl-<brand>.json
//   node scripts/import-xxl.mjs build [v1]               -> places photos, writes lib/catalog-xxl.ts from all fetched brands
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const H = { 'user-agent': UA, 'accept-language': 'de-DE,de;q=0.9' };
const ORIGIN = 'https://www.fahrrad-xxl.de';
const BRANDS = {
  Kalkhoff: 'kalkhoff', Haibike: 'haibike', 'Riese & Müller': 'riese-und-mueller', Cube: 'cube', Focus: 'focus', Winora: 'winora',
  Ghost: 'ghost', KTM: 'ktm', Specialized: 'specialized', Trek: 'trek', Giant: 'giant', Rotwild: 'rotwild', 'M1 Sporttechnik': 'm1-sporttechnik', Gazelle: 'gazelle', Brompton: 'brompton', QWIC: 'qwic',
};
const CATS = [['E-Trekking', 'e-bike-trekking'], ['E-City', 'e-bike-city'], ['E-MTB', 'e-bike-mtb'], ['Cargo-E-Bike', 'e-bike-lastenrad'], ['Speed-Pedelec', 'e-bike-speed-pedelec']];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slugify = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const num = (s) => Number(String(s).replace(/\./g, '').replace(',', '.'));
const q2 = (n) => Math.round(n * 100) / 100;
const decode = (s) => s.replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö').replace(/&uuml;/g, 'ü').replace(/&Auml;/g, 'Ä').replace(/&Ouml;/g, 'Ö').replace(/&Uuml;/g, 'Ü').replace(/&szlig;/g, 'ß').replace(/&amp;/g, '&').replace(/&euro;/g, '€').replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'");

async function get(url) {
  const r = await fetch(url, { headers: H, signal: AbortSignal.timeout(30000) });
  return r.ok ? (await r.text()).replace(/\\\//g, '/') : null;
}
const linksOf = (html) => [...new Set([...html.matchAll(/\/([a-z0-9-]+-m0\d{5,})/g)].map((m) => m[1]))];

async function modelLinks(brandSlug) {
  // current models only: season 2026 and 2027 brand pages
  const seasons = [];
  for (const y of [2026, 2027]) { const h = await get(`${ORIGIN}/marken/${brandSlug}/saison.${y}/`); if (h) seasons.push(...linksOf(h)); await sleep(250); }
  const all = seasons.join(' ');
  const byCat = {};
  for (const [cat, seg] of CATS) {
    const h = await get(`${ORIGIN}/fahrraeder/e-bike/${seg}/marke.${brandSlug}/`);
    if (h) for (const l of linksOf(h)) byCat[l] = byCat[l] || cat;
    await sleep(250);
  }
  const links = [...new Set(seasons)];
  return links.map((l) => ({ link: l, cat: byCat[l] || null }));
}

const LABELS = ['Motor', 'Display', 'Akku', 'Schaltung', 'Bremsen', 'Bremsen vorne', 'Bremsen hinten', 'Gabel', 'Rahmen', 'Rahmenform', 'Reifen (vorne)', 'Reifen (hinten)', 'Drehmoment', 'Gewicht in kg', 'Federung', 'Laufradgröße', 'Motorposition', 'Rahmenmaterial', 'Riemen', 'Gänge', 'Antrieb', 'Ladegerät', 'Schutzbleche', 'Beleuchtung', 'Gepäckträger', 'Ständer', 'Rahmenset', 'Gewicht'];

async function readPage(link) {
  const html = await get(`${ORIGIN}/${link}`);
  if (!html) return null;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean).flat();
  const prods = ld.filter((o) => o['@type'] === 'Product');
  if (!prods.length) return null;
  const first = prods[0];
  const images = [...new Set(prods.flatMap((p) => [].concat(p.image || [])).map((u) => u.split('?')[0]))];
  const price = Number(first.offers?.price);
  const strike = html.match(/data-basis>\s*([\d.]+(?:,\d+|,-)?)\s*&euro;\s*<\/span><span[^>]*strike-price-note">\s*&sup(\d);/);
  const uvp = strike && strike[2] === '1' ? num(strike[1].replace(',-', '')) : null;
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, '\n');
  const lines = text.split('\n').map((l) => decode(l).replace(/\s+/g, ' ').trim()).filter(Boolean);
  const specs = {};
  for (const key of LABELS) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== key) continue;
      let j = i + 1;
      while (j < lines.length && lines[j] === key) j++;
      const v = lines[j];
      if (v && v.length < 140 && !LABELS.includes(v) && !/^(Zulässiges|Bitte beachte)/.test(v)) { specs[key] = v; break; }
    }
  }
  const parts = decode(first.name).split(' - ');
  return { link, name: decode(first.name), model: parts[0], parts, price, uvp, images, specs, brand: first.brand };
}

const mode = process.argv[2];
if (mode === 'list' || mode === 'fetch') {
  const brand = process.argv[3];
  const max = Number(process.argv[4] || 12);
  const bs = BRANDS[brand];
  if (!bs) throw new Error('unknown brand ' + brand);
  const found = await modelLinks(bs);
  const seen = new Set();
  const models = [];
  for (const { link, cat } of found) {
    if (models.length >= max) break;
    const p = await readPage(link);
    await sleep(350);
    if (!p || !p.specs.Motor) continue; // e-bikes only
    const key = p.parts.slice(0, 3).join('|').toLowerCase(); // model + battery + wheel size: frame forms and colours are variants
    if (seen.has(key)) continue;
    seen.add(key);
    p.cat = cat;
    models.push(p);
  }
  console.log(brand, 'links', found.length, 'unique models read', models.length);
  const keep = [];
  for (const m of models) {
    // a shop price without cents and without strike-through is the list price itself
    if (!m.uvp && Number.isInteger(m.price)) m.uvp = m.price;
    const ok = m.uvp && m.images.length;
    console.log(ok ? 'OK  ' : 'SKIP', m.cat || '-', '|', m.parts.slice(0, 4).join(' - '), '| uvp', m.uvp, '| shop', m.price, '| imgs', m.images.length, '| motor', (m.specs.Motor || '').slice(0, 40));
    if (ok) keep.push(m);
  }
  if (mode === 'fetch') {
    fs.mkdirSync('.image-work/cand', { recursive: true });
    const out = [];
    for (const m of keep) {
      const slug = slugify(`${m.parts[0]} ${m.parts[1] || ''} ${m.parts[2] || ''}`);
      const dir = path.join('.image-work/cand', slug);
      fs.mkdirSync(dir, { recursive: true });
      let n = 0;
      const imgs = [];
      for (const u of m.images.slice(0, 3)) {
        try {
          const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
          if (!r.ok) continue;
          const buf = Buffer.from(await r.arrayBuffer());
          if (buf.length < 8000) continue;
          n++;
          fs.writeFileSync(path.join(dir, `${n}.jpg`), buf);
          imgs.push({ n, url: u });
        } catch { /* skip */ }
      }
      out.push({ slug, brand, cat: m.cat, name: m.model, parts: m.parts, uvp: m.uvp, shop: m.price, specs: m.specs, images: imgs, page: `${ORIGIN}/${m.link}` });
    }
    fs.writeFileSync(`.image-work/xxl-${slugify(brand)}.json`, JSON.stringify(out, null, 1));
    console.log('candidates written for', out.length, 'models');
  }
}

// Category mode: models of any brand from a category listing (current seasons), e.g. S-Pedelec or cargo.
//   node scripts/import-xxl.mjs fetchcat <Category> <listing-slug> [max]   e.g. Speed-Pedelec e-bike-45km-h 12
if (mode === 'fetchcat') {
  const cat = process.argv[3];
  const seg = process.argv[4];
  const max = Number(process.argv[5] || 12);
  let links = [];
  for (const y of [2026, 2027]) {
    const h = await get(`${ORIGIN}/fahrraeder/e-bike/${seg}/saison.${y}/`);
    if (h) links.push(...linksOf(h));
    await sleep(250);
  }
  if (!links.length) { const h = await get(`${ORIGIN}/fahrraeder/e-bike/${seg}/`); if (h) links = linksOf(h); }
  links = [...new Set(links)];
  const seen = new Set();
  const keep = [];
  for (const link of links) {
    if (keep.length >= max) break;
    const p = await readPage(link);
    await sleep(350);
    if (!p || !p.specs.Motor) continue;
    const key = p.parts.slice(0, 3).join('|').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (!p.uvp && Number.isInteger(p.price)) p.uvp = p.price;
    const ok = p.uvp && p.images.length;
    console.log(ok ? 'OK  ' : 'SKIP', p.brand, '|', p.parts.slice(0, 4).join(' - '), '| uvp', p.uvp, '| shop', p.price, '| imgs', p.images.length);
    if (ok) keep.push(p);
  }
  fs.mkdirSync('.image-work/cand', { recursive: true });
  const out = [];
  for (const m of keep) {
    const slug = slugify(`${m.parts[0]} ${m.parts[1] || ''} ${m.parts[2] || ''}`);
    const dir = path.join('.image-work/cand', slug);
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    const imgs = [];
    for (const u of m.images.slice(0, 3)) {
      try {
        const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 8000) continue;
        n++;
        fs.writeFileSync(path.join(dir, `${n}.jpg`), buf);
        imgs.push({ n, url: u });
      } catch { /* skip */ }
    }
    out.push({ slug, brand: m.brand, cat, name: m.model, parts: m.parts, uvp: m.uvp, shop: m.price, specs: m.specs, images: imgs, page: `${ORIGIN}/${m.link}` });
  }
  fs.writeFileSync(`.image-work/xxl-cat-${slugify(cat)}.json`, JSON.stringify(out, null, 1));
  console.log('category candidates written for', out.length, 'models');
}
