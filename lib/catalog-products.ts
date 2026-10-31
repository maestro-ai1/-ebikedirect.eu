import type { Product } from './types';

// Catalogue added from retailer and manufacturer data (research 2026-10-30/31).
// Rules: only facts found on the source pages; unknown values stay 0 or empty and the shop hides them
// (no invented ratings, reviews, stock counts, ranges or weights).
// price = RRP x 0.995 (owner rule); originalPrice = RRP. Stock and frame sizes still need the owner's confirmation.
// Photos: white studio shots from the source pages, see data/image-sources.json.

const img = (slug: string, n: number) => `/products/${slug}/${slug}-v1-${n}.webp`;
const gallery = (slug: string, count: number) => Array.from({ length: count }, (_, i) => img(slug, i + 1));
const SIZE_NOTE = ['Rahmengröße wird bei der Bestellbestätigung abgestimmt'];

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'kalkhoff-endeavour-5-advance-plus',
    slug: 'kalkhoff-endeavour-5-advance-plus',
    name: 'Kalkhoff Endeavour 5+ Advance',
    brand: 'Kalkhoff',
    category: 'E-Trekking',
    price: 4874.51,
    originalPrice: 4899,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Bosch Performance Line CX Smart Gen5, 250 W',
    torqueNm: 85,
    batteryStandardWh: 800,
    rangeKm: 0,
    weightKg: 0,
    image: img('kalkhoff-endeavour-5-advance-plus', 1),
    gallery: gallery('kalkhoff-endeavour-5-advance-plus', 1),
    shortDescription: 'Trekking E-Bike mit Bosch CX Mittelmotor, 800 Wh Akku und 4-Kolben-Scheibenbremsen.',
    description:
      'Das Kalkhoff Endeavour 5+ Advance ist ein Trekking E-Bike für Alltag und Tour. Der Bosch Performance Line CX Smart Gen5 liefert 85 Nm Drehmoment (mit Update bis zu 120 Nm), der Bosch Akku speichert 800 Wh. Eine 10-Gang-Kettenschaltung, hydraulische Tektro 4-Kolben-Scheibenbremsen, eine absenkbare Federgabel und Schwalbe Marathon Green Reifen sorgen für Kontrolle und Komfort. Das Kiox 300 Farbdisplay zeigt Unterstützung, Akkustand und Navigation.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Bosch Li-Ion 36 V / 22,2 Ah / 800 Wh', capacityWh: 800, priceDelta: 0 }],
      colors: [{ name: 'Grau', hex: '#8A9199' }]
    },
    specs: {
      'Motor': 'Bosch Mittelmotor Performance Line CX Smart Gen5, 250 W',
      'Drehmoment': '85 Nm (mit Update bis zu 120 Nm)',
      'Akku': 'Bosch Li-Ion, 36 V / 22,2 Ah / 800 Wh',
      'Display': 'Bosch Kiox 300 Farbdisplay mit Schiebehilfe',
      'Schaltung': '10-Gang Kettenschaltung',
      'Bremsen': 'Tektro T535, 4-Kolben, hydraulische Scheibenbremse',
      'Gabel': 'SR Suntour Mobie34, absenkbar, 110x15 mm Steckachse',
      'Rahmen': 'Aluminium, Diamantrahmen',
      'Reifen': 'Schwalbe Marathon Green 55-622'
    },
    isFeatured: false
  },
  {
    id: 'kalkhoff-entice-5-advance-plus',
    slug: 'kalkhoff-entice-5-advance-plus',
    name: 'Kalkhoff Entice 5+ Advance Belt',
    brand: 'Kalkhoff',
    category: 'E-City',
    price: 5173.01,
    originalPrice: 5199,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Bosch Performance Line CX Smart Gen5, 250 W',
    torqueNm: 85,
    batteryStandardWh: 800,
    rangeKm: 0,
    weightKg: 0,
    image: img('kalkhoff-entice-5-advance-plus', 1),
    gallery: gallery('kalkhoff-entice-5-advance-plus', 1),
    shortDescription: 'Komfort E-Bike mit Trapezrahmen, Gates Riemenantrieb und stufenloser Nabenschaltung.',
    description:
      'Das Kalkhoff Entice 5+ Advance Belt ist ein Komfort E-Bike mit bequemem Einstieg. Der Bosch Performance Line CX Smart Gen5 Motor leistet 85 Nm, der 800 Wh Akku sorgt für Reserven im Alltag. Statt einer Kette treibt ein wartungsarmer Gates Carbon Riemen das Rad an, geschaltet wird stufenlos über eine Getriebe-Nabenschaltung. Vierkolben-Scheibenbremsen, eine Federgabel und breite Schwalbe Smart Sam Reifen erhöhen Sicherheit und Komfort.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Bosch Li-Ion 36 V / 22,2 Ah / 800 Wh', capacityWh: 800, priceDelta: 0 }],
      colors: [{ name: 'Petrol', hex: '#1F4E5F' }]
    },
    specs: {
      'Motor': 'Bosch Mittelmotor Performance Line CX Smart Gen5, 250 W',
      'Drehmoment': '85 Nm (mit Update bis zu 120 Nm)',
      'Akku': 'Bosch Li-Ion, 36 V / 22,2 Ah / 800 Wh',
      'Display': 'Bosch Kiox 300 Farbdisplay mit Schiebehilfe',
      'Antrieb': 'Gates Carbon Drive CDX Riemen, stufenlose Getriebe-Nabenschaltung',
      'Bremsen': 'Tektro T535, 4-Kolben, hydraulische Scheibenbremse',
      'Gabel': 'SR Suntour Mobie34, 110x15 mm Steckachse',
      'Rahmen': 'Aluminium, Trapezrahmen',
      'Reifen': 'Schwalbe Smart Sam Bronze Reflex 57-622'
    },
    isFeatured: false
  },
  {
    id: 'kalkhoff-image-3-advance',
    slug: 'kalkhoff-image-3-advance',
    name: 'Kalkhoff Image 3 Advance',
    brand: 'Kalkhoff',
    category: 'E-City',
    price: 3282.51,
    originalPrice: 3299,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Bosch Performance Line Smart, 250 W',
    torqueNm: 75,
    batteryStandardWh: 540,
    rangeKm: 0,
    weightKg: 0,
    image: img('kalkhoff-image-3-advance', 1),
    gallery: gallery('kalkhoff-image-3-advance', 1),
    shortDescription: 'Einstiegs-City-E-Bike mit Tiefeinsteiger, Bosch Mittelmotor, 540 Wh Akku und 5-Gang-Nabe.',
    description:
      'Das Kalkhoff Image 3 Advance ist ein Tiefeinsteiger für die Stadt und den Alltag. Der Bosch Performance Line Smart Mittelmotor liefert 75 Nm, der 540 Wh Akku genügt für typische Pendelstrecken. Die 5-Gang-Nabenschaltung ist wartungsarm, hydraulische Tektro Scheibenbremsen und eine Federgabel sorgen für sicheres Fahren. Das Bosch Purion 200 Display zeigt Modus und Akkustand an.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Bosch Li-Ion 36 V / 15 Ah / 540 Wh', capacityWh: 540, priceDelta: 0 }],
      colors: [{ name: 'Violett', hex: '#8B6B9A' }]
    },
    specs: {
      'Motor': 'Bosch Mittelmotor Performance Line Smart, 250 W',
      'Drehmoment': '75 Nm',
      'Akku': 'Bosch Li-Ion, 36 V / 15 Ah / 540 Wh',
      'Display': 'Bosch Purion 200 Farbdisplay mit Schiebehilfe',
      'Schaltung': '5-Gang Nabenschaltung (Freilauf)',
      'Bremsen': 'Tektro T280, 2-Kolben, hydraulische Scheibenbremse',
      'Gabel': 'SR Suntour XCM32 Coil',
      'Rahmen': 'Aluminium, Tiefeinsteiger',
      'Reifen': 'Schwalbe Green Marathon 55-622'
    },
    isFeatured: false
  },
  {
    id: 'haibike-trekking-4-low',
    slug: 'haibike-trekking-4-low',
    name: 'Haibike Trekking 4 Low',
    brand: 'Haibike',
    category: 'E-Trekking',
    price: 3481.51,
    originalPrice: 3499,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Bosch Performance Line PX Smart, 250 W',
    torqueNm: 90,
    batteryStandardWh: 600,
    rangeKm: 0,
    weightKg: 0,
    image: img('haibike-trekking-4-low', 1),
    gallery: gallery('haibike-trekking-4-low', 1),
    shortDescription: 'Trekking E-Bike mit Tiefeinsteiger, Bosch PX Mittelmotor und 600 Wh PowerTube Akku.',
    description:
      'Das Haibike Trekking 4 Low verbindet einen komfortablen Tiefeinsteiger mit kräftigem Antrieb. Der Bosch Performance Line PX Smart Mittelmotor leistet 90 Nm, der Bosch PowerTube Akku speichert 600 Wh. Eine 10-Gang-Kettenschaltung, hydraulische 4-Kolben-Scheibenbremsen und eine Federgabel mit 100 mm Federweg machen das Rad für Touren und den Alltag geeignet. Das Bosch Intuvia 100 Display mit LED Remote erleichtert die Bedienung.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Bosch PowerTube 600 Wh', capacityWh: 600, priceDelta: 0 }],
      colors: [{ name: 'Beige', hex: '#B8A98A' }]
    },
    specs: {
      'Motor': 'Bosch Mittelmotor Performance Line PX Smart, 250 W',
      'Drehmoment': '90 Nm',
      'Akku': 'Bosch PowerTube, 600 Wh',
      'Display': 'Bosch Intuvia 100 mit LED Remote',
      'Schaltung': '10-Gang Kettenschaltung',
      'Bremsen': 'Tektro HD-M535, 4 Kolben, hydraulische Scheibenbremse',
      'Gabel': 'SR Suntour SF26-XCM34, 100 mm Federweg',
      'Rahmen': 'Aluminium, Tiefeinsteiger, Boost 110/148',
      'Reifen': 'XLC VT-T45 Toorak, 60-584 (27,5 Zoll)'
    },
    isFeatured: false
  },
  {
    id: 'tenways-cgo600-pro',
    slug: 'tenways-cgo600-pro',
    name: 'Tenways CGO600 Pro',
    brand: 'Tenways',
    category: 'E-City',
    price: 1790.01,
    originalPrice: 1799,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Mivice M070 Hinterradnabenmotor, 250 W',
    torqueNm: 0,
    batteryStandardWh: 0,
    rangeKm: 0,
    weightKg: 16,
    image: img('tenways-cgo600-pro', 1),
    gallery: gallery('tenways-cgo600-pro', 3),
    shortDescription: 'Leichtes Urban E-Bike mit Gates Riemenantrieb, Hinterradmotor und hydraulischen Scheibenbremsen.',
    description:
      'Das Tenways CGO600 Pro ist ein leichtes Urban E-Bike für Pendler. Der Mivice M070 Hinterradnabenmotor leistet 250 W, der Rahmen besteht aus 6061 Aluminium und das Rad wiegt 16 kg netto. Ein Gates CDN Carbon Riemen ersetzt die Kette und macht den Antrieb sauber und wartungsarm, hydraulische Scheibenbremsen bremsen bei jedem Wetter.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Integrierter Akku (Daten laut Hersteller)', capacityWh: 0, priceDelta: 0 }],
      colors: [{ name: 'Blau', hex: '#6C8BA3' }]
    },
    specs: {
      'Motor': 'Mivice M070 Hinterradnabenmotor, 250 W',
      'Antrieb': 'Gates CDN Carbon Riemen, Single-Speed',
      'Rahmen': '6061 Aluminium',
      'Bremsen': 'Hydraulische Scheibenbremsen',
      'Nettogewicht': '16 kg',
      'Gesamtgewicht': '18 kg (laut Hersteller)'
    },
    isFeatured: false
  },
  {
    id: 'riese-mueller-charger5-vario',
    slug: 'riese-mueller-charger5-vario',
    name: 'Riese & Müller Charger5 vario',
    brand: 'Riese & Müller',
    category: 'E-Trekking',
    price: 6217.66,
    originalPrice: 6248.9,
    inStock: true,
    stockCount: 0,
    rating: 0,
    reviewsCount: 0,
    motor: 'Bosch Performance Line CX Smart, 250 W',
    torqueNm: 85,
    batteryStandardWh: 800,
    rangeKm: 0,
    weightKg: 0,
    image: img('riese-mueller-charger5-vario', 1),
    gallery: gallery('riese-mueller-charger5-vario', 1),
    shortDescription: 'Premium Touren E-Bike mit Bosch CX Motor, 800 Wh, Riemenantrieb und stufenloser Getriebenabe.',
    description:
      'Das Riese & Müller Charger5 vario ist ein Premium Touren E-Bike. Der Bosch Performance Line CX Smart Motor liefert 85 Nm, der Bosch PowerTube Akku speichert 800 Wh. Ein Gates Carbon Drive Riemen und eine stufenlose Getriebe-Nabenschaltung halten den Antrieb sauber, Magura MT5 und MT4 Scheibenbremsen sorgen für starke Verzögerung. Die Federgabel mit 100 mm Federweg und Schwalbe Johnny Watts Reifen machen das Rad auf langen Strecken komfortabel.',
    options: {
      frameSizes: SIZE_NOTE,
      batteries: [{ label: 'Bosch PowerTube 800 Wh', capacityWh: 800, priceDelta: 0 }],
      colors: [{ name: 'Anthrazit', hex: '#4A4F55' }]
    },
    specs: {
      'Motor': 'Bosch Mittelmotor Performance Line CX Smart, 250 W',
      'Drehmoment': '85 Nm',
      'Akku': 'Bosch PowerTube 800 Wh',
      'Display': 'Bosch Kiox 500',
      'Antrieb': 'Gates Carbon Drive CDX Riemen, stufenlose Getriebe-Nabenschaltung',
      'Bremsen': 'Magura MT5 (vorne), Magura MT4 (hinten), hydraulisch',
      'Gabel': 'SR Suntour Mobie 34, tapered, Boost, 100 mm Federweg',
      'Rahmen': 'Aluminium, Diamantrahmen',
      'Reifen': 'Schwalbe Johnny Watts 60-584 (27,5 Zoll)'
    },
    isFeatured: false
  }
];
