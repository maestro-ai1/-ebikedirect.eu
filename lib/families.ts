import type { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import familyData from '@/data/keywords/families.json';
import { PER_PAGE } from '@/lib/mapped-pages';

// Model-family pages (pilot of 8): one page per bike line, e.g. /marken/ktm/macina. The family keyword lives here, the variants keep their own keywords.
export interface FamilyKeyword { keyword: string; volume: number; kd: number | null; intent: string }
export interface FamilyDef {
  path: string; // no trailing slash
  slug: string;
  brand: string;
  brandSlug: string;
  name: string;
  match: string; // regular expression source matched against product.name
  primary: FamilyKeyword;
  secondary: FamilyKeyword[];
  faq: FamilyKeyword[];
}

export const FAMILIES: FamilyDef[] = (familyData as unknown as { families: FamilyDef[] }).families;

export function getFamily(brandSlug: string, slug: string): FamilyDef | undefined {
  return FAMILIES.find((f) => f.brandSlug === brandSlug && f.slug === slug);
}

export function familyMembers(f: FamilyDef): Product[] {
  const re = new RegExp(f.match);
  return PRODUCTS.filter((p) => p.category !== 'Zubehör' && p.brand === f.brand && re.test(p.name)).sort((a, b) => a.price - b.price);
}

export function familyOfProduct(p: Product): FamilyDef | undefined {
  return FAMILIES.find((f) => f.brand === p.brand && new RegExp(f.match).test(p.name));
}

export const familyPageCount = (f: FamilyDef) => Math.max(1, Math.ceil(familyMembers(f).length / PER_PAGE));
export const familyListingUrl = (path: string, n: number) => (n <= 1 ? path : `${path}/page/${n}`);

export function familiesOfBrand(brand: string): FamilyDef[] {
  return FAMILIES.filter((f) => f.brand === brand && familyMembers(f).length >= 2);
}
