import type { Metadata } from 'next';
import { ui } from '@/lib/ui';
import { isLocale, type Locale } from '@/lib/i18n';
import React from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) ? locale : 'de') as Locale;
  return { title: ui(l, 'meta.cartTitle'), description: ui(l, 'meta.cartDesc'), robots: { index: false, follow: false } };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
