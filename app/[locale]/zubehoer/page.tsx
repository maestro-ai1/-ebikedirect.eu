import { redirect } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';

export function generateMetadata() {
  return mappedMetadata('/zubehoer');
}

export default async function AccessoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'de') redirect('/zubehoer');
  return <MappedPage path="/zubehoer" />;
}
