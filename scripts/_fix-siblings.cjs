const fs = require('fs');
const f = 'components/seo/mapped-page.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace("'/e-bikes/e-rennrad-gravel', '/e-bikes/kinder-jugend'])", "'/e-bikes/e-rennrad-gravel', '/e-bikes/kinder-jugend', '/e-bikes/damen', '/e-bikes/herren', '/e-bikes/leichte-carbon-e-bikes', '/e-bikes/radgroesse', '/e-bikes/motor-antrieb'])");
// the note comes after the intro paragraph so the first paragraph carries the main keyword
const a = t.indexOf('            {first && def.note && <p');
const b = t.indexOf('\n', a) + 1;
const noteLine = t.slice(a, b);
t = t.slice(0, a) + t.slice(b);
const marker = '            ) : (\n              <p className="text-sm text-gray-600">Seite {pageNum} von';
const m = t.indexOf(marker);
const close = t.indexOf('            )}\n', m) + '            )}\n'.length;
t = t.slice(0, close) + noteLine + t.slice(close);
fs.writeFileSync(f, t);
console.log('ok', t.includes('/e-bikes/radgroesse\'])'), t.indexOf(noteLine) > m);
