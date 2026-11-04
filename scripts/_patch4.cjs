const fs = require('fs'); const d = 'content/blog/de/';
const add = (f, x) => { let t = fs.readFileSync(d + f, 'utf8').replace(/\r\n/g, '\n'); t = t.replace('## Häufige Fragen (FAQ)', fs.readFileSync(x, 'utf8').replace(/\r\n/g, '\n') + '## Häufige Fragen (FAQ)'); fs.writeFileSync(d + f, t); };
add('08-akku-reichweite-e-bike.md', 'scripts/_extra_a.txt'); add('09-e-bike-akku-winter.md', 'scripts/_extra_b.txt'); add('10-e-bike-bosch-cx.md', 'scripts/_extra_c.txt');
