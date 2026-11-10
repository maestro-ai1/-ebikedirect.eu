// usage: node scripts/_page-peek.cjs <url> ... : prints title, H1, description, canonical, hreflang, counts
const urls = process.argv.slice(2);
(async () => {
  for (const u of urls) {
    const r = await fetch(u, { redirect: 'manual' });
    console.log('==', u, r.status, r.headers.get('location') || '');
    if (r.status !== 200) continue;
    const h = await r.text();
    const m = (re) => (h.match(re) || [])[1];
    console.log('title:', m(/<title>([^<]*)/));
    console.log('h1:', (m(/<h1[^>]*>([\s\S]*?)<\/h1>/) || '').replace(/<[^>]+>/g, ''));
    console.log('desc:', m(/name="description" content="([^"]*)/));
    console.log('canonical:', m(/rel="canonical" href="([^"]*)/));
    console.log('hreflang:', [...h.matchAll(/hrefLang="([^"]*)" href="([^"]*)"/gi)].map((x) => x[1] + '=' + x[2].replace('https://ebikedirect.eu', '')).join(' '));
    console.log('robots:', m(/name="robots" content="([^"]*)/));
    console.log('cards:', (h.match(/href="\/fr\/shop\/[^"]*"/g) || []).length, '| h2:', (h.match(/<h2/g) || []).length, '| h3:', (h.match(/<h3/g) || []).length, '| faq ld:', /FAQPage/.test(h));
  }
})();
