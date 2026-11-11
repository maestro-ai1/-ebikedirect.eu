import type { Metadata } from 'next';
import React from 'react';
import { redirect } from 'next/navigation';
import { ui, hasPages } from '@/lib/ui';
import { isLocale, type Locale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) && hasPages(locale) ? locale : 'de') as Locale;
  return { title: ui(l, 'meta.contactTitle'), description: ui(l, 'meta.contactDesc') };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (isLocale(locale) && !hasPages(locale)) redirect('/contact');
  return <>{children}</>;
}
