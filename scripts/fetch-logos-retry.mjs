// Second pass for logos that were rate limited: slower, with the exact Commons file names found by search.
import fs from 'node:fs';
import path from 'node:path';
const UA = 'ebikedirect-logo-fetch/1.0 (dealer site, contact via site owner)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = '.image-work/logos';
const FILES = {
  winora: 'Winora Logo (Winora Group).svg',
  ghost: 'Ghost-Bikes logo.svg',
  ktm: 'KTM Bike Industries.svg',
  trek: '2018 Trek logo word mark black.svg',
  giant: 'Giant bycicles logo.svg',
  brompton: 'Brompton Bicycle logo.svg',
};
for (const [slug, title] of Object.entries(FILES)) {
  const ext = (title.match(/\.(svg|png|jpg)$/i) || ['', 'svg'])[1].toLowerCase();
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  let ok = 0;
  for (let i = 0; i < 5 && !ok; i++) {
    await sleep(6000 + i * 6000);
    const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(out, `${slug}.${ext}`), buf);
      ok = buf.length;
    } else console.log('  retry', slug, r.status);
  }
  console.log(slug, title, ok);
}
