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
import { ProductCard } from '@/components/shop/product-card';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useI18n } from '@/context/i18n-context';

export default function ShopClient() {
  const { u } = useI18n();
  return (
    <>
      <h1 className="sr-only">{u('shop.title')}</h1>
      <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">...</div>}>
        <ShopContent />
      </Suspense>
    </>
  );
}

function ShopContent() {
  const { u } = useI18n();
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
  const itemsPerPage = 9;

  const categories = ['all', 'E-MTB', 'E-Trekking', 'E-City', 'Speed-Pedelec', 'Cargo-E-Bike', 'Falt-E-Bike', 'E-Gravel', 'E-Kinder', 'Zubehör'];
  const brands = ['all', ...Array.from(new Set(PRODUCTS.filter((p) => p.category !== 'Zubehör').map((p) => p.brand))).sort((a, b) => a.localeCompare(b, 'de'))];
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Page Title & Logistics Callout */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#131A22] tracking-tight">
              {u('shop.title')}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {u('shop.found', { n: filteredProducts.length })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#E8F8F0] border border-[#00C853]/40 text-[#009624] text-xs font-bold rounded-lg flex items-center gap-1.5">
              <Bitcoin className="w-4 h-4 text-[#00C853]" />
              <span>{u('shop.crypto')}</span>
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
                  {u('shop.filter')}
                </span>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#FF5722] hover:underline font-semibold"
                >
                  {u('shop.reset')}
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  {u('shop.category')}
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
                      <span>{cat === 'all' ? u('shop.allCats') : cat}</span>
                      {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  {u('shop.maker')}
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
                      <span>{b === 'all' ? u('shop.allBrands') : b}</span>
                      {selectedBrand === b && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motor Filter */}
              <div>
                <label className="block text-xs font-bold text-[#131A22] mb-2 uppercase tracking-wider">
                  {u('shop.motorMaker')}
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
                      <span>{m === 'all' ? u('shop.allMotors') : m}</span>
                      {selectedMotor === m && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5722]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs font-bold text-[#131A22] mb-2">
                  <span>{u('shop.maxPrice')}</span>
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
                  {u('shop.inStock')}
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
                {u('shop.showing', { a: paginatedProducts.length, b: filteredProducts.length })}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sortSelect" className="text-xs font-semibold text-gray-700">
                  {u('shop.sort')}
                </label>
                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs py-1.5 px-3 bg-white border border-gray-200 rounded-md text-gray-800 focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                >
                  <option value="featured">{u('shop.sortFeatured')}</option>
                  <option value="price-asc">{u('shop.sortAsc')}</option>
                  <option value="price-desc">{u('shop.sortDesc')}</option>
                  <option value="rating">{u('shop.sortRating')}</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
                <h3 className="text-base font-bold text-gray-800">{u('shop.noneTitle')}</h3>
                <p className="text-xs text-gray-500">
                  {u('shop.noneText')}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#FF5722] text-white text-xs font-bold rounded-lg hover:bg-[#E64A19] transition-colors"
                >
                  {u('shop.resetFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} alt={`${product.name} kaufen`} />
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
                  {u('shop.prev')}
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
                  {u('shop.next')}
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
