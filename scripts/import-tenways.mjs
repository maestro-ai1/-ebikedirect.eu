// Imports the Tenways range (official EUR store feed) into the catalogue.
//   node scripts/import-tenways.mjs fetch   -> downloads candidate photos, writes .image-work/tenways.json
//   node scripts/import-tenways.mjs facts   -> prints the facts found in each product text (review step)
// Descriptions are written here from facts; the brand's marketing copy is not reused.
import fs from 'node:fs';
import path from 'node:path';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const BASE = 'https://www.tenways.com';

// handle -> our slug, accessory group (matches the /zubehoer/<group> pages of the keyword map)
export const BIKES = {
  'ago-performance': 'tenways-ago-performance',
  'ago-air': 'tenways-ago-air',
  'ago-x': 'tenways-ago-x',
  'ago-t': 'tenways-ago-t',
  'cgo009': 'tenways-cgo009',
  'cgo-compact': 'tenways-cgo-compact',
  'cgo600': 'tenways-cgo600',
  'cgo800s': 'tenways-cgo800s',
  'cargo-one': 'tenways-cargo-one',
};
export const ACCESSORIES = {
  'abus-chain-lock-iven-8210-140': ['schloesser', 'abus-iven-kettenschloss-140-cm'],
  'abus-iven-chain-lock-8210-85cm': ['schloesser', 'abus-iven-kettenschloss-85-cm'],
  'abus-ring-lock': ['schloesser', 'abus-rahmenschloss'],
  'abus-foldable-lock': ['schloesser', 'abus-faltschloss'],
  'abus-chain-lock': ['schloesser', 'abus-kettenschloss'],
  'tenways-universal-phone-mount': ['handyhalter', 'tenways-universal-handyhalterung'],
  'tenways-adhesive-phone-mount-a': ['handyhalter', 'tenways-klebe-handyhalterung'],
  'eh20-smart-helmet': ['helme', 'tenways-eh20-smart-helm'],
  'tenways-electric-air-pump': ['werkzeug-pflege', 'tenways-elektrische-luftpumpe'],
  'pannier-bag': ['taschen-koerbe', 'tenways-gepaecktasche'],
  'tenways-m-pannier-bag': ['taschen-koerbe', 'tenways-gepaecktasche-m'],
  'tenways-l-pannier-bag': ['taschen-koerbe', 'tenways-gepaecktasche-l'],
  'waist-bag-blue': ['taschen-koerbe', 'tenways-huefttasche'],
  'rain-cover': ['regenschutz-bekleidung', 'tenways-regenschutz'],
  'tenways-child-seat-mik-hd': ['gepaecktraeger-anhaenger', 'tenways-kindersitz-mik-hd'],
  'cgo009-rear-carrier': ['gepaecktraeger-anhaenger', 'tenways-cgo009-gepaecktraeger-hinten'],
  'cgo009-new-edition-front-carrier': ['gepaecktraeger-anhaenger', 'tenways-cgo009-gepaecktraeger-vorne'],
  'cgo-compact-rear-carrier-with-mik-hd': ['gepaecktraeger-anhaenger', 'tenways-cgo-compact-gepaecktraeger-hinten'],
  'ago-air-rear-carrier': ['gepaecktraeger-anhaenger', 'tenways-ago-air-gepaecktraeger'],
  'ago-x-rear-carrier-with-mik-hd': ['gepaecktraeger-anhaenger', 'tenways-ago-x-gepaecktraeger-hinten'],
  'cgo600-pro-rear-carrier': ['gepaecktraeger-anhaenger', 'tenways-cgo600-gepaecktraeger'],
  'mudguards': ['schutzbleche-staender', 'tenways-cgo600-schutzbleche'],
  'ago-air-mudguards': ['schutzbleche-staender', 'tenways-ago-air-schutzbleche'],
  'cgo009-mudguards': ['schutzbleche-staender', 'tenways-cgo009-schutzbleche'],
  'ago-x-special-edition-mudguards': ['schutzbleche-staender', 'tenways-ago-x-schutzbleche'],
  'kickstand': ['schutzbleche-staender', 'tenways-cgo600-seitenstaender'],
  'ago-air-kickstand': ['schutzbleche-staender', 'tenways-ago-air-seitenstaender'],
  'cgo009-kickstand': ['schutzbleche-staender', 'tenways-cgo009-seitenstaender'],
  'cgo600-pro-battery': ['akkus', 'tenways-cgo600-pro-akku'],
  'cgo009-battery': ['akkus', 'tenways-cgo009-akku'],
  'ago-x-battery': ['akkus', 'tenways-ago-x-akku'],
  'ago-t-battery': ['akkus', 'tenways-ago-t-akku'],
};

const strip = (h) => (h || '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

export function factsOf(p) {
  const t = strip(p.body_html);
  const pick = (re) => (t.match(re) || [])[1];
  return {
    text: t,
    wh: pick(/(\d{3,4})\s?Wh/i),
    nm: pick(/(\d{2,3})\s?Nm/i),
    kg: pick(/(\d{1,2}(?:[.,]\d)?)\s?kg/i),
    km: pick(/(\d{2,3})\s?(?:km|miles)/i),
    watt: pick(/(\d{3})\s?W\b/i),
    belt: /belt|riemen|gates/i.test(t),
  };
}

export async function loadFeed() {
  const r = await fetch(`${BASE}/products.json?limit=250`, { headers: { 'user-agent': UA } });
  return (await r.json()).products;
}

if (process.argv[1] && process.argv[1].endsWith('import-tenways.mjs')) {
  const mode = process.argv[2];
  const feed = await loadFeed();
  const by = Object.fromEntries(feed.map((p) => [p.handle, p]));
  if (mode === 'facts') {
    for (const h of Object.keys(BIKES)) {
      const f = factsOf(by[h]);
      console.log(h, '|', by[h].variants.map((v) => v.title).join(' / ').slice(0, 90), '| Wh', f.wh, 'Nm', f.nm, 'kg', f.kg, 'km', f.km, 'W', f.watt, 'belt', f.belt);
      console.log('   ', f.text.slice(0, 380));
    }
  }
  if (mode === 'fetch') {
    fs.mkdirSync('.image-work/cand', { recursive: true });
    const manifest = {};
    const jobs = [...Object.entries(BIKES).map(([h, s]) => [h, s, 3]), ...Object.entries(ACCESSORIES).map(([h, [, s]]) => [h, s, 2])];
    for (const [handle, slug, max] of jobs) {
      const p = by[handle];
      if (!p) { console.log('missing', handle); continue; }
      manifest[slug] = [];
      const dir = path.join('.image-work/cand', slug);
      fs.mkdirSync(dir, { recursive: true });
      let n = 0;
      for (const im of p.images.slice(0, max + 2)) {
        if (n >= max + 1) break;
        try {
          const url = im.src.split('?')[0];
          const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
          if (!r.ok) continue;
          const buf = Buffer.from(await r.arrayBuffer());
          if (buf.length < 6000) continue;
          n++;
          const ext = (url.match(/\.(jpe?g|png|webp)$/i) || ['', 'jpg'])[1].toLowerCase();
          fs.writeFileSync(path.join(dir, `${n}.${ext}`), buf);
          manifest[slug].push({ n, url });
        } catch { /* skip */ }
      }
      console.log(slug, manifest[slug].length);
    }
    fs.writeFileSync('.image-work/tenways.json', JSON.stringify(manifest, null, 1));
  }
}
