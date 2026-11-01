import React from 'react';

// Click-to-open FAQ list built on the native details element: works without JavaScript and the answers stay in the HTML.
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map((f) => (
        <details key={f.q} className="group border border-gray-200 rounded-xl bg-white">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <h3 className="text-base font-bold text-[#131A22]">{f.q}</h3>
            <span aria-hidden="true" className="shrink-0 text-[#FF5722] text-xl leading-none transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="px-4 pb-4 text-sm sm:text-base text-gray-700 leading-relaxed max-w-4xl">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
