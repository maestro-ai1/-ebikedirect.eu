import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BlogIndex } from '@/components/blog/blog-index';
import { isLocale } from '@/lib/i18n';

// The magazine is written in German only: other languages are sent to the German page.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'E-Bike Ratgeber und Magazin',
    description: 'Ratgeber zu S-Pedelec, Akku, Motor, Zubehör und Kaufentscheidung: verständlich erklärt von der Redaktion von ebikedirect.eu. Jetzt Artikel lesen.',
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  if (locale !== 'de') redirect('/blog');
  return <BlogIndex page={1} locale="de" />;
}
