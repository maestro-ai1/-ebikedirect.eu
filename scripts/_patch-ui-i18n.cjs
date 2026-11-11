// Wires lib/ui.ts into the shopping flow: language switcher (translated equivalents), cart toast, checkout, shop filters, catalog nav, header, footer, product card, cart/checkout metadata.
const fs = require('fs');
let missing = 0;
const edit = (file, pairs) => {
  let t = fs.readFileSync(file, 'utf8');
  for (const [a, b, all] of pairs) {
    if (!t.includes(a)) { console.log('MISSING in', file, ':', a.slice(0, 80)); missing++; continue; }
    t = all ? t.split(a).join(b) : t.replace(a, b);
  }
  fs.writeFileSync(file, t);
};

// ---- context: u() and the equivalent-page switcher
edit('context/i18n-context.tsx', [
  ["interface I18nContextType {", "interface I18nContextType {\n  u: (key: string, vars?: Record<string, string | number>) => string;"],
  ["    const targetPath = getLocalizedPath(pathname, newLocale);", "    const targetPath = switchPath(pathname, locale, newLocale);"],
  ["  const t = (key: string, fallback?: string): string => {", "  const u = (key: string, vars?: Record<string, string | number>): string => ui(locale, key, vars);\n\n  const t = (key: string, fallback?: string): string => {"],
  ["        t,\n        formatCurrency,", "        t,\n        u,\n        formatCurrency,"],
]);
let c = fs.readFileSync('context/i18n-context.tsx', 'utf8');
if (!c.includes("from '@/lib/ui'")) c = c.replace("  isLocale\n} from '@/lib/i18n';", "  isLocale\n} from '@/lib/i18n';\nimport { ui } from '@/lib/ui';\nimport { switchPath } from '@/lib/l10n-pages';");
fs.writeFileSync('context/i18n-context.tsx', c);

// ---- cart toast
edit('components/layout/cart-toast.tsx', [
  ["import { useCart } from '@/context/cart-context';", "import { useCart } from '@/context/cart-context';\nimport { useI18n } from '@/context/i18n-context';"],
  ["  const { lastAdded, dismissToast, totalItemsCount } = useCart();", "  const { lastAdded, dismissToast, totalItemsCount } = useCart();\n  const { u, getLocalizedHref } = useI18n();"],
  ["Zum Warenkorb hinzugefügt</p>", "{u('toast.added')}</p>"],
  ['<Link href="/checkout"', "<Link href={getLocalizedHref('/checkout')}"],
  ["            Zur Kasse ({totalItemsCount})", "            {u('toast.checkout')} ({totalItemsCount})"],
  [">Weiter einkaufen</button>", ">{u('toast.continue')}</button>"],
  ['aria-label="Hinweis schließen"', "aria-label={u('toast.close')}"],
]);

// ---- language switcher labels
edit('components/layout/language-switcher.tsx', [
  ["const { locale, setLocale, supportedLocales } = useI18n();", "const { locale, setLocale, supportedLocales, u } = useI18n();"],
  ["aria-label={`Sprache wählen: ${currentLocaleInfo.nativeName} (${currentLocaleInfo.label})`}", "aria-label={`${u('sw.label')}: ${currentLocaleInfo.nativeName} (${currentLocaleInfo.label})`}"],
  ["<span>Select Market & Language</span>", "<span>{u('sw.title')}</span>"],
]);

// ---- header
edit('components/layout/header.tsx', [
  ["aria-label=\"Hauptnavigation\"", "aria-label={u('hdr.main')}"],
  ["aria-label=\"ebikedirect.eu Startseite\"", "aria-label={u('hdr.home')}"],
  ["aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}", "aria-label={mobileMenuOpen ? u('hdr.menuClose') : u('hdr.menuOpen')}"],
]);

// ---- footer labels
edit('components/layout/footer.tsx', [
  ["                  E-Mountainbikes (E-MTB)\n", "                  {u('ft.mtb')}\n"],
  ["                  E-Trekking & Reiseräder\n", "                  {u('ft.trekking')}\n"],
  ["                  City E-Bikes & Riemenantrieb\n", "                  {u('ft.city')}\n"],
  ["                  Speed-Pedelecs (45 km/h)\n", "                  {u('ft.speed')}\n"],
  ["                  Lastenräder & Cargo-Bikes\n", "                  {u('ft.cargo')}\n"],
  ["                  Widerruf & 2 Jahre Garantie\n", "                  {u('ft.warranty')}\n"],
  ["                  Versand- & Lieferbedingungen\n", "                  {u('ft.delivery')}\n"],
  ["                  Datenschutzerklärung\n", "                  {u('ft.privacy')}\n"],
]);

// ---- product card: frame note
edit('components/shop/product-card.tsx', [
  ["const { t, getLocalizedHref, formatCurrency } = useI18n();", "const { t, u, getLocalizedHref, formatCurrency } = useI18n();"],
  ["              <option key={s} value={s}>{s}</option>", "              <option key={s} value={s}>{s === 'Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt' ? u('pc.frameNote') : s}</option>"],
]);

// ---- cart / checkout metadata per language
for (const [file, tk, dk] of [['app/[locale]/cart/layout.tsx', 'meta.cartTitle', 'meta.cartDesc'], ['app/[locale]/checkout/layout.tsx', 'meta.checkoutTitle', 'meta.checkoutDesc']]) {
  let t = fs.readFileSync(file, 'utf8');
  const hasMeta = /export const metadata/.test(t);
  if (hasMeta) {
    t = t.replace(/export const metadata[^]*?\};\n/, "export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {\n  const { locale } = await params;\n  const l = (isLocale(locale) ? locale : 'de') as Locale;\n  return { title: ui(l, '" + tk + "'), description: ui(l, '" + dk + "'), robots: { index: false, follow: false } };\n}\n");
    if (!t.includes("from '@/lib/ui'")) t = t.replace("import type { Metadata } from 'next';", "import type { Metadata } from 'next';\nimport { ui } from '@/lib/ui';\nimport { isLocale, type Locale } from '@/lib/i18n';");
    fs.writeFileSync(file, t);
  } else console.log('no metadata in', file);
}
console.log('done, missing', missing);
// ---- u() in header and footer
edit('components/layout/header.tsx', [["const { t, getLocalizedHref, localeInfo } = useI18n();", "const { t, u, getLocalizedHref, localeInfo } = useI18n();"]]);
edit('components/layout/footer.tsx', [["const { t, getLocalizedHref } = useI18n();", "const { t, u, getLocalizedHref } = useI18n();"]]);
