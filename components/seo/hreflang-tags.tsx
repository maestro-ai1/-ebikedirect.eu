'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { extractLocaleFromPath, getLocalizedPath } from '@/lib/i18n';

export function HreflangTags() {
  const pathname = usePathname() || '/';
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const { strippedPath } = extractLocaleFromPath(pathname);

  // Exact mappings for European search engines
  const hreflangMappings = [
    { hreflang: 'de', url: `${baseUrl}${getLocalizedPath(strippedPath, 'de')}` },
    { hreflang: 'de-DE', url: `${baseUrl}${getLocalizedPath(strippedPath, 'de')}` },
    { hreflang: 'de-AT', url: `${baseUrl}${getLocalizedPath(strippedPath, 'de')}` },
    { hreflang: 'en', url: `${baseUrl}${getLocalizedPath(strippedPath, 'en')}` },
    { hreflang: 'en-EU', url: `${baseUrl}${getLocalizedPath(strippedPath, 'en')}` },
    { hreflang: 'en-GB', url: `${baseUrl}${getLocalizedPath(strippedPath, 'en')}` },
    { hreflang: 'nl', url: `${baseUrl}${getLocalizedPath(strippedPath, 'nl')}` },
    { hreflang: 'nl-NL', url: `${baseUrl}${getLocalizedPath(strippedPath, 'nl')}` },
    { hreflang: 'nl-BE', url: `${baseUrl}${getLocalizedPath(strippedPath, 'nl')}` },
    { hreflang: 'it', url: `${baseUrl}${getLocalizedPath(strippedPath, 'it')}` },
    { hreflang: 'it-IT', url: `${baseUrl}${getLocalizedPath(strippedPath, 'it')}` },
    { hreflang: 'es', url: `${baseUrl}${getLocalizedPath(strippedPath, 'es')}` },
    { hreflang: 'es-ES', url: `${baseUrl}${getLocalizedPath(strippedPath, 'es')}` },
    { hreflang: 'x-default', url: `${baseUrl}${strippedPath === '/' ? '' : strippedPath}` }
  ];

  return (
    <>
      {hreflangMappings.map((item) => (
        <link key={item.hreflang} rel="alternate" hrefLang={item.hreflang} href={item.url} />
      ))}
    </>
  );
}
