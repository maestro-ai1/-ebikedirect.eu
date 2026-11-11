const fs = require('fs');
let t = fs.readFileSync('lib/l10n-strings.ts', 'utf8');
t = t.replace("export function l10nDescription(locale: Locale, kind: PageKind, display: string, name: string): string {\n  if (locale !== 'fr') return '';", "export function l10nDescription(locale: Locale, kind0: PageKind | 'hub', display: string, name: string): string {\n  if (locale !== 'fr') return '';\n  const kind: PageKind = kind0 === 'hub' ? 'brand' : kind0;");
fs.writeFileSync('lib/l10n-strings.ts', t);
let c = fs.readFileSync('components/seo/l10n-category-page.tsx', 'utf8');
c = c.replace("  const kind = page.type;\n  const all = productsForPath(page.dePath);", "  const kind = (page.type === 'hub' ? 'brand' : page.type) as PageKind;\n  const all = productsForPath(page.dePath);");
c = c.replace("import { L10N, buildCtx, cap } from '@/lib/l10n-strings';", "import { L10N, buildCtx, cap, type PageKind } from '@/lib/l10n-strings';");
fs.writeFileSync('components/seo/l10n-category-page.tsx', c);
