import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { listingPageCount } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, listingPageCount('/e-bikes') - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return mappedMetadata('/e-bikes', Number(n));
}

export default async function EBikesPagedPage({ params }: { params: Promise<{ locale: string; n: string }> }) {
  const { locale, n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > listingPageCount('/e-bikes')) notFound();
  if (locale !== 'de') redirect(`/e-bikes/page/${page}`);
  return <MappedPage path="/e-bikes" pageNum={page} />;
}
