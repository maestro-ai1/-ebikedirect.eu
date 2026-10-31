import React from 'react';
import { MESSAGES, Locale } from '@/lib/i18n';

export function ServiceBand({ locale }: { locale: Locale }) {
  const m = MESSAGES[locale].home;
  const items = m.why as string[][];
  return (
    <section className="py-16 sm:py-24 bg-[#F8F9FA]" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="why-heading" className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight leading-[1.05] max-w-3xl">{m.whyTitle}</h2>
        <ol className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-3xl overflow-hidden ring-1 ring-gray-200">
          {items.map(([title, text], i) => (
            <li key={title} className="bg-white p-7 sm:p-8 flex flex-col gap-4">
              <span className="font-display text-5xl font-bold text-[#FF5722]/90 leading-none">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-xl font-bold text-[#131A22]">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
