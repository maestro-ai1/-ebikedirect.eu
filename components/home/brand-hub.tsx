'use client';

import React from 'react';
import Link from 'next/link';
import { TOP_BRANDS } from '@/lib/brands';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { useI18n } from '@/context/i18n-context';

export function BrandHub() {
  const { t, getLocalizedHref } = useI18n();

  return (
    <section className="py-14 sm:py-16 bg-white border-y border-gray-200" aria-labelledby="brand-hub-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>{t('brands.subtitle', 'Offizielle Markenvertretung & Zertifizierte Partner')}</span>
          </div>
          <h2 id="brand-hub-heading" className="text-2xl sm:text-3xl font-black text-[#131A22] tracking-tight">
            {t('brands.title', 'Original Hersteller & Motorenhersteller')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {t('brands.desc', 'Volle Herstellergarantie, Original-Diagnosegeräte und geschultes Werkstattpersonal für alle führenden Marken.')}
          </p>
        </div>

        {/* Compacted Uniform Grid of 9 Brands */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          {TOP_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={getLocalizedHref(`/shop?brand=${encodeURIComponent(brand.name.split(' ')[0])}`)}
              className="group p-4 sm:p-5 rounded-xl border border-gray-200/90 bg-[#F8F9FA] hover:bg-white hover:border-[#FF5722]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/* Uniform Brand Symbol Avatar */}
                  <div className="w-9 h-9 rounded-lg bg-[#131A22] text-white flex items-center justify-center font-black text-xs tracking-tighter shadow-xs group-hover:bg-[#FF5722] transition-colors">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{brand.country}</span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#131A22] group-hover:text-[#FF5722] transition-colors flex items-center gap-1">
                    {brand.name}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF5722]" />
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {brand.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-[#00C853] shrink-0" />
                <span className="truncate">{brand.badge}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
