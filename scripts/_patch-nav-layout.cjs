const fs = require('fs');
// ---- catalog-nav body
let nav = fs.readFileSync('components/shop/catalog-nav.tsx', 'utf8');
const i = nav.indexOf('  const link = (path: string, label: string, n: number) => (');
nav = nav.slice(0, i) + `  const link = (path: string, label: string, n: number) => {
    const href = hrefOf(path);
    if (!href) return null;
    return (
      <li key={path}>
        <Link href={href} aria-current={current === path ? 'page' : undefined} className={\`flex items-center justify-between gap-3 py-1.5 text-sm hover:text-[#FF5722] \${current === path ? 'font-black text-[#FF5722]' : 'font-semibold text-[#131A22]'}\`}>
          <span>{label}</span>
          <span className="text-xs font-medium text-gray-500">{n}</span>
        </Link>
      </li>
    );
  };
  const shopHref = locale === 'de' ? '/shop' : \`/\${locale}/shop\`;
  return (
    <nav aria-label={L('nav.label')} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex flex-wrap items-start gap-3">
        <Dropdown label={L('nav.cats')}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {CATEGORY_LINKS.map((c) => link(c.path, L(c.key), c.path === '/e-bikes' ? bike.length : count(c.path)))}
          </ul>
        </Dropdown>
        <Dropdown label={L('nav.brands')}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
            {brands.map((b) => link(b.path, b.brand!, count(b.path)))}
          </ul>
          {motors.length > 0 && (
            <>
              <p className="mt-4 mb-1 text-xs font-black uppercase tracking-wider text-gray-500">{L('nav.motors')}</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6">
                {motors.map((m) => link(m.path, nameOf(m.path, getKeywordPage('de', m.path)?.name.replace(/ \\(.*\\)/, '') || m.path), count(m.path)))}
              </ul>
            </>
          )}
        </Dropdown>
        <Dropdown label={L('nav.acc')}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {link('/zubehoer', L('nav.allAcc'), PRODUCTS.length - bike.length)}
            {acc.map((a) => link(a.path, nameOf(a.path, getKeywordPage('de', a.path)?.name || getMappedPage(a.path)?.accessory || a.path), count(a.path)))}
          </ul>
        </Dropdown>
        <Link href={shopHref} className="inline-flex items-center px-4 py-2.5 rounded-lg bg-[#131A22] text-white text-sm font-bold hover:bg-[#1D2633]">{L('nav.filter')}</Link>
      </div>
    </nav>
  );
}
`;
// Dropdown labels are plain strings already
fs.writeFileSync('components/shop/catalog-nav.tsx', nav);

// ---- shop layout (metadata and nav per language)
fs.writeFileSync('app/[locale]/shop/layout.tsx', `import type { Metadata } from 'next';
import React from 'react';
import { CatalogNav } from '@/components/shop/catalog-nav';
import { ui } from '@/lib/ui';
import { isLocale, type Locale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : 'de') as Locale;
  return { title: ui(l, 'meta.shopTitle'), description: ui(l, 'meta.shopDesc') };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : 'de') as Locale;
  return (
    <>
      <CatalogNav locale={l} />
      {children}
    </>
  );
}
`);

// ---- switchPath in l10n-pages
let f = 'lib/l10n-pages.ts';
let t = fs.readFileSync(f, 'utf8');
if (!t.includes('export function switchPath')) {
  t = t.replace("import type { Locale } from '@/lib/i18n';", "import { extractLocaleFromPath, type Locale } from '@/lib/i18n';");
  t += `
// pages that exist in every language (translated user interface)
const SHARED_PAGES = new Set(['/', '/shop', '/checkout', '/cart']);
// product pages exist in these languages
const PRODUCT_LANGS = new Set<Locale>(['fr']);

/** Path of the same page in another language: its translation when one exists, otherwise the language's shop or home (never a 404, never German text under another prefix). */
export function switchPath(pathname: string, from: Locale, to: Locale): string {
  const stripped = norm(extractLocaleFromPath(pathname).strippedPath || '/');
  let dePath = stripped;
  if (from !== 'de') {
    const p = l10nByUrl(from, stripped);
    if (p) dePath = norm(p.dePath);
  }
  const prefix = to === 'de' ? '' : '/' + to;
  if (to === 'de') return dePath === '/' ? '/' : dePath;
  if (/^\\/shop\\/[^/]+$/.test(dePath)) return PRODUCT_LANGS.has(to) ? prefix + dePath : prefix + '/shop';
  const page = l10nByDePath(to, dePath);
  if (page) return prefix + norm(page.url);
  if (SHARED_PAGES.has(dePath)) return dePath === '/' ? prefix : prefix + dePath;
  return prefix || '/';
}
`;
}
fs.writeFileSync(f, t);
console.log('ok', t.includes('export function switchPath'));
