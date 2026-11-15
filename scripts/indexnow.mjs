// IndexNow: tells Bing, Yandex, Seznam, Naver and other participating engines that URLs are new or changed (Google does not use it).
// The key file lives at /<key>.txt (public/). usage: node scripts/indexnow.mjs <url-list.txt | --sitemap-group de-pages,en-pages,fr-pages>  [base=https://ebikedirect.eu]
import fs from 'fs';
const base = 'https://ebikedirect.eu';
const key = fs.readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace('.txt', '');
if (!key) throw new Error('no key file in public/');
let urls = [];
const a = process.argv.slice(2);
if (a[0] === '--sitemap-group') {
  for (const g of a[1].split(',')) { const x = await (await fetch(`${base}/sitemap/${g}.xml`)).text(); urls.push(...[...x.matchAll(/<url>\s*<loc>([^<]*)<\/loc>/g)].map((m) => m[1])); }
} else urls = fs.readFileSync(a[0], 'utf8').split(/\r?\n/).filter(Boolean);
urls = [...new Set(urls)].slice(0, 10000);
const r = await fetch('https://api.indexnow.org/IndexNow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: 'ebikedirect.eu', key, keyLocation: `${base}/${key}.txt`, urlList: urls }) });
console.log('submitted', urls.length, 'urls | status', r.status, await r.text());
