'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { FaqJsonLd } from '@/components/seo/json-ld';
import { useI18n } from '@/context/i18n-context';
import { ChevronDown, HelpCircle, Search, ShieldCheck, Truck, Bitcoin, Wrench } from '@/components/ui/icons';

interface FaqItem {
  question: string;
  answer: string;
  category: 'logistik' | 'krypto' | 'technik' | 'garantie';
}

const CATS: FaqItem['category'][] = ['logistik', 'logistik', 'logistik', 'logistik', 'krypto', 'krypto', 'garantie', 'technik'];
const makeFaqs = (u: (k: string) => string): FaqItem[] => CATS.map((category, i) => ({ category, question: u('faq.q' + (i + 1)), answer: u('faq.a' + (i + 1)) }));

export default function FaqPage() {
  const { u, getLocalizedHref } = useI18n();
  const FAQS = makeFaqs(u);
  const [activeCategory, setActiveCategory] = useState<'all' | 'logistik' | 'krypto' | 'technik' | 'garantie'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 4]); // open first few by default

  const toggleAccordion = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <FaqJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: u('faq.bc'), href: getLocalizedHref('/faq') }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{u('faq.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#131A22] tracking-tight">
            {u('faq.h1')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {u('faq.intro')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={u('faq.search')}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#131A22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: u('faq.pAll') },
            { id: 'logistik', label: u('faq.pLog') },
            { id: 'krypto', label: u('faq.pCry') },
            { id: 'technik', label: u('faq.pTec') },
            { id: 'garantie', label: u('faq.pGar') }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#131A22] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              {u('faq.none')}
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              return (
                <div key={idx} className="transition-colors">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/70 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#131A22]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF5722]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
