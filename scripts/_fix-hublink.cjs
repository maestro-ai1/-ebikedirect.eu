const fs = require('fs');
let c = fs.readFileSync('components/seo/l10n-category-page.tsx', 'utf8');
if (!c.includes('hubPage')) {
  c = c.replace("  const siblings = l10nPages(locale).filter((p) => p.type === kind && p.url !== page.url);", "  const siblings = l10nPages(locale).filter((p) => p.type === kind && p.url !== page.url);\n  const hubPage = kind === 'brand' ? l10nPages(locale).find((p) => p.type === 'hub') : undefined;");
  c = c.replace("                <li key={s.url}><Link href={`${prefix}${s.url.replace(/\/$/, '')}`} className=\"text-[#FF5722] font-semibold hover:underline\">{s.name}</Link></li>\n              ))}\n            </ul>", "                <li key={s.url}><Link href={`${prefix}${s.url.replace(/\/$/, '')}`} className=\"text-[#FF5722] font-semibold hover:underline\">{s.name}</Link></li>\n              ))}\n            </ul>\n            {hubPage && <p className=\"mt-3 text-sm\"><Link href={`${prefix}${hubPage.url.replace(/\/$/, '')}`} className=\"text-[#FF5722] font-semibold hover:underline\">{hubPage.display}</Link></p>}");
}
fs.writeFileSync('components/seo/l10n-category-page.tsx', c);
console.log(c.includes('{hubPage && '));
