// Re-points links to blog slugs that do not exist (old posts 01-06) to the closest existing post or category. Run: node scripts/_fix-dead-blog-links.cjs
const fs = require('fs');
const d = 'content/blog/de/';
const MAP = {
  'was-ist-pedelec': '/blog/was-wiegt-ein-e-bike-ratgeber',
  'gewicht-e-bike': '/blog/was-wiegt-ein-e-bike-ratgeber',
  'e-bike-finanzieren': '/blog/e-bike-leasing-jobrad-steuervorteile-gehaltsumwandlung',
  'e-bike-enduro': '/blog/e-bike-mtb-ratgeber',
  'e-bike-motor-arten': '/blog/e-bike-electric-motor-ratgeber',
  'ebike-bosch-motor': '/blog/elektro-bike-bosch-motor-ratgeber',
  'bosch-akku-ebike': '/blog/akku-fahrradpumpe-ratgeber',
  'fahrradpflege-e-bike': '/blog/e-bike-wartung-tipps-fuer-den-winter',
  'fahrrad-flickzeug-e-bike': '/blog/reifen-fahrrad-spikes-ratgeber',
  'fahrradtransport-e-bike': '/blog/fahrradstaender-hinterrad-ratgeber',
  'e-bike-transportschutz': '/zubehoer/gepaecktraeger-anhaenger/',
  'klapp-e-bike-ratgeber': '/e-bikes/falt-e-bikes/',
  'e-rennrad-ratgeber': '/e-bikes/e-rennrad-gravel/',
  'schutzblech-fuers-fahrrad': '/blog/schutzblech-rennrad-ratgeber',
  'e-bike-riemenantrieb-ratgeber': '/blog/schaltung-fahrrad-ratgeber',
  'rahmentasche-fahrrad': '/blog/fahrradtasche-rahmen-ratgeber',
  'fahrradstaender-e-bike': '/blog/fahrradstaender-hinterrad-ratgeber',
  'bosch-ladegeraet-ebike': '/blog/bosch-charger-e-bike-ratgeber',
  'e-bike-tiefeinsteiger': '/blog/kalkhoff-fahrrad-damen-ratgeber',
  'e-bike-45-km-h': '/e-bikes/s-pedelec/'
};
const slugs = new Set(fs.readdirSync(d).map((f) => fs.readFileSync(d + f, 'utf8').match(/^slug: (.+)$/m)[1]));
let n = 0;
for (const f of fs.readdirSync(d)) {
  let t = fs.readFileSync(d + f, 'utf8'); const own = t.match(/^slug: (.+)$/m)[1];
  t = t.replace(/\]\(\/blog\/([a-z0-9-]+)\)/g, (m, s) => {
    if (slugs.has(s)) return m;
    const to = MAP[s]; if (!to) { console.log('NO MAP', f, s); return m; }
    if (to === '/blog/' + own) { console.log('SELF', f, s); return m; }
    n++; return '](' + to + ')';
  });
  fs.writeFileSync(d + f, t);
}
console.log('relinked', n);
