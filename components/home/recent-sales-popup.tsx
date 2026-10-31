'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import { RECENT_SALES } from '@/lib/sales-notifications';
import { SaleNotification } from '@/lib/types';

export function RecentSalesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSale, setCurrentSale] = useState<SaleNotification>(RECENT_SALES[0]);
  const [saleIndex, setSaleIndex] = useState(0);

  const triggerNotification = React.useCallback(() => {
    setSaleIndex((prev) => {
      const nextIndex = (prev + 1) % RECENT_SALES.length;
      setCurrentSale(RECENT_SALES[nextIndex]);
      return nextIndex;
    });
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 9000);
  }, []);

  // Initial trigger after 4 seconds so the user sees it immediately,
  // then triggers a new notification every 5 minutes (300,000 ms).
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      triggerNotification();
    }, 4000);

    const fiveMinInterval = setInterval(() => {
      triggerNotification();
    }, 300000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(fiveMinInterval);
    };
  }, [triggerNotification]);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Kürzliche Bestellung"
      className="fixed bottom-4 left-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-88 bg-white rounded-xl shadow-xl border border-gray-200/90 p-3 sm:p-3.5 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Product Image Thumbnail */}
        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
          <Image
            src={currentSale.productImage}
            alt={currentSale.productName}
            fill
            sizes="56px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-[11px] text-[#009624] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00C853]" />
            <span>Gerade bestellt ({currentSale.timeAgo})</span>
          </div>

          <div className="text-xs font-bold text-[#131A22] truncate mt-0.5">
            {currentSale.customerName}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{currentSale.location}</span>
          </div>

          <div className="text-[11px] font-medium text-gray-800 line-clamp-1 mt-1">
            {currentSale.productName}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
          aria-label="Benachrichtigung schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
