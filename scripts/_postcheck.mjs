// node scripts/_postcheck.mjs <base>   checks rendering of the six Phase 1 posts
const base = process.argv[2] || 'http://localhost:3100';
const slugs = ['elektro-bike-bosch-motor-ratgeber', 'lastenrad-hund-ratgeber', 'cube-mountainbike-mtb-ratgeber', 'e-bike-mtb-ratgeber', 'bosch-charger-e-bike-ratgeber', 'e-bike-electric-motor-ratgeber', 'was-wiegt-ein-e-bike-ratgeber', 'e-bike-750-watt-ratgeber', 'kalkhoff-fahrrad-damen-ratgeber', 'e-bike-150-kg-ratgeber', 'alpina-fahrradhelm-ratgeber', 'fahrradhelme-damen-ratgeber', 'fahrradhelm-damen-rennrad-ratgeber', 'fahrrad-helm-herren-ratgeber', 'akku-fahrradpumpe-ratgeber', 'fahrradkorb-gepaecktraeger-ratgeber', 'fahrradtasche-rahmen-ratgeber', 'ruecklicht-rennrad-ratgeber', 'fahrrad-mit-gepaecktraeger-ratgeber', 'fahrradtaschen-rucksack-ratgeber', 'fahrradschloss-zahlenschloss-ratgeber', 'klickpedale-rennrad-ratgeber', 'fahrradkoerbe-klickfix-ratgeber', 'fahrrad-korb-ratgeber', 'fahrradstaender-hinterrad-ratgeber', 'fahrrad-nachruesten-mit-motor-ratgeber', 'reifen-fahrrad-spikes-ratgeber', 'schaltung-fahrrad-ratgeber', 'bremsen-fahrrad-ratgeber', 'schutzblech-rennrad-ratgeber'];
for (const s of slugs) {
  const r = await fetch(`${base}/blog/${s}`); const h = await r.text();
  const img = await fetch(`${base}/blog/covers/${s}.webp`);
  const h1 = (h.match(/<h1/g) || []).length;
  const inb = [...h.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].length;
  console.log(r.status, s, '| h1', h1, '| BlogPosting', /BlogPosting/.test(h), '| FAQPage', /FAQPage/.test(h), '| Breadcrumb', /BreadcrumbList/.test(h), '| toc', /Inhaltsverzeichnis|Inhalt/i.test(h), '| cover', img.status, '| blog links on page', inb);
}
