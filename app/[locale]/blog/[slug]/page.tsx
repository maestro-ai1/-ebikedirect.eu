import React from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ArticleBody, getToc } from '@/components/blog/article-body';
import { getAllPosts, getPost, getRelatedPosts, formatDateDe } from '@/lib/blog-content';
import { SITE_URL } from '@/lib/seo';
import { getLocalizedPath, isLocale } from '@/lib/i18n';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Artikel nicht gefunden' };
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.seoTitle,
      description: post.description,
      images: [{ url: post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}` }],
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== 'de') redirect(`/blog/${slug}`);
  const post = getPost(slug);
  if (!post) notFound();

  const toc = getToc(post.body);
  const related = getRelatedPosts(post.slug);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const cover = post.cover.startsWith('http') ? post.cover : `${SITE_URL}${post.cover}`;

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [cover],
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: 'de',
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'Redaktion ebikedirect.eu' },
    publisher: { '@type': 'Organization', name: 'ebikedirect.eu', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` } },
  };
  const faqPage = post.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <article className="bg-[#F8F9FA] pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
      {faqPage && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />}
      <Breadcrumbs
        items={[
          { label: 'Magazin', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          <header className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-4">
              <span className="font-bold text-gray-900">Redaktion ebikedirect.eu</span>
              <span>Veröffentlicht: <time dateTime={post.date}>{formatDateDe(post.date)}</time></span>
              <span>Aktualisiert: <time dateTime={post.updated}>{formatDateDe(post.updated)}</time></span>
              <span>{post.readTime}</span>
            </div>
          </header>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.primary || post.title} width={1200} height={675} className="w-full aspect-video object-cover rounded-xl border border-gray-200 bg-[#F8F9FA]" />

          {toc.length > 0 && (
            <nav aria-label="Inhaltsverzeichnis" className="rounded-xl border border-gray-200 bg-[#F8F9FA] p-5">
              <p className="text-xs font-black uppercase tracking-wider text-[#131A22] mb-2">Inhaltsverzeichnis</p>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} className="text-gray-700 hover:text-[#FF5722]">{t.text}</a></li>
                ))}
              </ol>
            </nav>
          )}

          <ArticleBody body={post.body} locale="de" />

          <aside className="mt-8 p-6 bg-[#FFF1EC] rounded-xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">Passende Modelle</p>
              <p className="text-base font-bold text-[#131A22]">Jetzt E-Bikes im Sortiment vergleichen</p>
            </div>
            <Link href={getLocalizedPath('/shop', 'de')} className="px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold shrink-0 transition-colors">
              Zum E-Bike Sortiment
            </Link>
          </aside>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="pt-6 border-t border-gray-100">
              <h2 id="related-heading" className="text-lg font-black text-[#131A22] mb-3">Weitere Ratgeber</h2>
              <ul className="space-y-2 text-sm">
                {related.map((r) => (
                  <li key={r.slug}><Link href={getLocalizedPath(`/blog/${r.slug}`, 'de')} className="text-[#FF5722] font-semibold hover:underline">{r.title}</Link></li>
                ))}
              </ul>
            </section>
          )}

          <p className="text-sm text-gray-600 leading-relaxed pt-2">
            Alle Hersteller im Sortiment finden Sie unter <Link href={getLocalizedPath('/marken', 'de')} className="text-[#FF5722] font-semibold hover:underline">Marken</Link>, Antworten auf häufige Kauffragen in den <Link href={getLocalizedPath('/faq', 'de')} className="text-[#FF5722] font-semibold hover:underline">FAQ</Link>, mehr zum Shop unter <Link href={getLocalizedPath('/about', 'de')} className="text-[#FF5722] font-semibold hover:underline">Über uns</Link>, die Bedingungen unter <Link href={getLocalizedPath('/policies', 'de')} className="text-[#FF5722] font-semibold hover:underline">Lieferung, Rückgabe und Garantie</Link>, und bei Fragen hilft der <Link href={getLocalizedPath('/contact', 'de')} className="text-[#FF5722] font-semibold hover:underline">Kontakt</Link>.
          </p>

          <div className="pt-4">
            <Link href={getLocalizedPath('/blog', 'de')} className="text-xs font-bold text-gray-600 hover:text-[#131A22]">Zurück zur Magazinübersicht</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
