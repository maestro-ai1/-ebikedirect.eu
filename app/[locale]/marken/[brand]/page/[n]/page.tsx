import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { MAPPED_PAGES, getMappedPage, listingPageCount } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return MAPPED_PAGES.filter((p) => p.path.startsWith('/marken/')).flatMap((p) =>
    Array.from({ length: Math.max(0, listingPageCount(p.path) - 1) }, (_, i) => ({ brand: p.path.split('/')[2], n: String(i + 2) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; n: string }> }) {
  const { brand, n } = await params;
  return mappedMetadata(`/marken/${brand}`, Number(n));
}

export default async function BrandPagedPage({ params }: { params: Promise<{ locale: string; brand: string; n: string }> }) {
  const { locale, brand, n } = await params;
  const path = `/marken/${brand}`;
  const page = Number(n);
  if (!getMappedPage(path) || !Number.isInteger(page) || page < 2 || page > listingPageCount(path)) notFound();
  if (locale !== 'de') redirect(`${path}/page/${page}`);
  return <MappedPage path={path} pageNum={page} />;
}
