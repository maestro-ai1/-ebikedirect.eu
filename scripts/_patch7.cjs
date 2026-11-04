const fs = require('fs');
for (const f of ['components/seo/family-page.tsx', 'components/seo/mapped-page.tsx']) {
  let t = fs.readFileSync(f, 'utf8');
  t = t.replace(/(\n\s*)(const items = [^\n]*\n)/, (m, ws, line) => `${ws}${line}${ws.replace('\n', '')}const altSeen = new Set<string>();${ws}const altFor = (p: { slug: string; name: string }) => { const a = productFocusKeyword(p.slug, p.name); if (altSeen.has(a)) return \`\${a} - \${p.name}\`; altSeen.add(a); return a; };\n`);
  t = t.split('alt={productFocusKeyword(p.slug, p.name)}').join('alt={altFor(p)}');
  t = t.split('alt={productFocusKeyword(p.slug, p.name)}').join('alt={altFor(p)}');
  t = t.replace('>Lieferbare Modelle<', '>Modelle im Überblick<');
  fs.writeFileSync(f, t);
}
