import React from 'react';
import Link from 'next/link';
import { getAllPosts, formatDateDe } from '@/lib/blog-content';
import { MESSAGES, Locale, getLocalizedPath } from '@/lib/i18n';
import { ArrowRight } from '@/components/ui/icons';

// The magazine is written in German, so the teaser is shown on the German home page only.
export function GuideTeaser({ locale }: { locale: Locale }) {
  if (locale !== 'de') return null;
  const m = MESSAGES[locale].home;
  const posts = getAllPosts().filter((p) => !p.legacy).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-gray-200" aria-labelledby="guide-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <h2 id="guide-heading" className="font-display text-3xl sm:text-5xl font-bold text-[#131A22] tracking-tight leading-[1.05]">{m.guideTitle}</h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">{m.guideSub}</p>
          </div>
          <Link href={getLocalizedPath('/blog', locale)} className="inline-flex items-center gap-2 text-sm font-bold text-[#131A22] border-b-2 border-[#FF5722] pb-1 hover:text-[#FF5722] transition-colors self-start md:self-auto">
            {m.guideAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <li key={p.slug} className="group">
              <Link href={getLocalizedPath(`/blog/${p.slug}`, locale)} className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.primary || p.title} width={1200} height={675} loading="lazy" className="w-full aspect-video object-cover rounded-3xl ring-1 ring-gray-200" />
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#FF5722]">{p.category} · {formatDateDe(p.updated)}</div>
                <h3 className="font-display mt-1 text-lg sm:text-xl font-bold text-[#131A22] leading-snug group-hover:text-[#FF5722] transition-colors">{p.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
