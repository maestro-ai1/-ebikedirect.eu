'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Bitcoin,
  Mail,
  Phone,
  MapPin,
  Zap
} from '@/components/ui/icons';
import { useI18n } from '@/context/i18n-context';

export function Footer() {
  const { t, u, getLocalizedHref } = useI18n();

  return (
    <footer className="bg-[#131A22] text-gray-300 border-t border-gray-800 text-xs">
      {/* Value Proposition Highlights Bar */}
      <div className="border-b border-gray-800/80 bg-[#1D2633]/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                {t('valueProps.freeShippingTitle', 'Frei Haus ab 1.000 €')}
              </div>
              <div className="text-[11px] text-gray-400">
                {t('valueProps.freeShippingSub', 'Versicherte Hebebühnen-Zustellung')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00C853]/15 text-[#00C853] flex items-center justify-center shrink-0">
              <Bitcoin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                {t('valueProps.cryptoTitle', '10% Krypto-Rabatt')}
              </div>
              <div className="text-[11px] text-gray-400">
                {t('valueProps.cryptoSub', 'Sofort-Skonto mit USDT & BTC')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                {t('valueProps.warrantyTitle', '2 Jahre Gewährleistung')}
              </div>
              <div className="text-[11px] text-gray-400">
                {t('valueProps.warrantySub', 'Bosch & Shimano Fach-Garantie')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">
                {t('valueProps.returnsTitle', '30 Tage Rückgaberecht')}
              </div>
              <div className="text-[11px] text-gray-400">
                {t('valueProps.returnsSub', 'Mindestbestellwert 500 €')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand & Address */}
          <div className="col-span-2 space-y-4">
            <Link href={getLocalizedHref('/')} className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF5722] flex items-center justify-center text-white font-black text-sm">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                ebike<span className="text-[#FF5722]">direct</span>
                <span className="text-[#00C853]">.eu</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {t('footer.brandDesc', 'Europas autorisierter Fachhandel für hochwertige E-Bikes, Pedelecs und Cargo-Bikes. Geprüfte Meister-Werkstatt mit EU-weiter Palettenzustellung.')}
            </p>

            <div className="space-y-1.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>Kollwitzstraße 47, 10405 Berlin, Deutschland</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <a href="mailto:sales@ebikedirect.eu" className="hover:text-[#FF5722] transition-colors">sales@ebikedirect.eu</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>Mo-Fr: 09:00 - 18:30 Uhr</span>
              </div>
            </div>

            {/* Trustpilot Mini */}
            <div className="pt-2 flex items-center gap-2.5">
              <div className="bg-[#00C853] text-white px-2 py-0.5 rounded text-[11px] font-black">
                4.9 / 5.0
              </div>
              <span className="text-xs text-gray-300 font-medium">
                Trustpilot Score (5.284+ {t('trustpilot.reviewOf', 'Bewertungen')})
              </span>
            </div>
          </div>

          {/* E-Bike Sortiment */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('footer.assortment', 'Sortiment')}
            </p>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedHref('/shop?category=E-MTB')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.mtb')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/shop?category=E-Trekking')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.trekking')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/shop?category=E-City')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.city')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/shop?category=Speed-Pedelec')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.speed')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/shop?category=Cargo-E-Bike')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.cargo')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/shop')} className="text-[#FF5722] font-semibold hover:underline">
                  {t('products.viewAll', 'Alle Modelle ansehen')} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service & Navigation */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('footer.service', 'Service & Shop')}
            </p>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedHref('/about')} className="hover:text-[#FF5722] transition-colors">
                  {t('nav.about', 'Über Uns')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/faq')} className="hover:text-[#FF5722] transition-colors">
                  {t('nav.faq', 'FAQ')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/blog')} className="hover:text-[#FF5722] transition-colors">
                  {t('nav.blog', 'Blog & Tests')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/contact')} className="hover:text-[#FF5722] transition-colors">
                  {t('nav.contact', 'Kontakt')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('footer.legal', 'Rechtliches & Richtlinien')}
            </p>
            <ul className="space-y-2">
              <li>
                <Link href={getLocalizedHref('/policies/returns')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.warranty')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/policies/delivery')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.delivery')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/policies/privacy')} className="hover:text-[#FF5722] transition-colors">
                  {u('ft.privacy')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/policies/imprint')} className="hover:text-[#FF5722] transition-colors">
                  Impressum & Pflichtangaben
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Legal Notice */}
        <div className="mt-10 pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} ebikedirect.eu – {t('footer.allRights', 'Alle Rechte vorbehalten.')}</p>
          <p className="text-center sm:text-right">
            {t('footer.priceNote', 'Preise inkl. gesetzl. 19% MwSt. · Mindestbestellwert 500,00 € · Kostenloser Versand ab 1.000,00 €')}
          </p>
        </div>
      </div>
    </footer>
  );
}
