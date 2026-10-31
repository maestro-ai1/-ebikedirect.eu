import type { Product } from '@/lib/types';

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
}

export const MAPPED_PAGES: MappedPageDef[] = [
  { path: '/e-bikes', type: 'category' },
  { path: '/e-bikes/e-mountainbikes', type: 'category', category: 'E-MTB' },
  { path: '/e-bikes/trekking-e-bikes', type: 'category', category: 'E-Trekking' },
  { path: '/e-bikes/city-e-bikes', type: 'category', category: 'E-City' },
  { path: '/e-bikes/s-pedelec', type: 'category', category: 'Speed-Pedelec' },
  { path: '/e-bikes/cargo-bikes', type: 'category', category: 'Cargo-E-Bike' },
  { path: '/zubehoer', type: 'accessory' },
  { path: '/zubehoer/schloesser', type: 'accessory', accessory: 'schloesser' },
  { path: '/zubehoer/helme', type: 'accessory', accessory: 'helme' },
  { path: '/zubehoer/taschen-koerbe', type: 'accessory', accessory: 'taschen-koerbe' },
  { path: '/zubehoer/gepaecktraeger-anhaenger', type: 'accessory', accessory: 'gepaecktraeger-anhaenger' },
  { path: '/zubehoer/schutzbleche-staender', type: 'accessory', accessory: 'schutzbleche-staender' },
  { path: '/zubehoer/handyhalter', type: 'accessory', accessory: 'handyhalter' },
  { path: '/zubehoer/werkzeug-pflege', type: 'accessory', accessory: 'werkzeug-pflege' },
  { path: '/zubehoer/regenschutz-bekleidung', type: 'accessory', accessory: 'regenschutz-bekleidung' },
  { path: '/marken/cube', type: 'brand', brand: 'Cube' },
  { path: '/marken/specialized', type: 'brand', brand: 'Specialized' },
  { path: '/marken/riese-und-mueller', type: 'brand', brand: 'Riese & Müller' },
  { path: '/marken/haibike', type: 'brand', brand: 'Haibike' },
  { path: '/marken/kalkhoff', type: 'brand', brand: 'Kalkhoff' },
  { path: '/marken/gazelle', type: 'brand', brand: 'Gazelle' },
  { path: '/marken/canyon', type: 'brand', brand: 'Canyon' },
  { path: '/marken/tenways', type: 'brand', brand: 'Tenways' },
];

export function getMappedPage(path: string): MappedPageDef | undefined {
  const p = path.replace(/\/$/, '') || '/';
  return MAPPED_PAGES.find((m) => m.path === p);
}
