// Fetches brand logos (dealer use) into .image-work/logos. Sources: Wikimedia Commons files and brand sites.
// Logos are trademarks of their owners and are shown only to identify the brands the shop sells.
// node scripts/fetch-logos.mjs
import fs from 'node:fs';
import path from 'node:path';

const UA = 'ebikedirect-logo-fetch/1.0 (dealer site, contact via site owner)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = '.image-work/logos';
fs.mkdirSync(out, { recursive: true });

// slug -> Commons file title
const FILES = {
  kalkhoff: 'Kalkhoff-Logo.svg',
  haibike: 'Logo Haibike.svg',
  'riese-und-mueller': 'Riese-und-Müller Logo.png',
  cube: 'CUBE Logo neu.svg',
  specialized: 'Specialized wordmark.svg',
  gazelle: 'Gazelle Bikes wordmark.svg',
  canyon: 'CanyonBicycles.svg',
  focus: 'FOCUS Bikes Logo schwarz.svg',
  winora: 'Logo Winora.svg',
};
// brands still to search on Commons
const SEARCH = { ghost: 'Ghost Bikes logo', ktm: 'KTM Bike Industries logo', trek: 'Trek Bicycle logo', giant: 'Giant Bicycles logo', brompton: 'Brompton Bicycle logo' };

async function commonsSearch(q) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=6&format=json`, { headers: { 'user-agent': UA } });
    const t = await r.text();
    if (t.startsWith('{')) return JSON.parse(t).query?.search?.map((s) => s.title.replace(/^File:/, '')) || [];
    await sleep(5000 * (i + 1));
  }
  return [];
}

async function download(slug, title) {
  const ext = (title.match(/\.(svg|png|jpg|jpeg)$/i) || ['', 'svg'])[1].toLowerCase();
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(out, `${slug}.${ext}`), buf);
      return buf.length;
    }
    await sleep(4000 * (i + 1));
  }
  return 0;
}

const report = {};
for (const [slug, title] of Object.entries(FILES)) {
  report[slug] = await download(slug, title);
  console.log(slug, title, report[slug]);
  await sleep(2500);
}
for (const [slug, q] of Object.entries(SEARCH)) {
  const hits = await commonsSearch(q);
  console.log('search', slug, hits.join(' | '));
  const pick = hits.find((h) => /\.svg$/i.test(h) && /logo|wordmark/i.test(h)) || hits.find((h) => /\.(svg|png)$/i.test(h) && /logo|wordmark/i.test(h));
  if (pick) { report[slug] = await download(slug, pick); console.log('  ->', pick, report[slug]); }
  await sleep(3500);
}
