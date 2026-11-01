import { redirect, notFound } from 'next/navigation';
import { FamilyPage, familyMetadata } from '@/components/seo/family-page';
import { FAMILIES, getFamily, familyMembers } from '@/lib/families';

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILIES.filter((f) => familyMembers(f).length >= 2).map((f) => ({ brand: f.brandSlug, family: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; family: string }> }) {
  const { brand, family } = await params;
  return familyMetadata(brand, family);
}

export default async function FamilyRoute({ params }: { params: Promise<{ locale: string; brand: string; family: string }> }) {
  const { locale, brand, family } = await params;
  const f = getFamily(brand, family);
  if (!f || familyMembers(f).length < 2) notFound();
  if (locale !== 'de') redirect(f.path);
  return <FamilyPage brandSlug={brand} slug={family} />;
}
