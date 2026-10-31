import React from 'react';
import Link from 'next/link';
import { HeroSlideshow } from '@/components/home/hero-slideshow';
import { FeaturedProducts } from '@/components/home/featured-products';
import { TrustpilotWidget } from '@/components/home/trustpilot-widget';
import { BrandStrip } from '@/components/home/brand-strip';
import { CategoryTiles } from '@/components/home/category-tiles';
import { NewArrivals } from '@/components/home/new-arrivals';
import { ServiceBand } from '@/components/home/service-band';
import { GuideTeaser } from '@/components/home/guide-teaser';
import { PhoneCall, ArrowRight } from '@/components/ui/icons';
import { isLocale, DEFAULT_LOCALE } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <>
      <HeroSlideshow />
      <BrandStrip locale={locale} />
      <CategoryTiles locale={locale} />
      <NewArrivals locale={locale} />
      <FeaturedProducts />
      <ServiceBand locale={locale} />
      <TrustpilotWidget />
      <GuideTeaser locale={locale} />

      {/* 6. Interactive Workshop & Consultation CTA */}
      <section className="py-14 sm:py-16 bg-[#131A22] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#1D2633] to-[#131A22] rounded-2xl border border-gray-800 p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF5722] text-xs font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Persönliche Fachberatung</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Unsicher bei Rahmengröße oder Motorenauswahl?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Unsere zertifizierten Zweiradmechaniker beraten Sie gerne telefonisch oder in unserem Münchner Showroom. 
                Wir unterstützen Sie auch beim Dienstrad-Leasing oder der Bezahlung per Kryptowährung.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <span>Showroom & Beratung kontaktieren</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/faq"
                  className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  E-Bike FAQ lesen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
