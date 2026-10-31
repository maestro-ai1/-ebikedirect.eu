import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { BlogPostingJsonLd } from '@/components/seo/json-ld';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Bitcoin, ShoppingBag } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Artikel nicht gefunden' };

  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';

  return {
    title: `${post.title} | ebikedirect.eu Magazin`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      url: `${siteUrl}/blog/${post.slug}`
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`
    }
  };
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-[#F8F9FA] pb-16">
      <BlogPostingJsonLd post={post} />
      <Breadcrumbs
        items={[
          { label: 'Magazin', href: '/blog' },
          { label: post.category, href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] leading-tight">
              {post.title}
            </h1>

            {/* Author and Date Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs">
                  {post.author.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{post.author.name}</div>
                  <div className="text-[10px] text-gray-400">{post.author.role}</div>
                </div>
              </div>

              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {post.date}
              </span>

              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-gray-200">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Article Markdown/Content Body */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 pt-4">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-base sm:text-lg font-bold text-[#131A22] mt-6 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n');
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1.5 text-gray-700">
                    {listItems.map((item, liIdx) => (
                      <li key={liIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('1. ')) {
                const listItems = paragraph.split('\n');
                return (
                  <ol key={index} className="list-decimal pl-5 space-y-1.5 text-gray-700">
                    {listItems.map((item, liIdx) => (
                      <li key={liIdx}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Bottom In-Article Product Banner */}
          <div className="mt-8 p-6 bg-orange-50/70 rounded-xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#FF5722] uppercase tracking-wider flex items-center gap-1.5">
                <Bitcoin className="w-4 h-4 text-[#FF5722]" />
                <span>10% Krypto-Skonto sichern</span>
              </div>
              <h4 className="text-base font-bold text-[#131A22]">
                Passendes E-Bike jetzt online konfigurieren
              </h4>
              <p className="text-xs text-gray-600">
                Speditionsversand Frei Haus ab 10.000 € · Mindestbestellwert 500 € · 30 Tage Rückgaberecht.
              </p>
            </div>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Zum E-Bike Sortiment</span>
            </Link>
          </div>

          {/* Navigation Footer */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="text-xs font-bold text-gray-600 hover:text-[#131A22] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück zur Magazinübersicht</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
