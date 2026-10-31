'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  BatteryCharging,
  Gauge,
  ArrowRight,
  Bitcoin,
  ShieldCheck
} from '@/components/ui/icons';

interface Slide {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  highlightText: string;
  subtext: string;
  image: string;
  specs: { label: string; value: string; icon: React.ElementType }[];
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  modelSlug: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'slide-cube',
    badge: 'Flaggschiff 2026',
    badgeColor: '#FF5722',
    headline: 'Maximale Trail-Performance.',
    highlightText: 'Bosch Smart System & 750 Wh.',
    subtext: 'Cube Stereo Hybrid 160 HPC Actionteam. Carbon-Enduro mit Fox Factory 170 mm Fahrwerk und 85 Nm Drehmoment.',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Drehmoment', value: '85 Nm CX', icon: Gauge },
      { label: 'Akkukapazität', value: '750 Wh', icon: BatteryCharging },
      { label: 'Krypto-Vorteil', value: '-10% Rabatt', icon: Bitcoin }
    ],
    primaryCtaText: 'Modell konfigurieren',
    primaryCtaHref: '/shop/cube-stereo-hybrid-160-hpc-actionteam-750',
    secondaryCtaText: 'Sortiment entdecken',
    secondaryCtaHref: '/shop',
    modelSlug: 'cube-stereo-hybrid-160-hpc-actionteam-750'
  },
  {
    id: 'slide-specialized',
    badge: 'Luxus All-Mountain',
    badgeColor: '#00C853',
    headline: 'Verstärkt deine Kraft 4-fach.',
    highlightText: 'Specialized Turbo Levo Pro.',
    subtext: '90 Nm Spitzenpower, MasterMind TCU im Oberrohr und Vollcarbon-Rahmen für kompromisslose Bergauf-Traktion.',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Antrieb', value: '90 Nm 2.2', icon: Gauge },
      { label: 'Reichweite', value: 'bis 155 km', icon: BatteryCharging },
      { label: 'Versand', value: 'Frei Haus', icon: Zap }
    ],
    primaryCtaText: 'Turbo Levo ansehen',
    primaryCtaHref: '/shop/specialized-turbo-levo-pro-carbon-2026',
    secondaryCtaText: 'Zur Krypto-Kasse',
    secondaryCtaHref: '/checkout/crypto',
    modelSlug: 'specialized-turbo-levo-pro-carbon-2026'
  },
  {
    id: 'slide-riese',
    badge: 'Langstrecken-König',
    badgeColor: '#3B82F6',
    headline: 'Grenzenlose Reiselust.',
    highlightText: 'DualBattery 1.000 Wh System.',
    subtext: 'Riese & Müller Supercharger GT Touring. Über 200 km Reichweite und Supernova Fernlicht für jedes Abenteuer.',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Dual-Akku', value: '1.000 Wh', icon: BatteryCharging },
      { label: 'Reichweite', value: 'bis 210 km', icon: Gauge },
      { label: 'Garantie', value: '2 Jahre Meister', icon: ShieldCheck }
    ],
    primaryCtaText: 'Supercharger entdecken',
    primaryCtaHref: '/shop/riese-mueller-supercharger-gt-touring-1000wh',
    secondaryCtaText: 'Alle Trekking-Bikes',
    secondaryCtaHref: '/shop?category=E-Trekking',
    modelSlug: 'riese-mueller-supercharger-gt-touring-1000wh'
  }
];

import { useI18n } from '@/context/i18n-context';

export function HeroSlideshow() {
  const { t, getLocalizedHref } = useI18n();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 6 seconds unless user hovers
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      className="relative w-full bg-[#131A22] text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="E-Bike Neuheiten Slideshow"
    >
      {/* Background Hero Image with Dark Gradient Overlay for Contrast */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={slide.image}
            alt={slide.headline}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35 transition-all duration-1000 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Radial and Linear Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#131A22] via-[#131A22]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131A22] via-transparent to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Top Quiet Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-gray-200">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: slide.badgeColor }}
              />
              <span className="uppercase tracking-wider">{slide.badge}</span>
              <span className="text-gray-400">·</span>
              <span className="text-[#00C853] font-semibold">{t('hero.cryptoBadge', '10% Krypto-Rabatt')}</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {slide.headline}{' '}
                <span className="text-[#FF5722] block sm:inline">
                  {slide.highlightText}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl pt-2">
                {slide.subtext}
              </p>
            </div>

            {/* Key Specs Row */}
            <div className="grid grid-cols-3 gap-3 py-2 max-w-lg">
              {slide.specs.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                      <IconComponent className="w-3.5 h-3.5 text-[#FF5722]" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-white">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href={getLocalizedHref(slide.primaryCtaHref)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-bold shadow-lg shadow-[#FF5722]/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={getLocalizedHref(slide.secondaryCtaHref)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-xs border border-white/20 transition-all"
              >
                {slide.secondaryCtaText}
              </Link>
            </div>

            {/* Quick Trust and Logistics Micro-Line */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                Mindestbestellwert 500 €
              </span>
              <span>·</span>
              <span>Kostenloser Versand ab 10.000 €</span>
              <span>·</span>
              <span className="text-[#00C853] font-semibold">Trustpilot 4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/15 z-10"
        aria-label="Vorheriges E-Bike Modell"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors border border-white/15 z-10"
        aria-label="Nächstes E-Bike Modell"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators / Thumbnails */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`transition-all rounded-full ${
              currentSlideIndex === idx
                ? 'w-8 h-2 bg-[#FF5722]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Gehe zu Folie ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
