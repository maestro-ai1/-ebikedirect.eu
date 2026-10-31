import React from 'react';
import Link from 'next/link';
import { HeroSlideshow } from '@/components/home/hero-slideshow';
import { FeaturedProducts } from '@/components/home/featured-products';
import { BrandHub } from '@/components/home/brand-hub';
import { TrustpilotWidget } from '@/components/home/trustpilot-widget';
import { HomeBlogSection } from '@/components/home/home-blog-section';
import {
  ShieldCheck,
  Truck,
  Bitcoin,
  Wrench,
  PhoneCall,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Animated Slideshow */}
      <HeroSlideshow />

      {/* 2. Value Proposition Strip */}
      <section className="bg-white border-b border-gray-200 py-6" aria-label="Einkaufsvorteile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100/60 text-[#FF5722] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#131A22]">
                  Frei Haus ab 10.000 €
                </div>
                <div className="text-[11px] text-gray-500">
                  Mindestbestellwert: 500 €
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100/60 text-[#00C853] flex items-center justify-center shrink-0">
                <Bitcoin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#131A22]">
                  10% Krypto-Rabatt
                </div>
                <div className="text-[11px] text-gray-500">
                  Sofort-Skonto mit USDT & BTC
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#131A22]">
                  Meister-Montage 95%
                </div>
                <div className="text-[11px] text-gray-500">
                  Fahrbereit justiert & geprüft
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100/60 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-black text-[#131A22]">
                  2 Jahre Garantie
                </div>
                <div className="text-[11px] text-gray-500">
                  30 Tage Rückgaberecht
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid (Exact 6 products with interactive option selector) */}
      <FeaturedProducts />

      {/* 4. Brand Hub Grid */}
      <BrandHub />

      {/* 5. Trustpilot 4.9/5 Widget & Multi-lingual Review Ticker */}
      <TrustpilotWidget />

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

      {/* 7. Home Blog Section (3 Latest Articles) */}
      <HomeBlogSection />
    </>
  );
}
