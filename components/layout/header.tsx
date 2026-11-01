'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Sparkles,
  ShieldCheck,
  Truck,
  Zap,
  Bitcoin
} from '@/components/ui/icons';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

export function Header() {
  const pathname = usePathname() || '/';
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { t, getLocalizedHref, localeInfo } = useI18n();

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const announcements = [
    { key: 'announcements.minOrder', icon: ShieldCheck },
    { key: 'announcements.freeShipping', icon: Truck },
    { key: 'announcements.cryptoDiscount', icon: Bitcoin },
    { key: 'announcements.trustpilot', icon: Sparkles }
  ];

  // Rotate announcement ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Detect scroll for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAllMenus = () => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  };

  const navLinks = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.shop', href: '/shop' },
    { labelKey: 'nav.brands', href: '/marken' },
    { labelKey: 'nav.about', href: '/about' },
    { labelKey: 'nav.faq', href: '/faq' },
    { labelKey: 'nav.blog', href: '/blog' },
    { labelKey: 'nav.contact', href: '/contact' }
  ];

  const currentAnnouncement = announcements[currentAnnouncementIndex];
  const AnnouncementIcon = currentAnnouncement.icon;

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#131A22] text-white border-b border-white/10 text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0">
            <AnnouncementIcon className="w-3.5 h-3.5 text-[#FF5722] shrink-0 animate-pulse" />
            <span className="font-medium tracking-wide text-gray-200 truncate">
              {t(currentAnnouncement.key)}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-gray-300">
              <span>{localeInfo.label} / € EUR</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Bar */}
      <nav
        className={`bg-white/95 backdrop-blur-md transition-shadow border-b border-gray-200/80 ${
          isScrolled ? 'shadow-md py-3' : 'py-4'
        }`}
        aria-label="Hauptnavigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={getLocalizedHref('/')}
            className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded-md"
            aria-label="ebikedirect.eu Startseite"
          >
            <div className="relative w-10 h-10 rounded-xl bg-[#131A22] flex items-center justify-center shrink-0 shadow-sm border border-gray-800">
              <Zap className="w-5 h-5 text-[#FF5722]" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00C853] border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#131A22] leading-none">
                ebike<span className="text-[#FF5722]">direct</span>
                <span className="text-[#00C853]">.eu</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">
                Premium E-Bike Fachhandel
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const localizedHref = getLocalizedHref(link.href);
              const isActive =
                link.href === '/'
                  ? pathname === '/' || pathname === `/${localeInfo.code}`
                  : pathname.includes(link.href);

              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  className={`text-sm font-medium transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] rounded ${
                    isActive
                      ? 'text-[#FF5722] font-semibold'
                      : 'text-[#131A22] hover:text-[#FF5722]'
                  }`}
                >
                  {t(link.labelKey, link.href.replace('/', ''))}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5722] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions: Language Switcher, Search, Crypto CTA, Cart, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-700 hover:text-[#131A22] hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
              aria-label={t('nav.search', 'Suche öffnen')}
            >
              <Search className="w-5 h-5" />
            </button>


            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#131A22] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
              aria-label={`${t('nav.cart', 'Warenkorb')} (${totalItemsCount})`}
            >
              <ShoppingBag className="w-5 h-5 text-[#131A22]" />
              <span className="hidden sm:inline text-xs font-bold">{t('nav.cart', 'Warenkorb')}</span>
              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-extrabold text-white bg-[#FF5722] rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#131A22] hover:bg-gray-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]"
              aria-label={mobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {showSearch && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `${getLocalizedHref('/shop')}?q=${encodeURIComponent(
                    searchQuery.trim()
                  )}`;
                }
              }}
              className="relative flex items-center"
            >
              <Search className="w-5 h-5 absolute left-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  'nav.searchPlaceholder',
                  'Modell, Marke oder Motor suchen (z.B. Cube, Bosch CX)...'
                )}
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#131A22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1.5 bg-[#FF5722] text-white text-xs font-semibold rounded-md hover:bg-[#E64A19] transition-colors"
              >
                {t('nav.searchBtn', 'Suchen')}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            {/* Mobile Language Switcher */}
            <div className="pb-2 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Market / Language:
              </span>
              <LanguageSwitcher compact />
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => {
                const localizedHref = getLocalizedHref(link.href);
                const isActive =
                  link.href === '/'
                    ? pathname === '/' || pathname === `/${localeInfo.code}`
                    : pathname.includes(link.href);

                return (
                  <Link
                    key={link.href}
                    href={localizedHref}
                    onClick={closeAllMenus}
                    className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-[#FF5722] font-semibold'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {t(link.labelKey, link.href.replace('/', ''))}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <div className="text-xs text-gray-500 text-center pt-1">
                Mindestbestellwert: 500 € · Frei Haus ab 10.000 €
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
