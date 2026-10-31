import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getAllPosts, formatDateDe, POSTS_PER_PAGE } from '@/lib/blog-content';
import { getLocalizedPath, Locale } from '@/lib/i18n';

export function blogPageCount(): number {
  return Math.max(1, Math.ceil(getAllPosts().length / POSTS_PER_PAGE));
}

export function BlogIndex({ page, locale }: { page: number; locale: Locale }) {
  const all = getAllPosts();
  const total = blogPageCount();
  const posts = all.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const pageHref = (n: number) => getLocalizedPath(n === 1 ? '/blog' : `/blog/page/${n}`, locale);

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'E-Bike Magazin & Ratgeber', href: '/blog' }]} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        <header className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 shadow-xs space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-[#FF5722]">E-Bike Wissen und Ratgeber</p>
          <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
            {page === 1 ? 'E-Bike Ratgeber und Magazin' : `E-Bike Ratgeber und Magazin, Seite ${page}`}
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Ratgeber zu S-Pedelec, Akku, Motor, Zubehör und Kaufentscheidung. {all.length} Artikel, geprüft und zuletzt aktualisiert am {formatDateDe(all[0].updated)}.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
              <Link href={getLocalizedPath(`/blog/${p.slug}`, locale)} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.primary || p.title} width={1200} height={675} loading="lazy" className="w-full aspect-video object-cover bg-[#F8F9FA]" />
              </Link>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">{p.category}</span>
                <h2 className="text-base font-bold text-[#131A22] leading-snug">
                  <Link href={getLocalizedPath(`/blog/${p.slug}`, locale)} className="hover:text-[#FF5722]">{p.title}</Link>
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed flex-1">{p.description}</p>
                <div className="text-[11px] text-gray-400">{formatDateDe(p.updated)} · {p.readTime}</div>
              </div>
            </li>
          ))}
        </ul>

        <nav aria-label="Seitennavigation" className="flex items-center justify-center gap-2 flex-wrap">
          {page > 1 && <Link rel="prev" href={pageHref(page - 1)} className="px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:border-[#FF5722]">Zurück</Link>}
          {Array.from({ length: total }, (_, idx) => idx + 1).map((n) => (
            <Link key={n} href={pageHref(n)} aria-current={n === page ? 'page' : undefined}
              className={`px-3 py-2 text-xs font-bold rounded-lg border ${n === page ? 'bg-[#131A22] text-white border-[#131A22]' : 'bg-white border-gray-200 hover:border-[#FF5722]'}`}>
              Seite {n}
            </Link>
          ))}
          {page < total && <Link rel="next" href={pageHref(page + 1)} className="px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:border-[#FF5722]">Weiter</Link>}
        </nav>
      </div>
    </div>
  );
}
