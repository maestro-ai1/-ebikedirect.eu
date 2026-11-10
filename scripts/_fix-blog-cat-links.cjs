// re-points blog links to category pages that do not exist (found by link-audit) to the closest existing page
const fs = require('fs');
const MAP = {
  '/e-bikes/damen/': '/e-bikes/city-e-bikes/', '/e-bikes/damen': '/e-bikes/city-e-bikes/',
  '/e-bikes/herren/': '/e-bikes/trekking-e-bikes/', '/e-bikes/herren': '/e-bikes/trekking-e-bikes/',
  '/e-bikes/motor-antrieb/': '/e-bikes/', '/e-bikes/motor-antrieb': '/e-bikes/',
  '/zubehoer/akkus/': '/zubehoer/', '/zubehoer/akkus': '/zubehoer/',
  '/zubehoer/displays-elektronik/': '/zubehoer/', '/zubehoer/displays-elektronik': '/zubehoer/',
  '/zubehoer/bremsen-antrieb/': '/zubehoer/werkzeug-pflege/', '/zubehoer/bremsen-antrieb': '/zubehoer/werkzeug-pflege/',
  '/zubehoer/reifen-schlaeuche/': '/zubehoer/werkzeug-pflege/', '/zubehoer/reifen-schlaeuche': '/zubehoer/werkzeug-pflege/',
  '/zubehoer/ladegeraete/': '/zubehoer/', '/zubehoer/ladegeraete': '/zubehoer/',
};
const dir = 'content/blog/de'; let n = 0;
for (const f of fs.readdirSync(dir)) {
  let t = fs.readFileSync(dir + '/' + f, 'utf8'); const o = t;
  t = t.replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, (m, label, url) => {
    if (MAP[url]) { n++; console.log(f, '|', label, '|', url, '->', MAP[url]); return `[${label}](${MAP[url]})`; }
    if (/finanzierung-leasing/.test(url) && /leasing-jobrad/.test(f)) { n++; console.log(f, '| self/dead link unlinked:', label); return label; }
    return m;
  });
  if (t !== o) fs.writeFileSync(dir + '/' + f, t);
}
console.log('links fixed', n);
