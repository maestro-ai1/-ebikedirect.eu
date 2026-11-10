'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { extractLocaleFromPath, getHreflangAlternates, getLocalizedPath, localesForPath, Locale } from '@/lib/i18n';
import { l10nAlternates, isL10nPath } from '@/lib/l10n-pages';

// Emits the self-referencing canonical plus the hreflang set for the current page.
export function HreflangTags({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://ebikedirect.eu';
  const { strippedPath } = extractLocaleFromPath(pathname);
  const translated = locale === 'de' || localesForPath(strippedPath).some((l) => l.code === locale) || isL10nPath(locale, strippedPath);
  const canonical = `${baseUrl}${getLocalizedPath(strippedPath, translated ? locale : 'de')}`;
  const alts = l10nAlternates(strippedPath, locale, baseUrl) || getHreflangAlternates(strippedPath, baseUrl);

  return (
    <>
      <link rel="canonical" href={canonical} />
      {alts.map((item) => (
        <link key={item.hreflang} rel="alternate" hrefLang={item.hreflang} href={item.url} />
      ))}
    </>
  );
}
