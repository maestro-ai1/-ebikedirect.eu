// Checks every product page that has a mapped model keyword: title/H1/meta/alt/H3/FAQ really carry the mapped keywords, no stuffing.
const base = process.argv[2] || 'http://localhost:3100';
const pk = require('../data/keywords/products.json').products;
const titleCase = (kw) => kw.split(' ').map((w, i) => (i > 0 && ['und','für','mit','von','der','die','das','im','in','bei','zu','oder'].includes(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' ');
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const strip = (h) => dec(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
(async () => {
  const slugs = Object.keys(pk).filter((s) => pk[s].primary && pk[s].primary.source === 'bank');
  const res = { pages: 0, titleStarts: 0, titleLen: 0, metaLen: 0, h1one: 0, altOk: 0, secInH3: 0, secTotal: 0, faqInQ: 0, faqTotal: 0, stuffed: [], problems: [] };
  for (const slug of slugs) {
    const r = await fetch(`${base}/shop/${slug}`); const h = await r.text(); res.pages++;
    const e = pk[slug];
    const title = dec((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
    const meta = dec((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
    if (title.toLowerCase().startsWith(e.primary.keyword.toLowerCase()) || title.toLowerCase().startsWith(e.name.toLowerCase())) res.titleStarts++; else res.problems.push(`title does not start with primary/name: ${slug} -> ${title}`);
    if (title.length <= 60) res.titleLen++; else res.problems.push(`title ${title.length} chars: ${slug}`);
    if (meta.length >= 110 && meta.length <= 158) res.metaLen++; else res.problems.push(`meta ${meta.length} chars: ${slug}`);
    if ((h.match(/<h1[\s>]/g) || []).length === 1) res.h1one++; else res.problems.push(`h1 count: ${slug}`);
    if (h.toLowerCase().includes(`alt="${e.primary.keyword.toLowerCase().replace(/&/g, '&amp;')}"`)) res.altOk++; else res.problems.push(`alt missing primary: ${slug}`);
    const h3 = [...h.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => strip(m[1]).toLowerCase());
    for (const s of e.secondary.slice(0, 5)) { res.secTotal++; if (h3.includes(s.keyword.toLowerCase())) res.secInH3++; else res.problems.push(`secondary not in an H3: ${slug} -> ${s.keyword}`); }
    const text = strip(h.split('</head>')[1] || h).toLowerCase();
    for (const f of e.faq.slice(0, 5)) { res.faqTotal++; if (text.includes(f.keyword.toLowerCase() + ':')) res.faqInQ++; else res.problems.push(`faq keyword not in a question: ${slug} -> ${f.keyword}`); }
    const main = text; const count = (main.split(e.primary.keyword.toLowerCase()).length - 1);
    if (count > 8) res.stuffed.push(`${slug}: primary "${e.primary.keyword}" appears ${count}x`);
  }
  console.log(JSON.stringify({ ...res, problems: res.problems.length, stuffed: res.stuffed.length }, null, 1));
  console.log(res.problems.slice(0, 15).join('\n')); console.log(res.stuffed.slice(0, 5).join('\n'));
})();
