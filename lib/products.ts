import { Product } from './types';
import { CATALOG_PRODUCTS } from './catalog-products';
import { TENWAYS_PRODUCTS } from './catalog-tenways';
import { UNIVERSAL_PRODUCTS } from './catalog-universal';

const TEMPLATE_PRODUCTS: Product[] = [
  {
    id: 'prod-cube-stereo-160',
    slug: 'cube-stereo-hybrid-160-hpc-actionteam-750',
    name: 'Cube Stereo Hybrid 160 HPC Actionteam 750',
    brand: 'Cube',
    category: 'E-MTB',
    price: 5999,
    originalPrice: 6599,
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviewsCount: 142,
    motor: 'Bosch Performance Line CX Gen 4 (Smart System)',
    torqueNm: 85,
    batteryStandardWh: 750,
    rangeKm: 140,
    weightKg: 24.3,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'High-End Carbon Enduro E-Mountainbike mit Bosch Smart System 85 Nm und Fox Factory Federung.',
    description: 'Das Cube Stereo Hybrid 160 HPC Actionteam 750 ist die Speerspitze alpiner E-MTB Performance. Mit dem leichten C:62 Carbon-Hauptrahmen, dem kraftvollen Bosch Performance Line CX Motor (85 Nm Drehmoment) und dem vollintegrierten 750 Wh PowerTube Akku meisterst du steilste Anstiege und technische Singletrails mit unnachgiebiger Präzision. Die Fox 38 Float Factory FIT4 Gabel mit 170 mm Federweg und Kashima-Beschichtung bietet unvergleichliches Ansprechverhalten.',
    options: {
      frameSizes: ['S (16")', 'M (18")', 'L (20")', 'XL (22")'],
      batteries: [
        { label: 'Bosch PowerTube 750 Wh (Standard)', capacityWh: 750, priceDelta: 0 },
        { label: 'Bosch PowerTube 750 Wh + PowerMore 250 Wh Zusatzakku (+1.000 Wh Total)', capacityWh: 1000, priceDelta: 449 }
      ],
      colors: [
        { name: 'Actionteam Blue / Orange', hex: '#FF5722' },
        { name: 'Stealth Black Matte', hex: '#1C1C1E' }
      ]
    },
    specs: {
      'Rahmen': 'C:62 Monocoque Advanced Twin Mold Technology, 6061 T6 Hinterbau',
      'Gabel': 'Fox 38 Float Factory FIT4, 170mm, Kashima Coated',
      'Dämpfer': 'Fox Float X Factory, 205x65mm, Kashima Coated',
      'Motor': 'Bosch Drive Unit Performance CX Generation 4 (85Nm) Cruise (250Watt)',
      'Display': 'Bosch Kiox 300 & LED Remote',
      'Schaltung': 'Shimano XT RD-M8100-SGS, ShadowPlus, 12-Speed',
      'Bremsen': 'Shimano XT BR-M8120, Hydr. Disc Brake (203/203)',
      'Laufradsatz': 'Newmen Evolution SL E.G. 30, 28/28 Spokes, 15x110mm/12x148mm, Tubeless Ready'
    },
    isFeatured: true
  },
  {
    id: 'prod-specialized-turbo-levo',
    slug: 'specialized-turbo-levo-pro-carbon-2026',
    name: 'Specialized Turbo Levo Pro Carbon',
    brand: 'Specialized',
    category: 'E-MTB',
    price: 8499,
    originalPrice: 9299,
    inStock: true,
    stockCount: 4,
    rating: 5.0,
    reviewsCount: 98,
    motor: 'Specialized Turbo Full Power System 2.2',
    torqueNm: 90,
    batteryStandardWh: 700,
    rangeKm: 155,
    weightKg: 22.1,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Unvergleichliche 4x-Verstärkung: Der Benchmark unter den Luxus E-Mountainbikes mit 90 Nm Drehmoment.',
    description: 'Das Turbo Levo Pro vereint modernste Fahrwerksgeometrie, einen Vollcarbon-Rahmen und den revolutionären Turbo Full Power 2.2 Motor. Mit satten 90 Nm Drehmoment und 565 Watt Spitzenleistung verstärkt das Levo deinen Kraftaufwand um das Vierfache. Dank MasterMind TCU Display lässt sich die Leistungsabgabe in 10%-Schritten via MicroTune feinstjustieren.',
    options: {
      frameSizes: ['S2 (Medium)', 'S3 (Large)', 'S4 (X-Large)', 'S5 (XX-Large)'],
      batteries: [
        { label: 'Specialized M3-700 Integriert 700 Wh', capacityWh: 700, priceDelta: 0 },
        { label: 'Specialized 700 Wh + 160 Wh Range Extender (860 Wh)', capacityWh: 860, priceDelta: 399 }
      ],
      colors: [
        { name: 'Redwood / Satin Carbon', hex: '#8B0000' },
        { name: 'Gloss Carbon / Smoke Gray', hex: '#2F4F4F' }
      ]
    },
    specs: {
      'Rahmen': 'FACT 11m Full Carbon, 29" Front / 27.5" Rear Mullet Setup, 150mm Travel',
      'Gabel': 'FOX FLOAT 38 Factory, GRIP2 Damper, 160mm, Kashima',
      'Dämpfer': 'FOX FLOAT X2 Factory, LSC, LSR, 2-position lever',
      'Motor': 'Specialized 2.2 Custom Rx Trail Tuned Motor (90Nm)',
      'Display': 'Specialized MasterMind TCU, integriert ins Oberrohr',
      'Schaltung': 'SRAM X01 Eagle AXS, elektronisch 12-Speed',
      'Bremsen': 'SRAM Code RSC, 4-Kolben hydraulisch (220/200mm)'
    },
    isFeatured: true
  },
  {
    id: 'prod-riese-mueller-supercharger',
    slug: 'riese-mueller-supercharger-gt-touring-1000wh',
    name: 'Riese & Müller Supercharger GT Touring 1000Wh',
    brand: 'Riese & Müller',
    category: 'E-Trekking',
    price: 7299,
    originalPrice: 7799,
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewsCount: 184,
    motor: 'Bosch Performance Line CX Smart System',
    torqueNm: 85,
    batteryStandardWh: 1000,
    rangeKm: 210,
    weightKg: 28.5,
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Der unangefochtene Langstrecken-König: DualBattery mit 1000 Wh für grenzenlose Expeditionen.',
    description: 'Wer täglich weite Strecken zurücklegen will oder große Radreisen plant, findet im Riese & Müller Supercharger das ultimative E-Bike. Zwei vollintegrierte Bosch PowerTube Akkus liefern 1.000 Wh Energie für Reichweiten von über 200 km. Der verwindungssteife Rahmen, helle Supernova M99 Mini Pro Beleuchtung mit Fernlicht und die erstklassige Ergonomie garantieren ungetrübten Fahrkomfort.',
    options: {
      frameSizes: ['46 cm (1.65-1.78m)', '49 cm (1.75-1.88m)', '53 cm (1.80-1.95m)', '56 cm (>1.90m)'],
      batteries: [
        { label: 'DualBattery 1000 Wh (2x 500 Wh)', capacityWh: 1000, priceDelta: 0 },
        { label: 'DualBattery 1250 Wh (625 Wh + 625 Wh)', capacityWh: 1250, priceDelta: 350 }
      ],
      colors: [
        { name: 'Curry Matt', hex: '#D4AF37' },
        { name: 'Warm Silver Matt', hex: '#A8A9AD' }
      ]
    },
    specs: {
      'Rahmen': 'Aluminium 6061 T6, integrierte DualBattery Technologie',
      'Gabel': 'Marzocchi Bomber Z2, Air, 100mm Federweg',
      'Motor': 'Bosch Performance CX Gen 4 Smart System (85 Nm)',
      'Akku': 'Bosch DualBattery 1.000 Wh (vollintegriert)',
      'Display': 'Bosch Nyon Touchscreen Navi & Smart Connectivity',
      'Schaltung': 'Shimano Deore XT 11-Gang Linkglide (extrem verschleißarm)',
      'Scheinwerfer': 'Supernova M99 Mini Pro-25 mit 1.200 Lumen Fernlicht'
    },
    isFeatured: true
  },
  {
    id: 'prod-haibike-allmtn-7',
    slug: 'haibike-allmtn-7-yamaha-pw-x3',
    name: 'Haibike ALLMTN 7 Yamaha PW-X3',
    brand: 'Haibike',
    category: 'E-MTB',
    price: 5499,
    originalPrice: 6299,
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewsCount: 112,
    motor: 'Yamaha PW-X3 85Nm',
    torqueNm: 85,
    batteryStandardWh: 720,
    rangeKm: 135,
    weightKg: 24.1,
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Aggressiver Allrounder: Yamaha PW-X3 Motor, Fox Performance 160 mm und Mullet-Laufradmix.',
    description: 'Das Haibike ALLMTN 7 kennt keine Limits auf anspruchsvollen Trails. Der extrem kompakte und leichte Yamaha PW-X3 Motor bringt ein Drehmoment von 85 Nm sofort auf die Kette. Das 29" Vorderrad rollt geschmeidig über Felsbrocken, während das agile 27,5" Hinterrad Traktion und Wendigkeit maximiert.',
    options: {
      frameSizes: ['S', 'M', 'L', 'XL'],
      batteries: [
        { label: 'Yamaha InTube 720 Wh (Standard)', capacityWh: 720, priceDelta: 0 },
        { label: 'Yamaha 720 Wh + Range Extender 360 Wh (1.080 Wh)', capacityWh: 1080, priceDelta: 499 }
      ],
      colors: [
        { name: 'Coffee / Black Gloss', hex: '#4A3B32' },
        { name: 'Anthracite / Lime', hex: '#333333' }
      ]
    },
    specs: {
      'Rahmen': 'Haibike Aluminium 6061, 160mm Travel',
      'Gabel': 'FOX 36 Float Performance Air, 160mm',
      'Dämpfer': 'FOX Float DPS Performance EVOL, Air',
      'Motor': 'Yamaha PW-X3, 250W, 85Nm, 25km/h',
      'Schaltung': 'SRAM GX Eagle, 12-Speed',
      'Bremsen': 'Magura MT7, 4-Kolben Scheibenbremsen (203/203mm)'
    },
    isFeatured: true
  },
  {
    id: 'prod-kalkhoff-entice-7-advance',
    slug: 'kalkhoff-entice-7-advance-abs-2026',
    name: 'Kalkhoff Entice 7+ Advance ABS',
    brand: 'Kalkhoff',
    category: 'E-Trekking',
    price: 4999,
    originalPrice: 5399,
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewsCount: 76,
    motor: 'Bosch Performance CX Smart System (85Nm)',
    torqueNm: 85,
    batteryStandardWh: 750,
    rangeKm: 160,
    weightKg: 27.2,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'SUV E-Bike der Extraklasse mit integriertem Bosch eBike ABS für maximale Bremssicherheit bei jedem Wetter.',
    description: 'Das Kalkhoff Entice 7+ Advance ABS ist das perfekte Crossover-Bike für Stadt, Schotter und Bergetappen. Dank des innovativen Bosch Antiblockiersystems (ABS) bleibt das Vorderrad auch bei abrupter Vollbremsung auf nassem Untergrund spurtreu, ohne wegzurutschen. Zugelassen für ein Systemgewicht von bis zu 170 kg.',
    options: {
      frameSizes: ['Diamant M (50cm)', 'Diamant L (55cm)', 'Trapez M (48cm)', 'Wave L (53cm)'],
      batteries: [
        { label: 'Bosch PowerTube 750 Wh', capacityWh: 750, priceDelta: 0 }
      ],
      colors: [
        { name: 'Crystal Gray Matt', hex: '#8E9196' },
        { name: 'Forest Green Metallic', hex: '#1C3F24' }
      ]
    },
    specs: {
      'Rahmen': 'Integrale 0.6 CX Aluminium, 170 kg max. Systemgewicht',
      'Bremssystem': 'Bosch eBike ABS Generation 2 mit Magura CMe ABS Bremsen',
      'Motor': 'Bosch Performance Line CX Smart System, 85 Nm',
      'Akku': 'Bosch PowerTube 750 Wh Li-Ion',
      'Schaltung': 'Shimano Deore XT 11-Gang Linkglide',
      'Bereifung': 'Schwalbe Smart Sam Plus, 57-622 mit Pannenschutz'
    },
    isFeatured: true
  },
  {
    id: 'prod-gazelle-ultimate-c380',
    slug: 'gazelle-ultimate-c380-hmb-belt',
    name: 'Gazelle Ultimate C380 HMB Belt Drive',
    brand: 'Gazelle',
    category: 'E-City',
    price: 4399,
    originalPrice: 4699,
    inStock: true,
    stockCount: 11,
    rating: 4.9,
    reviewsCount: 215,
    motor: 'Bosch Performance Line (75Nm)',
    torqueNm: 75,
    batteryStandardWh: 625,
    rangeKm: 145,
    weightKg: 25.6,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80'
    ],
    shortDescription: 'Lautloser Gates Riemenantrieb, stufenlose Enviolo-Nabenschaltung und niederländische Premium-Bequemlichkeit.',
    description: 'Kein Kettenschmieren, kein Rasseln: Das Gazelle Ultimate C380 HMB setzt auf den nahezu wartungsfreien Gates Carbon Drive CDX Zahnriemen in Kombination mit der stufenlosen Enviolo Trekking Nabenschaltung. Schalten unter Last oder im Stand geschieht butterweich per Drehgriff. Integrierte Federung im Steuerkopf und der Sattelstütze filtern Kopfsteinpflaster mühelos heraus.',
    options: {
      frameSizes: ['Wave 46 cm', 'Wave 53 cm', 'Wave 57 cm', 'Herren 53 cm', 'Herren 57 cm'],
      batteries: [
        { label: 'Bosch PowerTube 625 Wh', capacityWh: 625, priceDelta: 0 },
        { label: 'Bosch PowerTube 750 Wh Smart System', capacityWh: 750, priceDelta: 250 }
      ],
      colors: [
        { name: 'Petrol Blue Gloss', hex: '#164E63' },
        { name: 'Mallard Blue Matt', hex: '#264653' },
        { name: 'Ivory White', hex: '#FDFBF7' }
      ]
    },
    specs: {
      'Antrieb': 'Gates Carbon Drive CDX Zahnriemen',
      'Schaltung': 'Enviolo 380 Trekking, stufenlos 380% Übersetzungsbandbreite',
      'Motor': 'Bosch Performance Line Smart System (75 Nm)',
      'Bremsen': 'Shimano BR-MT420, 4-Kolben vorn / 2-Kolben hinten',
      'Gabel': 'Teleskop-Monoshock integriert im Steuerrohr, 40mm Federweg'
    },
    isFeatured: true
  },
  // Additional catalog bikes for Shop page pagination and filtering
  {
    id: 'prod-canyon-spectral-on',
    slug: 'canyon-spectral-on-cf-9-shimano-ep801',
    name: 'Canyon Spectral:ON CF 9 Shimano EP801',
    brand: 'Canyon',
    category: 'E-MTB',
    price: 6899,
    originalPrice: 7299,
    inStock: true,
    stockCount: 5,
    rating: 4.8,
    reviewsCount: 89,
    motor: 'Shimano Steps EP801 (85Nm)',
    torqueNm: 85,
    batteryStandardWh: 900,
    rangeKm: 170,
    weightKg: 22.8,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1200&q=80'],
    shortDescription: 'Leichter Carbon-Trail-Jäger mit gigantischem 900 Wh Akku und Shimano EP801 Aggregat.',
    description: 'Das Canyon Spectral:ON CF 9 vereint das verspielte Handling eines regulären Mountainbikes mit der schieren Ausdauer eines 900 Wh Kraftpakets. Der Vollcarbon-Rahmen drückt das Gesamtgewicht auf unter 23 kg. Shimano EP801 Antrieb bietet Free Shift und Auto Shift Kompatibilität.',
    options: {
      frameSizes: ['S', 'M', 'L', 'XL'],
      batteries: [
        { label: 'Canyon BT0002 900 Wh', capacityWh: 900, priceDelta: 0 }
      ],
      colors: [
        { name: 'Infrared Red', hex: '#B22222' },
        { name: 'Stealth Raw Carbon', hex: '#222222' }
      ]
    },
    specs: {
      'Rahmen': 'Canyon Spectral:ON CF Carbon, 155mm',
      'Gabel': 'FOX 36 Factory Grip2, 150mm, Kashima',
      'Motor': 'Shimano Steps EP801, 85 Nm, 600W Peak',
      'Schaltung': 'SRAM GX Eagle AXS Transmission T-Type, 12s',
      'Akku': 'Canyon Custom 900 Wh Slim'
    },
    isFeatured: false
  },
  {
    id: 'prod-riese-mueller-load-75',
    slug: 'riese-mueller-load-75-vario-cargo',
    name: 'Riese & Müller Load 75 Vario Cargo E-Bike',
    brand: 'Riese & Müller',
    category: 'Cargo-E-Bike',
    price: 8990,
    originalPrice: 9490,
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 64,
    motor: 'Bosch Cargo Line Smart System (85Nm)',
    torqueNm: 85,
    batteryStandardWh: 1000,
    rangeKm: 150,
    weightKg: 36.8,
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80'],
    shortDescription: 'Vollgefedertes Lasten-E-Bike für bis zu 3 Kinder oder 100 kg Zuladung mit Control Technology.',
    description: 'Das Riese & Müller Load 75 ist das Flaggschiff moderner urbaner Familien- und Gewerbemobilität. Die Vollfederung (Control Technology) sorgt dafür, dass selbst schwere Fracht und Kinder butterweich und sicher über jedes Kopfsteinpflaster gleiten.',
    options: {
      frameSizes: ['Universal Einheitsgröße (verstellbarer Vorbau & Sattel)'],
      batteries: [
        { label: 'DualBattery 1000 Wh (2x 500 Wh)', capacityWh: 1000, priceDelta: 0 },
        { label: 'DualBattery 1450 Wh (725 Wh + 725 Wh)', capacityWh: 1450, priceDelta: 699 }
      ],
      colors: [
        { name: 'Coal Gray Matt', hex: '#374151' },
        { name: 'Peanut Matt', hex: '#92400E' }
      ]
    },
    specs: {
      'Zuladung Ladefläche': 'Bis zu 100 kg Fracht oder 3 Kindersitze mit 5-Punkt-Gurten',
      'Motor': 'Bosch Cargo Line Gen 4 Smart System (85 Nm, bis zu 400% Unterstützung)',
      'Federung': 'Vollfederung: Suntour Mobie A32 vorn / X-Fusion Glyde Dämpfer hinten',
      'Antrieb': 'Gates CDX Riemen mit stufenloser Enviolo 380 Nabenschaltung'
    },
    isFeatured: false
  },
  {
    id: 'prod-cube-kathmandu-hybrid',
    slug: 'cube-kathmandu-hybrid-slt-750',
    name: 'Cube Kathmandu Hybrid SLT 750',
    brand: 'Cube',
    category: 'E-Trekking',
    price: 4599,
    originalPrice: 4899,
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 167,
    motor: 'Bosch Performance CX Smart System (85Nm)',
    torqueNm: 85,
    batteryStandardWh: 750,
    rangeKm: 165,
    weightKg: 25.4,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1200&q=80'],
    shortDescription: 'Das Premium Touren-E-Bike mit integriertem Gepäckträger 3.0 und Shimano XT 12-fach Schaltung.',
    description: 'Für Weltenbummler und Pendler: Das Cube Kathmandu Hybrid SLT 750 verfügt über den elegant in den Rahmen geschweißten Integrated Carrier 3.0, der Packtaschen vibrationsfrei aufnimmt. Die RockShox Recon Gold Luftfedergabel dämpft jede Bodenwelle souverän ab.',
    options: {
      frameSizes: ['Men S (50cm)', 'Men M (54cm)', 'Men L (58cm)', 'Trapez M (50cm)', 'Easy Entry L (54cm)'],
      batteries: [
        { label: 'Bosch PowerTube 750 Wh', capacityWh: 750, priceDelta: 0 }
      ],
      colors: [
        { name: 'Prizm Blue / Black', hex: '#1E3A8A' },
        { name: 'Polarsilver / Black', hex: '#94A3B8' }
      ]
    },
    specs: {
      'Rahmen': 'Aluminium Superlite, Gravity Casting Technology',
      'Gabel': 'RockShox Recon Gold RL Air, 100mm, Lockout',
      'Schaltung': 'Shimano XT RD-M8100-SGS, ShadowPlus, 12-Speed',
      'Motor': 'Bosch Drive Unit Performance CX Gen 4 (85Nm)'
    },
    isFeatured: false
  },
  {
    id: 'prod-specialized-turbo-vado-5',
    slug: 'specialized-turbo-vado-50-speed-pedelec',
    name: 'Specialized Turbo Vado 5.0 IGH Speed-Pedelec',
    brand: 'Specialized',
    category: 'Speed-Pedelec',
    price: 5899,
    originalPrice: 6399,
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 52,
    motor: 'Specialized 2.2 Motor (90Nm) bis 45 km/h',
    torqueNm: 90,
    batteryStandardWh: 710,
    rangeKm: 130,
    weightKg: 25.2,
    image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80'],
    shortDescription: '45 km/h Speed-Pedelec mit automatischer Enviolo AutomatiQ Schaltung und Garmin Radar System.',
    description: 'Schneller als der Berufsverkehr: Das Specialized Turbo Vado 5.0 unterstützt legal bis zu 45 km/h (S-Pedelec Zulassung). Mit integriertem Garmin Varia Radar wirst du gewarnt, wenn sich Fahrzeuge von hinten nähern. Die elektronische Enviolo AutomatiQ Nabenschaltung wählt stets die perfekte Trittfrequenz.',
    options: {
      frameSizes: ['S', 'M', 'L', 'XL'],
      batteries: [
        { label: 'Specialized U2-710 Wh Integriert', capacityWh: 710, priceDelta: 0 }
      ],
      colors: [
        { name: 'Red Tint / Silver', hex: '#7F1D1D' },
        { name: 'Cast Black Reflective', hex: '#111827' }
      ]
    },
    specs: {
      'Klasse': 'L1e-B Speed-Pedelec (bis 45 km/h, versicherungspflichtig)',
      'Radar': 'Integriertes Garmin Radar mit haptischer & akustischer Warnung',
      'Schaltung': 'Enviolo AutomatiQ stufenlose Automatikschaltung',
      'Riemen': 'Gates Carbon Drive CDX'
    },
    isFeatured: false
  }
];

// Catalogue products first, then the products carried over from the former site.
export const PRODUCTS: Product[] = [...CATALOG_PRODUCTS, ...TENWAYS_PRODUCTS, ...UNIVERSAL_PRODUCTS, ...TEMPLATE_PRODUCTS];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured).slice(0, 6);
