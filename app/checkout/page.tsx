'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Bitcoin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useI18n } from '@/context/i18n-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, formatCurrency, getLocalizedHref } = useI18n();
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    vatAmount,
    finalTotal,
    isMinOrderMet,
    minOrderThreshold,
    minOrderRemaining,
    isCryptoDiscountApplied,
    setIsCryptoDiscountApplied,
    clearCart
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card' | 'klarna' | 'paypal'>('crypto');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    country: 'Deutschland',
    deliveryNote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) return;

    if (paymentMethod === 'crypto') {
      setIsCryptoDiscountApplied(true);
      router.push(getLocalizedHref('/checkout/crypto'));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrder = `EFS-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className="bg-[#F8F9FA] py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#E8F8F0] rounded-full flex items-center justify-center mx-auto text-[#00C853]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-[#131A22]">
              Vielen Dank für Ihre Bestellung!
            </h1>
            <p className="text-sm text-gray-600">
              Ihre Bestellnummer lautet <strong className="text-gray-900 font-mono">{orderNumber}</strong>.
              Eine Bestätigung inklusive Rechnung (inkl. 19% MwSt.) wurde an{' '}
              <strong className="text-gray-900">{formData.email || 'Ihre E-Mail-Adresse'}</strong> gesendet.
            </p>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-left space-y-2 text-gray-700">
              <div className="font-bold text-gray-900">Nächste Schritte:</div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                <span>
                  Die Spedition wird Sie 24 Stunden vor Zustellung telefonisch avisieren, um ein genaues Lieferzeitfenster abzustimmen.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0 mt-0.5" />
                <span>
                  Ihr E-Bike wird zu 95% fahrbereit auf Palette mit Hebebühne geliefert. 2 Jahre Fachhändler-Gewährleistung inklusive.
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E64A19] transition-colors"
            >
              Weiter im Shop stöbern
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Warenkorb', href: '/cart' }, { label: 'Kasse & Versand', href: '/checkout' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] mb-6">
          Kasse & Versandabwicklung
        </h1>

        {!isMinOrderMet && (
          <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#FF5722] shrink-0" />
              <span>
                <strong>Mindestbestellwert nicht erreicht:</strong> Bitte legen Sie Artikel für mindestens{' '}
                {minOrderRemaining.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € in den Warenkorb.
              </span>
            </div>
            <Link href="/shop" className="text-xs font-bold text-[#FF5722] underline">
              Zum Sortiment
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 Cols: Frictionless Input Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF5722]" />
                1. Lieferadresse & Speditionsavisierung
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vorname *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nachname *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">E-Mail-Adresse *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="max.mustermann@example.de"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#FF5722]" />
                    Telefonnummer für Spedition *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="+49 170 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Straße *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="Hauptstraße"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hausnummer *</label>
                  <input
                    type="text"
                    name="houseNumber"
                    required
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="12a"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Postleitzahl *</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="80331"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stadt *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                    placeholder="München"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Land *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                  >
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Niederlande">Niederlande</option>
                    <option value="Italien">Italien</option>
                    <option value="Spanien">Spanien</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#FF5722]" />
                2. Zahlungsmethode wählen
              </h2>

              <div className="space-y-3">
                {/* 1. Crypto with 10% Discount HIGHLIGHTED */}
                <label
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-[#00C853] bg-emerald-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'crypto'}
                        onChange={() => setPaymentMethod('crypto')}
                        className="w-4 h-4 text-[#00C853] accent-[#00C853]"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                          <Bitcoin className="w-4 h-4 text-[#009624]" />
                          <span>Kryptowährung: USDT (TRC-20/ERC-20) oder Bitcoin</span>
                        </div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">
                          Sofortiger 10% Skonto-Abzug auf den gesamten Warenkorb.
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-[#00C853] text-white text-[11px] font-black shrink-0">
                      -10% Rabatt
                    </span>
                  </div>
                </label>

                {/* 2. Klarna Rechnung */}
                <label
                  className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'klarna'
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'klarna'}
                        onChange={() => setPaymentMethod('klarna')}
                        className="w-4 h-4 text-[#FF5722] accent-[#FF5722]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          Klarna Rechnungskauf / Ratenzahlung
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Erst prüfen, in 30 Tagen bezahlen. Bonität vorausgesetzt.
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 3. Credit Card */}
                <label
                  className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-[#FF5722] accent-[#FF5722]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          Kreditkarte (Visa, Mastercard, American Express)
                        </div>
                        <div className="text-[11px] text-gray-500">
                          3D Secure 2.0 verschlüsselt
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* 4. PayPal */}
                <label
                  className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-[#FF5722] bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-[#FF5722] accent-[#FF5722]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          PayPal & PayPal Später Bezahlen
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Käuferschutz inklusive
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3">
                Bestellübersicht ({items.reduce((s, i) => s + i.quantity, 0)} Artikel)
              </h2>

              {/* Items Compact */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {item.quantity}x · {item.selectedFrameSize} · {item.selectedBattery.capacityWh} Wh
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 text-right">
                      {(item.unitPrice * item.quantity).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Warenwert:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </span>
                </div>

                {paymentMethod === 'crypto' && (
                  <div className="flex justify-between text-[#009624] font-bold">
                    <span>10% Krypto-Rabatt:</span>
                    <span>- {(subtotal * 0.1).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Spedition mit Hebebühne:</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <strong className="text-[#00C853]">Kostenlos (Frei Haus)</strong>
                    ) : (
                      `${shippingFee.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                  <span>Enthaltene 19% MwSt.:</span>
                  <span>
                    {(paymentMethod === 'crypto' ? (finalTotal - (isCryptoDiscountApplied ? 0 : subtotal * 0.1)) : finalTotal) > 0
                      ? ((paymentMethod === 'crypto' ? (subtotal * 0.9 + shippingFee) : (subtotal + shippingFee)) - ((paymentMethod === 'crypto' ? (subtotal * 0.9 + shippingFee) : (subtotal + shippingFee)) / 1.19)).toLocaleString('de-DE', { minimumFractionDigits: 2 })
                      : '0,00'}{' '}
                    €
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-[#131A22] pt-3 border-t border-gray-200">
                  <span>Zu zahlender Gesamtbetrag:</span>
                  <span className="text-[#FF5722]">
                    {(paymentMethod === 'crypto' ? (subtotal * 0.9 + shippingFee) : (subtotal + shippingFee)).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!isMinOrderMet || isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                  paymentMethod === 'crypto'
                    ? 'bg-[#131A22] hover:bg-[#1D2633] border border-gray-800'
                    : 'bg-[#FF5722] hover:bg-[#E64A19] shadow-[#FF5722]/30'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <span>Wird verarbeitet...</span>
                ) : paymentMethod === 'crypto' ? (
                  <>
                    <Bitcoin className="w-4 h-4 text-[#00C853]" />
                    <span>Weiter zur Krypto-Zahlung (-10% Skonto)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Zahlungspflichtig bestellen</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-gray-400 text-center space-y-1">
                <div>256-Bit SSL-Verschlüsselung · 30 Tage Rückgaberecht</div>
                <div>Mindestbestellwert 500 € · Frei Haus ab 10.000 €</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
