'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Truck } from '@/components/ui/icons';

export interface HeroSlide {
  id: string;
  label: string; // category name
  productName: string;
  image: string;
  alt: string; // main primary keyword + model
  href: string; // category landing page
  cta: string;
}

// Bright hero: light background, white studio photos on a white card, one persistent H1 that carries the homepage primary keyword.
export function HeroSlideshow({ h1, sub, allText, allHref, slides, bullets }: { h1: string; sub: string; allText: string; allHref: string; slides: HeroSlide[]; bullets: string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);
  const s = slides[i];
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-[#F8F9FA] to-[#FFF1EC] overflow-hidden border-b border-gray-200" aria-label={h1} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-5 order-2 lg:order-1">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#131A22] leading-[1.05]">{h1}</h1>
          <p className="text-sm sm:text-lg text-gray-600 leading-relaxed max-w-xl">{sub}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href={s.href} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-bold shadow-md transition-colors">
              <span>{s.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={allHref} className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white border border-gray-300 hover:border-[#131A22] text-[#131A22] text-sm font-bold transition-colors">
              {allText}
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-gray-700">
            {bullets.map((b, n) => (
              <li key={b} className="inline-flex items-center gap-2">
                {n === 0 ? <ShieldCheck className="w-4 h-4 text-[#00C853]" /> : <Truck className="w-4 h-4 text-[#00C853]" />}
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative bg-white rounded-3xl border border-gray-200 shadow-sm aspect-4/3 overflow-hidden">
            {slides.map((sl, n) => (
              <Link key={sl.id} href={sl.href} tabIndex={n === i ? 0 : -1} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-700 ${n === i ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Image src={sl.image} alt={sl.alt} fill priority={n === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-4 sm:p-8" />
              </Link>
            ))}
            <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between gap-3">
              <div className="bg-white/95 border border-gray-200 rounded-xl px-3 py-2 shadow-xs min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF5722]">{s.label}</div>
                <div className="text-sm font-bold text-[#131A22] truncate">{s.productName}</div>
              </div>
              {slides.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => setI((p) => (p === 0 ? slides.length - 1 : p - 1))} aria-label="Zurück" className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:border-[#131A22] flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setI((p) => (p + 1) % slides.length)} aria-label="Weiter" className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:border-[#131A22] flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Slides">
              {slides.map((sl, n) => (
                <button key={sl.id} type="button" onClick={() => setI(n)} aria-label={sl.label} aria-selected={n === i} role="tab" className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-[#FF5722]' : 'w-2 bg-gray-300'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
