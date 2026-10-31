'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Star,
  Gauge,
  Battery,
  ShoppingBag,
  Zap,
  Bitcoin,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight
} from '@/components/ui/icons';
import { PRODUCTS } from '@/lib/products';
import { Product } from '@/lib/types';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useCart } from '@/context/cart-context';

export default function ShopPage() {
  return (
    <>
      <h1 className="sr-only">Premium E-Bikes und Pedelecs Katalog</h1>
      <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Katalog wird geladen...</div>}>
        <ShopContent />
      </Suspense>
    </>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedMotor, setSelectedMotor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const categories = ['all', 'E-MTB', 'E-Trekking', 'E-City', 'Speed-Pedelec', 'Cargo-E-Bike', 'Zubehör'];
  const brands = ['all', 'Cube', 'Specialized', 'Riese & Müller', 'Haibike', 'Kalkhoff', 'Gazelle', 'Canyon', 'Tenways', 'Focus', 'Winora', 'Ghost', 'KTM', 'ABUS'];
  const motors = ['all', 'Bosch', 'Shimano', 'Yamaha', 'Specialized'];

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase()) && !p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'all' && !p.brand.toLowerCase().includes(selectedBrand.toLowerCase())) {
        return false;
      }
      if (selectedMotor !== 'all' && !p.motor.toLowerCase().includes(selectedMotor.toLowerCase())) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (onlyInStock && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedBrand, selectedMotor, maxPrice, onlyInStock, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedMotor('all');
    setMaxPrice(10000);
    setOnlyInStock(false);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'E-Bike Sortiment', href: '/shop' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Page Title & Logistics Callout */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#131A22] tracking-tight">
              Premium E-Bikes & Pedelecs Katalog
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredProducts.length} Modelle gefunden · Mindestbestellwert 500 € · Kostenloser Speditionsversand ab 10.000 €
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#E8F8F0] border border-[#00C853]/40 text-[#009624] text-xs font-bold rounded-lg flex items-center gap-1.5">
              <Bitcoin className="w-4 h-4 text-[#00C853]" />
              <span>10% Skonto mit Krypto (USDT / BTC)</span>
            </span>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Catalog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm font-bold text-[#131A22] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF5722]" />
                  Filter
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#FF5722] hover:underline font-semibold"
                >
                  Zurücksetzen
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  Kategorie
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-orange-50 text-[#FF5722] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat === 'all' ? 'Alle Kategorien' : cat}</span>
                      {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  Hersteller
                </label>
                <div className="space-y-1">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setSelectedBrand(b);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedBrand === b
                          ? 'bg-orange-50 text-[#FF5722] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{b === 'all' ? 'Alle Marken' : b}</span>
                      {selectedBrand === b && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motor Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  Motorenhersteller
                </label>
                <div className="space-y-1">
                  {motors.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMotor(m);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedMotor === m
                          ? 'bg-orange-50 text-[#FF5722] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{m === 'all' ? 'Alle Motoren' : m}</span>
                      {selectedMotor === m && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs font-bold text-[#131A22] mb-2">
                  <span>Max. Preis:</span>
                  <span className="text-[#FF5722]">{maxPrice.toLocaleString('de-DE')} €</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#FF5722] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>4.000 €</span>
                  <span>10.000 €</span>
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <label htmlFor="inStockToggle" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Nur sofort lieferbar
                </label>
                <input
                  id="inStockToggle"
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => {
                    setOnlyInStock(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 rounded text-[#FF5722] focus:ring-[#FF5722] accent-[#FF5722]"
                />
              </div>
            </div>
          </aside>

          {/* Main Catalog Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sorting and Results Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-600 font-medium">
                Zeige <strong>{paginatedProducts.length}</strong> von <strong>{filteredProducts.length}</strong> E-Bikes
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sortSelect" className="text-xs font-semibold text-gray-700">
                  Sortieren nach:
                </label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs py-1.5 px-3 bg-white border border-gray-200 rounded-md text-gray-800 focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                >
                  <option value="featured">Empfehlung / Beliebtheit</option>
                  <option value="price-asc">Preis: aufsteigend</option>
                  <option value="price-desc">Preis: absteigend</option>
                  <option value="rating">Beste Bewertung</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
                <h3 className="text-base font-bold text-gray-800">Keine E-Bikes für diese Filterkriterien gefunden</h3>
                <p className="text-xs text-gray-500">
                  Bitte passen Sie Ihre Filterauswahl an oder setzen Sie die Filter zurück.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#FF5722] text-white text-xs font-bold rounded-lg hover:bg-[#E64A19] transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedProducts.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Zurück
                </button>

                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-[#FF5722] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Weiter
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ShopProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedFrame, setSelectedFrame] = useState(product.options.frameSizes[0]);
  const [selectedBattery, setSelectedBattery] = useState(product.options.batteries[0]);
  const [selectedColor, setSelectedColor] = useState(product.options.colors[0]);

  const currentPrice = product.price + selectedBattery.priceDelta;
  const cryptoPrice = currentPrice * 0.9;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Image */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden group">
        <Link href={`/shop/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </Link>
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#131A22] text-white text-[10px] font-bold rounded">
          {product.brand}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-black rounded flex items-center gap-1">
          <Bitcoin className="w-3 h-3 text-[#FF5722]" />
          -10% Krypto
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.category}</div>
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-bold text-[#131A22] hover:text-[#FF5722] transition-colors line-clamp-1 mt-0.5"
          >
            {product.name}
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-md">
          <div className="flex items-center gap-1 truncate">
            <Gauge className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
            <span className="truncate">{product.motor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
            <span>{product.rangeKm > 0 ? `bis ${product.rangeKm} km` : product.batteryStandardWh > 0 ? `${product.batteryStandardWh} Wh Akku` : 'Akku siehe Daten'}</span>
          </div>
        </div>

        {/* Option Selector: Frame Size */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 mb-1">
            Rahmen: <strong className="text-gray-900">{selectedFrame}</strong>
          </label>
          <div className="flex flex-wrap gap-1">
            {product.options.frameSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedFrame(size)}
                className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                  selectedFrame === size
                    ? 'border-[#FF5722] bg-orange-50 text-[#FF5722] font-bold'
                    : 'border-gray-200 text-gray-700 bg-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg font-black text-[#131A22]">
                {currentPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
              <div className="text-[10px] text-gray-400">inkl. 19% MwSt.</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#009624]">
                {cryptoPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              </div>
              <div className="text-[9px] text-gray-400">mit 10% Krypto-Skonto</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, selectedFrame, selectedBattery, selectedColor, 1)}
              className="py-2 px-2.5 rounded-lg border border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Warenkorb</span>
            </button>
            <button
              onClick={() => {
                addToCart(product, selectedFrame, selectedBattery, selectedColor, 1);
                router.push('/checkout');
              }}
              className="py-2 px-2.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Direkt Kaufen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
