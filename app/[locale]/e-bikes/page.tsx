import { redirect } from 'next/navigation';
import { MappedPage, mappedMetadata } from '@/components/seo/mapped-page';

export function generateMetadata() {
  return mappedMetadata('/e-bikes');
}

export default async function EBikesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'de') redirect('/e-bikes');
  return <MappedPage path="/e-bikes" />;
}
