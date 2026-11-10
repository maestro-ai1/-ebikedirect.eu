const fs = require('fs');
const f = 'components/layout/breadcrumbs.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace("import { BreadcrumbsJsonLd } from '@/components/seo/json-ld';", "import { BreadcrumbsJsonLd } from '@/components/seo/json-ld';\nimport { useI18n } from '@/context/i18n-context';");
t = t.replace("  const allItems = [{ label: 'Home', href: '/' }, ...items];", "  const { locale, t, getLocalizedHref } = useI18n();\n  const homeLabel = t('seo.breadcrumbHome', 'Startseite');\n  const homeHref = getLocalizedHref('/');\n  const allItems = [{ label: locale === 'de' ? 'Home' : homeLabel, href: homeHref }, ...items];");
t = t.replace('              href="/"\n', '              href={homeHref}\n');
t = t.replace('<span>Startseite</span>', '<span>{homeLabel}</span>');
fs.writeFileSync(f, t);
console.log(t.includes('homeHref}'), t.includes('{homeLabel}'));
