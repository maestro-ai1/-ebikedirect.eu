import frLive from '@/data/keywords/fr-live.json';
import enLive from '@/data/keywords/en-live.json';
import { extractLocaleFromPath, type Locale } from '@/lib/i18n';

// Pages that exist in another language than German. Each one is rendered by the same internal (German) route and carries its own
// keyword set (data/keywords/<lang>-live.json, built by scripts/_lang-pages.cjs from the language bank).
export interface L10nKw { keyword: string; volume: number; kd: number | null; intent: string }
export interface L10nPage {
  url: string; // public path, no language prefix, e.g. /velos-electriques/vtt-electrique/
  dePath: string; // internal German path that holds the product list, e.g. /e-bikes/e-mountainbikes
  name: string;
  display: string; // H1 and title wording of the primary keyword (accents, apostrophes)
  type: 'category' | 'brand' | 'accessory' | 'hub';
  primary: L10nKw;
  secondary: L10nKw[];
  faq: L10nKw[];
}

const LIVE: Partial<Record<Locale, L10nPage[]>> = {
  fr: (frLive as unknown as { pages: L10nPage[] }).pages,
  en: (enLive as unknown as { pages: L10nPage[] }).pages,
};

// every product page exists in French (batch 3); the shop route returns 404 for unknown slugs, so the path pattern is enough here
const isFrProduct = (path: string) => /^\/shop\/[^/]+$/.test(norm0(path));
const REG: Record<string, string[]> = { fr: ['fr', 'fr-FR', 'fr-BE'], nl: ['nl', 'nl-NL', 'nl-BE'], it: ['it', 'it-IT'], es: ['es', 'es-ES'], pt: ['pt', 'pt-PT'], en: ['en', 'en-GB', 'en-IE'] };
const norm0 = (u: string) => (u.length > 1 ? u.replace(/\/$/, '') : u);
const norm = (u: string) => (u.length > 1 ? u.replace(/\/$/, '') : u);

export function l10nPages(locale: Locale): L10nPage[] {
  return LIVE[locale] || [];
}
export function l10nByUrl(locale: Locale, url: string): L10nPage | undefined {
  return l10nPages(locale).find((p) => norm(p.url) === norm(url));
}
export function l10nByDePath(locale: Locale, dePath: string): L10nPage | undefined {
  return l10nPages(locale).find((p) => norm(p.dePath) === norm(dePath));
}
export const L10N_LOCALES = Object.keys(LIVE) as Locale[];

/** hreflang pairs for a page: its German original and every language version, whichever of them is the current URL. */
// FAQ, About and Contact exist in these languages besides German (see hasPages in lib/ui.ts)
export const SERVICE_PATHS = ['/faq', '/about', '/contact'];
export const SERVICE_LANGS: Locale[] = ['fr', 'en'];
const isService = (p: string) => SERVICE_PATHS.includes(norm0(p));

export function l10nAlternates(strippedPath: string, locale: Locale, baseUrl: string): { hreflang: string; url: string }[] | null {
  let dePath: string | null = null;
  if (isService(strippedPath) && (locale === 'de' || SERVICE_LANGS.includes(locale))) {
    dePath = norm(strippedPath);
    const out: { hreflang: string; url: string }[] = [];
    for (const r of ['de', 'de-DE', 'de-AT', 'de-CH']) out.push({ hreflang: r, url: `${baseUrl}${dePath}` });
    for (const l of SERVICE_LANGS) for (const r of REG[l] || [l]) out.push({ hreflang: r, url: `${baseUrl}/${l}${dePath}` });
    out.push({ hreflang: 'x-default', url: `${baseUrl}${dePath}` });
    return out;
  }
  if (isFrProduct(strippedPath) && (locale === 'de' || PRODUCT_LANGS.has(locale))) {
    dePath = norm(strippedPath);
    const out: { hreflang: string; url: string }[] = [];
    for (const r of ['de', 'de-DE', 'de-AT', 'de-CH']) out.push({ hreflang: r, url: `${baseUrl}${dePath}` });
    for (const l of Array.from(PRODUCT_LANGS)) for (const r of REG[l] || [l]) out.push({ hreflang: r, url: `${baseUrl}/${l}${dePath}` });
    out.push({ hreflang: 'x-default', url: `${baseUrl}${dePath}` });
    return out;
  }
  if (locale === 'de') {
    dePath = norm(strippedPath);
    if (!L10N_LOCALES.some((l) => l10nByDePath(l, dePath!))) return null;
  } else {
    const p = l10nByUrl(locale, strippedPath);
    if (!p) return null;
    dePath = norm(p.dePath);
  }
  const out: { hreflang: string; url: string }[] = [];
  for (const r of ['de', 'de-DE', 'de-AT', 'de-CH']) out.push({ hreflang: r, url: `${baseUrl}${dePath}` });
  for (const l of L10N_LOCALES) {
    const p = l10nByDePath(l, dePath);
    if (!p) continue;
    for (const r of REG[l] || [l]) out.push({ hreflang: r, url: `${baseUrl}/${l}${norm(p.url)}` });
  }
  out.push({ hreflang: 'x-default', url: `${baseUrl}${dePath}` });
  return out;
}

/** True when the page at this stripped path is a real translated page in that language. */
export function isL10nPath(locale: Locale, strippedPath: string): boolean {
  if (PRODUCT_LANGS.has(locale) && isFrProduct(strippedPath)) return true;
  if (isService(strippedPath) && SERVICE_LANGS.includes(locale)) return true;
  return !!l10nByUrl(locale, strippedPath);
}

// pages that exist in every language (translated user interface)
const SHARED_PAGES = new Set(['/', '/shop', '/checkout', '/cart']);
// product pages exist in these languages
export const PRODUCT_LANGS = new Set<Locale>(['fr', 'en']);

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
  if (/^\/shop\/[^/]+$/.test(dePath)) return PRODUCT_LANGS.has(to) ? prefix + dePath : prefix + '/shop';
  const page = l10nByDePath(to, dePath);
  if (page) return prefix + norm(page.url);
  if (SHARED_PAGES.has(dePath)) return dePath === '/' ? prefix : prefix + dePath;
  if (isService(dePath) && SERVICE_LANGS.includes(to)) return prefix + dePath;
  return prefix || '/';
}
