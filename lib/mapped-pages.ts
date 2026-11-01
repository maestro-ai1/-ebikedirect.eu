import type { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';

// Pages built from the approved-draft German keyword map (data/keywords/de.json).
// Stock check: a page exists only when the catalogue really holds what it names.
// Map entries without stock (damen, herren, gebraucht, falt, kinder, senioren, leasing,
// all accessories and the brands without products) stay on the "to source" list.
export interface MappedPageDef {
  path: string; // no trailing slash
  type: 'category' | 'brand' | 'accessory';
  category?: Product['category'];
  brand?: string; // value of product.brand
  accessory?: string; // value of product.accessory
  motor?: string; // regular expression source matched against product.motor (motor-maker hubs)
}

const STATIC_PAGES: MappedPageDef[] = [
  { path: '/e-bikes', type: 'category' },
  { path: '/e-bikes/e-mountainbikes', type: 'category', category: 'E-MTB' },
  { path: '/e-bikes/trekking-e-bikes', type: 'category', category: 'E-Trekking' },
  { path: '/e-bikes/city-e-bikes', type: 'category', category: 'E-City' },
  { path: '/e-bikes/s-pedelec', type: 'category', category: 'Speed-Pedelec' },
  { path: '/e-bikes/cargo-bikes', type: 'category', category: 'Cargo-E-Bike' },
  { path: '/e-bikes/falt-e-bikes', type: 'category', category: 'Falt-E-Bike' },
  { path: '/e-bikes/e-rennrad-gravel', type: 'category', category: 'E-Gravel' },
  { path: '/e-bikes/kinder-jugend', type: 'category', category: 'E-Kinder' },
  { path: '/zubehoer', type: 'accessory' },
  { path: '/zubehoer/schloesser', type: 'accessory', accessory: 'schloesser' },
  { path: '/zubehoer/helme', type: 'accessory', accessory: 'helme' },
  { path: '/zubehoer/taschen-koerbe', type: 'accessory', accessory: 'taschen-koerbe' },
  { path: '/zubehoer/gepaecktraeger-anhaenger', type: 'accessory', accessory: 'gepaecktraeger-anhaenger' },
  { path: '/zubehoer/schutzbleche-staender', type: 'accessory', accessory: 'schutzbleche-staender' },
  { path: '/zubehoer/handyhalter', type: 'accessory', accessory: 'handyhalter' },
  { path: '/zubehoer/werkzeug-pflege', type: 'accessory', accessory: 'werkzeug-pflege' },
  { path: '/zubehoer/regenschutz-bekleidung', type: 'accessory', accessory: 'regenschutz-bekleidung' },
  { path: '/zubehoer/beleuchtung', type: 'accessory', accessory: 'beleuchtung' },
  { path: '/zubehoer/sattel-lenker', type: 'accessory', accessory: 'sattel-lenker' },
  { path: '/marken/cube', type: 'brand', brand: 'Cube' },
  { path: '/marken/specialized', type: 'brand', brand: 'Specialized' },
  { path: '/marken/riese-und-mueller', type: 'brand', brand: 'Riese & Müller' },
  { path: '/marken/haibike', type: 'brand', brand: 'Haibike' },
  { path: '/marken/kalkhoff', type: 'brand', brand: 'Kalkhoff' },
  { path: '/marken/gazelle', type: 'brand', brand: 'Gazelle' },
  { path: '/marken/tenways', type: 'brand', brand: 'Tenways' },
  { path: '/marken/focus', type: 'brand', brand: 'Focus' },
  { path: '/marken/winora', type: 'brand', brand: 'Winora' },
  { path: '/marken/ghost', type: 'brand', brand: 'Ghost' },
  { path: '/marken/ktm', type: 'brand', brand: 'KTM' },
  { path: '/marken/trek', type: 'brand', brand: 'Trek' },
  { path: '/marken/giant', type: 'brand', brand: 'Giant' },
  { path: '/marken/bosch', type: 'brand', motor: 'bosch' },
  { path: '/marken/shimano', type: 'brand', motor: 'shimano' },
  { path: '/marken/yamaha-motor', type: 'brand', motor: 'yamaha' },
];

/** URL slug of a brand: Riese & Müller -> riese-und-mueller. */
export function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/&/g, ' und ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Every brand that has at least one bike in the catalogue gets its own hub page (stock is confirmed by the owner).
const KNOWN = new Set(STATIC_PAGES.map((p) => p.path));
const DYNAMIC_BRANDS = [...new Set(PRODUCTS.filter((p) => p.category !== 'Zubehör').map((p) => p.brand))]
  .map((brand): MappedPageDef => ({ path: `/marken/${brandSlug(brand)}`, type: 'brand', brand }))
  .filter((p) => !KNOWN.has(p.path));

export const MAPPED_PAGES: MappedPageDef[] = [...STATIC_PAGES, ...DYNAMIC_BRANDS];

export function getMappedPage(path: string): MappedPageDef | undefined {
  const p = path.replace(/\/$/, '') || '/';
  return MAPPED_PAGES.find((m) => m.path === p);
}

export const PER_PAGE = 9;

/** Products shown on a mapped landing page (category, brand, motor maker or accessory group). */
export function productsForPath(path: string): Product[] {
  const def = getMappedPage(path);
  if (!def) return [];
  if (def.motor) return PRODUCTS.filter((p) => p.category !== 'Zubehör' && new RegExp(def.motor!, 'i').test(p.motor));
  if (def.brand) return PRODUCTS.filter((p) => p.brand === def.brand);
  if (def.accessory) return PRODUCTS.filter((p) => p.accessory === def.accessory);
  if (def.type === 'accessory') return PRODUCTS.filter((p) => p.category === 'Zubehör');
  if (def.category) return PRODUCTS.filter((p) => p.category === def.category);
  return PRODUCTS.filter((p) => p.category !== 'Zubehör');
}

export function listingPageCount(path: string): number {
  return Math.max(1, Math.ceil(productsForPath(path).length / PER_PAGE));
}

/** URL of listing page n (page 1 keeps the plain path). */
export function listingUrl(path: string, n: number): string {
  return n <= 1 ? path : `${path}/page/${n}`;
}
