'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Battery,
  Gauge,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Bitcoin
} from 'lucide-react';
import { FEATURED_PRODUCTS } from '@/lib/products';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';

export function FeaturedProducts() {
  const { t, getLocalizedHref } = useI18n();

  return (
    <section className="py-16 sm:py-20 bg-[#F8F9FA]" aria-labelledby="featured-products-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-[#FF5722]" />
              <span>{t('products.featuredTag', 'Ausgewählte Spitzenmodelle 2026')}</span>
            </div>
            <h2
              id="featured-products-heading"
              className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight"
            >
              {t('products.featuredHeading', 'Beliebteste Premium E-Bikes')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {t('products.featuredSub', 'Direkt ab Lager verfügbar. Inklusive 19% MwSt., versicherter Speditionszustellung und 10% Rabatt bei Krypto-Zahlung.')}
            </p>
          </div>

          <Link
            href={getLocalizedHref('/shop')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5722] hover:text-[#E64A19] transition-colors group"
          >
            <span>{t('products.viewAll', 'Gesamtes Sortiment anzeigen')} ({FEATURED_PRODUCTS.length}+ Modelle)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t, getLocalizedHref, formatCurrency } = useI18n();

  // State for interactive option selectors
  const [selectedFrame, setSelectedFrame] = useState(product.options.frameSizes[0]);
  const [selectedBattery, setSelectedBattery] = useState(product.options.batteries[0]);
  const [selectedColor, setSelectedColor] = useState(product.options.colors[0]);
  const [activeImage, setActiveImage] = useState(product.image);

  // Dynamic price calculation based on chosen battery
  const currentPrice = product.price + selectedBattery.priceDelta;
  const cryptoDiscountedPrice = currentPrice * 0.9; // 10% Crypto discount

  const handleAddToCart = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, 1);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, 1);
    router.push(getLocalizedHref('/checkout'));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
        <Link href={getLocalizedHref(`/shop/${product.slug}`)} className="block w-full h-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Brand & Stock Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 bg-[#131A22] text-white text-[11px] font-bold rounded-md shadow-xs">
            {product.brand}
          </span>
          <span className="px-2 py-0.5 bg-[#E8F8F0] border border-[#00C853]/40 text-[#009624] text-[10px] font-bold rounded flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] inline-block animate-pulse" />
            {t('products.inStock', 'Auf Lager')} ({product.stockCount} {t('products.units', 'Stk.')})
          </span>
        </div>

        {/* 10% Crypto Discount Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-black rounded-md flex items-center gap-1 shadow-xs">
            <Bitcoin className="w-3 h-3 text-[#FF5722]" />
            {t('products.cryptoDiscountBadge', '-10% mit Krypto')}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-gray-300 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category & Title */}
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {product.category}
            </div>
            <Link
              href={getLocalizedHref(`/shop/${product.slug}`)}
              className="text-base font-bold text-[#131A22] hover:text-[#FF5722] transition-colors line-clamp-1 mt-0.5"
            >
              {product.name}
            </Link>
          </div>

          {/* Quick Technical Specs Line */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex items-center gap-1 truncate">
              <Gauge className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
              <span className="truncate">{product.motor}</span>
            </div>
            <div className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
              <span>{t('products.upTo', 'bis')} {product.rangeKm} km</span>
            </div>
          </div>

          {/* INTERACTIVE OPTION SELECTOR 1: Frame Size */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              {t('products.frameSize', 'Rahmengröße')}: <strong className="text-[#131A22]">{selectedFrame}</strong>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.options.frameSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedFrame(size)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                    selectedFrame === size
                      ? 'border-[#FF5722] bg-orange-50 text-[#FF5722] font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE OPTION SELECTOR 2: Battery Choice */}
          {product.options.batteries.length > 1 && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                {t('products.batteryConfig', 'Akkukonfiguration')}:
              </label>
              <select
                value={selectedBattery.capacityWh}
                onChange={(e) => {
                  const b = product.options.batteries.find(
                    (item) => item.capacityWh === Number(e.target.value)
                  );
                  if (b) setSelectedBattery(b);
                }}
                className="w-full text-xs py-1.5 px-2 bg-white border border-gray-200 rounded-md text-gray-800 focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
              >
                {product.options.batteries.map((b) => (
                  <option key={b.capacityWh} value={b.capacityWh}>
                    {b.label} {b.priceDelta > 0 ? `(+${b.priceDelta} €)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* INTERACTIVE OPTION SELECTOR 3: Color Swatches */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              {t('products.color', 'Farbe')}: <strong className="text-gray-900">{selectedColor.name}</strong>
            </label>
            <div className="flex items-center gap-2">
              {product.options.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedColor.name === c.name
                      ? 'border-[#FF5722] scale-110 shadow-xs'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`${c.name}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Call To Action Buttons */}
        <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
          {/* Price Container */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#131A22]">
                {formatCurrency(currentPrice)}
              </div>
              <div className="text-[10px] text-gray-500">
                {t('products.inclVat', 'inkl. 19% MwSt., versandkostenfrei ab 10.000 €')}
              </div>
            </div>

            {/* Crypto Price Tag */}
            <div className="text-right">
              <div className="text-xs font-black text-[#009624] flex items-center gap-0.5 justify-end">
                <Bitcoin className="w-3 h-3 text-[#009624]" />
                {formatCurrency(cryptoDiscountedPrice)}
              </div>
              <div className="text-[10px] text-gray-400">
                {t('products.cryptoCashDiscount', 'mit 10% Krypto-Skonto')}
              </div>
            </div>
          </div>

          {/* Dual Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white text-xs font-bold transition-all shadow-xs"
              aria-label={`${product.name} ${t('products.addToCart', 'In Warenkorb')}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('products.addToCart', 'In Warenkorb')}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5722]/20"
              aria-label={`${product.name} ${t('products.buyNow', 'Direkt Kaufen')}`}
            >
              <Zap className="w-4 h-4" />
              <span>{t('products.buyNow', 'Direkt Kaufen')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
