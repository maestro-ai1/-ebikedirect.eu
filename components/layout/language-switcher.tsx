'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/context/i18n-context';
import { Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, supportedLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLocaleInfo = supportedLocales.find((l) => l.code === locale) || supportedLocales[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#FF5722] ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 w-full justify-between'
            : 'px-2.5 py-1.5 text-xs font-bold bg-white/90 border-gray-200 hover:border-gray-300 text-[#131A22] shadow-2xs hover:shadow-xs'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Sprache wählen: ${currentLocaleInfo.nativeName} (${currentLocaleInfo.label})`}
      >
        <span className="font-extrabold text-xs tracking-wider uppercase">
          {currentLocaleInfo.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#FF5722]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#FF5722]" />
            <span>Select Market & Language</span>
          </div>

          <div className="py-1">
            {supportedLocales.map((item) => {
              const isSelected = item.code === locale;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLocale(item.code as Locale);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-orange-50/80 text-[#FF5722] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 text-[10px] font-extrabold tracking-wider text-gray-400">{item.label}</span>
                    <div className="flex flex-col">
                      <span className="leading-tight">{item.nativeName}</span>
                      <span className="text-[10px] text-gray-400 font-normal leading-tight">
                        {item.country}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#FF5722] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
