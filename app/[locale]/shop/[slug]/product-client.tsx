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
} from '@/components/ui/icons';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';
import { isFrameNote } from '@/lib/ui';

const EN_PC: Record<string, string> = {
  '-10 % en crypto': '-10% with crypto',
  'vue': 'view',
  'Garantie de 2 ans': '2-year warranty',
  'Retour sous 30 jours': '30-day returns',
  'Transporteur avec hayon élévateur': 'Freight carrier with lift gate',
  'Monté à 95 %': '95% assembled',
  'Disponible immédiatement ({n} en stock)': 'Available now ({n} in stock)',
  'Disponible en stock': 'In stock',
  'Moteur': 'Motor',
  'voir fiche': 'see specs',
  'Batterie': 'Battery',
  'Autonomie': 'Range',
  'jusqu’à {n} km': 'up to {n} km',
  'Choisir la taille de cadre :': 'Choose frame size:',
  'Capacité de la batterie :': 'Battery capacity:',
  'Couleur': 'Colour',
  'Couleur du cadre': 'Frame colour',
  'Remise crypto de 10 % : économisez': '10% crypto discount: save',
  'Prix en paiement USDT (TRC-20/ERC-20) ou Bitcoin :': 'Price when paying with USDT (TRC-20/ERC-20) or Bitcoin:',
  'Expédition assurée par transporteur, port gratuit dès 1 000 €': 'Insured freight carrier delivery, free shipping from 1,000 €',
  'Ajouter au panier': 'Add to basket',
  'Acheter maintenant': 'Buy now',
  'Commande minimum dans la boutique : 500,00 €. Cet article atteint le seuil.': 'Minimum order in the shop: 500.00 €. This item meets the minimum.',
  'Caractéristiques techniques complètes': 'Full technical specifications',
  'Poids :': 'Weight:',
};

export interface FrView { lead: string; specs: [string, string][]; category: string; h1?: string }

export function ProductDetailClient({ product, focusKeyword, frView }: { product: Product; focusKeyword: string; frView?: FrView }) {
  const { locale, u } = useI18n();
  const fr = (locale === 'fr' || locale === 'en') && !!frView;
  const nloc = fr ? (locale === 'en' ? 'en-IE' : 'fr-FR') : 'de-DE';
  const show = (s: string) => (locale !== 'de' && isFrameNote(s) ? u('pc.frameNote') : s);
  const tr = (k: string) => (locale === 'en' ? EN_PC[k] ?? k : k);
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedFrame, setSelectedFrame] = useState(product.options.frameSizes[0]);
  const [selectedBattery, setSelectedBattery] = useState(product.options.batteries[0]);
  const [selectedColor, setSelectedColor] = useState(product.options.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const isAccessory = product.category === 'Zubehör';
  const currentPrice = product.price + selectedBattery.priceDelta;
  const cryptoPrice = currentPrice * 0.9;
  const cryptoSavings = currentPrice * 0.1;

  const handleAddToCart = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedFrame, selectedBattery, selectedColor, quantity);
    router.push(locale === 'de' ? '/checkout' : `/${locale}/checkout`);
  };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 6 Cols: Photo Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={activeImage}
                  alt={focusKeyword}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                  referrerPolicy="no-referrer"
                />

                <span className="absolute top-4 left-4 px-3 py-1 bg-[#131A22] text-white text-xs font-bold rounded-md">
                  {product.brand}
                </span>

                <span className="absolute top-4 right-4 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black rounded-md flex items-center gap-1.5">
                  <Bitcoin className="w-4 h-4 text-[#FF5722]" />
                  {fr ? tr('-10 % en crypto') : '-10% mit Krypto'}
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
                        alt={`${focusKeyword} - ${fr ? tr('vue') : 'Ansicht'} ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-1 bg-white"
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
                  <span>{fr ? tr('Garantie de 2 ans') : '2 Jahre Gewährleistung'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>{fr ? tr('Retour sous 30 jours') : '30 Tage Rückgaberecht'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{fr ? tr('Transporteur avec hayon élévateur') : 'Spedition mit Hebebühne'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{fr ? tr('Monté à 95 %') : 'Zu 95% fahrfertig montiert'}</span>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Purchasing Details & Option Selectors */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Stock */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
                    {fr ? frView!.category : product.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#009624] bg-[#E8F8F0] px-2.5 py-1 rounded-full border border-[#00C853]/40">
                    <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                    {product.stockCount > 0 ? (fr ? tr('Disponible immédiatement ({n} en stock)').replace('{n}', String(product.stockCount)) : `Sofort lieferbar (${product.stockCount} verfügbar)`) : (fr ? tr('Disponible en stock') : 'Ab Lager lieferbar')}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] leading-tight">
                  {fr && frView!.h1 ? frView!.h1 : product.name}
                </h1>

                {/* Rating */}
                {product.reviewsCount > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({product.reviewsCount} Kundenbewertungen auf Trustpilot)</span>
                </div>
                )}

                {/* Key Technical Metric Badges */}
                {!isAccessory && (
                <div className="grid grid-cols-3 gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">{fr ? tr('Moteur') : 'Motor'}</div>
                    <div className="text-xs font-extrabold text-gray-900 truncate mt-0.5">{product.torqueNm > 0 ? `${product.torqueNm} Nm` : (fr ? tr('voir fiche') : 'siehe Daten')}</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">{fr ? tr('Batterie') : 'Akku'}</div>
                    <div className="text-xs font-extrabold text-gray-900 mt-0.5">{selectedBattery.capacityWh > 0 ? `${selectedBattery.capacityWh} Wh` : (fr ? tr('voir fiche') : 'siehe Daten')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500 font-semibold uppercase">{fr ? tr('Autonomie') : 'Reichweite'}</div>
                    <div className="text-xs font-extrabold text-gray-900 mt-0.5">{product.rangeKm > 0 ? (fr ? tr('jusqu’à {n} km').replace('{n}', String(product.rangeKm)) : `bis ${product.rangeKm} km`) : (fr ? tr('voir fiche') : 'siehe Daten')}</div>
                  </div>
                </div>
                )}

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {fr ? frView!.lead : <>{isAccessory && !product.description.toLowerCase().includes(product.name.toLowerCase()) ? `${product.name}: ` : ""}{product.description}</>}
                </p>

                {/* INTERACTIVE SELECTOR 1: Frame Sizes */}
                {(!isAccessory || product.options.frameSizes.length > 1) && (
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-gray-800">
                    {fr ? tr('Choisir la taille de cadre :') : 'Rahmengröße auswählen:'} <strong className="text-[#FF5722]">{show(selectedFrame)}</strong>
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
                        {show(size)}
                      </button>
                    ))}
                  </div>
                </div>

                )}

                {/* INTERACTIVE SELECTOR 2: Battery Choice */}
                {!isAccessory && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    {fr ? tr('Capacité de la batterie :') : 'Akkukapazität:'}
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

                )}

                {/* INTERACTIVE SELECTOR 3: Color Swatches */}
                {(!isAccessory || product.options.colors.length > 1) && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">
                    {isAccessory ? (fr ? tr('Couleur') : 'Farbe') : (fr ? tr('Couleur du cadre') : 'Rahmenfarbe')} : <strong className="text-gray-900">{selectedColor.name}</strong>
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
                )}
              </div>

              {/* Price Calculation & Checkout Triggers */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* 10% Crypto Callout Box */}
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Bitcoin className="w-6 h-6 text-[#009624] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        {fr ? tr('Remise crypto de 10 % : économisez') : '10% Krypto-Rabatt: Sparen Sie'} {cryptoSavings.toLocaleString(nloc, { minimumFractionDigits: 2 })} €
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        {fr ? tr('Prix en paiement USDT (TRC-20/ERC-20) ou Bitcoin :') : 'Zahlungspreis mit USDT (TRC-20/ERC-20) oder Bitcoin:'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-[#009624]">
                      {cryptoPrice.toLocaleString(nloc, { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>

                {/* Main Price */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#131A22]">
                      {currentPrice.toLocaleString(nloc, { minimumFractionDigits: 2 })} €
                    </span>
                    <span className="text-xs text-gray-500 block">
                      {fr ? tr('Expédition assurée par transporteur, port gratuit dès 1 000 €') : 'inkl. gesetzlicher 19% MwSt., versicherter Speditionsversand ab 1.000 €'}
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
                    <span>{fr ? tr('Ajouter au panier') : 'In den Warenkorb'}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 px-4 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF5722]/30"
                  >
                    <Zap className="w-5 h-5" />
                    <span>{fr ? tr('Acheter maintenant') : 'Direkt Kaufen'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-2">
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                  <span>{fr ? tr('Commande minimum dans la boutique : 500,00 €. Cet article atteint le seuil.') : 'Mindestbestellwert im Shop: 500,00 €. Dieser Artikel erfüllt den Schwellenwert.'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Technical Specifications Table */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-black text-[#131A22] mb-4">
              {fr ? tr('Caractéristiques techniques complètes') : 'Vollständige technische Daten & Ausstattung'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {(fr ? frView!.specs : Object.entries(product.specs)).map(([specKey, specVal]) => (
                <div
                  key={specKey}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-semibold text-gray-500">{specKey}:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{specVal}</span>
                </div>
              ))}
              {product.weightKg > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-500">{fr ? tr('Poids :') : 'Gewicht:'}</span>
                <span className="font-medium text-gray-900">{product.weightKg} kg</span>
              </div>
              )}
              {!isAccessory && !fr && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-500">Zulassung:</span>
                <span className="font-medium text-gray-900">{product.category === 'Speed-Pedelec' ? 'S-Pedelec bis 45 km/h, Versicherungskennzeichen' : 'StVZO-konform / EPAC bis 25 km/h'}</span>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
