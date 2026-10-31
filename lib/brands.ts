export interface BrandItem {
  id: string;
  name: string;
  country: string;
  specialty: string;
  badge: string;
}

export const TOP_BRANDS: BrandItem[] = [
  {
    id: 'bosch',
    name: 'Bosch eBike Systems',
    country: 'Deutschland',
    specialty: 'Smart System & Performance CX 85Nm',
    badge: 'Offizieller Service-Stützpunkt'
  },
  {
    id: 'shimano',
    name: 'Shimano STEPS',
    country: 'Japan',
    specialty: 'EP801 & Di2 Elektronikschaltung',
    badge: 'Zertifizierter Partner'
  },
  {
    id: 'cube',
    name: 'Cube Bikes',
    country: 'Deutschland (Waldershof)',
    specialty: 'Stereo Hybrid & Carbon Enduro',
    badge: 'Premium Flagship Dealer'
  },
  {
    id: 'specialized',
    name: 'Specialized',
    country: 'USA / Schweiz',
    specialty: 'Turbo Levo, Kenevo & Vado',
    badge: 'Elite Partner Store'
  },
  {
    id: 'riese-mueller',
    name: 'Riese & Müller',
    country: 'Deutschland (Mühltal)',
    specialty: 'DualBattery Touren & Cargo E-Bikes',
    badge: 'Exklusiv-Vertretung'
  },
  {
    id: 'haibike',
    name: 'Haibike',
    country: 'Deutschland (Schweinfurt)',
    specialty: 'Pioniere des E-Mountainbikens',
    badge: 'Pro Dealer'
  },
  {
    id: 'canyon',
    name: 'Canyon',
    country: 'Deutschland (Koblenz)',
    specialty: 'Spectral:ON & Strive:ON Pure Performance',
    badge: 'Autorisierter Händler'
  },
  {
    id: 'kalkhoff',
    name: 'Kalkhoff',
    country: 'Deutschland (Cloppenburg)',
    specialty: 'SUV E-Bikes mit ABS & 170kg Tragkraft',
    badge: 'Plus Partner'
  },
  {
    id: 'gazelle',
    name: 'Gazelle',
    country: 'Niederlande (Dieren)',
    specialty: 'Koninklijke Riemen- & Stadtrad-Perfektion',
    badge: 'Königlicher Hoflieferant'
  }
];
