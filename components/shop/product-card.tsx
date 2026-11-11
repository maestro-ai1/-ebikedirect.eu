'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Battery, Gauge, Check } from '@/components/ui/icons';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';

// Standard product card (Image Rule: white studio photo, one fixed square frame; same height for every card).
export function ProductCard({ product, alt, tag }: { product: Product; alt: string; tag?: string }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t, u, getLocalizedHref, formatCurrency } = useI18n();
  const [frame, setFrame] = useState(product.options.frameSizes[0]);
  const [added, setAdded] = useState(false);
  const battery = product.options.batteries[0];
  const color = product.options.colors[0];
  const price = product.price + battery.priceDelta;

  const add = () => {
    addToCart(product, frame, battery, color, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  const buyNow = () => {
    addToCart(product, frame, battery, color, 1);
    router.push(getLocalizedHref('/checkout'));
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
      <Link href={getLocalizedHref(`/shop/${product.slug}`)} className="block relative aspect-square bg-white border-b border-gray-100">
        <Image src={product.image} alt={alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-4" />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#131A22] text-white text-[11px] font-bold rounded-md">{product.brand}</span>
        <span className="absolute top-3 right-3 px-2 py-1 bg-[#E8F8F0] text-[#009624] text-[11px] font-bold rounded-md inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
          {t('products.inStock', 'Auf Lager')}
        </span>
      </Link>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{tag || product.category}</div>
        <h3 className="text-base font-bold text-[#131A22] leading-snug line-clamp-2 min-h-[2.75rem]">
          <Link href={getLocalizedHref(`/shop/${product.slug}`)} className="hover:text-[#FF5722]">{product.name}</Link>
        </h3>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
          <span className="inline-flex items-center gap-1 truncate"><Gauge className="w-3.5 h-3.5 text-[#FF5722] shrink-0" /><span className="truncate">{product.motor}</span></span>
          <span className="inline-flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-[#00C853] shrink-0" />{product.batteryStandardWh} Wh</span>
        </div>
        <label className="block text-[11px] font-semibold text-gray-700">
          {t('products.frameSize', 'Rahmengröße')}
          <select value={frame} onChange={(e) => setFrame(e.target.value)} className="mt-1 w-full text-xs py-1.5 px-2 bg-white border border-gray-200 rounded-md text-gray-800 focus:ring-1 focus:ring-[#FF5722] focus:outline-none">
            {product.options.frameSizes.map((s) => (
              <option key={s} value={s}>{s === 'Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt' ? u('pc.frameNote') : s}</option>
            ))}
          </select>
        </label>
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="text-xl font-black text-[#131A22]">{formatCurrency(price)}</div>
          <div className="text-[10px] text-gray-500">{t('products.inclVat', 'inkl. 19% MwSt., versandkostenfrei ab 10.000 €')}</div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button type="button" onClick={add} className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white text-xs font-bold transition-colors" aria-label={`${product.name}: ${t('products.addToCart', 'In den Warenkorb')}`}>
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              <span>{added ? t('products.added', 'Hinzugefügt') : t('products.addToCart', 'In den Warenkorb')}</span>
            </button>
            <button type="button" onClick={buyNow} className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-colors" aria-label={`${product.name}: ${t('products.buyNow', 'Jetzt kaufen')}`}>
              <Zap className="w-4 h-4" />
              <span>{t('products.buyNow', 'Jetzt kaufen')}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
