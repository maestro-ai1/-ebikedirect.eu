import deKw from '@/data/keywords/de.json';
import frKw from '@/data/keywords/fr.json';
import nlKw from '@/data/keywords/nl.json';
import itKw from '@/data/keywords/it.json';
import esKw from '@/data/keywords/es.json';
import ptKw from '@/data/keywords/pt.json';
import { MESSAGES, Locale, getHreflangAlternates, getLocalizedPath, INDEXED_LOCALES } from '@/lib/i18n';

export interface KeywordRef {
  keyword: string;
  volume: number;
  kd: number | null;
  intent: string;
}

export interface KeywordPage {
  url: string;
  type: 'home' | 'category' | 'brand' | 'accessory';
  name: string;
  primary: KeywordRef;
  secondary: KeywordRef[];
  faq?: KeywordRef[];
  metaTitle?: string;
  metaDescription?: string;
}

// Word guard for page keywords (owner audit 2026-11-04): secondary and FAQ keywords never carry test/review/spec words or a model year up to 2025.
// The used-bike landing page keeps its own words because that is its topic.
const GUARD = /(^|[\s-])(test|tests|testbericht|review|reviews|bewertung|bewertungen|erfahrung|erfahrungen|idealo|specs|datenblatt|gebraucht|gebrauchte|gebrauchter|used|2019|2020|2021|2022|2023|2024|2025)($|[\s-])/i;
const guardPages = (bank: any) => ({ ...bank, pages: bank.pages.map((p: any) => (/gebraucht/.test(p.url) ? p : { ...p, secondary: (p.secondary || []).filter((k: any) => !GUARD.test(k.keyword)), faq: p.faq ? p.faq.filter((k: any) => !GUARD.test(k.keyword)) : p.faq })) });

const BANK: Record<string, { pages: KeywordPage[] }> = {
  de: guardPages(deKw) as any,
  fr: frKw as any,
  nl: nlKw as any,
  it: itKw as any,
  es: esKw as any,
  pt: ptKw as any
};

export const SITE_URL = process.env.APP_URL || 'https://ebikedirect.eu';
const BRAND = 'ebikedirect.eu';

export function getKeywordPage(locale: Locale, url: string): KeywordPage | null {
  const bank = BANK[locale];
  if (!bank) return null;
  const norm = (u: string) => (u.length > 1 ? u.replace(/\/$/, '') : u);
  return bank.pages.find((p) => norm(p.url) === norm(url)) || null;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Title starts with the primary keyword and stays within 60 characters. */
export function buildTitle(locale: Locale, primary: string): string {
  const tail = MESSAGES[locale]?.seo?.titleTail as string | undefined;
  const kw = capitalize(primary);
  const full = tail ? `${kw} – ${tail} | ${BRAND}` : '';
  if (full && full.length <= 60) return full;
  const short = `${kw} | ${BRAND}`;
  return short.length <= 60 ? short : kw.slice(0, 60);
}

/** Meta description of 110 to 158 characters carrying the primary and a call to action. */
export function buildDescription(locale: Locale, primary: string): string {
  const seo = MESSAGES[locale]?.seo;
  const sentences: string[] = [seo?.s1, seo?.s2, seo?.s3].filter(Boolean);
  const kw = capitalize(primary);
  let parts = [...sentences];
  let text = `${kw}: ${parts.join(' ')}`;
  while (text.length > 158 && parts.length > 1) {
    parts = parts.slice(0, -2).concat(parts.slice(-1)); // drop the middle sentence first, keep the call to action
    text = `${kw}: ${parts.join(' ')}`;
  }
  return text;
}

/** Canonical and hreflang alternates for a stripped path. */
export function buildAlternates(locale: Locale, strippedPath: string) {
  const languages = Object.fromEntries(getHreflangAlternates(strippedPath, SITE_URL).map((a) => [a.hreflang, a.url]));
  return {
    canonical: `${SITE_URL}${getLocalizedPath(strippedPath, locale)}`,
    languages
  };
}

export function isIndexed(locale: Locale): boolean {
  return INDEXED_LOCALES.some((l) => l.code === locale);
}
