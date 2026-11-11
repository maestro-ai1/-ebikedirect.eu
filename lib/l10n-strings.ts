import type { Locale } from '@/lib/i18n';
import type { Product } from '@/lib/types';

// Copy of the translated category, brand and accessory pages. Every sentence is built from catalogue data (counts, prices, motors, batteries)
// or from shop terms the owner confirmed (delivery by freight with lift gate, 2 years warranty, 30 days returns). No VAT wording.
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
  hub: {
    intro: (display: string, n: number) => string;
    allH2: string;
    models: (n: number) => string;
    facts: (h: HubCtx) => string[];
    faq: (h: HubCtx) => { q: string; a: string }[];
  };
}
export interface HubCtx { brands: string[]; total: number; top?: { name: string; n: number }; min: number; max: number; fmt: (n: number) => string }

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
  hub: {
    intro: (d, n) => `${d} : voici les ${n} marques et fabricants de moteurs de la boutique, avec le nombre de modèles disponibles pour chacun. Cliquez sur une marque pour comparer ses modèles, leurs prix, moteurs et batteries.`,
    allH2: 'Toutes les marques',
    models: (n) => `${n} ${n === 1 ? 'modèle' : 'modèles'}`,
    facts: (h) => [
      `La boutique présente ${h.brands.length} marques et fabricants de moteurs, avec ${h.total} modèles au total.`,
      h.top ? `La marque qui propose le plus de modèles est ${h.top.name}, avec ${h.top.n} modèles.` : '',
      `Les prix des vélos électriques vont de ${h.fmt(h.min)} à ${h.fmt(h.max)}.`,
      'Les pages Bosch, Shimano et Yamaha réunissent les modèles par fabricant de moteur.',
      'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Garantie de 2 ans et droit de retour de 30 jours.',
    ],
    faq: (h) => [
      { q: 'Quelles marques de vélos électriques proposez-vous ?', a: `Nous proposons ${h.brands.length} marques et fabricants de moteurs, notamment ${h.brands.slice(0, 8).join(', ')}.` },
      { q: 'Quelle marque propose le plus de modèles ?', a: h.top ? `${h.top.name}, avec ${h.top.n} modèles disponibles.` : '' },
      { q: 'Quels fabricants de moteurs trouve-t-on ici ?', a: 'Les modèles sont regroupés sur les pages Bosch, Shimano et Yamaha selon le moteur monté.' },
      { q: 'Combien coûtent les vélos électriques ?', a: `Les prix vont de ${h.fmt(h.min)} à ${h.fmt(h.max)}.` },
      { q: 'Comment les vélos sont-ils livrés ?', a: 'La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous. Garantie de 2 ans et droit de retour de 30 jours.' },
    ],
  },
};

const EN_DELIVERY = 'Delivery is by freight carrier with a lift gate, by appointment. Below an order value of 10,000 € a flat freight charge of 49 € is added; above that, delivery is free. 2-year warranty and 30-day returns.';

const EN: L10nStrings = {
  intl: 'en-IE',
  home: 'Home',
  eyebrow: { category: 'Category', brand: 'Brand', accessory: 'Accessories' },
  models: { category: 'Models in stock', brand: 'Models in stock', accessory: 'Items in stock' },
  noModels: 'No models are listed at the moment.',
  seeAll: 'See the full range in the shop',
  moreCategories: { category: 'More categories', brand: 'More brands', accessory: 'More accessories' },
  topicsH2: (name) => `What buyers look at: ${name}`,
  topicsIntro: 'These topics come up most often in what customers search for. Each one is based on the real data of the items listed above.',
  faqH2: (name) => `Frequently asked questions: ${name}`,
  intro: (kind, h1, n, name) => {
    if (kind === 'accessory') return `${h1}: the shop offers ${n === 1 ? 'the available item' : `the ${n} available items`} in the ${name} range, with the price and the bikes each item fits. Order your e-bike accessories online.`;
    if (kind === 'brand') return `${h1}: the shop offers ${n === 1 ? 'the available model' : `the ${n} available models`} from ${name}, with price, motor and battery capacity at a glance. Compare the equipment and order online, delivered by freight carrier to the address of your choice.`;
    return `${h1}: the shop offers ${n === 1 ? 'the available model' : `the ${n} available models`} in the ${name} category, with price, motor and battery capacity at a glance. Compare the equipment and order your electric bike online, delivered by freight carrier to the address of your choice.`;
  },
  categoryTag: { 'E-MTB': 'Electric mountain bike', 'E-Trekking': 'Electric trekking bike', 'E-City': 'Electric city bike', 'Speed-Pedelec': 'Speed pedelec', 'Cargo-E-Bike': 'Electric cargo bike', 'Falt-E-Bike': 'Electric folding bike', 'E-Gravel': 'Electric gravel bike', 'E-Kinder': 'Kids electric bike' },
  notes: {
    '/e-bikes/damen': 'This list gathers the models whose name, frame or spec sheet shows a step-through or women’s frame shape (for example Wave, Low, Easy Entry or Trapeze).',
    '/e-bikes/herren': 'This list gathers the models whose name, frame or spec sheet shows a diamond frame or a men’s frame.',
    '/e-bikes/motor-antrieb': 'A selection of models with their motors. Find all models by motor maker on the Bosch, Shimano and Yamaha pages.',
  },
  facts: (kind, c, name) => {
    const delivery = 'Delivery is by freight carrier, by appointment. 2-year warranty and 30-day returns.';
    if (kind === 'accessory') {
      return [
        `The shop offers ${c.n} ${c.n === 1 ? 'item' : 'items'} in the ${name} range.`,
        `Prices range from ${c.fmt(c.min)} to ${c.fmt(c.max)}.`,
        `The items come from the brands ${list(c.brands.slice(0, 5), 'and')}.`,
        `The cheapest item is the ${c.cheapest.name}, at ${c.fmt(c.cheapest.price)}.`,
        delivery,
      ];
    }
    return [
      `The shop offers ${c.n} ${c.n === 1 ? 'model' : 'models'}${kind === 'brand' ? ` from ${name}` : ' in this category'}${c.brands.length > 1 ? `, from the brands ${list(c.brands.slice(0, 5), 'and')}` : ''}.`,
      `Prices range from ${c.fmt(c.min)} to ${c.fmt(c.max)}, with an average price of ${c.fmt(c.avg)}.`,
      c.whText ? `Battery capacity is ${c.whText}.` : 'The battery capacity is shown in the spec sheet of each model.',
      c.motors.length ? `The motors fitted are: ${c.motors.join(', ')}.` : 'The motor is shown in the spec sheet of each model.',
      'Delivery is by freight carrier with a lift gate, by appointment. 2-year warranty and 30-day returns.',
    ];
  },
  faq: (kind, c, name) => {
    if (kind === 'accessory') {
      return [
        { q: 'Which items are available?', a: `The shop offers ${c.n} ${c.n === 1 ? 'item' : 'items'} in the ${name} range, from the brands ${list(c.brands.slice(0, 6), 'and')}.` },
        { q: 'How much do the items cost?', a: `Prices range from ${c.fmt(c.min)} to ${c.fmt(c.max)}.` },
        { q: 'Which brands are the items from?', a: `The listed items come from the brands ${list(c.brands, 'and')}.` },
        { q: 'What is the cheapest item?', a: `The cheapest is the ${c.cheapest.name} from ${c.cheapest.brand}, at ${c.fmt(c.cheapest.price)}.` },
        { q: 'What is the most expensive item?', a: `The most expensive is the ${c.priciest.name} from ${c.priciest.brand}, at ${c.fmt(c.priciest.price)}.` },
      ];
    }
    const which = kind === 'brand' ? `Which ${name} models are available?` : 'Which models are available in this category?';
    return [
      { q: which, a: `The shop offers ${c.n} ${c.n === 1 ? 'model' : 'models'}${kind === 'brand' ? '' : `, from the brands ${list(c.brands.slice(0, 8), 'and')}${c.brands.length > 8 ? ' and others' : ''}`}.` },
      { q: 'How much do the models cost?', a: `Prices range from ${c.fmt(c.min)} to ${c.fmt(c.max)}, with an average price of ${c.fmt(c.avg)}. The cheapest model is the ${c.cheapest.name} at ${c.fmt(c.cheapest.price)}.` },
      { q: 'Which motors are fitted?', a: c.motors.length ? `The motors fitted are: ${c.motors.join(', ')}.` : 'The motor is shown in the spec sheet of each model.' },
      { q: 'What is the battery capacity?', a: c.whText ? `Battery capacity is ${c.whText}.` : 'The battery capacity is shown in the spec sheet of each model.' },
      { q: 'How are the bikes delivered?', a: EN_DELIVERY },
    ];
  },
  hub: {
    intro: (d, n) => `${d}: here are the ${n} brands and motor makers in the shop, with the number of models available for each. Click a brand to compare its models, prices, motors and batteries.`,
    allH2: 'All brands',
    models: (n) => `${n} ${n === 1 ? 'model' : 'models'}`,
    facts: (h) => [
      `The shop lists ${h.brands.length} brands and motor makers, with ${h.total} models in total.`,
      h.top ? `The brand with the most models is ${h.top.name}, with ${h.top.n} models.` : '',
      `Electric bike prices range from ${h.fmt(h.min)} to ${h.fmt(h.max)}.`,
      'The Bosch, Shimano and Yamaha pages gather the models by motor maker.',
      'Delivery is by freight carrier with a lift gate, by appointment. 2-year warranty and 30-day returns.',
    ],
    faq: (h) => [
      { q: 'Which electric bike brands do you offer?', a: `We offer ${h.brands.length} brands and motor makers, including ${h.brands.slice(0, 8).join(', ')}.` },
      { q: 'Which brand has the most models?', a: h.top ? `${h.top.name}, with ${h.top.n} models available.` : '' },
      { q: 'Which motor makers can I find here?', a: 'The models are grouped on the Bosch, Shimano and Yamaha pages by the motor fitted.' },
      { q: 'How much do electric bikes cost?', a: `Prices range from ${h.fmt(h.min)} to ${h.fmt(h.max)}.` },
      { q: 'How are the bikes delivered?', a: EN_DELIVERY },
    ],
  },
};

export const L10N: Partial<Record<Locale, L10nStrings>> = { fr: FR, en: EN };

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
export function l10nDescription(locale: Locale, kind0: PageKind | 'hub', display: string, name: string): string {
  if (locale === 'en') return enDescription(kind0, display, name);
  if (locale !== 'fr') return '';
  if (kind0 === 'hub') return `${display} : toutes les marques de vélos électriques de la boutique avec le nombre de modèles. Comparez et commandez en ligne, garantie de 2 ans.`;
  const kind: PageKind = kind0;
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

function enDescription(kind0: PageKind | 'hub', display: string, name: string): string {
  if (kind0 === 'hub') return `${display}: all the electric bike brands in the shop with the number of models for each. Compare and order online, 2-year warranty.`;
  const kind: PageKind = kind0;
  const tails: Record<PageKind, string[]> = {
    category: [
      `${display}: models with price, motor and battery. Compare the equipment and order online, delivery by freight carrier, 2-year warranty.`,
      `${display}: compare models with price, motor and battery. Order online, 2-year warranty and 30-day returns.`,
    ],
    brand: [
      `${display}: ${name} models with price, motor and battery. Compare and order online, delivery by freight carrier, 2-year warranty.`,
      `${display}: see the ${name} models with price and equipment. Order online, 2-year warranty, 30-day returns.`,
    ],
    accessory: [
      `${display}: ${name} for electric bikes with price and fit. Order online, 2-year warranty and 30-day returns.`,
      `${display}: accessories for electric bikes with price. Order online, 2-year warranty, 30-day returns.`,
    ],
  };
  const ok = tails[kind].find((t) => t.length >= 110 && t.length <= 158);
  if (ok) return ok;
  let t = tails[kind][0];
  if (t.length > 158) t = t.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (t.length < 110) t += ' Delivery by freight carrier across Europe.';
  return t;
}
