import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { listingPageCount } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, listingPageCount('/zubehoer') - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return mappedMetadata('/zubehoer', Number(n));
}

export default async function AccessoriesPagedPage({ params }: { params: Promise<{ locale: string; n: string }> }) {
  const { locale, n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > listingPageCount('/zubehoer')) notFound();
  if (locale !== 'de') redirect(`/zubehoer/page/${page}`);
  return <MappedPage path="/zubehoer" pageNum={page} />;
}
