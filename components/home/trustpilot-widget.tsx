'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { REVIEWS_POOL, TRUSTPILOT_STATS } from '@/lib/reviews';
import { TrustpilotReview } from '@/lib/types';
import { useI18n } from '@/context/i18n-context';

export function TrustpilotWidget() {
  const { t } = useI18n();
  const [selectedLang, setSelectedLang] = useState<'all' | 'de' | 'nl' | 'it' | 'es'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredReviews = selectedLang === 'all'
    ? REVIEWS_POOL
    : REVIEWS_POOL.filter((r) => r.language === selectedLang);

  // Auto rotate reviews every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredReviews.length]);

  // Reset index when changing language
  const handleLangChange = (lang: 'all' | 'de' | 'nl' | 'it' | 'es') => {
    setSelectedLang(lang);
    setCurrentIndex(0);
  };

  const currentReview = filteredReviews[currentIndex] || REVIEWS_POOL[0];

  const languages = [
    { code: 'all', label: t('trustpilot.allEu', 'Alle (EU)') },
    { code: 'de', label: 'Deutsch' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'it', label: 'Italiano' },
    { code: 'es', label: 'Español' }
  ];

  return (
    <section className="py-16 bg-[#F8F9FA]" aria-labelledby="trustpilot-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Trust Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 4 Cols: Trust Score Badge */}
            <div className="lg:col-span-4 lg:border-r lg:border-gray-100 lg:pr-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Green Trustpilot Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#00C853] text-white flex items-center justify-center rounded-sm font-black text-xs">
                  TP
                </div>
                <span className="text-sm font-extrabold text-[#131A22] tracking-wider uppercase">
                  Trustpilot
                </span>
              </div>

              {/* Score Display */}
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black text-[#131A22]">
                  {TRUSTPILOT_STATS.score}
                </span>
                <span className="text-base text-gray-500 font-semibold">
                  / {TRUSTPILOT_STATS.maxScore}
                </span>
              </div>

              {/* Star Rating Grid */}
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-7 h-7 bg-[#00C853] text-white flex items-center justify-center rounded-xs shadow-2xs"
                  >
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-600 font-medium">
                {t('trustpilot.scoreLabel', 'Basierend auf')} <strong className="text-gray-900">{TRUSTPILOT_STATS.totalReviews}</strong> {t('trustpilot.verifiedReviews', 'verifizierten europäischen Bewertungen seit 2024.')}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 w-full flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                <span>{t('trustpilot.verifiedPurchases', '100% Echte & Verifizierte Käufe')}</span>
              </div>
            </div>

            {/* Right 8 Cols: Multi-lingual Review Ticker */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              {/* Language Selector Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>{t('trustpilot.langFilterLabel', 'Kundenstimmen nach Sprache:')}</span>
                </span>

                <div className="flex items-center gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangChange(lang.code as any)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        selectedLang === lang.code
                          ? 'bg-[#131A22] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Card */}
              <div className="py-6 min-h-[170px] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[#00C853]">
                      {[...Array(currentReview.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#00C853]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {currentReview.date}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#131A22] leading-snug">
                    &ldquo;{currentReview.title}&rdquo;
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
                    {currentReview.comment}
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{currentReview.name}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{currentReview.location}</span>
                  </div>

                  {currentReview.bikeModel && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853]" />
                      <span>{t('trustpilot.bought', 'Gekauft')}: <strong>{currentReview.bikeModel}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-500">
                  {t('trustpilot.reviewOf', 'Bewertung')} {currentIndex + 1} von {filteredReviews.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === 0 ? filteredReviews.length - 1 : prev - 1
                      )
                    }
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Vorherige Bewertung"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length)
                    }
                    className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Nächste Bewertung"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
