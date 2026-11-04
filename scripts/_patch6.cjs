const fs = require('fs');
const rep = (f, a, b) => { let t = fs.readFileSync(f, 'utf8'); if (!t.includes(a)) { console.log('MISSING', f, a.slice(0, 50)); return; } fs.writeFileSync(f, t.split(a).join(b)); };
rep('app/[locale]/page.tsx', "sub={`${m.seo.s1} ${m.seo.s3}`}", "sub={locale === 'de' ? `${primary.charAt(0).toUpperCase() + primary.slice(1)} bei ebikedirect.eu: ${m.seo.s1} ${m.seo.s3}` : `${m.seo.s1} ${m.seo.s3}`}");
rep('components/home/best-products.tsx', 'Beliebte E-Bikes aus unseren Top-Kategorien', 'Beliebte E-Bikes: Elektrofahrrad Modelle aus den Top-Kategorien');
rep('components/home/home-faq.tsx', 'Häufige Fragen zum E-Bike-Kauf', 'Elektrorad oder E-Bike kaufen: Häufige Fragen');
rep('components/seo/mapped-page.tsx', 'alt={`${def.brand} Logo`}', 'alt={`${page.primary.keyword} Logo`}');
rep('components/seo/mapped-page.tsx', "def.type === 'accessory' ? 'Lieferbare Artikel' : 'Lieferbare Modelle'", "def.type === 'accessory' ? 'Artikel im Überblick' : 'Modelle im Überblick'");
