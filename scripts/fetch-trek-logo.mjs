// The Trek wordmark is inline in the page header: extract that svg and save it as a standalone file.
import fs from 'node:fs';
const r = await fetch('https://www.trekbikes.com/de/de_DE/', { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124' } });
const h = await r.text();
const m = h.match(/<svg[^>]*viewBox="0 0 93 11"[^>]*aria-labelledby="[^"]*-trek">[\s\S]*?<\/svg>/);
if (!m) { console.log('not found'); process.exit(1); }
let svg = m[0].replace(/aria-labelledby="[^"]*"/, '').replace(/width="\d+"/, 'width="186"').replace(/height="\d+"/, 'height="22"').replace('fill="currentColor"', 'fill="#131A22"');
fs.writeFileSync('.image-work/logos/trek.svg', svg);
console.log('trek.svg', svg.length);
