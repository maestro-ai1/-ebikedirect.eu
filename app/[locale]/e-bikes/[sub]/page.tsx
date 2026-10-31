import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { MAPPED_PAGES, getMappedPage } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return MAPPED_PAGES.filter((p) => p.path.startsWith('/e-bikes/')).map((p) => ({ sub: p.path.split('/')[2] }));
}

export async function generateMetadata({ params }: { params: Promise<{ sub: string }> }) {
  const { sub } = await params;
  return mappedMetadata(`/e-bikes/${sub}`);
}

export default async function EBikesSubPage({ params }: { params: Promise<{ locale: string; sub: string }> }) {
  const { locale, sub } = await params;
  const path = `/e-bikes/${sub}`;
  if (!getMappedPage(path)) notFound();
  if (locale !== 'de') redirect(path);
  return <MappedPage path={path} />;
}
