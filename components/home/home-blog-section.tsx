import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock, Calendar, User } from '@/components/ui/icons';
import { getAllPosts, formatDateDe } from '@/lib/blog-content';

export function HomeBlogSection() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-200" aria-labelledby="home-blog-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-[#FF5722]" />
              <span>Expertenwissen & Kaufberatung</span>
            </div>
            <h2 id="home-blog-heading" className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Aktuelles aus unserem E-Bike Magazin
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
              Ratgeber zu Technik, Kaufberatung und Zubehör für Ihr nächstes Pedelec.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF5722] hover:text-[#E64A19] transition-colors group"
          >
            <span>Alle Artikel im Magazin lesen</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {latestPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col bg-[#F8F9FA] rounded-xl border border-gray-200/90 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-16/10 bg-gray-200 overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#131A22]/90 text-white text-[11px] font-bold rounded backdrop-blur-xs">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  {/* Metadata Row: Clean Unboxed Text with typographic separators */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatDateDe(post.date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#131A22] group-hover:text-[#FF5722] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Redaktion ebikedirect.eu</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#FF5722] hover:text-[#E64A19] flex items-center gap-1"
                  >
                    <span>Weiterlesen</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
