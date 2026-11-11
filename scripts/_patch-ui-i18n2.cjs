// Part 2: checkout page, shop filter page, catalog navigation, shop layout, switchPath().
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

// ---------------- checkout
const UJ = String.raw`  const uj = (key: string, parts: Record<string, React.ReactNode>) => u(key).split(/(\{\w+\})/).map((s, i) => { const m = s.match(/^\{(\w+)\}$/); return m ? <React.Fragment key={i}>{parts[m[1]]}</React.Fragment> : s; });`;
edit('app/[locale]/checkout/page.tsx', [
  ["import { useI18n } from '@/context/i18n-context';", "import { useI18n } from '@/context/i18n-context';\nimport { COUNTRY_VALUES, countryLabel } from '@/lib/ui';"],
  ["  const { formatCurrency } = useI18n();", "  const { formatCurrency, u, locale, getLocalizedHref } = useI18n();\n" + UJ],
  ["setError(j.error || 'Die Bestellung konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.');", "setError(j.error || u('co.errServer'));"],
  ["setError('Die Bestellung konnte nicht übermittelt werden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.');", "setError(u('co.errNet'));"],
  ["Vielen Dank für Ihre Bestellung!</h1>", "{u('co.thanks')}</h1>"],
  ["              Ihre Bestellnummer lautet <strong className=\"text-gray-900 font-mono\">{done.ref}</strong>. Eine Bestätigung wurde an <strong className=\"text-gray-900\">{done.email}</strong> gesendet.\n              Die Zahlungsdaten erhalten Sie in einer separaten E-Mail.\n", "              {uj('co.orderNo', { ref: <strong className=\"text-gray-900 font-mono\">{done.ref}</strong>, email: <strong className=\"text-gray-900\">{done.email}</strong> })}\n              {' '}{u('co.payData')}\n"],
  ["<span><strong>Mindestbestellwert {formatCurrency(MIN_ORDER)}:</strong> Es fehlen noch {formatCurrency(MIN_ORDER - subtotal)}. <Link href=\"/e-bikes\" className=\"font-bold text-[#FF5722] underline\">Zum Sortiment</Link></span>", "<span><strong>{u('co.minB', { min: formatCurrency(MIN_ORDER) })}</strong> {u('co.minT', { missing: formatCurrency(MIN_ORDER - subtotal) })} <Link href={getLocalizedHref('/shop')} className=\"font-bold text-[#FF5722] underline\">{u('co.toShop')}</Link></span>"],
  ["href=\"/e-bikes\"", "href={getLocalizedHref('/shop')}", true],
  [">Weiter im Shop <ArrowRight", ">{u('co.continue')} <ArrowRight"],
  ["label: 'Warenkorb und Kasse', href: '/checkout'", "label: u('co.title'), href: getLocalizedHref('/checkout')"],
  ["mb-6\">Warenkorb und Kasse</h1>", "mb-6\">{u('co.title')}</h1>"],
  ["Ihr Warenkorb ist leer.</p>", "{u('co.empty')}</p>"],
  ["Wählen Sie ein E-Bike aus unserem Sortiment, es landet hier mit Preis und Lieferdetails.</p>", "{u('co.emptyText')}</p>"],
  [">Alle E-Bikes ansehen <ArrowRight", ">{u('co.seeAll')} <ArrowRight"],
  ["<span><strong>Die Online-Bestellung wird gerade eingerichtet.</strong> Sie können den Warenkorb vorbereiten, die Bestellung lässt sich erst nach der Freischaltung abschicken.</span>", "<span><strong>{u('co.disabledB')}</strong> {u('co.disabledT')}</span>"],
  ["1. Ihr Warenkorb ({count} {count === 1 ? 'Artikel' : 'Artikel'})</h2>", "{u('co.h1items', { n: count })}</h2>"],
  ["href={`/shop/${item.product.slug}`}", "href={getLocalizedHref(`/shop/${item.product.slug}`)}", true],
  ["aria-label={`${item.product.name} entfernen`}", "aria-label={u('co.remove', { name: item.product.name })}"],
  ["aria-label=\"Menge verringern\"", "aria-label={u('co.qtyDown')}"],
  ["aria-label=\"Menge erhöhen\"", "aria-label={u('co.qtyUp')}"],
  ["<div className=\"text-[11px] text-gray-500\">inkl. 19 % MwSt.</div>", "<div className=\"text-[11px] text-gray-500\">{u('co.vatIncl')}</div>"],
  ["/> 2. Lieferadresse</h2>", "/> {u('co.h2delivery')}</h2>"],
  [">Vorname *<input", ">{u('co.first')}<input"],
  [">Nachname *<input", ">{u('co.last')}<input"],
  [">E-Mail-Adresse *<input", ">{u('co.email')}<input"],
  ["Telefon für die Spedition *</span>", "{u('co.phone')}</span>"],
  [">Straße *<input", ">{u('co.street')}<input"],
  [">Hausnr. *<input", ">{u('co.house')}<input"],
  [">PLZ *<input", ">{u('co.zip')}<input"],
  [">Stadt *<input", ">{u('co.city')}<input"],
  ["text-gray-700\">Land *", "text-gray-700\">{u('co.country')}"],
  ["{['Deutschland', 'Österreich', 'Schweiz', 'Niederlande', 'Frankreich', 'Italien', 'Spanien', 'Portugal'].map((c) => <option key={c} value={c}>{c}</option>)}", "{COUNTRY_VALUES.map((c) => <option key={c} value={c}>{countryLabel(locale, c)}</option>)}"],
  [">Hinweis für die Zustellung (optional)<textarea", ">{u('co.note')}<textarea"],
  ["/> 3. Zahlungsart</h2>", "/> {u('co.h2pay')}</h2>"],
  [">Banküberweisung (Vorkasse)</span>", ">{u('co.bank')}</span>"],
  ["Die Bankdaten erhalten Sie nach der Bestellung per E-Mail.</span>", "{u('co.bankText')}</span>"],
  ["/> Kryptowährung (USDT oder Bitcoin), 10 % Rabatt</span>", "/> {u('co.crypto')}</span>"],
  ["Der Rabatt gilt nur bei dieser Zahlungsart. Die Empfangsadresse und den Betrag erhalten Sie nach der Bestellung per E-Mail.</span>", "{u('co.cryptoText')}</span>"],
  [">Bestellübersicht</h2>", ">{u('co.summary')}</h2>"],
  ["<dt>Warenwert</dt>", "<dt>{u('co.goods')}</dt>"],
  ["<dt>Krypto-Rabatt (10 %)</dt>", "<dt>{u('co.cryptoDisc')}</dt>"],
  ["<dt>Versand per Spedition</dt>", "<dt>{u('co.shipping')}</dt>"],
  ["{shipping === 0 ? 'kostenlos' : formatCurrency(shipping)}", "{shipping === 0 ? u('co.free') : formatCurrency(shipping)}"],
  ["<div className=\"flex justify-between text-xs text-gray-500\"><dt>darin 19 % MwSt.</dt><dd>{formatCurrency(vat)}</dd></div>", "{u('co.vatIn') && <div className=\"flex justify-between text-xs text-gray-500\"><dt>{u('co.vatIn')}</dt><dd>{formatCurrency(vat)}</dd></div>}"],
  ["<dt>Gesamt</dt>", "<dt>{u('co.total')}</dt>"],
  ["{shipping === 0 ? 'Der Speditionsversand ist kostenfrei.' : `Noch ${formatCurrency(FREE_SHIPPING - subtotal)} bis zum kostenlosen Speditionsversand ab ${formatCurrency(FREE_SHIPPING)}.`}", "{shipping === 0 ? u('co.shipFree') : u('co.shipLeft', { left: formatCurrency(FREE_SHIPPING - subtotal), limit: formatCurrency(FREE_SHIPPING) })}"],
  ["{busy ? 'Wird gesendet …' : 'Zahlungspflichtig bestellen'}", "{busy ? u('co.sending') : u('co.order')}"],
  ["/> 2 Jahre Garantie und 30 Tage Rückgaberecht</li>", "/> {u('co.warranty')}</li>"],
  ["/> Lieferung per Spedition mit Hebebühne</li>", "/> {u('co.delivery')}</li>"],
  ["Mit der Bestellung akzeptieren Sie die <Link href=\"/policies/returns\" className=\"underline\">Rückgabe- und Garantiebedingungen</Link> und die <Link href=\"/policies/delivery\" className=\"underline\">Lieferbedingungen</Link>.", "{u('co.accept')} <Link href={getLocalizedHref('/policies/returns')} className=\"underline\">{u('co.returnsTerms')}</Link> {u('co.and')} <Link href={getLocalizedHref('/policies/delivery')} className=\"underline\">{u('co.deliveryTerms')}</Link>."],
]);

// ---------------- shop filter page
edit('app/[locale]/shop/shop-client.tsx', [
  ["import { useCart } from '@/context/cart-context';", "import { useCart } from '@/context/cart-context';\nimport { useI18n } from '@/context/i18n-context';"],
  ["function ShopContent() {", "function ShopContent() {\n  const { u } = useI18n();"],
  ["Premium E-Bikes und Pedelecs Katalog</h1>", "{u('shop.title')}</h1>"],
  ["              Premium E-Bikes & Pedelecs Katalog\n", "              {u('shop.title')}\n"],
  ["{filteredProducts.length} Modelle gefunden · Mindestbestellwert 500 € · Kostenloser Speditionsversand ab 10.000 €", "{u('shop.found', { n: filteredProducts.length })}"],
  ["<span>10% Skonto mit Krypto (USDT / BTC)</span>", "<span>{u('shop.crypto')}</span>"],
  ["                  Filter\n                </span>", "                  {u('shop.filter')}\n                </span>"],
  ["                  Zurücksetzen\n", "                  {u('shop.reset')}\n"],
  ["                  Kategorie\n", "                  {u('shop.category')}\n"],
  ["{cat === 'all' ? 'Alle Kategorien' : cat}", "{cat === 'all' ? u('shop.allCats') : cat}"],
  ["                  Hersteller\n", "                  {u('shop.maker')}\n"],
  ["{b === 'all' ? 'Alle Marken' : b}", "{b === 'all' ? u('shop.allBrands') : b}"],
  ["                  Motorenhersteller\n", "                  {u('shop.motorMaker')}\n"],
  ["{m === 'all' ? 'Alle Motoren' : m}", "{m === 'all' ? u('shop.allMotors') : m}"],
  ["<span>Max. Preis:</span>", "<span>{u('shop.maxPrice')}</span>"],
  ["                  Nur sofort lieferbar\n", "                  {u('shop.inStock')}\n"],
  ["                Zeige <strong>{paginatedProducts.length}</strong> von <strong>{filteredProducts.length}</strong> E-Bikes\n", "                {u('shop.showing', { a: paginatedProducts.length, b: filteredProducts.length })}\n"],
  ["                  Sortieren nach:\n", "                  {u('shop.sort')}\n"],
  ["<option value=\"featured\">Empfehlung / Beliebtheit</option>", "<option value=\"featured\">{u('shop.sortFeatured')}</option>"],
  ["<option value=\"price-asc\">Preis: aufsteigend</option>", "<option value=\"price-asc\">{u('shop.sortAsc')}</option>"],
  ["<option value=\"price-desc\">Preis: absteigend</option>", "<option value=\"price-desc\">{u('shop.sortDesc')}</option>"],
  ["<option value=\"rating\">Beste Bewertung</option>", "<option value=\"rating\">{u('shop.sortRating')}</option>"],
  ["Keine E-Bikes für diese Filterkriterien gefunden</h3>", "{u('shop.noneTitle')}</h3>"],
  ["                  Bitte passen Sie Ihre Filterauswahl an oder setzen Sie die Filter zurück.\n", "                  {u('shop.noneText')}\n"],
  ["                  Filter zurücksetzen\n", "                  {u('shop.resetFilters')}\n"],
  ["                  Zurück\n", "                  {u('shop.prev')}\n"],
  ["                  Weiter\n", "                  {u('shop.next')}\n"],
]);

// ---------------- catalog nav: language aware, links only to pages that exist in the language
let nav = fs.readFileSync('components/shop/catalog-nav.tsx', 'utf8');
if (!nav.includes("from '@/lib/ui'")) {
  nav = nav.replace("import { getKeywordPage } from '@/lib/seo';", "import { getKeywordPage } from '@/lib/seo';\nimport { ui } from '@/lib/ui';\nimport { l10nByDePath } from '@/lib/l10n-pages';\nimport type { Locale } from '@/lib/i18n';");
  // category link table with ui keys
  nav = nav.replace(/const CATEGORY_LINKS = \[[^]*?\n\];/, "const CATEGORY_LINKS = [\n  { path: '/e-bikes', key: 'nav.all' },\n  { path: '/e-bikes/e-mountainbikes', key: 'nav.mtb' },\n  { path: '/e-bikes/trekking-e-bikes', key: 'nav.trekking' },\n  { path: '/e-bikes/city-e-bikes', key: 'nav.city' },\n  { path: '/e-bikes/s-pedelec', key: 'nav.speed' },\n  { path: '/e-bikes/cargo-bikes', key: 'nav.cargo' },\n  { path: '/e-bikes/falt-e-bikes', key: 'nav.fold' },\n  { path: '/e-bikes/e-rennrad-gravel', key: 'nav.gravel' },\n  { path: '/e-bikes/kinder-jugend', key: 'nav.kids' },\n  { path: '/e-bikes/damen', key: 'nav.women' },\n  { path: '/e-bikes/herren', key: 'nav.men' },\n  { path: '/e-bikes/leichte-carbon-e-bikes', key: 'nav.light' },\n  { path: '/e-bikes/radgroesse', key: 'nav.wheel' },\n  { path: '/e-bikes/motor-antrieb', key: 'nav.motor' },\n  { path: '/zubehoer', key: 'nav.acc' }\n];");
  nav = nav.replace("export function CatalogNav({ current }: { current?: string }) {", "export function CatalogNav({ current, locale = 'de' }: { current?: string; locale?: Locale }) {\n  const L = (key: string) => ui(locale, key);\n  // in another language only pages that exist there are linked; their URL and name come from that language's page list\n  const hrefOf = (path: string) => (locale === 'de' ? path : (l10nByDePath(locale, path) ? `/${locale}${l10nByDePath(locale, path)!.url.replace(/\\/$/, '')}` : null));\n  const nameOf = (path: string, fallback: string) => (locale === 'de' ? fallback : (l10nByDePath(locale, path)?.name || fallback));");
}
fs.writeFileSync('components/shop/catalog-nav.tsx', nav);
console.log('nav patched', nav.includes('const L = (key: string)'));
console.log('done, missing', missing);
