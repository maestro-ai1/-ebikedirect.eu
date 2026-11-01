// Shows where the main keyword sits on the highest-density product pages and lists pages under 400 words.
const pk = require('../data/keywords/products.json').products;
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const section = async (slug) => {
  const h = await (await fetch('http://localhost:3100/shop/' + slug)).text();
  const m = h.match(/<section[^>]*aria-label="Informationen zum[\s\S]*?<\/section>/);
  return m ? dec(m[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, '|')).replace(/\|+/g, '|') : '';
};
(async () => {
  for (const slug of ['cube-stereo-hybrid-one44-pro-800-800-wh-29-zoll']) {
    const e = pk[slug];
    console.log('primary:', e.primary.keyword, '| name:', e.name);
    const t = await section(slug);
    const kw = e.primary.keyword.toLowerCase();
    t.split('|').filter((x) => x.toLowerCase().includes(kw)).forEach((x) => console.log(' *', x.trim().slice(0, 120)));
  }
  const low = [];
  for (const slug of Object.keys(pk)) {
    const t = await section(slug);
    const w = t.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    if (w < 400) low.push(`${slug} ${w} words`);
  }
  console.log('under 400 words:\n' + low.join('\n'));
})();
