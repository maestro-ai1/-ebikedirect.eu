// duplicate MAIN keywords inside one language (products + pages)
const nk = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').sort().join(' ');
for (const lg of ['en', 'fr']) {
  const own = new Map(); const add = (u, k, role) => { if (!k) return; const key = nk(k.keyword); (own.get(key) || own.set(key, []).get(key)).push(u + ':' + role); };
  for (const p of require('../data/keywords/' + lg + '-live.json').pages) { add(p.url, p.primary, 'P'); (p.secondary || []).forEach((k) => add(p.url, k, 'S')); (p.faq || []).forEach((k) => add(p.url, k, 'F')); }
  for (const [s, e] of Object.entries(require('../data/keywords/' + lg + '-products.json').products)) { add('/shop/' + s, e.primary, 'P'); (e.secondary || []).forEach((k) => add('/shop/' + s, k, 'S')); (e.faq || []).forEach((k) => add('/shop/' + s, k, 'F')); }
  const bad = [...own.entries()].filter(([, v]) => v.some((x) => x.endsWith(':P')) && new Set(v.map((x) => x.split(':')[0])).size > 1);
  console.log(lg, 'main keywords that appear on another URL:', bad.length); bad.slice(0, 12).forEach(([k, v]) => console.log('  ', k, '|', v.join(', ')));
}
