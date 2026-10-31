'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldAlert,
  ArrowRight,
  Bitcoin,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useI18n } from '@/context/i18n-context';

export default function CartPage() {
  const { t, formatCurrency, getLocalizedHref } = useI18n();
  const {
    items,
    removeFromCart,
    updateQuantity,
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
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Warenkorb', href: '/cart' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] mb-6">
          Ihr Warenkorb
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Ihr Warenkorb ist derzeit leer</h2>
            <p className="text-xs text-gray-500">
              Entdecken Sie unsere preisgekrönten E-Bikes von Cube, Specialized und Riese & Müller mit 10% Krypto-Rabatt.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E64A19] transition-colors"
            >
              Jetzt E-Bikes entdecken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Item Table & Banners */}
            <div className="lg:col-span-8 space-y-6">
              {/* Logistics Progress Banners */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                {/* 500 € Minimum Order Value Rule */}
                {!isMinOrderMet ? (
                  <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <ShieldAlert className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-bold text-amber-950 mb-0.5">
                        Mindestbestellwert nicht erreicht:
                      </strong>
                      Der Mindestbestellwert beträgt 500,00 €. Es fehlen noch{' '}
                      <strong className="text-[#FF5722]">
                        {minOrderRemaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                      </strong>{' '}
                      Warenwert für die Freischaltung des Bestellvorgangs.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-[#E8F8F0] p-3 rounded-lg border border-[#00C853]/40">
                    <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                    <span>Mindestbestellwert von 500,00 € ist erfolgreich erreicht!</span>
                  </div>
                )}

                {/* Free Shipping 10.000 € Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#FF5722]" />
                      {isFreeShipping ? (
                        <span className="text-[#00C853] font-bold">Kostenloser Speditionsversand Frei Haus aktiviert!</span>
                      ) : (
                        <span>
                          Noch{' '}
                          <strong className="text-gray-900">
                            {freeShippingRemaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </strong>{' '}
                          bis zum kostenlosen Speditionsversand
                        </span>
                      )}
                    </span>
                    <span>{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFreeShipping ? 'bg-[#00C853]' : 'bg-[#FF5722]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Ab 10.000 € versenden wir per Spedition mit Hebebühne Frei Haus (regulär 49,00 €).
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.product.brand} · {item.product.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#131A22] leading-snug">
                        <Link href={`/shop/${item.product.slug}`} className="hover:text-[#FF5722]">
                          {item.product.name}
                        </Link>
                      </h3>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div>Rahmen: <strong>{item.selectedFrameSize}</strong></div>
                        <div>Akku: <strong>{item.selectedBattery.label}</strong></div>
                        <div className="flex items-center gap-1.5">
                          Farbe:
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{item.selectedColor.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Menge verringern"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#131A22]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                          aria-label="Menge erhöhen"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-black text-[#131A22]">
                          {(item.unitPrice * item.quantity).toLocaleString('de-DE', {
                            minimumFractionDigits: 2
                          })}{' '}
                          €
                        </div>
                        <div className="text-[10px] text-gray-400">inkl. 19% MwSt.</div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Artikel löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Order Summary & Checkout Links */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3">
                  Bestellübersicht
                </h2>

                {/* 10% Crypto Toggle Button */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-[#009624] shrink-0" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">10% Krypto-Skonto</strong>
                      <span className="text-[11px] text-emerald-800">
                        Mit USDT (TRC20/ERC20) oder Bitcoin zahlen
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCryptoDiscountApplied(!isCryptoDiscountApplied)}
                    className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${
                      isCryptoDiscountApplied
                        ? 'bg-[#00C853] text-white shadow-xs'
                        : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {isCryptoDiscountApplied ? '10% Krypto-Rabatt aktiv (-10%)' : '10% Rabatt jetzt aktivieren'}
                  </button>
                </div>

                {/* Voucher Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Gutscheincode eingeben"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Anwenden
                  </button>
                </form>

                {promoMessage && (
                  <div
                    className={`text-xs p-2 rounded-md ${
                      promoMessage.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {promoMessage.text}
                  </div>
                )}

                {/* Calculation Rows */}
                <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Warenwert:</span>
                    <span className="font-semibold text-gray-900">
                      {subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  {isCryptoDiscountApplied && (
                    <div className="flex justify-between text-[#009624] font-bold">
                      <span>10% Krypto-Rabatt:</span>
                      <span>
                        - {discountAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Speditionsversand:</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? (
                        <strong className="text-[#00C853]">0,00 € (Frei Haus)</strong>
                      ) : (
                        `${shippingFee.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                    <span>Enthaltene 19% MwSt.:</span>
                    <span>{vatAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-[#131A22] pt-3 border-t border-gray-200">
                    <span>Gesamtsumme:</span>
                    <span className="text-[#FF5722]">
                      {finalTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2">
                  {isMinOrderMet ? (
                    <>
                      <Link
                        href="/checkout"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5722]/30 transition-all"
                      >
                        <span>Zur Kasse</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href="/checkout/crypto"
                        onClick={() => setIsCryptoDiscountApplied(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#131A22] hover:bg-[#1D2633] text-white text-xs font-bold border border-gray-700 transition-all"
                      >
                        <Bitcoin className="w-4 h-4 text-[#00C853]" />
                        <span>Krypto-Express Checkout (-10%)</span>
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-2 text-center">
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-gray-200 text-gray-500 text-xs sm:text-sm font-bold cursor-not-allowed"
                      >
                        Mindestbestellwert 500 € erforderlich
                      </button>
                      <p className="text-[11px] text-gray-500">
                        Legen Sie weitere Artikel für mindestens {minOrderRemaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € in den Warenkorb.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
