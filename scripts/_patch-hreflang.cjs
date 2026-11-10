const fs = require('fs');
// 1. HreflangTags: translated pairs and canonical to the German page for untranslated paths under a language prefix
let f = 'components/seo/hreflang-tags.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace("import { extractLocaleFromPath, getHreflangAlternates, getLocalizedPath, Locale } from '@/lib/i18n';", "import { extractLocaleFromPath, getHreflangAlternates, getLocalizedPath, localesForPath, Locale } from '@/lib/i18n';\nimport { l10nAlternates, isL10nPath } from '@/lib/l10n-pages';");
t = t.replace("  const canonical = `${baseUrl}${getLocalizedPath(strippedPath, locale)}`;", "  const translated = locale === 'de' || localesForPath(strippedPath).some((l) => l.code === locale) || isL10nPath(locale, strippedPath);\n  const canonical = `${baseUrl}${getLocalizedPath(strippedPath, translated ? locale : 'de')}`;\n  const alts = l10nAlternates(strippedPath, locale, baseUrl) || getHreflangAlternates(strippedPath, baseUrl);");
t = t.replace("      {getHreflangAlternates(strippedPath, baseUrl).map((item) => (", "      {alts.map((item) => (");
fs.writeFileSync(f, t);
// 2. sitemap
f = 'app/sitemap.ts';
t = fs.readFileSync(f, 'utf8');
if (!t.includes('l10nAlternates')) {
  t = t.replace(/(import [^\n]*getHreflangAlternates[^\n]*\n)/, "$1import { l10nAlternates, l10nPages, L10N_LOCALES } from '@/lib/l10n-pages';\n");
  t = t.replace("  return routes.flatMap((route) => {\n    const languages = Object.fromEntries(\n      getHreflangAlternates(route.path, baseUrl).map((a) => [a.hreflang, a.url])\n    );", "  const translated = L10N_LOCALES.flatMap((l) => l10nPages(l).map((p) => ({\n    url: `${baseUrl}/${l}${p.url.replace(/\\/$/, '')}`,\n    lastModified: currentDate,\n    changeFrequency: 'weekly' as const,\n    priority: p.type === 'category' ? 0.8 : 0.7,\n    alternates: { languages: Object.fromEntries((l10nAlternates(p.url, l, baseUrl) || []).map((a) => [a.hreflang, a.url])) },\n  })));\n  const base = routes.flatMap((route) => {\n    const languages = Object.fromEntries(\n      (l10nAlternates(route.path, 'de', baseUrl) || getHreflangAlternates(route.path, baseUrl)).map((a) => [a.hreflang, a.url])\n    );");
  // close: replace the final "  });\n}" of the function
  const i = t.lastIndexOf('  });\n}');
  t = t.slice(0, i) + '  });\n  return [...base, ...translated];\n}' + t.slice(i + '  });\n}'.length);
}
fs.writeFileSync(f, t);
console.log(fs.readFileSync('app/sitemap.ts', 'utf8').includes('return [...base, ...translated]'));
console.log(fs.readFileSync('components/seo/hreflang-tags.tsx', 'utf8').includes('isL10nPath'));
