// finds product pages of one language that share the first 12 words of the opening paragraph
const lang = process.argv[2] || 'en', base = process.argv[3] || 'https://ebikedirect.eu';
(async () => {
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => base + m[1].replace(/^https?:\/\/[^/]+/, '')).filter((u) => u.includes('/' + lang + '/shop/'));
  const g = new Map(); let i = 0;
  const work = async () => { while (i < urls.length) { const u = urls[i++]; const h = await (await fetch(u)).text(); const ps = [...h.matchAll(/<p[^>]*>([^<]{80,}?)<\/p>/g)]; const para = ps.length ? ps[0][1].replace(/&amp;/g, '&') : ''; const k = para.toLowerCase().split(/\s+/).slice(0, 12).join(' '); (g.get(k) || g.set(k, []).get(k)).push(u.replace(base, '')); } };
  await Promise.all(Array.from({ length: 8 }, work));
  let n = 0; for (const [k, v] of g) if (v.length > 1) { n += v.length; console.log(v.length, k, '\n   ', v.join('\n    ')); }
  console.log('products sharing:', n);
})();
