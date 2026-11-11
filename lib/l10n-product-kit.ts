import type { Product } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { buildFrContent, frRelated, frEntry, frH1, frTitle, frDescription, FR_CATEGORY_LABEL } from '@/lib/l10n-product';
import { localName } from '@/lib/l10n-names';
import { buildEnContent, enRelated, enEntry, enH1, enTitle, enDescription, EN_CATEGORY_LABEL } from '@/lib/l10n-product-en';

// One kit per product language: the page code asks the kit for title, description, copy and labels, so a new language is one new file plus a row here.
export interface ProductKit {
  intl: string;
  build: (p: Product) => { lead: string; sections: { h2: string; blocks: { h3?: string; text: string }[] }[]; faqs: { q: string; a: string }[]; words: number; specs: [string, string][] };
  related: (p: Product) => Product[];
  entry: (p: Product) => { primary: { keyword: string; source: string } };
  h1: (p: Product) => string;
  title: (p: Product) => string;
  description: (p: Product) => string;
  categoryLabel: Record<string, string>;
  ui: {
    shop: string; faqH2: (name: string) => string; seeAlso: string; brandModels: string; category: string; accessoryCategory: string; allRange: string;
    faqLink: string; contactLink: string; aboutLink: string;
    similar: string; learnMore: string; aria: (name: string) => string;
    mfrSite: (brand: string) => string; mfrNote: string; boschNote: string; boschHref: string;
    assocLabel: string; assocHref: string; assocNote: string; wikiLabel: string; wikiHref: string; wikiNote: string;
  };
}

const loc = (lg: string) => (p: Product): Product => ({ ...p, name: localName(lg, p.name) });
const lf = loc('fr'), le = loc('en');

const FR: ProductKit = {
  intl: 'fr-FR', build: (p) => buildFrContent(lf(p)), related: frRelated, entry: (p) => frEntry(lf(p)), h1: (p) => frH1(lf(p)), title: (p) => frTitle(lf(p)), description: (p) => frDescription(lf(p)), categoryLabel: FR_CATEGORY_LABEL,
  ui: {
    shop: 'Boutique', faqH2: (n) => `Questions fréquentes sur ${n}`, seeAlso: 'Voir aussi', brandModels: 'Tous les modèles de la marque', category: 'Catégorie', accessoryCategory: 'Rubrique', allRange: 'toute la gamme dans la boutique',
    faqLink: 'Livraison, paiement et retour : la FAQ', contactLink: 'Une question ? Contactez-nous', aboutLink: 'À propos de la boutique',
    similar: 'Produits similaires', learnMore: 'Pour en savoir plus', aria: (n) => `Informations sur ${n}`,
    mfrSite: (b) => `${b} : site du fabricant`, mfrNote: 'Site officiel avec tous les modèles et les informations techniques.', boschNote: 'Systèmes d’entraînement, batteries et mises à jour du fabricant du moteur.', boschHref: 'https://www.bosch-ebike.com/fr/',
    assocLabel: 'FUB : Fédération des usagers de la bicyclette', assocHref: 'https://www.fub.fr/', assocNote: 'Informations et conseils pour les cyclistes au quotidien.',
    wikiLabel: 'Vélo à assistance électrique sur Wikipédia', wikiHref: 'https://fr.wikipedia.org/wiki/V%C3%A9lo_%C3%A0_assistance_%C3%A9lectrique', wikiNote: 'Principes du vélo à assistance électrique : moteur, batterie et cadre réglementaire.',
  },
};
const EN: ProductKit = {
  intl: 'en-IE', build: (p) => buildEnContent(le(p)), related: enRelated, entry: (p) => enEntry(le(p)), h1: (p) => enH1(le(p)), title: (p) => enTitle(le(p)), description: (p) => enDescription(le(p)), categoryLabel: EN_CATEGORY_LABEL,
  ui: {
    shop: 'Shop', faqH2: (n) => `Frequently asked questions about ${n}`, seeAlso: 'See also', brandModels: 'All models from the brand', category: 'Category', accessoryCategory: 'Range', allRange: 'the full range in the shop',
    faqLink: 'Delivery, payment and returns: the FAQ', contactLink: 'Questions? Contact us', aboutLink: 'About the shop',
    similar: 'Similar products', learnMore: 'Learn more', aria: (n) => `Information about ${n}`,
    mfrSite: (b) => `${b}: manufacturer website`, mfrNote: 'Official website with all models and technical information.', boschNote: 'Drive systems, batteries and updates from the motor manufacturer.', boschHref: 'https://www.bosch-ebike.com/en/',
    assocLabel: 'Cycling UK', assocHref: 'https://www.cyclinguk.org/', assocNote: 'Advice and information for everyday cyclists.',
    wikiLabel: 'Electric bicycle on Wikipedia', wikiHref: 'https://en.wikipedia.org/wiki/Electric_bicycle', wikiNote: 'Basics of the electric bicycle: motor, battery and regulation.',
  },
};
const KITS: Partial<Record<Locale, ProductKit>> = { fr: FR, en: EN };
export const productKit = (locale: string): ProductKit | undefined => KITS[locale as Locale];
