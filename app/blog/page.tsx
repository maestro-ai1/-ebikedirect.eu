'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BLOG_POSTS } from '@/lib/blog';
import { Calendar, Clock, User, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const categories = ['all', 'Technik & Test', 'Kaufberatung', 'Finanzen & Recht', 'Ratgeber'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'E-Bike Magazin & Ratgeber', href: '/blog' }]} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
              E-Bike Wissen & Praxistests
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Das ebikedirect.eu Magazin
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Unabhängige Vergleiche, Akku-Pflege, Reichweitenanalysen und Steuervorteile bei Diensträdern.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Artikel suchen..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#FF5722] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#131A22] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'Alle Artikel' : cat}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {paginatedPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-xs text-gray-500">
            Keine Beiträge gefunden. Bitte Filter zurücksetzen.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#131A22] text-white text-[10px] font-bold rounded">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {post.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-[#131A22] group-hover:text-[#FF5722] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{post.author.name}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1"
                    >
                      <span>Lesen</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </button>

            <span className="text-xs text-gray-600 font-semibold">
              Seite {currentPage} von {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Weiter
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
