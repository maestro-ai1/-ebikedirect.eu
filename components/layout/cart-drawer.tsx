'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShieldAlert,
  Truck,
  ArrowRight,
  Bitcoin,
  CheckCircle2,
  Tag
} from '@/components/ui/icons';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';

export function CartDrawer() {
  const { t, formatCurrency, getLocalizedHref } = useI18n();
  const {
    items,
    removeFromCart,
    updateQuantity,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    subtotal,
    discountAmount,
    shippingFee,
    vatAmount,
    finalTotal,
    isMinOrderMet,
    minOrderThreshold,
    minOrderRemaining,
    freeShippingThreshold,
    freeShippingRemaining,
    isFreeShipping,
    isCryptoDiscountApplied,
    setIsCryptoDiscountApplied,
    applyPromoCode,
    promoCode,
    setPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="cart-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h2 id="cart-drawer-title" className="text-lg font-bold text-[#131A22]">
                {t('cart.title', 'Ihr Warenkorb')}
              </h2>
              <span className="text-xs font-semibold text-gray-500">
                ({items.reduce((s, i) => s + i.quantity, 0)} {t('cart.articles', 'Artikel')})
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Warenkorb schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logistics Progress Banners */}
          <div className="p-4 bg-orange-50/70 border-b border-orange-100 space-y-3">
            {/* Minimum Order Threshold: 500 € */}
            {!isMinOrderMet ? (
              <div className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80">
                <ShieldAlert className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{t('cart.minOrderNotice', 'Mindestbestellwert beachten:')}</span> {t('cart.minOrderShort', 'Es fehlen noch')}{' '}
                  <span className="font-extrabold text-[#FF5722]">
                    {formatCurrency(minOrderRemaining)}
                  </span>{' '}
                  bis zum Mindestbestellwert von {formatCurrency(minOrderThreshold)}.
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>{t('cart.minOrderMet', 'Mindestbestellwert von 500 € ist erreicht!')}</span>
              </div>
            )}

            {/* Free Shipping Tracker: 10,000 € */}
            <div>
              <div className="flex justify-between text-xs text-gray-700 mb-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FF5722]" />
                  {isFreeShipping ? (
                    <span className="text-[#00C853] font-bold">{t('cart.freeShippingActive', 'Kostenloser Speditionsversand aktiv!')}</span>
                  ) : (
                    <span>
                      {t('cart.stillMissing', 'Noch')}{' '}
                      <strong className="text-[#131A22]">
                        {formatCurrency(freeShippingRemaining)}
                      </strong>{' '}
                      {t('cart.untilFreeShipping', 'bis Frei Haus')}
                    </span>
                  )}
                </span>
                <span className="text-gray-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFreeShipping ? 'bg-[#00C853]' : 'bg-[#FF5722]'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {t('cart.freeShippingDesc', 'Kostenlose Palettenzustellung per Hebebühne ab 10.000 € Bestellwert.')}
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">{t('cart.emptyTitle', 'Ihr Warenkorb ist leer')}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('cart.emptyDesc', 'Entdecken Sie unsere Premium E-Bikes von Cube, Specialized, Riese & Müller.')}
                  </p>
                </div>
                <Link
                  href={getLocalizedHref('/shop')}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E64A19] transition-colors"
                >
                  {t('cart.exploreBikes', 'Zum E-Bike Sortiment')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#131A22] leading-snug line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Artikel entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                      <div>{t('cart.frame', 'Rahmen')}: <strong className="text-gray-700">{item.selectedFrameSize}</strong></div>
                      <div>{t('cart.battery', 'Akku')}: <strong className="text-gray-700">{item.selectedBattery.label}</strong></div>
                      <div className="flex items-center gap-1.5">
                        {t('cart.color', 'Farbe')}:
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-gray-700">{item.selectedColor.name}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-md bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Menge verringern"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#131A22]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Menge erhöhen"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Price for Item */}
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-extrabold text-[#131A22]">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </div>
                        <div className="text-[10px] text-gray-400">inkl. 19% MwSt.</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 space-y-4">
              {/* Crypto 10% Discount Toggle Box */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-5 h-5 text-[#009624] shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-950">{t('cart.cryptoBoxTitle', '10% Krypto-Rabatt nutzen')}</div>
                    <div className="text-[11px] text-emerald-800">
                      {t('cart.cryptoBoxDesc', 'Gültig bei Zahlung mit USDT oder Bitcoin')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCryptoDiscountApplied(!isCryptoDiscountApplied)}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                    isCryptoDiscountApplied
                      ? 'bg-[#00C853] text-white shadow-xs'
                      : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {isCryptoDiscountApplied ? t('cart.activated', 'Aktiviert (-10%)') : t('cart.activate', 'Aktivieren')}
                </button>
              </div>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder={t('cart.promoPlaceholder', 'Gutscheincode (z.B. CRYPTO10)')}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  {t('cart.apply', 'Einlösen')}
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-xs px-2.5 py-1.5 rounded-md ${
                    promoMessage.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal', 'Zwischensumme:')}</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {isCryptoDiscountApplied && (
                  <div className="flex justify-between text-[#009624] font-bold">
                    <span>10% Krypto-Rabatt:</span>
                    <span>
                      - {formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('cart.shipping', 'Speditionsversand:')}</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <strong className="text-[#00C853]">{t('cart.free', 'Kostenlos (Frei Haus)')}</strong>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>{t('cart.vatIncluded', 'Darin enthaltene 19% MwSt.:')}</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-[#131A22] pt-2 border-t border-gray-200">
                  <span>{t('cart.total', 'Gesamtbetrag:')}</span>
                  <span className="text-[#FF5722]">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {isMinOrderMet ? (
                  <>
                    <Link
                      href={getLocalizedHref('/checkout')}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-bold shadow-md transition-all"
                    >
                      <span>{t('cart.toCheckout', 'Zur Kasse gehen')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href={getLocalizedHref('/checkout/crypto')}
                      onClick={() => {
                        setIsCryptoDiscountApplied(true);
                        setIsCartDrawerOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#131A22] hover:bg-[#1D2633] text-white text-xs font-bold transition-all border border-gray-700"
                    >
                      <Bitcoin className="w-4 h-4 text-[#00C853]" />
                      <span>{t('cart.payCrypto', 'Mit Krypto zahlen & 10% sparen')}</span>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-lg bg-gray-300 text-gray-600 text-sm font-bold cursor-not-allowed text-center"
                    >
                      {t('cart.minOrderNotMetBtn', 'Mindestbestellwert von 500 € nicht erreicht')}
                    </button>
                    <p className="text-[11px] text-center text-gray-500">
                      Bitte legen Sie weitere Artikel in den Warenkorb, um die Bestellung fortzusetzen.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
