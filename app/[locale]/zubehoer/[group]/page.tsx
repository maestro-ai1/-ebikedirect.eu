import { redirect, notFound } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';
import { MAPPED_PAGES, getMappedPage } from '@/lib/mapped-pages';

export function generateStaticParams() {
  return MAPPED_PAGES.filter((p) => p.path.startsWith('/zubehoer/')).map((p) => ({ group: p.path.split('/')[2] }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  return mappedMetadata(`/zubehoer/${group}`);
}

export default async function AccessoryGroupPage({ params }: { params: Promise<{ locale: string; group: string }> }) {
  const { locale, group } = await params;
  const path = `/zubehoer/${group}`;
  if (!getMappedPage(path)) notFound();
  if (locale !== 'de') redirect(path);
  return <MappedPage path={path} />;
}
