import productKw from '@/data/keywords/products.json';

interface ProductKw {
  primary: { keyword: string; source: string };
  secondary: { keyword: string }[];
  faq: { keyword: string }[];
}

const MAP = (productKw as unknown as { products: Record<string, ProductKw> }).products;

/** Focus keyword for a product page: the bank keyword when one matches, otherwise the product name plus "kaufen". */
export function productFocusKeyword(slug: string, name: string): string {
  const entry = MAP[slug];
  if (entry && entry.primary.source === 'bank') return entry.primary.keyword;
  return `${name} kaufen`;
}

export function productKeywords(slug: string): ProductKw | undefined {
  return MAP[slug];
}
