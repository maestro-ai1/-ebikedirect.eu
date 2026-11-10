import type { Locale } from '@/lib/i18n';
import type { Product } from '@/lib/types';

// Copy of the translated category, brand and accessory pages. Every sentence is built from catalogue data (counts, prices, motors, batteries)
// or from shop terms the owner confirmed (delivery by freight with lift gate, 2 years warranty, 30 days returns). No VAT rate is named.
export type PageKind = 'category' | 'brand' | 'accessory';

export interface Ctx { n: number; min: number; max: number; avg: number; whText: string; motors: string[]; brands: string[]; cheapest: Product; priciest: Product; fmt: (n: number) => string }

export interface L10nStrings {
  intl: string;
  home: string;
  eyebrow: Record<PageKind, string>;
  models: Record<PageKind, string>;
  noModels: string;
  seeAll: string;
  moreCategories: Record<PageKind, string>;
  topicsH2: (name: string) => string;
  topicsIntro: string;
  faqH2: (name: string) => string;
  intro: (kind: PageKind, h1: string, n: number, name: string) => string;
  categoryTag: Record<string, string>;
  notes: Record<string, string>;
  facts: (kind: PageKind, ctx: Ctx, name: string) => string[];
  faq: (kind: PageKind, ctx: Ctx, name: string) => { q: string; a: string }[];
}

const uniq = <T,>(a: T[]) => [...new Set(a)];
const list = (a: string[], and: string) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} ${and} ${a[a.length - 1]}`);

const FR_DELIVERY = 'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Jusqu’à 10 000 € de commande, un forfait transport de 49 € s’ajoute ; au-delà, la livraison est gratuite. Garantie de 2 ans et droit de retour de 30 jours.';

const FR: L10nStrings = {
  intl: 'fr-FR',
  home: 'Accueil',
  eyebrow: { category: 'Catégorie', brand: 'Marque', accessory: 'Accessoires' },
  models: { category: 'Modèles disponibles', brand: 'Modèles disponibles', accessory: 'Articles disponibles' },
  noModels: 'Aucun modèle n’est listé pour le moment.',
  seeAll: 'Voir toute la gamme dans la boutique',
  moreCategories: { category: 'Autres catégories', brand: 'Autres marques', accessory: 'Autres accessoires' },
  topicsH2: (name) => `À quoi les acheteurs font attention : ${name}`,
  topicsIntro: 'Ces thèmes reviennent le plus souvent dans les recherches des clients. Chacun s’appuie sur les données réelles des articles listés ci-dessus.',
  faqH2: (name) => `Questions fréquentes : ${name}`,
  intro: (kind, h1, n, name) => {
    if (kind === 'accessory') return `${h1} : la boutique propose ${n === 1 ? 'l’article disponible' : `les ${n} articles disponibles`} de la rubrique ${name}, avec le prix et la mention des vélos compatibles. Commandez vos accessoires pour vélo électrique directement en ligne.`;
    if (kind === 'brand') return `${h1} : la boutique propose ${n === 1 ? 'le modèle disponible' : `les ${n} modèles disponibles`} ${name}, avec prix, moteur et capacité de batterie en un coup d’œil. Comparez les équipements et commandez en ligne, avec livraison par transporteur à l’adresse de votre choix.`;
    return `${h1} : la boutique propose ${n === 1 ? 'le modèle disponible' : `les ${n} modèles disponibles`} de la catégorie ${name}, avec prix, moteur et capacité de batterie en un coup d’œil. Comparez les équipements et commandez votre vélo électrique en ligne, avec livraison par transporteur à l’adresse de votre choix.`;
  },
  categoryTag: { 'E-MTB': 'VTT électrique', 'E-Trekking': 'Vélo trekking électrique', 'E-City': 'Vélo de ville électrique', 'Speed-Pedelec': 'Speed pedelec', 'Cargo-E-Bike': 'Vélo cargo électrique', 'Falt-E-Bike': 'Vélo pliant électrique', 'E-Gravel': 'Vélo gravel électrique', 'E-Kinder': 'Vélo électrique enfant' },
  notes: {
    '/e-bikes/damen': 'Cette liste réunit les modèles dont le nom, le cadre ou la fiche technique indique un cadre bas ou une forme de cadre pour femme (par exemple Wave, Low, Easy Entry ou Trapez).',
    '/e-bikes/herren': 'Cette liste réunit les modèles dont le nom, le cadre ou la fiche technique indique un cadre diamant ou un cadre homme.',
    '/e-bikes/motor-antrieb': 'Une sélection de modèles avec leur moteur. Retrouvez tous les modèles par fabricant de moteur sur les pages Bosch, Shimano et Yamaha.',
  },
  facts: (kind, c, name) => {
    const items = kind === 'accessory' ? 'article' : 'modèle';
    const delivery = 'La livraison se fait par transporteur sur rendez-vous. Garantie de 2 ans et droit de retour de 30 jours.';
    if (kind === 'accessory') {
      return [
        `La boutique propose ${c.n} ${c.n === 1 ? 'article' : 'articles'} dans la rubrique ${name}.`,
        `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}.`,
        `Les articles viennent des marques ${list(c.brands.slice(0, 5), 'et')}.`,
        `L’article le moins cher est le ${c.cheapest.name}, à ${c.fmt(c.cheapest.price)}.`,
        delivery,
      ];
    }
    return [
      `La boutique propose ${c.n} ${c.n === 1 ? items : 'modèles'} ${kind === 'brand' ? name : 'dans cette catégorie'}${c.brands.length > 1 ? `, des marques ${list(c.brands.slice(0, 5), 'et')}` : ''}.`,
      `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}, avec un prix moyen de ${c.fmt(c.avg)}.`,
      c.whText ? `Les batteries ont une capacité de ${c.whText}.` : 'La capacité de la batterie figure dans la fiche technique de chaque modèle.',
      c.motors.length ? `Les moteurs montés sont : ${c.motors.join(', ')}.` : 'Le moteur figure dans la fiche technique de chaque modèle.',
      'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Garantie de 2 ans et droit de retour de 30 jours.',
    ];
  },
  faq: (kind, c, name) => {
    if (kind === 'accessory') {
      return [
        { q: 'Quels articles sont disponibles ?', a: `La boutique propose ${c.n} ${c.n === 1 ? 'article' : 'articles'} de la rubrique ${name}, des marques ${list(c.brands.slice(0, 6), 'et')}.` },
        { q: 'Combien coûtent les articles ?', a: `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}.` },
        { q: 'De quelles marques sont les articles ?', a: `Les articles listés viennent des marques ${list(c.brands, 'et')}.` },
        { q: 'Quel est l’article le moins cher ?', a: `Le moins cher est le ${c.cheapest.name} de ${c.cheapest.brand}, à ${c.fmt(c.cheapest.price)}.` },
        { q: 'Quel est l’article le plus cher ?', a: `Le plus cher est le ${c.priciest.name} de ${c.priciest.brand}, à ${c.fmt(c.priciest.price)}.` },
      ];
    }
    const which = kind === 'brand' ? `Quels modèles ${name} sont disponibles ?` : 'Quels modèles sont disponibles dans cette catégorie ?';
    return [
      { q: which, a: `La boutique propose ${c.n} ${c.n === 1 ? 'modèle' : 'modèles'}${kind === 'brand' ? '' : `, des marques ${list(c.brands.slice(0, 8), 'et')}${c.brands.length > 8 ? ' et d’autres' : ''}`}.` },
      { q: 'Combien coûtent les modèles ?', a: `Les prix vont de ${c.fmt(c.min)} à ${c.fmt(c.max)}, avec un prix moyen de ${c.fmt(c.avg)}. Le modèle le moins cher est le ${c.cheapest.name} à ${c.fmt(c.cheapest.price)}.` },
      { q: 'Quels moteurs sont montés ?', a: c.motors.length ? `Les moteurs montés sont : ${c.motors.join(', ')}.` : 'Le moteur figure dans la fiche technique de chaque modèle.' },
      { q: 'Quelle est la capacité des batteries ?', a: c.whText ? `Les batteries ont une capacité de ${c.whText}.` : 'La capacité de la batterie figure dans la fiche technique de chaque modèle.' },
      { q: 'Comment les modèles sont-ils livrés ?', a: FR_DELIVERY },
    ];
  },
};

export const L10N: Partial<Record<Locale, L10nStrings>> = { fr: FR };

export function buildCtx(products: Product[], fmt: (n: number) => string): Ctx {
  const prices = products.map((p) => p.price);
  const whs = products.map((p) => p.batteryStandardWh).filter((w) => w > 0);
  const motorShort = (p: Product) => p.motor.replace(/Mittelmotor\s*/i, '').replace(/\s*\d+\s*Watt.*$/i, '').replace(/\s+/g, ' ').trim() || p.motor;
  const byPrice = products.slice().sort((a, b) => a.price - b.price);
  return {
    n: products.length,
    min: Math.min(...prices), max: Math.max(...prices), avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    whText: whs.length ? (Math.min(...whs) === Math.max(...whs) ? `${Math.min(...whs)} Wh` : `${Math.min(...whs)} à ${Math.max(...whs)} Wh`) : '',
    motors: uniq(products.map(motorShort)).slice(0, 4),
    brands: uniq(products.map((p) => p.brand)),
    cheapest: byPrice[0], priciest: byPrice[byPrice.length - 1],
    fmt,
  };
}

/** French sentence case for a keyword: first letter capital, the rest unchanged. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Meta description (110 to 158 characters) with the page's main keyword and a call to action, by page kind. */
export function l10nDescription(locale: Locale, kind: PageKind, display: string, name: string): string {
  if (locale !== 'fr') return '';
  const tails: Record<PageKind, string[]> = {
    category: [
      `${display} : modèles avec prix, moteur et batterie. Comparez les équipements et commandez en ligne, livraison par transporteur, garantie de 2 ans.`,
      `${display} : comparez les modèles avec prix, moteur et batterie. Commandez en ligne, garantie de 2 ans et retour sous 30 jours.`,
    ],
    brand: [
      `${display} : modèles ${name} avec prix, moteur et batterie. Comparez et commandez en ligne, livraison par transporteur, garantie de 2 ans.`,
      `${display} : découvrez les modèles ${name} avec prix et équipement. Commandez en ligne, garantie de 2 ans, retour sous 30 jours.`,
    ],
    accessory: [
      `${display} : ${name} pour vélo électrique avec prix et compatibilité. Commandez en ligne, garantie de 2 ans et retour sous 30 jours.`,
      `${display} : accessoires pour vélo électrique avec prix. Commandez en ligne, garantie de 2 ans, retour sous 30 jours.`,
    ],
  };
  const ok = tails[kind].find((t) => t.length >= 110 && t.length <= 158);
  if (ok) return ok;
  let t = tails[kind][0];
  if (t.length > 158) t = t.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (t.length < 110) t += ' Livraison par transporteur dans toute l’Europe.';
  return t;
}
