import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Space_Grotesk, Inter } from 'next/font/google';
import { I18nProvider } from '@/context/i18n-context';
import { CartProvider } from '@/context/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { RecentSalesPopup } from '@/components/home/recent-sales-popup';
import { StoreJsonLd } from '@/components/seo/json-ld';
import { HreflangTags } from '@/components/seo/hreflang-tags';
import { LOCALE_CODES, SUPPORTED_LOCALES, isLocale, MESSAGES } from '@/lib/i18n';
import { SITE_URL, getKeywordPage, buildTitle, buildDescription, isIndexed } from '@/lib/seo';

const display = Space_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-display-face', display: 'swap' });
const body = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-body-face', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#131A22',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return LOCALE_CODES.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<string, string> = {
  de: 'de_DE', fr: 'fr_FR', nl: 'nl_NL', it: 'it_IT', es: 'es_ES', pt: 'pt_PT', en: 'en_IE'
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const home = getKeywordPage(locale, '/');
  const primary = home?.primary.keyword || MESSAGES[locale].seo.home;
  // an owner-approved title and description (data/keywords) wins over the generated pair
  const title = home?.metaTitle || buildTitle(locale, primary);
  const description = home?.metaDescription || buildDescription(locale, primary);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: '%s | ebikedirect.eu' },
    description,
    authors: [{ name: 'ebikedirect.eu' }],
    creator: 'ebikedirect.eu',
    publisher: 'ebikedirect.eu',
    icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      url: SITE_URL,
      title,
      description,
      siteName: 'ebikedirect.eu',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: isIndexed(locale)
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const info = SUPPORTED_LOCALES.find((l) => l.code === locale)!;

  return (
    <html lang={info.hreflang.split('-')[0]} className={`scroll-smooth ${display.variable} ${body.variable}`}>
      <head>
        <StoreJsonLd />
        <Suspense fallback={null}>
          <HreflangTags locale={locale} />
        </Suspense>
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#131A22] antialiased selection:bg-[#FF5722] selection:text-white" suppressHydrationWarning>
        <Suspense fallback={null}>
          <I18nProvider locale={locale}>
            <CartProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <CartDrawer />
              <RecentSalesPopup />
              <Footer />
            </CartProvider>
          </I18nProvider>
        </Suspense>
      </body>
    </html>
  );
}
