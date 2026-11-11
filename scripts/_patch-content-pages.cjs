// FAQ, About, Contact: language-aware copy (French), redirect to the German page for languages without translated copy.
const fs = require('fs');
let missing = 0;
const edit = (file, pairs) => {
  let t = fs.readFileSync(file, 'utf8');
  for (const [a, b, all] of pairs) { if (!t.includes(a)) { console.log('MISSING', file, ':', a.slice(0, 70)); missing++; continue; } t = all ? t.split(a).join(b) : t.replace(a, b); }
  fs.writeFileSync(file, t);
};

// ---- ui.ts merges PAGES and exposes hasPages()
let ui = fs.readFileSync('lib/ui.ts', 'utf8');
if (!ui.includes("from '@/lib/ui-pages'")) {
  ui = ui.replace("import type { Locale } from '@/lib/i18n';", "import type { Locale } from '@/lib/i18n';\nimport { PAGES } from '@/lib/ui-pages';");
  ui = ui.replace("const IDX: Record<string, number>", "Object.assign(T, PAGES);\n\n/** Languages whose FAQ, About and Contact copy exists. Other languages are sent to the German page until their batch is built. */\nexport const hasPages = (l: Locale) => l === 'de' || l === 'fr';\n\nconst IDX: Record<string, number>");
  fs.writeFileSync('lib/ui.ts', ui);
}

// ---- FAQ page
{
  const f = 'app/[locale]/faq/page.tsx';
  let t = fs.readFileSync(f, 'utf8');
  const a = t.indexOf('const FAQS: FaqItem[] = [');
  const b = t.indexOf('export default function FaqPage()');
  const fn = `const CATS: FaqItem['category'][] = ['logistik', 'logistik', 'logistik', 'logistik', 'krypto', 'krypto', 'garantie', 'technik'];
const makeFaqs = (u: (k: string) => string): FaqItem[] => CATS.map((category, i) => ({ category, question: u('faq.q' + (i + 1)), answer: u('faq.a' + (i + 1)) }));

`;
  t = t.slice(0, a) + fn + t.slice(b);
  t = t.replace("import { ChevronDown,", "import { useI18n } from '@/context/i18n-context';\nimport { ChevronDown,");
  t = t.replace("export default function FaqPage() {\n", "export default function FaqPage() {\n  const { u, getLocalizedHref } = useI18n();\n  const FAQS = makeFaqs(u);\n");
  const pairs = [
    ["label: 'Häufige Fragen (FAQ)', href: '/faq'", "label: u('faq.bc'), href: getLocalizedHref('/faq')"],
    ["<span>Hilfe & Wissensdatenbank</span>", "<span>{u('faq.badge')}</span>"],
    ["            Häufig gestellte Fragen (FAQ)\n", "            {u('faq.h1')}\n"],
    ["            Hier finden Sie Antworten zu Mindestbestellwert, Speditionsversand, 10% Krypto-Rabatt und technischer Garantie.\n", "            {u('faq.intro')}\n"],
    ['placeholder="Suchbegriff eingeben (z.B. Mindestbestellwert, Krypto, Spedition)..."', "placeholder={u('faq.search')}"],
    ["{ id: 'all', label: 'Alle Fragen' }", "{ id: 'all', label: u('faq.pAll') }"],
    ["{ id: 'logistik', label: 'Spedition & Mindestbestellwert' }", "{ id: 'logistik', label: u('faq.pLog') }"],
    ["{ id: 'krypto', label: '10% Krypto-Zahlung' }", "{ id: 'krypto', label: u('faq.pCry') }"],
    ["{ id: 'technik', label: 'E-Bike Technik & Akku' }", "{ id: 'technik', label: u('faq.pTec') }"],
    ["{ id: 'garantie', label: 'Garantie & Rückgabe' }", "{ id: 'garantie', label: u('faq.pGar') }"],
    ["              Keine passenden Fragen zu diesem Suchbegriff gefunden.\n", "              {u('faq.none')}\n"],
  ];
  for (const [x, y] of pairs) { if (!t.includes(x)) { console.log('MISSING faq:', x.slice(0, 60)); missing++; } else t = t.replace(x, y); }
  fs.writeFileSync(f, t);
}

// ---- layouts (FAQ, Contact): localized metadata, redirect for untranslated languages
for (const [file, tk, dk, path] of [['app/[locale]/faq/layout.tsx', 'meta.faqTitle', 'meta.faqDesc', '/faq'], ['app/[locale]/contact/layout.tsx', 'meta.contactTitle', 'meta.contactDesc', '/contact']]) {
  fs.writeFileSync(file, `import type { Metadata } from 'next';
import React from 'react';
import { redirect } from 'next/navigation';
import { ui, hasPages } from '@/lib/ui';
import { isLocale, type Locale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) && hasPages(locale) ? locale : 'de') as Locale;
  return { title: ui(l, '${tk}'), description: ui(l, '${dk}') };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (isLocale(locale) && !hasPages(locale)) redirect('${path}');
  return <>{children}</>;
}
`);
}

// ---- About (server component)
{
  const f = 'app/[locale]/about/page.tsx';
  let t = fs.readFileSync(f, 'utf8');
  t = t.replace("export default function AboutPage() {", "export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {\n  const { locale } = await params;\n  if (isLocale(locale) && !hasPages(locale)) redirect('/about');\n  const l = (isLocale(locale) ? locale : 'de') as Locale;\n  const u = (k: string) => ui(l, k);\n  const pre = l === 'de' ? '' : '/' + l;");
  if (!t.includes("from '@/lib/ui'")) t = t.replace("import { Breadcrumbs }", "import { redirect } from 'next/navigation';\nimport { ui, hasPages } from '@/lib/ui';\nimport { isLocale, type Locale } from '@/lib/i18n';\nimport { Breadcrumbs }");
  const pairs = [
    ["label: 'Über Uns', href: '/about'", "label: u('about.bc'), href: pre + '/about'"],
    ["<span>Tradition & Innovation seit 2018</span>", "<span>{u('about.badge')}</span>"],
    ["              Deutschlands leidenschaftlicher Fachhandel für High-End E-Bikes\n", "              {u('about.h1')}\n"],
    ["Willkommen bei ebikedirect.eu. Wir verbinden traditionelles deutsches Handwerk mit zukunftsweisender Elektromobilität. Vom leichten Carbon E-MTB für alpine Trails bis zum robusten Lastenrad für Familien: Bei uns finden Sie ausschließlich renommierte Spitzenmarken.", "{u('about.intro')}"],
    ["Werkstatt & Prüfstand", "{u('about.wsTag')}"],
    ["Kein Fahrrad verlässt unseren Hof ungeprüft", "{u('about.wsH')}"],
    ["Jedes bei uns bestellte E-Bike durchläuft vor dem Verpacken einen 42-Punkte-Sicherheitscheck auf unserem digitalen Rollenprüfstand. Bremsen werden entlüftet, Schaltungen unter Last justiert und der Bordcomputer auf den neuesten Firmware-Stand aktualisiert.", "{u('about.wsText')}"],
    ["<span>Bosch eBike Systems zertifizierter Fachbetrieb</span>", "<span>{u('about.b1')}</span>"],
    ["<span>Shimano Service Center mit Original-Ersatzteilen</span>", "<span>{u('about.b2')}</span>"],
    ["<span>Geschultes Personal für Gates Carbon Drive Riemenantriebe</span>", "<span>{u('about.b3')}</span>"],
    ['alt="E-Bike Meisterwerkstatt"', "alt={u('about.imgAlt')}"],
    ["<span>Moderne Zahlungsphilosophie</span>", "<span>{u('about.payTag')}</span>"],
    ["Warum wir 10% Rabatt auf Krypto-Zahlungen bieten", "{u('about.payH')}"],
    ["Traditionelle Kreditkartenunternehmen und Zahlungsdienstleister erheben bei hochwertigen E-Bike-Käufen zwischen 2% und 4% Gebühren plus tagelange Verzögerungen. Durch die direkte Abwicklung auf der Blockchain (USDT über TRC-20 / ERC-20 oder Bitcoin) eliminieren wir Zwischenhändler und geben diese Ersparnis zu 100% als 10%-Skonto an unsere Kunden weiter.", "{u('about.payText')}"],
    ['href="/shop"', "href={pre + '/shop'}"],
    ["              E-Bike Sortiment erkunden\n", "              {u('about.cta1')}\n"],
    ['href="/contact"', "href={pre + '/contact'}"],
    ["              Kontakt aufnehmen\n", "              {u('about.cta2')}\n"],
  ];
  for (const [x, y] of pairs) { if (!t.includes(x)) { console.log('MISSING about:', x.slice(0, 60)); missing++; } else t = t.replace(x, y); }
  // metadata becomes dynamic
  t = t.replace(/export const metadata[^]*?\};\n/, "export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {\n  const { locale } = await params;\n  const l = (isLocale(locale) && hasPages(locale) ? locale : 'de') as Locale;\n  return { title: ui(l, 'meta.aboutTitle'), description: ui(l, 'meta.aboutDesc') };\n}\n");
  fs.writeFileSync(f, t);
}

// ---- Contact (client)
{
  const f = 'app/[locale]/contact/page.tsx';
  let t = fs.readFileSync(f, 'utf8');
  if (!t.includes("useI18n")) t = t.replace("import { Breadcrumbs }", "import { useI18n } from '@/context/i18n-context';\nimport { Breadcrumbs }");
  t = t.replace(/(export default function ContactPage\(\) \{\n)/, "$1  const { u, locale, getLocalizedHref } = useI18n();\n");
  const pairs = [
    ["label: 'Kontakt', href: '/contact'", "label: u('contact.bc'), href: getLocalizedHref('/contact')"],
    ["            Wir sind für Sie da\n", "            {u('contact.tag')}\n"],
    ["            Kontaktieren Sie unsere E-Bike Spezialisten\n", "            {u('contact.h1')}\n"],
    ["            Haben Sie Fragen zu Rahmenhöhen, Lieferzeiten oder der 10% Krypto-Bezahlung? Unser Team antwortet werktags innerhalb von 2 Stunden.\n", "            {u('contact.intro')}\n"],
    ["                Zentrale & Meisterbetrieb\n", "                {u('contact.hq')}\n"],
    ['font-bold">Firmensitz:</strong>', "font-bold\">{u('contact.seat')}</strong>"],
    ['font-bold">E-Mail:</strong>', "font-bold\">{u('contact.mail')}</strong>"],
    ['font-bold">Öffnungszeiten:</strong>', "font-bold\">{u('contact.hours')}</strong>"],
    ["<div>Montag – Freitag: 09:00 – 18:30 Uhr</div>", "<div>{u('contact.hMonFri')}</div>"],
    ["<div>Samstag: 10:00 – 16:00 Uhr</div>", "<div>{u('contact.hSat')}</div>"],
    ["<span>Bosch Service</span>", "<span>{u('contact.bBosch')}</span>"],
    ["<span>Shimano Partner</span>", "<span>{u('contact.bShimano')}</span>"],
    ["                    Vielen Dank für Ihre Nachricht!\n", "                    {u('contact.thanks')}\n"],
    ["                    Wir haben Ihre Anfrage erhalten. Ein zertifizierter E-Bike Fachberater wird sich innerhalb weniger Stunden bei Ihnen melden.\n", "                    {u('contact.thanksText')}\n"],
    ["                    Weitere Nachricht verfassen\n", "                    {u('contact.again')}\n"],
    ["                    Nachricht senden\n", "                    {u('contact.formH')}\n"],
    ["                        Ihr Name *\n", "                        {u('contact.name')}\n"],
    ["                        Ihre E-Mail-Adresse *\n", "                        {u('contact.email')}\n"],
    ["                        Telefonnummer (optional)\n", "                        {u('contact.phone')}\n"],
    ["                        Thema / Betreff\n", "                        {u('contact.subject')}\n"],
    ['<option value="Allgemeine Kaufberatung">Allgemeine Kaufberatung</option>', "<option value=\"Allgemeine Kaufberatung\">{u('contact.s1')}</option>"],
    ['<option value="Frage zur Rahmengröße">Frage zur Rahmengröße</option>', "<option value=\"Frage zur Rahmengröße\">{u('contact.s2')}</option>"],
    ['<option value="Krypto-Zahlung & 10% Rabatt">Krypto-Zahlung & 10% Rabatt</option>', "<option value=\"Krypto-Zahlung & 10% Rabatt\">{u('contact.s3')}</option>"],
    ['<option value="Lieferstatus & Spedition">Lieferstatus & Spedition</option>', "<option value=\"Lieferstatus & Spedition\">{u('contact.s4')}</option>"],
    ['<option value="Dienstrad / JobRad Leasing">Dienstrad / JobRad Leasing</option>', "{locale === 'de' && <option value=\"Dienstrad / JobRad Leasing\">Dienstrad / JobRad Leasing</option>}"],
    ["                      Ihre Mitteilung *\n", "                      {u('contact.msg')}\n"],
    ['placeholder="Beschreiben Sie Ihre Anforderungen oder das gewünschte Modell..."', "placeholder={u('contact.msgPh')}"],
    ["<span>Nachricht absenden</span>", "<span>{u('contact.send')}</span>"],
    ["                    Ihre Daten werden verschlüsselt übertragen und streng nach DSGVO verarbeitet.\n", "                    {u('contact.privacy')}\n"],
  ];
  for (const [x, y] of pairs) { if (!t.includes(x)) { console.log('MISSING contact:', x.slice(0, 60)); missing++; } else t = t.replace(x, y); }
  fs.writeFileSync(f, t);
}
console.log('done, missing', missing);
