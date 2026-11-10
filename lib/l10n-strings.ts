import type { Locale } from '@/lib/i18n';
import type { Product } from '@/lib/types';

// Copy of the translated category, brand and accessory pages. Every sentence is built from catalogue data (counts, prices, motors, batteries)
// or from shop terms the owner confirmed (delivery by freight with lift gate, 2 years warranty, 30 days returns). No VAT rate is named.
export interface L10nStrings {
  intl: string;
  home: string;
  eyebrow: Record<'category' | 'brand' | 'accessory', string>;
  models: Record<'category' | 'brand' | 'accessory', string>;
  noModels: string;
  seeAll: string;
  moreCategories: string;
  topicsH2: (name: string) => string;
  topicsIntro: string;
  faqH2: (name: string) => string;
  intro: (h1: string, n: number, name: string) => string;
  categoryTag: Record<string, string>;
  notes: Record<string, string>;
  motorHubLinks: string;
  facts: (ctx: Ctx) => string[];
  faq: (ctx: Ctx) => { q: string; a: string }[];
}
export interface Ctx { n: number; min: number; max: number; avg: number; whText: string; motors: string[]; brands: string[]; cheapest: Product; fmt: (n: number) => string }

const uniq = <T,>(a: T[]) => [...new Set(a)];

const FR: L10nStrings = {
  intl: 'fr-FR',
  home: 'Accueil',
  eyebrow: { category: 'Catégorie', brand: 'Marque', accessory: 'Accessoires' },
  models: { category: 'Modèles disponibles', brand: 'Modèles disponibles', accessory: 'Articles disponibles' },
  noModels: 'Aucun modèle n’est listé dans cette catégorie pour le moment.',
  seeAll: 'Voir toute la gamme dans la boutique',
  moreCategories: 'Autres catégories',
  topicsH2: (name) => `À quoi les acheteurs font attention : ${name}`,
  topicsIntro: 'Ces thèmes reviennent le plus souvent dans les recherches des clients pour cette catégorie. Chacun s’appuie sur les données réelles des modèles listés ci-dessus.',
  faqH2: (name) => `Questions fréquentes : ${name}`,
  intro: (h1, n, name) => `${h1} : la boutique propose ${n === 1 ? 'le modèle disponible' : `les ${n} modèles disponibles`} de la catégorie ${name}, avec prix, moteur et capacité de batterie en un coup d’œil. Comparez les équipements et commandez votre vélo électrique en ligne, avec livraison par transporteur à l’adresse de votre choix.`,
  categoryTag: { 'E-MTB': 'VTT électrique', 'E-Trekking': 'Vélo trekking électrique', 'E-City': 'Vélo de ville électrique', 'Speed-Pedelec': 'Speed pedelec', 'Cargo-E-Bike': 'Vélo cargo électrique', 'Falt-E-Bike': 'Vélo pliant électrique', 'E-Gravel': 'Vélo gravel électrique', 'E-Kinder': 'Vélo électrique enfant' },
  notes: {
    '/e-bikes/damen': 'Cette liste réunit les modèles dont le nom, le cadre ou la fiche technique indique un cadre bas ou une forme de cadre pour femme (par exemple Wave, Low, Easy Entry ou Trapez).',
    '/e-bikes/herren': 'Cette liste réunit les modèles dont le nom, le cadre ou la fiche technique indique un cadre diamant ou un cadre homme.',
    '/e-bikes/motor-antrieb': 'Une sélection de modèles avec leur moteur. Retrouvez tous les modèles par fabricant de moteur sur les pages Bosch, Shimano et Yamaha.',
  },
  motorHubLinks: 'Bosch, Shimano, Yamaha',
  facts: (c) => [
    `La boutique propose ${c.n} ${c.n === 1 ? 'modèle' : 'modèles'} dans cette catégorie, des marques ${c.brands.slice(0, 5).join(', ')}.`,
    `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}, avec un prix moyen de ${c.fmt(c.avg)}.`,
    c.whText ? `Les batteries ont une capacité de ${c.whText}.` : 'La capacité de la batterie figure dans la fiche technique de chaque modèle.',
    c.motors.length ? `Les moteurs montés sont : ${c.motors.join(', ')}.` : 'Le moteur figure dans la fiche technique de chaque modèle.',
    'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Garantie de 2 ans et droit de retour de 30 jours.',
  ],
  faq: (c) => [
    { q: 'Quels modèles sont disponibles dans cette catégorie ?', a: `La boutique propose ${c.n} ${c.n === 1 ? 'modèle' : 'modèles'}, des marques ${c.brands.slice(0, 8).join(', ')}${c.brands.length > 8 ? ' et d’autres' : ''}.` },
    { q: 'Combien coûtent les modèles ?', a: `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}, avec un prix moyen de ${c.fmt(c.avg)}. Le modèle le moins cher est le ${c.cheapest.name} à ${c.fmt(c.cheapest.price)}.` },
    { q: 'Quels moteurs sont montés ?', a: c.motors.length ? `Les moteurs montés sont : ${c.motors.join(', ')}.` : 'Le moteur figure dans la fiche technique de chaque modèle.' },
    { q: 'Quelle est la capacité des batteries ?', a: c.whText ? `Les batteries ont une capacité de ${c.whText}.` : 'La capacité de la batterie figure dans la fiche technique de chaque modèle.' },
    { q: 'Comment les modèles sont-ils livrés ?', a: 'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Jusqu’à 10 000 € de commande, un forfait transport de 49 € s’ajoute ; au-delà, la livraison est gratuite. Garantie de 2 ans et droit de retour de 30 jours.' },
  ],
};

export const L10N: Partial<Record<Locale, L10nStrings>> = { fr: FR };

export function buildCtx(products: Product[], fmt: (n: number) => string): Ctx {
  const prices = products.map((p) => p.price);
  const whs = products.map((p) => p.batteryStandardWh).filter((w) => w > 0);
  const motorShort = (p: Product) => p.motor.replace(/Mittelmotor\s*/i, '').replace(/\s*\d+\s*Watt.*$/i, '').replace(/\s+/g, ' ').trim() || p.motor;
  return {
    n: products.length,
    min: Math.min(...prices), max: Math.max(...prices), avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    whText: whs.length ? (Math.min(...whs) === Math.max(...whs) ? `${Math.min(...whs)} Wh` : `${Math.min(...whs)} à ${Math.max(...whs)} Wh`) : '',
    motors: uniq(products.map(motorShort)).slice(0, 4),
    brands: uniq(products.map((p) => p.brand)),
    cheapest: products.slice().sort((a, b) => a.price - b.price)[0],
    fmt,
  };
}

/** French sentence case for a keyword: first letter capital, the rest unchanged. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
