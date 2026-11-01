// Checks the model-family pages on a running server: title, description, one H1, keywords in place, FAQ, word count, keyword share, links, sitemap, product tags.
const base = process.argv[2] || 'http://localhost:3100';
const fam = require('../data/keywords/families.json').families;
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (h) => dec(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
(async () => {
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const rows = []; const problems = [];
  for (const f of fam) {
    const r = await fetch(base + f.path); const h = await r.text();
    const t = text(h).toLowerCase();
    const title = dec((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
    const meta = dec((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
    const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
    const h3 = [...h.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]).toLowerCase());
    const main = h.match(/<div class="max-w-7xl[\s\S]*$/);
    const body = text(main ? main[0] : h).toLowerCase();
    const words = body.split(' ').length;
    const kw = f.primary.keyword.toLowerCase();
    const share = ((body.split(kw).length - 1) * kw.split(' ').length / words * 100);
    const ok = (c, msg) => { if (!c) problems.push(`${f.path}: ${msg}`); };
    ok(r.status === 200, 'status ' + r.status);
    ok(title.toLowerCase().startsWith(kw), 'title does not start with the main keyword: ' + title);
    ok(title.length <= 60, 'title length ' + title.length);
    ok(meta.length >= 110 && meta.length <= 158, 'description length ' + meta.length);
    ok(h1s.length === 1 && h1s[0].toLowerCase().startsWith(kw), 'H1: ' + JSON.stringify(h1s));
    f.secondary.forEach((s) => ok(h3.includes(s.keyword.toLowerCase()), 'secondary not in an H3: ' + s.keyword));
    f.faq.forEach((s) => ok(t.includes(s.keyword.toLowerCase() + ':'), 'FAQ keyword not in a question: ' + s.keyword));
    ok(h.includes('FAQPage'), 'no FAQ schema');
    ok(words >= 400, 'only ' + words + ' words');
    ok(sm.includes(f.path), 'not in the sitemap');
    const links = [...h.matchAll(/href="(\/shop\/[^"]+)"/g)].map((m) => m[1]);
    let bad = 0; for (const l of [...new Set(links)]) { const x = await fetch(base + l, { method: 'HEAD' }); if (x.status !== 200) bad++; }
    ok(bad === 0, bad + ' broken product links');
    const pages = (h.match(/aria-label="Seite \d+"/g) || []).length;
    if (pages > 1) { for (let n = 2; n <= pages; n++) { const p = await fetch(`${base}${f.path}/page/${n}`); const ph = await p.text(); ok(p.status === 200, `page ${n} status ${p.status}`); ok(/Seite \d/.test(dec((ph.match(/<title>([^<]*)<\/title>/) || [])[1] || '')), `page ${n} title not unique`); } }
    rows.push(`${f.path} | ${links.length ? new Set(links).size : 0} bike links | ${words} words | main keyword share ${share.toFixed(1)}% | pages ${Math.max(1, pages)} | title: ${title}`);
  }
  console.log(rows.join('\n'));
  // product tags and brand page links
  const prod = await (await fetch(base + '/shop/cube-nuroad-hybrid-c-62-race-400x-400-wh-28-zoll')).text();
  console.log('product page links to its family page:', prod.includes('href="/marken/cube/nuroad"'));
  const brand = await (await fetch(base + '/marken/cube')).text();
  console.log('brand page lists the model families:', text(brand).includes('Modellreihen von Cube') && brand.includes('href="/marken/cube/nuroad"'));
  const de = await fetch(base + '/fr/marken/cube/nuroad', { redirect: 'manual' });
  console.log('French URL redirects to the German page:', de.status, de.headers.get('location'));
  const nf = await fetch(base + '/marken/cube/not-a-family');
  console.log('unknown family gives:', nf.status);
  console.log('problems:', problems.length); problems.slice(0, 25).forEach((p) => console.log(' -', p));
})();
