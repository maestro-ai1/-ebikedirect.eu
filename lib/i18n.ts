import deMessages from '@/messages/de.json';
import enMessages from '@/messages/en.json';
import nlMessages from '@/messages/nl.json';
import itMessages from '@/messages/it.json';
import esMessages from '@/messages/es.json';

export type Locale = 'de' | 'en' | 'nl' | 'it' | 'es';

export interface LocaleInfo {
  code: Locale;
  label: string;
  nativeName: string;
  flag: string;
  country: string;
  hreflang: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'de', label: 'DE', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Deutschland & Österreich', hreflang: 'de-DE' },
  { code: 'en', label: 'EN', nativeName: 'English', flag: '🇬🇧', country: 'Europe (English)', hreflang: 'en-EU' },
  { code: 'nl', label: 'NL', nativeName: 'Nederlands', flag: '🇳🇱', country: 'Nederland & België', hreflang: 'nl-NL' },
  { code: 'it', label: 'IT', nativeName: 'Italiano', flag: '🇮🇹', country: 'Italia', hreflang: 'it-IT' },
  { code: 'es', label: 'ES', nativeName: 'Español', flag: '🇪🇸', country: 'España', hreflang: 'es-ES' }
];

export const DEFAULT_LOCALE: Locale = 'de';

export const MESSAGES: Record<Locale, any> = {
  de: deMessages,
  en: enMessages,
  nl: nlMessages,
  it: itMessages,
  es: esMessages
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
      // Fallback to German or English if missing in target
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
 * Extracts the locale prefix from a pathname (e.g. "/en/shop" -> "en").
 */
export function extractLocaleFromPath(pathname: string): { locale: Locale; strippedPath: string } {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0] as Locale;

  if (first && (['de', 'en', 'nl', 'it', 'es'] as Locale[]).includes(first)) {
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
