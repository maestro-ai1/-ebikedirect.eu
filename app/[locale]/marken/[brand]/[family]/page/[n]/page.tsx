import { redirect, notFound } from 'next/navigation';
import { FamilyPage, familyMetadata } from '@/components/seo/family-page';
import { FAMILIES, getFamily, familyMembers, familyPageCount } from '@/lib/families';

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILIES.filter((f) => familyMembers(f).length >= 2).flatMap((f) =>
    Array.from({ length: Math.max(0, familyPageCount(f) - 1) }, (_, i) => ({ brand: f.brandSlug, family: f.slug, n: String(i + 2) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; family: string; n: string }> }) {
  const { brand, family, n } = await params;
  return familyMetadata(brand, family, Number(n));
}

export default async function FamilyPagedRoute({ params }: { params: Promise<{ locale: string; brand: string; family: string; n: string }> }) {
  const { locale, brand, family, n } = await params;
  const f = getFamily(brand, family);
  const page = Number(n);
  if (!f || familyMembers(f).length < 2 || !Number.isInteger(page) || page < 2 || page > familyPageCount(f)) notFound();
  if (locale !== 'de') redirect(`${f.path}/page/${page}`);
  return <FamilyPage brandSlug={brand} slug={family} pageNum={page} />;
}
