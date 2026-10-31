'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Locale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LocaleInfo,
  getTranslation,
  extractLocaleFromPath,
  getLocalizedPath,
  isLocale
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

export function I18nProvider({ children, locale: initialLocale }: { children: React.ReactNode; locale: Locale }) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  const locale: Locale = initialLocale;

  const localeInfo = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];

  const handleSetLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Smoothly transition the route to the new localized prefix while preserving the sub-path and search query
    const targetPath = getLocalizedPath(pathname, newLocale);
    const queryString = typeof window !== 'undefined' ? window.location.search.slice(1) : '';
    const finalUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

    router.push(finalUrl, { scroll: false });
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(locale, key, fallback);
  };

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(localeInfo.intl, {
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
