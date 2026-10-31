'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { extractLocaleFromPath, getHreflangAlternates, getLocalizedPath, Locale } from '@/lib/i18n';

// Emits the self-referencing canonical plus the hreflang set for the current page.
export function HreflangTags({ locale }: { locale: Locale }) {
  const pathname = usePathname() || '/';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://ebikedirect.eu';
  const { strippedPath } = extractLocaleFromPath(pathname);
  const canonical = `${baseUrl}${getLocalizedPath(strippedPath, locale)}`;

  return (
    <>
      <link rel="canonical" href={canonical} />
      {getHreflangAlternates(strippedPath, baseUrl).map((item) => (
        <link key={item.hreflang} rel="alternate" hrefLang={item.hreflang} href={item.url} />
      ))}
    </>
  );
}
