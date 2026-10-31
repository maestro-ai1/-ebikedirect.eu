'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Bitcoin,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Gauge,
  Battery,
  Star,
  Info
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedFrame, setSelectedFrame] = useState(product.options.frameSizes[0]);
  const [selectedBattery, setSelectedBattery] = useState(product.options.batteries[0]);
  const [selectedColor, setSelectedColor] = useState(product.options.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = product.price + selectedBattery.priceDelta;
  const cryptoPrice = currentPrice * 0.9;
  const cryptoSavings = currentPrice * 0.1;

  const handleAddToCart = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 6 Cols: Photo Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />

                <span className="absolute top-4 left-4 px-3 py-1 bg-[#131A22] text-white text-xs font-bold rounded-md">
                  {product.brand}
                </span>

                <span className="absolute top-4 right-4 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black rounded-md flex items-center gap-1.5">
                  <Bitcoin className="w-4 h-4 text-[#FF5722]" />
                  -10% mit Krypto
                </span>
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-3">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-[#FF5722] ring-2 ring-[#FF5722]/30' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} Ansicht ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Security & Warranty Banner */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0" />
                  <span>2 Jahre Gewährleistung</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>30 Tage Rückgaberecht</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Spedition mit Hebebühne</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zu 95% fahrfertig montiert</span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Purchasing Details & Option Selectors */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
                    {product.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#009624] bg-[#E8F8F0] px-2.5 py-1 rounded-full border border-[#00C853]/40">
                    <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                    Sofort lieferbar ({product.stockCount} verfügbar)
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({product.reviewsCount} Kundenbewertungen auf Trustpilot)</span>
                </div>

                {/* Key Technical Metric Badges */}
                <div className="grid grid-cols-3 gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Motor</div>
                    <div className="text-xs font-extrabold text-gray-900 truncate mt-0.5">{product.torqueNm} Nm</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Akku</div>
                    <div className="text-xs font-extrabold text-gray-900 mt-0.5">{selectedBattery.capacityWh} Wh</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">Reichweite</div>
                    <div className="text-xs font-extrabold text-gray-900 mt-0.5">bis {product.rangeKm} km</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* INTERACTIVE SELECTOR 1: Frame Sizes */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-gray-800">
                    Rahmengröße auswählen: <strong className="text-[#FF5722]">{selectedFrame}</strong>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.options.frameSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedFrame(size)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                          selectedFrame === size
                            ? 'border-[#FF5722] bg-orange-50 text-[#FF5722] shadow-xs'
                            : 'border-gray-200 hover:border-gray-400 text-gray-800 bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE SELECTOR 2: Battery Choice */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    Akkukapazität:
                  </label>
                  <div className="space-y-2">
                    {product.options.batteries.map((b) => (
                      <button
                        key={b.capacityWh}
                        type="button"
                        onClick={() => setSelectedBattery(b)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                          selectedBattery.capacityWh === b.capacityWh
                            ? 'border-[#FF5722] bg-orange-50/60 text-[#131A22]'
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                        }`}
                      >
                        <span className="font-semibold">{b.label}</span>
                        <span className="font-bold text-[#FF5722]">
                          {b.priceDelta === 0 ? 'Im Grundpreis enthalten' : `+${b.priceDelta} €`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE SELECTOR 3: Color Swatches */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    Rahmenfarbe: <strong className="text-gray-900">{selectedColor.name}</strong>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.options.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          selectedColor.name === c.name
                            ? 'border-[#FF5722] bg-orange-50 text-[#FF5722]'
                            : 'border-gray-200 text-gray-700 bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Calculation & Checkout Triggers */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* 10% Crypto Callout Box */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Bitcoin className="w-6 h-6 text-[#009624] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        10% Krypto-Rabatt: Sparen Sie {cryptoSavings.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Zahlungspreis mit USDT (TRC-20/ERC-20) oder Bitcoin:
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-[#009624]">
                      {cryptoPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>

                {/* Main Price */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#131A22]">
                      {currentPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                    <span className="text-xs text-gray-500 block">
                      inkl. gesetzlicher 19% MwSt., versicherter Speditionsversand ab 10.000 €
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Art.-Nr: <strong className="font-mono text-gray-800">{product.id}</strong>
                  </div>
                </div>

                {/* Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 px-4 rounded-xl border-2 border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>In den Warenkorb</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF5722]/30"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Direkt Kaufen</span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-2">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mindestbestellwert im Shop: 500,00 €. Dieser Artikel erfüllt den Schwellenwert.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Technical Specifications Table */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-black text-[#131A22] mb-4">
              Vollständige technische Daten & Ausstattung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {Object.entries(product.specs).map(([specKey, specVal]) => (
                <div
                  key={specKey}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-semibold text-gray-500">{specKey}:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{specVal}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Gewicht:</span>
                <span className="font-medium text-gray-900">{product.weightKg} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Zulassung:</span>
                <span className="font-medium text-gray-900">StVZO-konform / EPAC bis 25 km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
