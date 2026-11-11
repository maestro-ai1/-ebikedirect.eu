'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, X } from '@/components/ui/icons';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';

/** "Add to cart" confirmation: a small toast with a link to the checkout page (no drawer, nothing blocks the page). */
export function CartToast() {
  const { lastAdded, dismissToast, totalItemsCount } = useCart();
  const { u, getLocalizedHref } = useI18n();
  const pathname = usePathname() || '';
  useEffect(() => {
    if (!lastAdded) return;
    const timer = window.setTimeout(dismissToast, 6000);
    return () => window.clearTimeout(timer);
  }, [lastAdded, dismissToast]);
  if (!lastAdded || pathname.includes('/checkout')) return null;
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-xl border border-gray-200 shadow-xl p-4 flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-[#00C853] shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#131A22]">{u('toast.added')}</p>
        <p className="text-xs text-gray-600 truncate">{lastAdded.name}</p>
        <div className="mt-2 flex items-center gap-3">
          <Link href={getLocalizedHref('/checkout')} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E64A19]" onClick={dismissToast}>
            {u('toast.checkout')} ({totalItemsCount})
          </Link>
          <button type="button" onClick={dismissToast} className="text-xs font-semibold text-gray-600 hover:text-[#131A22]">{u('toast.continue')}</button>
        </div>
      </div>
      <button type="button" onClick={dismissToast} aria-label={u('toast.close')} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
    </div>
  );
}
