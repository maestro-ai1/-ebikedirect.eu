import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { MAPPED_PAGES, getMappedPage, listingPageCount } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return MAPPED_PAGES.filter((p) => p.path.startsWith('/e-bikes/')).flatMap((p) =>
    Array.from({ length: Math.max(0, listingPageCount(p.path) - 1) }, (_, i) => ({ sub: p.path.split('/')[2], n: String(i + 2) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ sub: string; n: string }> }) {
  const { sub, n } = await params;
  return mappedMetadata(`/e-bikes/${sub}`, Number(n));
}

export default async function EBikesSubPagedPage({ params }: { params: Promise<{ locale: string; sub: string; n: string }> }) {
  const { locale, sub, n } = await params;
  const path = `/e-bikes/${sub}`;
  const page = Number(n);
  if (!getMappedPage(path) || !Number.isInteger(page) || page < 2 || page > listingPageCount(path)) notFound();
  if (locale !== 'de') redirect(`${path}/page/${page}`);
  return <MappedPage path={path} pageNum={page} />;
}
