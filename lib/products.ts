import { Product } from './types';
import { CATALOG_PRODUCTS } from './catalog-products';
import { TENWAYS_PRODUCTS } from './catalog-tenways';
import { UNIVERSAL_PRODUCTS } from './catalog-universal';
import { XXL_PRODUCTS } from './catalog-xxl';
import { CANNONDALE_PRODUCTS } from './catalog-cannondale';
import { STROMER_PRODUCTS } from './catalog-stromer';

// One page per model: when two import runs produced the same model name, the first one is kept (no duplicate titles or URLs).
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const seen = new Set<string>();
export const PRODUCTS: Product[] = [...CATALOG_PRODUCTS, ...TENWAYS_PRODUCTS, ...UNIVERSAL_PRODUCTS, ...XXL_PRODUCTS, ...CANNONDALE_PRODUCTS, ...STROMER_PRODUCTS].filter((p) => {
  const key = norm(`${p.brand} ${p.name}`);
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
