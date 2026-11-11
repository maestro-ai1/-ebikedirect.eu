const fs = require('fs');
let t = fs.readFileSync('lib/l10n-product.ts', 'utf8');
t = t.replace("  take(byBrand[p.brand] || []);\n  if (out.length < 4) take(byCat[p.category] || []);", "  if (p.category !== 'Zubehör') take(byBrand[p.brand] || []);\n  if (out.length < 4) take(byCat[p.category] || []);");
fs.writeFileSync('lib/l10n-product.ts', t);
console.log(t.includes("if (p.category !== 'Zubehör') take(byBrand"));
let r = fs.readFileSync('scripts/_lang-report.cjs', 'utf8');
if (!r.includes('French product keyword map')) {
  const add = `
// ---- products
let prodRows = '', pstat = { bank: 0, name: 0, full: 0 };
try {
  const fp = require('../data/keywords/' + lang + '-products.json').products;
  const pm = require('../data/keywords/products.json').products;
  const all = Object.entries(pm).map(([slug, p]) => ({ slug, name: p.name, brand: p.brand, cat: p.category, e: fp[slug] || { primary: { keyword: 'acheter ' + p.name.toLowerCase(), volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] } }));
  for (const x of all) { if (x.e.primary.source === 'bank') pstat.bank++; else pstat.name++; if (x.e.secondary.length >= 5 && x.e.faq.length >= 5) pstat.full++; }
  const pres = G.results.filter((r) => r.url.startsWith('/' + lang + '/shop/'));
  const ppass = pres.filter((r) => r.ok).length;
  const byRule = {}; for (const r of pres.filter((x) => !x.ok)) byRule[r.rule.slice(0, 70)] = (byRule[r.rule.slice(0, 70)] || 0) + 1;
  prodRows += '<h2>3b. ' + NAME + ' product pages (' + all.length + ')</h2><div class="cards"><div class="c"><b>' + all.length + '</b><span>product pages live in ' + NAME + '</span></div><div class="c"><b>' + ppass + ' / ' + pres.length + '</b><span>live gate checks pass on product pages</span></div><div class="c"><b>' + pstat.bank + '</b><span>with a bank model keyword</span></div><div class="c"><b>' + pstat.name + '</b><span>on the product-name fallback</span></div><div class="c"><b>' + pstat.full + '</b><span>with 5 secondary and 5 FAQ keywords</span></div></div>';
  prodRows += '<div class="box"><b>Failing rules on product pages:</b><ul>' + Object.entries(byRule).sort((a, b) => b[1] - a[1]).map(([k, v]) => '<li>' + esc(k) + ': ' + v + '</li>').join('') + '</ul><small>M1, M6, M6c and H6 follow from the ' + NAME + ' bank holding brand-level but almost no model-level keywords. L5 is a manufacturer-site false positive (Conway).</small></div>';
  prodRows += '<div class="scroll"><table><thead><tr><th>Product</th><th>Type</th><th>Main keyword</th><th class="n">Vol</th><th class="n">KD</th><th>Intent</th><th>Source</th><th class="n">Sec</th><th class="n">FAQ</th></tr></thead><tbody>' + all.map((x) => '<tr><td>' + esc(x.name) + '<br><small><a href="https://ebikedirect.eu/' + lang + '/shop/' + esc(x.slug) + '">/' + lang + '/shop/' + esc(x.slug) + '</a></small></td><td>' + esc(x.cat) + '</td><td>' + esc(x.e.primary.keyword) + '</td><td class="n">' + nf(x.e.primary.volume || 0) + '</td><td class="n">' + (x.e.primary.kd == null ? '-' : x.e.primary.kd) + '</td><td><b class="t ' + x.e.primary.intent + '">' + x.e.primary.intent + '</b></td><td>' + (x.e.primary.source === 'bank' ? 'bank' : '<span class="amber">name</span>') + '</td><td class="n">' + x.e.secondary.length + '</td><td class="n">' + x.e.faq.length + '</td></tr>').join('') + '</tbody></table></div>';
} catch (e) { /* products not built for this language */ }
`;
  r = r.replace("H += `<h2>4. Not verified</h2>", add.replace(/`/g, '`') + "\nH += prodRows;\nH += `<h2>4. Not verified</h2>");
  r = r.replace(/batch2-2026-11-10/g, 'batch3-2026-11-10').replace('Product pages come in batch 3.', 'Model-family keywords (batch 3b) and the blog follow.');
  r = r.replace("<small>Search Console data for ${NAME}; native-speaker review of the copy; product pages, brand pages, accessories and the blog are not yet in ${NAME};", "<small>Search Console data for ${NAME}; native-speaker review of the copy; model-family pages, the blog and the legal pages are not yet in ${NAME};");
  r = r.replace("categories, brands, accessories)", "categories, brands, accessories; products below)");
}
fs.writeFileSync('scripts/_lang-report.cjs', r);
