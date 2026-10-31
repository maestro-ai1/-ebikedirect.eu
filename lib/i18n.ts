import deMessages from '@/messages/de.json';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';
import nlMessages from '@/messages/nl.json';
import itMessages from '@/messages/it.json';
import esMessages from '@/messages/es.json';
import ptMessages from '@/messages/pt.json';

// One locale per language we hold a keyword bank for (Semrush db in brackets):
// de (DE, AT, CH), fr (FR), nl (NL), it (IT), es (ES), pt (PT).
// en is a UI fallback only: no keyword bank, so it is not in hreflang or the sitemap.
export type Locale = 'de' | 'fr' | 'nl' | 'it' | 'es' | 'pt' | 'en';

export interface LocaleInfo {
  code: Locale;
  label: string;
  nativeName: string;
  country: string;
  hreflang: string;
  /** Extra hreflang regions that share this language's pages. */
  regions: string[];
  /** Intl locale used for number and currency formatting. */
  intl: string;
  /** True when a keyword bank backs this language (indexed, in hreflang and sitemap). */
  hasKeywordBank: boolean;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'de', label: 'DE', nativeName: 'Deutsch', country: 'Deutschland, Österreich, Schweiz', hreflang: 'de-DE', regions: ['de', 'de-AT', 'de-CH'], intl: 'de-DE', hasKeywordBank: true },
  { code: 'fr', label: 'FR', nativeName: 'Français', country: 'France, Belgique', hreflang: 'fr-FR', regions: ['fr', 'fr-BE'], intl: 'fr-FR', hasKeywordBank: true },
  { code: 'nl', label: 'NL', nativeName: 'Nederlands', country: 'Nederland, België', hreflang: 'nl-NL', regions: ['nl', 'nl-BE'], intl: 'nl-NL', hasKeywordBank: true },
  { code: 'it', label: 'IT', nativeName: 'Italiano', country: 'Italia', hreflang: 'it-IT', regions: ['it'], intl: 'it-IT', hasKeywordBank: true },
  { code: 'es', label: 'ES', nativeName: 'Español', country: 'España', hreflang: 'es-ES', regions: ['es'], intl: 'es-ES', hasKeywordBank: true },
  { code: 'pt', label: 'PT', nativeName: 'Português', country: 'Portugal', hreflang: 'pt-PT', regions: ['pt'], intl: 'pt-PT', hasKeywordBank: true },
  { code: 'en', label: 'EN', nativeName: 'English', country: 'Europe (English)', hreflang: 'en', regions: ['en'], intl: 'en-IE', hasKeywordBank: false }
];

export const LOCALE_CODES: Locale[] = SUPPORTED_LOCALES.map((l) => l.code);
export const INDEXED_LOCALES: LocaleInfo[] = SUPPORTED_LOCALES.filter((l) => l.hasKeywordBank);
export const DEFAULT_LOCALE: Locale = 'de';

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALE_CODES as string[]).includes(value);
}

export const MESSAGES: Record<Locale, any> = {
  de: deMessages,
  fr: frMessages,
  nl: nlMessages,
  it: itMessages,
  es: esMessages,
  pt: ptMessages,
  en: enMessages
};

/**
 * Resolves a nested dot-separated key (e.g. "nav.shop") from a messages dictionary.
 */
export function getTranslation(locale: Locale, key: string, fallback?: string): string {
  const dict = MESSAGES[locale] || MESSAGES[DEFAULT_LOCALE];
  const keys = key.split('.');
  let current: any = dict;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Fallback to the default language if missing in target
      const fallbackDict = MESSAGES[DEFAULT_LOCALE];
      let fbCurrent: any = fallbackDict;
      for (const fbK of keys) {
        if (fbCurrent && typeof fbCurrent === 'object' && fbK in fbCurrent) {
          fbCurrent = fbCurrent[fbK];
        } else {
          return fallback || key;
        }
      }
      return typeof fbCurrent === 'string' ? fbCurrent : fallback || key;
    }
  }

  return typeof current === 'string' ? current : fallback || key;
}

/**
 * Extracts the locale prefix from a pathname (e.g. "/fr/shop" -> "fr").
 */
export function extractLocaleFromPath(pathname: string): { locale: Locale; strippedPath: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (isLocale(first)) {
    const stripped = '/' + segments.slice(1).join('/');
    return { locale: first, strippedPath: stripped === '' ? '/' : stripped };
  }

  return { locale: DEFAULT_LOCALE, strippedPath: pathname || '/' };
}

/**
 * Formats a path with the specified locale prefix.
 */
export function getLocalizedPath(path: string, targetLocale: Locale): string {
  const { strippedPath } = extractLocaleFromPath(path);
  if (targetLocale === DEFAULT_LOCALE) {
    return strippedPath === '/' ? '/' : strippedPath;
  }
  return `/${targetLocale}${strippedPath === '/' ? '' : strippedPath}`;
}

// Content that exists in German only: magazine, category, brand and accessory pages.
// The other languages get these pages once their keyword maps and copy exist.
const GERMAN_ONLY_PATHS = [/^\/blog(\/|$)/, /^\/e-bikes(\/|$)/, /^\/marken(\/|$)/, /^\/zubehoer(\/|$)/];

export function isGermanOnlyPath(strippedPath: string): boolean {
  return GERMAN_ONLY_PATHS.some((r) => r.test(strippedPath));
}

// Only the home page has localized metadata in every language so far. All other pages are
// German content under every prefix, so they are indexed in German only and the translated
// URLs stay noindex until the copy is translated.
export function localesForPath(strippedPath: string): LocaleInfo[] {
  const localized = strippedPath === '/' || strippedPath === '';
  return localized ? INDEXED_LOCALES : INDEXED_LOCALES.filter((l) => l.code === DEFAULT_LOCALE);
}

/**
 * hreflang alternates for one stripped path: every indexed language plus its regions,
 * and x-default pointing at the default language.
 */
export function getHreflangAlternates(strippedPath: string, baseUrl: string): { hreflang: string; url: string }[] {
  const list: { hreflang: string; url: string }[] = [];
  for (const l of localesForPath(strippedPath)) {
    const url = `${baseUrl}${getLocalizedPath(strippedPath, l.code)}`;
    for (const r of l.regions) list.push({ hreflang: r === l.code ? l.code : r, url });
    list.push({ hreflang: l.hreflang, url });
  }
  list.push({ hreflang: 'x-default', url: `${baseUrl}${getLocalizedPath(strippedPath, DEFAULT_LOCALE)}` });
  // de-DE and de could repeat: keep the first occurrence of each hreflang value
  const seen = new Set<string>();
  return list.filter((i) => (seen.has(i.hreflang) ? false : (seen.add(i.hreflang), true)));
}
