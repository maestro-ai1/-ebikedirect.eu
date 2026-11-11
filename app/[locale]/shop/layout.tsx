import type { Metadata } from 'next';
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
