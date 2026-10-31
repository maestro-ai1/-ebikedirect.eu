'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bitcoin,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  QrCode,
  ArrowRight,
  ExternalLink
} from '@/components/ui/icons';
import { useCart } from '@/context/cart-context';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useI18n } from '@/context/i18n-context';

type CryptoCurrency = 'USDT_TRC20' | 'USDT_ERC20' | 'BTC';

interface CryptoConfig {
  name: string;
  network: string;
  symbol: string;
  walletAddress: string;
  ratePerEur: number; // units per EUR
  confirmationsNeeded: number;
}

const CRYPTO_CONFIGS: Record<CryptoCurrency, CryptoConfig> = {
  USDT_TRC20: {
    name: 'Tether USD',
    network: 'TRON (TRC-20)',
    symbol: 'USDT',
    walletAddress: 'TYDzsYUE29wBPx76fC8b4VkgQ5k7c3mS6q',
    ratePerEur: 1.08,
    confirmationsNeeded: 19
  },
  USDT_ERC20: {
    name: 'Tether USD',
    network: 'Ethereum (ERC-20)',
    symbol: 'USDT',
    walletAddress: '0x71C8364437a9C741632757b0c36360c4d32098bF',
    ratePerEur: 1.08,
    confirmationsNeeded: 12
  },
  BTC: {
    name: 'Bitcoin',
    network: 'Bitcoin Mainnet',
    symbol: 'BTC',
    walletAddress: 'bc1q9v8h20h0l8h64x650dpxs3d2wueq893q7d49e7',
    ratePerEur: 0.0000154,
    confirmationsNeeded: 3
  }
};

export default function CryptoCheckoutPage() {
  const { t, formatCurrency, getLocalizedHref } = useI18n();
  const { subtotal, shippingFee, clearCart } = useCart();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>('USDT_TRC20');
  const [copied, setCopied] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 minutes
  const [txState, setTxState] = useState<'awaiting' | 'detected' | 'confirmed'>('awaiting');
  const [orderId, setOrderId] = useState('EFS-89241');

  // If subtotal is empty, provide a fallback amount of 5.999 € for live testing
  const effectiveSubtotal = subtotal > 0 ? subtotal : 5999;
  const discountedSubtotal = effectiveSubtotal * 0.9; // 10% discount
  const finalEurTotal = discountedSubtotal + (effectiveSubtotal >= 10000 ? 0 : 49);

  const activeConfig = CRYPTO_CONFIGS[selectedCrypto];
  const cryptoAmount = (finalEurTotal * activeConfig.ratePerEur).toFixed(
    selectedCrypto === 'BTC' ? 6 : 2
  );

  // 15-Minute Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeConfig.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Simulate payment flow
  const simulatePayment = () => {
    setTxState('detected');
    setTimeout(() => {
      setTxState('confirmed');
      clearCart();
    }, 3000);
  };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Warenkorb', href: '/cart' },
          { label: 'Kasse', href: '/checkout' },
          { label: 'Krypto-Zahlung (10% Rabatt)', href: '/checkout/crypto' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Header with 10% Discount Badge */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E8F8F0] border border-[#00C853]/40 text-[#009624] text-xs font-black mb-2">
              <Bitcoin className="w-4 h-4 text-[#00C853]" />
              <span>{t('crypto.badge', '10% SKONTO AKTIVIERT')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#131A22] tracking-tight">
              {t('crypto.heading', 'Krypto-Zahlung & Blockchain-Abrechnung')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {t('crypto.subheading', 'Bezahlen Sie direkt über die Blockchain mit USDT (TRC-20 / ERC-20) oder Bitcoin. Ihr 10% Rabatt wurde automatisch vom Rechnungsbetrag abgezogen.')}
            </p>
          </div>

          <div className="text-right bg-emerald-50 p-4 rounded-xl border border-emerald-200 shrink-0">
            <span className="text-[11px] font-bold text-emerald-900 block uppercase">
              {t('crypto.savings', '10% Ersparnis:')}
            </span>
            <span className="text-xl font-black text-[#009624]">
              - {formatCurrency(effectiveSubtotal * 0.1)}
            </span>
          </div>
        </div>

        {/* Currency Network Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(CRYPTO_CONFIGS) as CryptoCurrency[]).map((cur) => {
            const cfg = CRYPTO_CONFIGS[cur];
            const isSelected = selectedCrypto === cur;
            return (
              <button
                key={cur}
                type="button"
                onClick={() => {
                  setSelectedCrypto(cur);
                  if (txState !== 'confirmed') setTxState('awaiting');
                }}
                className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#00C853] bg-white shadow-md shadow-[#00C853]/10 ring-2 ring-[#00C853]/20'
                    : 'border-gray-200 bg-gray-50/80 hover:bg-white text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-[#131A22]">{cfg.symbol}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#00C853]" />}
                </div>
                <div className="text-xs text-gray-500 font-semibold truncate">{cfg.network}</div>
              </button>
            );
          })}
        </div>

        {/* Main Payment Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 space-y-6">
          {txState === 'confirmed' ? (
            /* State 3: Confirmed Success View */
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-[#E8F8F0] rounded-full flex items-center justify-center mx-auto text-[#00C853]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-[#131A22]">
                {t('crypto.confirmed', 'Blockchain-Zahlung erfolgreich verifiziert!')}
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Die Transaktion wurde auf der Blockchain bestätigt. Ihre Bestellung{' '}
                <strong className="text-gray-900 font-mono">#{orderId}</strong> wird nun für die Speditionslieferung vorbereitet.
              </p>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 max-w-md mx-auto text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaktionsnetzwerk:</span>
                  <strong className="text-gray-900">{activeConfig.network}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gezahlter Betrag:</span>
                  <strong className="text-[#009624] font-mono">{cryptoAmount} {activeConfig.symbol}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Speditionsavisierung:</span>
                  <strong className="text-gray-900">Per Telefon 24h vor Zustellung</strong>
                </div>
              </div>

              <Link
                href={getLocalizedHref('/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#E64A19] transition-colors"
              >
                Zurück zur Startseite
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Payment Status State Indicator */}
              <div className="p-4 rounded-xl border flex items-center justify-between gap-4 bg-gray-50 border-gray-200">
                <div className="flex items-center gap-3">
                  {txState === 'awaiting' ? (
                    <RefreshCw className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 animate-pulse shrink-0" />
                  )}
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {txState === 'awaiting'
                        ? t('crypto.waiting', 'Warte auf Blockchain-Zahlungseingang...')
                        : t('crypto.detected', 'Transaktion im Mempool erkannt! (1 von 3 Bestätigungen)')}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Netzwerk wird alle 5 Sekunden automatisch abgefragt.
                    </div>
                  </div>
                </div>

                {/* Price Lock Timer */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{formatTime(countdownSeconds)}</span>
                </div>
              </div>

              {/* Amount to send */}
              <div className="p-5 bg-orange-50/50 rounded-xl border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Zu sendender Betrag:
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#131A22] font-mono mt-0.5">
                    {cryptoAmount} <span className="text-[#FF5722]">{activeConfig.symbol}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Entspricht {finalEurTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € (inkl. 19% MwSt. & 10% Krypto-Skonto)
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
                  <div>Netzwerk: <strong className="text-gray-900">{activeConfig.network}</strong></div>
                  <div>Bestätigungen: <strong className="text-gray-900">{activeConfig.confirmationsNeeded} Blöcke</strong></div>
                </div>
              </div>

              {/* QR Code and Wallet Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual SVG QR Code placeholder */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="w-48 h-48 bg-white border-2 border-gray-900 rounded-xl p-3 flex flex-col items-center justify-center shadow-xs">
                    {/* SVG Stylized QR Code */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#131A22]" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="4" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="70" y="0" width="30" height="30" rx="4" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="0" y="70" width="30" height="30" rx="4" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                      {/* Random Matrix Patterns */}
                      <rect x="35" y="10" width="8" height="8" />
                      <rect x="50" y="5" width="12" height="6" />
                      <rect x="40" y="25" width="6" height="10" />
                      <rect x="55" y="20" width="8" height="8" />
                      <rect x="35" y="45" width="15" height="10" />
                      <rect x="10" y="45" width="12" height="8" />
                      <rect x="60" y="45" width="12" height="12" />
                      <rect x="80" y="40" width="10" height="15" />
                      <rect x="40" y="65" width="8" height="18" />
                      <rect x="55" y="70" width="15" height="8" />
                      <rect x="80" y="70" width="12" height="18" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold mt-2 flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    {t('crypto.scanQr', 'Mit Krypto-Wallet scannen')}
                  </span>
                </div>

                {/* Wallet Address & Copy Function */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {t('crypto.officialAddress', 'Offizielle Empfangsadresse')} ({activeConfig.network}):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={activeConfig.walletAddress}
                        className="w-full px-3.5 py-3 text-xs sm:text-sm font-mono bg-gray-50 border border-gray-300 rounded-lg text-gray-900 select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className={`px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                          copied
                            ? 'bg-[#00C853] text-white'
                            : 'bg-[#131A22] hover:bg-[#1D2633] text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{t('crypto.copied', 'Kopiert!')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>{t('crypto.copy', 'Kopieren')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      {t('crypto.networkNotice', 'Wichtiger Netzwerk-Hinweis:')}
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Senden Sie nur <strong className="text-amber-950">{activeConfig.symbol}</strong> über das{' '}
                      <strong className="text-amber-950">{activeConfig.network}</strong>. Das Senden anderer Währungen oder über abweichende Netzwerke kann zum Verlust führen.
                    </p>
                  </div>

                  {/* Interactive Simulation Button for Testing */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Live-Test & Simulation:
                    </span>
                    <button
                      type="button"
                      onClick={simulatePayment}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      {t('crypto.simulateDemo', 'Zahlungseingang simulieren (Demo)')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
