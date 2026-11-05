// Usage: node scripts/_linkcheck.mjs url1 url2 ...   or   node scripts/_linkcheck.mjs --posts  (checks every external link in content/blog/de)
import fs from 'node:fs';
let urls = process.argv.slice(2);
if (urls[0] === '--posts') {
  const d = 'content/blog/de/';
  const set = new Set();
  for (const f of fs.readdirSync(d)) for (const m of fs.readFileSync(d + f, 'utf8').matchAll(/\]\((https?:[^)\s]+)\)/g)) set.add(m[1]);
  urls = [...set];
}
for (const u of urls) {
  try {
    const r = await fetch(u, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }, signal: AbortSignal.timeout(20000) });
    console.log(r.status, u);
  } catch (e) {
    console.log('ERR', u, String(e.cause?.code || e.message).slice(0, 60));
  }
}
