import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PRODUCTS } from '@/lib/products';
import { BLOG_POSTS } from '@/lib/blog';
import { Map, ExternalLink, ShieldCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HTML-Sitemap: alle Seiten im Überblick',
  description: 'Vollständige Übersicht aller Seiten, Produkte, Ratgeber und technischer Spezifikationen mit 100% kanonischer Ausrichtung.'
};

export default function SitemapPage() {
  const baseUrl = process.env.APP_URL || 'https://ebikedirect.eu';

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'HTML-Sitemap', href: '/sitemap' }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold">
            <Map className="w-3.5 h-3.5" />
            <span>Kanonische Seitenstruktur</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
            HTML-Sitemap & Index
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Alle Hauptseiten, Produktkataloge, Magazinbeiträge und AI-Crawler-Dateien mit 100% kanonischer Verlinkung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Pages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-2">
              Hauptnavigation & Kasse
            </h2>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <Link href="/" className="text-[#FF5722] hover:underline font-semibold">
                  Startseite (/)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FF5722] transition-colors">
                  E-Bike Gesamtkatalog (/shop)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF5722] transition-colors">
                  Über uns & Werkstatt (/about)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FF5722] transition-colors">
                  Häufige Fragen - FAQ (/faq)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#FF5722] transition-colors">
                  Magazin & Ratgeber (/blog)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5722] transition-colors">
                  Kontakt & Showroom (/contact)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FF5722] transition-colors">
                  Warenkorb (/cart)
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[#FF5722] transition-colors">
                  Kasse & Versand (/checkout)
                </Link>
              </li>
              <li>
                <Link href="/checkout/crypto" className="text-[#009624] font-bold hover:underline">
                  Krypto-Checkout 10% Rabatt (/checkout/crypto)
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Machine-Readable Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-2">
              Rechtliches & AI-Dateien
            </h2>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <Link href="/policies/returns" className="hover:text-[#FF5722]">
                  Widerruf & 2 Jahre Garantie (/policies/returns)
                </Link>
              </li>
              <li>
                <Link href="/policies/delivery" className="hover:text-[#FF5722]">
                  Liefer- & Versandbedingungen (/policies/delivery)
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-[#FF5722]">
                  Datenschutzerklärung (/policies/privacy)
                </Link>
              </li>
              <li>
                <Link href="/policies/imprint" className="hover:text-[#FF5722]">
                  Impressum (/policies/imprint)
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-100">
                <a href="/sitemap.xml" target="_blank" className="hover:text-[#FF5722] flex items-center gap-1 font-mono">
                  <span>/sitemap.xml (Dynamische XML Sitemap)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="/robots.txt" target="_blank" className="hover:text-[#FF5722] flex items-center gap-1 font-mono">
                  <span>/robots.txt (AI & Search Directives)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="/llms.txt" target="_blank" className="hover:text-[#FF5722] flex items-center gap-1 font-mono text-emerald-800 font-semibold">
                  <span>/llms.txt (LLM Standard Doc)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" target="_blank" className="hover:text-[#FF5722] flex items-center gap-1 font-mono text-emerald-800 font-semibold">
                  <span>/llms-full.txt (Full Technical Catalog Doc)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Product Catalog Direct Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-2">
            Alle E-Bike Modelle (Kanonische Detailseiten)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {PRODUCTS.map((prod) => (
              <div key={prod.id} className="p-2.5 rounded-lg border border-gray-100 hover:border-gray-300">
                <Link href={`/shop/${prod.slug}`} className="font-bold text-gray-900 hover:text-[#FF5722] block">
                  {prod.name}
                </Link>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {prod.brand} · {prod.price.toLocaleString('de-DE')} €
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-2">
            Magazinartikel & Kaufberatung
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {BLOG_POSTS.map((post) => (
              <div key={post.id} className="p-2.5 rounded-lg border border-gray-100 hover:border-gray-300">
                <Link href={`/blog/${post.slug}`} className="font-bold text-gray-900 hover:text-[#FF5722] block">
                  {post.title}
                </Link>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {post.date} · {post.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
