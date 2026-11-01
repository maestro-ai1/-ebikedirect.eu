'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, Bitcoin, CheckCircle2, Lock, ArrowRight, Phone, AlertCircle, Plus, Minus, Trash2 } from '@/components/ui/icons';
import { useCart } from '@/context/cart-context';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useI18n } from '@/context/i18n-context';

const MIN_ORDER = 500;
const FREE_SHIPPING = 10000;
const SHIPPING = 49;
const inputCls = 'w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF5722]/40 focus:border-[#FF5722] focus:outline-none';

// The cart IS this page (WebForge pattern): items with quantity steppers, delivery form, payment choice and the order summary side by side.
export default function CheckoutPage() {
  const { formatCurrency } = useI18n();
  const { items, subtotal, updateQuantity, removeFromCart, clearCart, setIsCryptoDiscountApplied } = useCart();
  const [payment, setPayment] = useState<'bank' | 'crypto'>('bank');
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', street: '', houseNumber: '', zip: '', city: '', country: 'Deutschland', deliveryNote: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ ref: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/order').then((r) => r.json()).then((j) => setEnabled(Boolean(j.enabled))).catch(() => setEnabled(false));
  }, []);
  useEffect(() => { setIsCryptoDiscountApplied(payment === 'crypto'); }, [payment, setIsCryptoDiscountApplied]);

  const discount = payment === 'crypto' ? Math.round(subtotal * 10) / 100 : 0;
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  const total = subtotal - discount + shipping;
  const vat = total > 0 ? total - total / 1.19 : 0;
  const minMet = subtotal >= MIN_ORDER;
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minMet || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          payment,
          items: items.map((i) => ({ slug: i.product.slug, quantity: i.quantity, frame: i.selectedFrameSize, batteryWh: i.selectedBattery.capacityWh, color: i.selectedColor.name }))
        })
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        setDone({ ref: j.ref, email: form.email });
        clearCart();
      } else {
        setError(j.error || 'Die Bestellung konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.');
      }
    } catch {
      setError('Die Bestellung konnte nicht übermittelt werden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.');
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="bg-[#F8F9FA] py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#E8F8F0] rounded-full flex items-center justify-center mx-auto text-[#00C853]"><CheckCircle2 className="w-10 h-10" /></div>
            <h1 className="text-2xl font-black text-[#131A22]">Vielen Dank für Ihre Bestellung!</h1>
            <p className="text-sm text-gray-600">
              Ihre Bestellnummer lautet <strong className="text-gray-900 font-mono">{done.ref}</strong>. Eine Bestätigung wurde an <strong className="text-gray-900">{done.email}</strong> gesendet.
              Die Zahlungsdaten erhalten Sie in einer separaten E-Mail.
            </p>
            <Link href="/e-bikes" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#E64A19] transition-colors">Weiter im Shop <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Warenkorb und Kasse', href: '/checkout' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] mb-6">Warenkorb und Kasse</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4">
            <p className="text-lg font-bold text-[#131A22]">Ihr Warenkorb ist leer.</p>
            <p className="text-sm text-gray-600">Wählen Sie ein E-Bike aus unserem Sortiment, es landet hier mit Preis und Lieferdetails.</p>
            <Link href="/e-bikes" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#E64A19]">Alle E-Bikes ansehen <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <>
            {enabled === false && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
                <span><strong>Die Online-Bestellung wird gerade eingerichtet.</strong> Sie können den Warenkorb vorbereiten, die Bestellung lässt sich erst nach der Freischaltung abschicken.</span>
              </div>
            )}
            {!minMet && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
                <span><strong>Mindestbestellwert {formatCurrency(MIN_ORDER)}:</strong> Es fehlen noch {formatCurrency(MIN_ORDER - subtotal)}. <Link href="/e-bikes" className="font-bold text-[#FF5722] underline">Zum Sortiment</Link></span>
              </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <section aria-labelledby="cart-items" className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                  <h2 id="cart-items" className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3 mb-2">1. Ihr Warenkorb ({count} {count === 1 ? 'Artikel' : 'Artikel'})</h2>
                  <ul className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <li key={item.id} className="py-4 flex gap-4">
                        <Link href={`/shop/${item.product.slug}`} className="relative w-24 h-24 shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <Image src={item.product.image} alt={item.product.name} fill sizes="96px" className="object-contain p-1" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link href={`/shop/${item.product.slug}`} className="text-sm font-bold text-[#131A22] hover:text-[#FF5722] line-clamp-2">{item.product.name}</Link>
                              <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}{item.selectedBattery.capacityWh > 0 ? ` · ${item.selectedBattery.capacityWh} Wh` : ''}</p>
                            </div>
                            <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`${item.product.name} entfernen`} className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Menge verringern" className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 text-[#131A22]"><Minus className="w-4 h-4" /></button>
                              <span className="w-10 text-center text-sm font-bold" aria-live="polite">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))} aria-label="Menge erhöhen" className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 text-[#131A22]"><Plus className="w-4 h-4" /></button>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-black text-[#131A22]">{formatCurrency(item.unitPrice * item.quantity)}</div>
                              <div className="text-[11px] text-gray-500">inkl. 19 % MwSt.</div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-labelledby="delivery" className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
                  <h2 id="delivery" className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-[#FF5722]" /> 2. Lieferadresse</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block text-xs font-semibold text-gray-700">Vorname *<input name="firstName" required autoComplete="given-name" value={form.firstName} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700">Nachname *<input name="lastName" required autoComplete="family-name" value={form.lastName} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700">E-Mail-Adresse *<input type="email" name="email" required autoComplete="email" value={form.email} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700"><span className="inline-flex items-center gap-1"><Phone className="w-3 h-3 text-[#FF5722]" /> Telefon für die Spedition *</span><input type="tel" name="phone" required autoComplete="tel" value={form.phone} onChange={change} className={`${inputCls} mt-1`} /></label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="col-span-2 block text-xs font-semibold text-gray-700">Straße *<input name="street" required autoComplete="address-line1" value={form.street} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700">Hausnr. *<input name="houseNumber" required value={form.houseNumber} onChange={change} className={`${inputCls} mt-1`} /></label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block text-xs font-semibold text-gray-700">PLZ *<input name="zip" required autoComplete="postal-code" value={form.zip} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700">Stadt *<input name="city" required autoComplete="address-level2" value={form.city} onChange={change} className={`${inputCls} mt-1`} /></label>
                    <label className="block text-xs font-semibold text-gray-700">Land *
                      <select name="country" value={form.country} onChange={change} className={`${inputCls} mt-1`}>
                        {['Deutschland', 'Österreich', 'Schweiz', 'Niederlande', 'Frankreich', 'Italien', 'Spanien', 'Portugal'].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs font-semibold text-gray-700">Hinweis für die Zustellung (optional)<textarea name="deliveryNote" rows={2} value={form.deliveryNote} onChange={change} className={`${inputCls} mt-1`} /></label>
                </section>

                <section aria-labelledby="payment" className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-3">
                  <h2 id="payment" className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#FF5722]" /> 3. Zahlungsart</h2>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${payment === 'bank' ? 'border-[#FF5722] bg-orange-50/40' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={payment === 'bank'} onChange={() => setPayment('bank')} className="mt-1 accent-[#FF5722]" />
                    <span><span className="block text-sm font-bold text-[#131A22]">Banküberweisung (Vorkasse)</span><span className="block text-xs text-gray-600 mt-0.5">Die Bankdaten erhalten Sie nach der Bestellung per E-Mail.</span></span>
                  </label>
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${payment === 'crypto' ? 'border-[#00C853] bg-emerald-50/50' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={payment === 'crypto'} onChange={() => setPayment('crypto')} className="mt-1 accent-[#00C853]" />
                    <span>
                      <span className="flex items-center gap-2 text-sm font-bold text-[#131A22]"><Bitcoin className="w-4 h-4 text-[#009624]" /> Kryptowährung (USDT oder Bitcoin), 10 % Rabatt</span>
                      <span className="block text-xs text-gray-600 mt-0.5">Der Rabatt gilt nur bei dieser Zahlungsart. Die Empfangsadresse und den Betrag erhalten Sie nach der Bestellung per E-Mail.</span>
                    </span>
                  </label>
                </section>
              </div>

              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-28 bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
                  <h2 className="text-base font-bold text-[#131A22] border-b border-gray-100 pb-3">Bestellübersicht</h2>
                  <dl className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between"><dt>Warenwert</dt><dd className="font-semibold text-gray-900">{formatCurrency(subtotal)}</dd></div>
                    {discount > 0 && <div className="flex justify-between text-[#009624] font-bold"><dt>Krypto-Rabatt (10 %)</dt><dd>- {formatCurrency(discount)}</dd></div>}
                    <div className="flex justify-between"><dt>Versand per Spedition</dt><dd className="font-semibold text-gray-900">{shipping === 0 ? 'kostenlos' : formatCurrency(shipping)}</dd></div>
                    <div className="flex justify-between text-xs text-gray-500"><dt>darin 19 % MwSt.</dt><dd>{formatCurrency(vat)}</dd></div>
                    <div className="flex justify-between pt-3 border-t border-gray-100 text-lg font-black text-[#131A22]"><dt>Gesamt</dt><dd className="text-[#FF5722]">{formatCurrency(total)}</dd></div>
                  </dl>
                  <p className="text-xs text-gray-600">{shipping === 0 ? 'Der Speditionsversand ist kostenfrei.' : `Noch ${formatCurrency(FREE_SHIPPING - subtotal)} bis zum kostenlosen Speditionsversand ab ${formatCurrency(FREE_SHIPPING)}.`}</p>
                  {error && <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">{error}</p>}
                  <button type="submit" disabled={!minMet || busy || enabled === false} className="w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-sm font-black transition-colors">
                    <Lock className="w-4 h-4" /> {busy ? 'Wird gesendet …' : 'Zahlungspflichtig bestellen'}
                  </button>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#00C853]" /> 2 Jahre Garantie und 30 Tage Rückgaberecht</li>
                    <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#FF5722]" /> Lieferung per Spedition mit Hebebühne</li>
                  </ul>
                  <p className="text-[11px] text-gray-500">Mit der Bestellung akzeptieren Sie die <Link href="/policies/returns" className="underline">Rückgabe- und Garantiebedingungen</Link> und die <Link href="/policies/delivery" className="underline">Lieferbedingungen</Link>.</p>
                </div>
              </aside>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
