// Step 1 of the image pipeline: collect candidate photo URLs from product pages and download them
// into .image-work/cand/<slug>/<n>.<ext>. Candidates are reviewed on a contact sheet before use.
// Usage: node scripts/fetch-candidates.mjs
import fs from 'node:fs';
import path from 'node:path';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const PAGES = {
  'kalkhoff-endeavour-5-advance-plus': ['https://www.fahrrad-xxl.de/kalkhoff-endeavour-5-advance-m000103335'],
  'kalkhoff-entice-5-advance-plus': ['https://www.fahrrad-xxl.de/kalkhoff-entice-5-advance-belt-m000093764'],
  'kalkhoff-image-3-advance': ['https://www.fahrrad-xxl.de/kalkhoff-image-3-advance-m000103352'],
  'haibike-trekking-4-low': ['https://www.fahrrad-xxl.de/haibike-trekking-4-low-m000105662'],
  'haibike-trekking-5-high-28': ['https://www.mtbiker.shop/shop/e-bikes/trekking/haibike-trekking-5-high-28-electric-bike-olive-red-p405253.html'],
  'tenways-cgo600-pro': ['https://simplebikestore.eu/de/tenways-cgo600-pro.html'],
  'riese-mueller-charger5-vario': ['https://www.fahrrad-xxl.de/riese-und-mueller-charger5-vario-m000105109'],
};
const out = '.image-work/cand';
fs.mkdirSync(out, { recursive: true });
const manifest = {};

for (const [slug, pages] of Object.entries(PAGES)) {
  const urls = [];
  for (const p of pages) {
    try {
      const r = await fetch(p, { headers: { 'user-agent': UA, 'accept-language': 'de-DE,de;q=0.9' }, signal: AbortSignal.timeout(25000) });
      const html = (await r.text()).replace(/\\\//g, '/');
      const fromLd = [...html.matchAll(/"image"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)].flatMap((m) => [...m[1].matchAll(/https?:\/\/[^"\s]+/g)].map((x) => x[0]));
      const og = [...html.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)/gi)].map((m) => m[1]);
      urls.push(...fromLd, ...og);
    } catch (e) { console.log('page error', p, e.message); }
  }
  const uniq = [...new Set(urls.map((u) => u.replace(/&amp;/g, '&')))].filter((u) => /\.(jpe?g|png|webp)/i.test(u)).slice(0, 10);
  manifest[slug] = [];
  fs.mkdirSync(path.join(out, slug), { recursive: true });
  let n = 0;
  for (const u of uniq) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 8000) continue;
      const ext = (u.match(/\.(jpe?g|png|webp)/i) || ['', 'jpg'])[1].toLowerCase();
      n++;
      const file = path.join(out, slug, `${n}.${ext}`);
      fs.writeFileSync(file, buf);
      manifest[slug].push({ n, url: u, bytes: buf.length });
    } catch (e) { /* skip */ }
  }
  console.log(slug, 'candidates:', manifest[slug].length);
}
fs.writeFileSync('.image-work/manifest.json', JSON.stringify(manifest, null, 1));
