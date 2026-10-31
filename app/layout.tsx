import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider } from '@/context/i18n-context';
import { CartProvider } from '@/context/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { RecentSalesPopup } from '@/components/home/recent-sales-popup';
import { StoreJsonLd } from '@/components/seo/json-ld';
import { HreflangTags } from '@/components/seo/hreflang-tags';

const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';

export const viewport: Viewport = {
  themeColor: '#131A22',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ebikedirect.eu | Premium E-Bikes & Pedelecs Fachhandel',
    template: '%s | ebikedirect.eu'
  },
  description: 'Europas führender Fachhandel für High-End E-Bikes von Cube, Specialized, Riese & Müller, Haibike & Canyon. Kostenloser Speditionsversand ab 10.000 €, 500 € Mindestbestellwert und 10% Rabatt bei Krypto-Zahlung.',
  keywords: [
    'ebikedirect',
    'E-Bike Europa',
    'Pedelec kaufen',
    'Cube Stereo Hybrid',
    'Specialized Turbo Levo',
    'Riese und Müller Supercharger',
    'E-Bike Krypto Rabatt',
    'USDT E-Bike',
    'Bitcoin E-Bike Shop',
    'Bosch Smart System'
  ],
  authors: [{ name: 'ebikedirect.eu' }],
  creator: 'ebikedirect.eu',
  publisher: 'ebikedirect.eu',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: siteUrl,
    title: 'ebikedirect.eu | Premium E-Bikes & Pedelecs',
    description: 'High-End E-Bikes mit 10% Krypto-Rabatt, 10.000 € Frei-Haus-Grenze und 500 € Mindestbestellwert. 4.9/5 Trustpilot Bewertung.',
    siteName: 'ebikedirect.eu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ebikedirect.eu | Premium E-Bike Fachhandel',
    description: 'Europas führender Fachhandel für High-End E-Bikes mit 10% Krypto-Rabatt.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <StoreJsonLd />
        <Suspense fallback={null}>
          <HreflangTags />
        </Suspense>
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#131A22] antialiased selection:bg-[#FF5722] selection:text-white" suppressHydrationWarning>
        <Suspense fallback={null}>
          <I18nProvider>
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
