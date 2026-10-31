import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { MAPPED_PAGES, getMappedPage } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return MAPPED_PAGES.filter((p) => p.path.startsWith('/marken/')).map((p) => ({ brand: p.path.split('/')[2] }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = await params;
  return mappedMetadata(`/marken/${brand}`);
}

export default async function BrandPage({ params }: { params: Promise<{ locale: string; brand: string }> }) {
  const { locale, brand } = await params;
  const path = `/marken/${brand}`;
  if (!getMappedPage(path)) notFound();
  if (locale !== 'de') redirect(path);
  return <MappedPage path={path} />;
}
