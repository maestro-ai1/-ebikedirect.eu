// Prints on-page SEO numbers for one page: node scripts/page-stats.cjs <url>
const url = process.argv[2];
(async () => {
  const h = await (await fetch(url)).text();
  const body = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  const main = (body.match(/<main[\s\S]*<\/main>/) || [body])[0].replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
  const count = (re) => (h.match(re) || []).length;
  console.log('words in main:', main.split(/\s+/).filter(Boolean).length);
  console.log('h1', count(/<h1/g), 'h2', count(/<h2/g), 'h3', count(/<h3/g));
  console.log((h.match(/<title>[^<]*<\/title>/) || [])[0]);
  console.log((h.match(/name="description" content="[^"]*"/) || [])[0]);
  console.log('alt samples:', (h.match(/alt="[^"]*"/g) || []).slice(0, 4).join(' | '));
  console.log('internal links:', count(/href="\/[^"]*"/g), 'external links:', count(/href="https?:\/\/(?!ebikedirect)[^"]*"/g));
})();
