'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LocaleInfo,
  getTranslation,
  extractLocaleFromPath,
  getLocalizedPath
} from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  localeInfo: LocaleInfo;
  setLocale: (newLocale: Locale) => void;
  t: (key: string, fallback?: string) => string;
  formatCurrency: (amount: number) => string;
  getLocalizedHref: (path: string) => string;
  supportedLocales: LocaleInfo[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const router = useRouter();

  // Internal preference state when on default route without prefix
  const [prefLocale, setPrefLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;
    try {
      const stored = localStorage.getItem('ebikedirect_locale') as Locale;
      if (stored && ['de', 'en', 'nl', 'it', 'es'].includes(stored)) {
        return stored;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LOCALE;
  });

  // Deterministically compute the active locale: URL path prefix takes precedence
  const { locale: pathLocale } = extractLocaleFromPath(pathname);
  const locale: Locale = pathLocale !== DEFAULT_LOCALE ? pathLocale : prefLocale;

  const localeInfo = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];

  const handleSetLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    setPrefLocale(newLocale);
    try {
      localStorage.setItem('ebikedirect_locale', newLocale);
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }

    // Smoothly transition the route to the new localized prefix while preserving the sub-path and search query
    const targetPath = getLocalizedPath(pathname, newLocale);
    const queryString = searchParams?.toString();
    const finalUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

    router.push(finalUrl, { scroll: false });
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(locale, key, fallback);
  };

  const formatCurrency = (amount: number): string => {
    try {
      const localeString = locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-IE' : locale === 'nl' ? 'nl-NL' : locale === 'it' ? 'it-IT' : 'es-ES';
      return new Intl.NumberFormat(localeString, {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} €`;
    }
  };

  const getLocalizedHref = (path: string): string => {
    return getLocalizedPath(path, locale);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        localeInfo,
        setLocale: handleSetLocale,
        t,
        formatCurrency,
        getLocalizedHref,
        supportedLocales: SUPPORTED_LOCALES
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
