// scans every sitemap URL: repeated adjacent words (incl. doubled "kaufen") in title, meta description, h1 and h2
const base = 'http://localhost:3100';
const xml = await (await fetch(base + '/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
const bad = []; let i = 0;
async function w() { while (i < urls.length) { const u = urls[i++]; const html = await (await fetch(u)).text();
  const parts = [(html.match(/<title>([^<]*)/) || [])[1], (html.match(/<meta name="description" content="([^"]*)"/) || [])[1], ...[...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''))];
  for (const p of parts) { if (!p) continue; const m = p.match(/\b([A-Za-zÄÖÜäöüß]{3,})\s+\1\b/i) || p.match(/\bkaufen\b[^a-zA-ZäöüÄÖÜ]{0,4}\bkaufen\b/i); if (m) bad.push([u.replace(base, ''), m[0]]); } } }
await Promise.all(Array.from({ length: 8 }, w));
console.log('pages', urls.length, '| repeated words in title/description/h1/h2:', bad.length);
for (const b of bad.slice(0, 12)) console.log(b.join(' | '));
