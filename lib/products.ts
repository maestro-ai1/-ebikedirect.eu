import { Product } from './types';
import { CATALOG_PRODUCTS } from './catalog-products';
import { TENWAYS_PRODUCTS } from './catalog-tenways';
import { UNIVERSAL_PRODUCTS } from './catalog-universal';
import { XXL_PRODUCTS } from './catalog-xxl';

export const PRODUCTS: Product[] = [...CATALOG_PRODUCTS, ...TENWAYS_PRODUCTS, ...UNIVERSAL_PRODUCTS, ...XXL_PRODUCTS];