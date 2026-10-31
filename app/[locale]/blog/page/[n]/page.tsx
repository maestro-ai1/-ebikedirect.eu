import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { BlogIndex, blogPageCount } from '@/components/blog/blog-index';
import { isLocale } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `E-Bike Ratgeber und Magazin, Seite ${n}`,
    description: `Seite ${n} des E-Bike Magazins: weitere Ratgeber zu Akku, Motor, Zubehör und Kauf. Neue Artikel auf ebikedirect.eu entdecken und gleich lesen.`,
  };
}

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, blogPageCount() - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export default async function BlogPagedPage({ params }: { params: Promise<{ locale: string; n: string }> }) {
  const { locale, n } = await params;
  const page = Number(n);
  if (!isLocale(locale) || !Number.isInteger(page) || page < 2 || page > blogPageCount()) notFound();
  if (locale !== 'de') redirect(`/blog/page/${page}`);
  return <BlogIndex page={page} locale="de" />;
}
