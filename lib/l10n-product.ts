import frProducts from '@/data/keywords/fr-products.json';
import { PRODUCTS } from '@/lib/products';
import type { Product } from '@/lib/types';

// French product pages: keywords (data/keywords/fr-products.json), title, description, specs and copy, all built from catalogue data.
// Nothing is invented: every sentence comes from a spec value, the price, or shop terms the owner confirmed. No VAT wording.
export interface FrKw { keyword: string; volume: number; kd: number | null; intent: string }
export interface FrEntry { primary: FrKw & { source: string }; secondary: FrKw[]; faq: FrKw[] }

const MAP = (frProducts as unknown as { products: Record<string, FrEntry> }).products;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const DISP: Record<string, string> = { velo: 'vélo', velos: 'vélos', electrique: 'électrique', electriques: 'électriques', vtt: 'VTT', vtc: 'VTC', vae: 'VAE', ktm: 'KTM', qio: 'QiO', abus: 'ABUS' };
/** "cube reaction pro velo" -> "Cube reaction pro vélo": the keyword as it is written in a title or heading. */
export const frDisplay = (kw: string) => cap(kw.split(' ').map((w) => DISP[w] || w).join(' '));

export function frEntry(p: Product): FrEntry {
  const e = MAP[p.slug];
  if (e) return e;
  return { primary: { keyword: `acheter ${p.name.toLowerCase()}`, volume: 0, kd: null, intent: 'T', source: 'name' }, secondary: [], faq: [] };
}
export const frIsBank = (p: Product) => frEntry(p).primary.source === 'bank';

// ---------- price / text helpers
const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const fmt2 = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

export const FR_CATEGORY_LABEL: Record<string, string> = { 'E-MTB': 'VTT électrique', 'E-Trekking': 'Vélo trekking électrique', 'E-City': 'Vélo de ville électrique', 'Speed-Pedelec': 'Speed pedelec', 'Cargo-E-Bike': 'Vélo cargo électrique', 'Falt-E-Bike': 'Vélo pliant électrique', 'E-Gravel': 'Vélo gravel électrique', 'E-Kinder': 'Vélo électrique enfant', 'Zubehör': 'Accessoire' };
const CAT_NOUN: Record<string, string> = { 'E-MTB': 'VTT électrique', 'E-Trekking': 'vélo trekking électrique', 'E-City': 'vélo de ville électrique', 'Speed-Pedelec': 'speed pedelec', 'Cargo-E-Bike': 'vélo cargo électrique', 'Falt-E-Bike': 'vélo pliant électrique', 'E-Gravel': 'vélo gravel électrique', 'E-Kinder': 'vélo électrique pour enfant' };

const FR_CATEGORY_TEXT: Record<string, string> = {
  'E-MTB': 'Les VTT électriques associent un moteur central puissant à un cadre robuste et à une suspension pour les sentiers, les chemins et les montées raides. Un couple élevé, une grande batterie et des freins performants comptent le plus. Les modèles tout suspendus offrent plus de confort et de contrôle en terrain accidenté, les semi-rigides sont plus légers et demandent moins d’entretien.',
  'E-Trekking': 'Les vélos trekking électriques sont conçus pour les longues distances sur route et sur piste cyclable. Ils ont généralement porte-bagages, garde-boue et éclairage d’origine, une position assise droite et une grande batterie pour une autonomie élevée. Ils conviennent aussi bien aux trajets quotidiens qu’aux voyages à vélo le week-end.',
  'E-City': 'Les vélos de ville électriques facilitent le quotidien en ville : position droite, garde-boue, éclairage et souvent un cadre bas pour monter et descendre facilement. Ils misent sur le confort, la sécurité et un entretien réduit, et conviennent aux trajets domicile-travail, aux courses et aux balades.',
  'Speed-Pedelec': 'Les speed pedelecs assistent jusqu’à 45 km/h et sont classés légalement comme cyclomoteurs. Une plaque d’assurance, au moins le permis de la catégorie AM et un casque sont nécessaires. C’est le moyen le plus rapide de parcourir de plus longues distances domicile-travail avec la force des jambes et un moteur.',
  'Cargo-E-Bike': 'Les vélos cargo électriques transportent enfants, courses ou charges avec l’aide du moteur. L’empattement long et le cadre stable assurent un bon équilibre, le moteur compense le poids. Au quotidien, ils remplacent souvent une seconde voiture sur de courtes distances.',
  'Falt-E-Bike': 'Les vélos pliants électriques se replient en un petit volume et tiennent dans le train, le coffre ou l’appartement. Les petites roues et le cadre compact les rendent maniables en ville, le moteur aide aussi dans les montées et contre le vent.',
  'E-Kinder': 'Les vélos électriques pour enfants et adolescents ont un cadre plus petit, des roues plus petites et un moteur à démarrage doux pour rouler en sécurité avec assistance dès l’âge scolaire. Le poids réduit, des freins fiables et la bonne taille de cadre sont essentiels. La batterie est en général plus petite que sur les vélos adultes, ce qui garde le vélo léger.',
  'E-Gravel': 'Les vélos de route et gravel électriques associent un cadre léger à un cintre course, des pneus étroits à moyens et un moteur compact. Ils sont plus rapides et plus sportifs qu’un vélo trekking et conviennent à l’asphalte, aux chemins et aux longues sorties. Beaucoup de modèles ont une petite batterie légère pour conserver la sensation d’un vélo de route classique.',
};
const FR_WHO_TEXT: Record<string, string> = {
  'E-MTB': 'Le modèle s’adresse aux cyclistes qui veulent faire plus de dénivelé et de plus longues sorties en terrain, sans renoncer au plaisir de rouler.',
  'E-Trekking': 'Le modèle convient aux pendulaires et aux cyclotouristes qui recherchent confort, transport de bagages et grande autonomie pour de longues distances.',
  'E-City': 'Le modèle convient à tous ceux qui veulent arriver confortablement, en sécurité et sans transpirer, en ville et en périphérie.',
  'Speed-Pedelec': 'Le modèle convient aux pendulaires qui veulent rouler vite sur de plus longues distances et qui remplissent les conditions légales du speed pedelec.',
  'Cargo-E-Bike': 'Le modèle convient aux familles et aux professionnels qui veulent transporter enfants ou charges en toute sécurité à vélo.',
  'Falt-E-Bike': 'Le modèle convient à celles et ceux qui combinent train, voiture et vélo et qui ont peu de place pour le ranger.',
  'E-Kinder': 'Le modèle convient aux enfants et adolescents qui veulent rouler en sécurité avec assistance, et aux parents attentifs au poids, aux freins et à la bonne taille de cadre.',
  'E-Gravel': 'Le modèle convient aux cyclistes sportifs qui veulent rouler plus loin sur asphalte et chemins, avec une aide dans les montées et contre le vent.',
};

// ---------- specs: German catalogue values translated word by word; a value that still contains German is left out of the French page
const SPEC_LABEL: Record<string, string> = { Motor: 'Moteur', Akku: 'Batterie', Display: 'Écran', Schaltung: 'Transmission', Bremsen: 'Freins', Rahmen: 'Cadre', Gabel: 'Fourche', Reifen: 'Pneus', 'Laufradgröße': 'Taille des roues', Drehmoment: 'Couple', Gewicht: 'Poids', Reichweite: 'Autonomie', Antrieb: 'Entraînement', Federweg: 'Débattement', Geschwindigkeit: 'Vitesse', Sensor: 'Capteur', Bedieneinheit: 'Commande', App: 'Application', 'Gepäckträger': 'Porte-bagages', Vorbau: 'Potence', Transport: 'Transport', 'Passend für': 'Compatible avec', Material: 'Matière', Farbe: 'Couleur', 'Größe': 'Taille', 'Länge': 'Longueur', Inhalt: 'Contenu', Volumen: 'Volume', Lieferumfang: 'Contenu de la livraison' };
const RULES: [RegExp, string][] = [
  [/&quot;|&ldquo;|&rdquo;/g, '"'], [/&amp;/g, '&'], [/&#39;|&rsquo;/g, '’'],
  [/Stufenlose Getriebe-Nabenschaltung/gi, 'moyeu à variation continue'], [/Getriebeschaltung/gi, 'boîte de vitesses'], [/Nabenschaltung/gi, 'moyeu à vitesses'], [/Kettenschaltung/gi, 'dérailleur'],
  [/(\d+)[- ]Gang/gi, '$1 vitesses'], [/(\d+) Gänge/gi, '$1 vitesses'], [/mit Riemenantrieb/gi, 'avec courroie'], [/Riemenantrieb/gi, 'courroie'], [/\(Freilauf\)/gi, '(roue libre)'], [/\(Rücktrittbremse\)/gi, '(frein à rétropédalage)'],
  [/hydraulische Scheibenbremse/gi, 'frein à disque hydraulique'], [/hydraulische Felgenbremse/gi, 'frein sur jante hydraulique'], [/(\d)\/(\d)[- ]Kolben/gi, '$1/$2 pistons'], [/(\d)[- ]Kolben/gi, '$1 pistons'],
  [/mit integrierten Display/gi, 'avec écran intégré'], [/Farb ?-?Display/gi, 'écran couleur'], [/mit Schiebehilfe/gi, 'avec aide à la poussée'], [/inklusive Mini Remote/gi, 'avec mini télécommande'],
  [/\(mit Update bis zu (\d+) Nm\)/gi, '(avec mise à jour jusqu’à $1 Nm)'], [/bis zu/gi, 'jusqu’à'], [/\bbis\b/gi, 'jusqu’à'],
  [/Starrgabel/gi, 'fourche rigide'], [/Federgabel/gi, 'fourche suspendue'], [/Federweg/gi, 'débattement'], [/\bZoll\b/gi, 'pouces'],
  [/\bohne Akku\b/gi, 'sans batterie'], [/\bmit Akku\b/gi, 'avec batterie'], [/\bTiefeinsteiger\b/gi, 'cadre bas'], [/\bDiamant\b/gi, 'cadre diamant'], [/\bFully\b/gi, 'tout suspendu'], [/\bTrapez\b/gi, 'cadre trapèze'],
  [/\bAluminium\b/gi, 'aluminium'], [/\bmit\b/gi, 'avec'], [/\bund\b/gi, 'et'], [/\binklusive\b/gi, 'avec'],
];
const GERMAN_LEFT = /([äöüß]|\b(der|die|das|ein|eine|für|nicht|auch|oder|zum|zur|beim|werden|wird|ist|sind|integriert|integrierter|integrierten|Akku|Rahmen|Gepäckträger|Schutzblech|Seitenständer|Aufnahme|Anhänger)\b|[A-Za-z]{4,}(ung|keit|heit|lich)\b)/;
export function frSpecValue(v: string): string | null {
  let s = v;
  for (const [re, r] of RULES) s = s.replace(re, r);
  s = s.replace(/\s+/g, ' ').trim();
  if (GERMAN_LEFT.test(s)) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function frSpecs(p: Product): [string, string][] {
  const out: [string, string][] = [];
  for (const [k, v] of Object.entries(p.specs || {})) {
    const label = SPEC_LABEL[k];
    const val = label ? frSpecValue(v) : null;
    if (label && val) out.push([label, val]);
  }
  return out;
}

// ---------- related products (every product gets 4 inbound links): next models of the same brand, filled from the same category
const byBrand: Record<string, Product[]> = {};
const byCat: Record<string, Product[]> = {};
for (const p of PRODUCTS.slice().sort((a, b) => a.slug.localeCompare(b.slug))) { (byBrand[p.brand] ||= []).push(p); (byCat[p.category] ||= []).push(p); }
function baseRelated(p: Product): Product[] {
  const out: Product[] = [];
  const take = (list: Product[]) => {
    const i = list.findIndex((x) => x.slug === p.slug);
    for (let k = 1; k < list.length && out.length < 4; k++) { const c = list[(i + k) % list.length]; if (c.slug !== p.slug && !out.some((o) => o.slug === c.slug)) out.push(c); }
  };
  if (p.category !== 'Zubehör') take(byBrand[p.brand] || []);
  if (out.length < 4) take(byCat[p.category] || []);
  return out;
}

const nz = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
/** H1: the product name; when the main keyword is not part of the name, the keyword leads: "Cube nuroad race : Cube Nuroad Hybrid ...". */
export function frH1(p: Product): string {
  const e = frEntry(p);
  if (e.primary.source !== 'bank') return p.name;
  return nz(p.name).includes(nz(e.primary.keyword)) ? p.name : `${frDisplay(e.primary.keyword)} : ${p.name}`;
}

// ---------- title and description
export function frTitle(p: Product): string {
  const e = frEntry(p);
  const lead = e.primary.source === 'bank' && !p.name.toLowerCase().startsWith(e.primary.keyword.toLowerCase()) ? frDisplay(e.primary.keyword) : '';
  const tries = lead ? [`${lead} | ebikedirect.eu`, `${lead} | ebikedirect.eu`] : [];
  const name = [`${p.name} : acheter en ligne | ebikedirect.eu`, `${p.name} : acheter | ebikedirect.eu`, `${p.name} | ebikedirect.eu`];
  return [...tries, ...name].find((t) => t.length <= 60) || p.name.slice(0, 60);
}
export function frDescription(p: Product): string {
  const e = frEntry(p);
  const kwLead = e.primary.source === 'bank' && !p.name.toLowerCase().startsWith(e.primary.keyword.toLowerCase()) ? frDisplay(e.primary.keyword) : '';
  const lead = kwLead ? kwLead + ' : ' + p.name : p.name;
  const wh = p.batteryStandardWh > 0 ? `, batterie ${p.batteryStandardWh} Wh` : '';
  const motor = p.motor.split(' ').slice(0, 3).join(' ');
  const price = fmt(p.price);
  const tries = p.category === 'Zubehör'
    ? [`${lead} à ${price}. Commandez en ligne, garantie de 2 ans, retour sous 30 jours, livraison par transporteur.`, `${lead} à ${price}. Commande en ligne, garantie de 2 ans et retour sous 30 jours.`]
    : [`${lead}, moteur ${p.motor}${wh}. ${price}, garantie de 2 ans, livraison par transporteur.`, `${lead}, moteur ${motor}${wh}. ${price}, garantie de 2 ans, livraison par transporteur.`, `${lead}${wh}. ${price}, garantie de 2 ans, retour sous 30 jours, livraison par transporteur.`, `${lead} à ${price}. Garantie de 2 ans, retour sous 30 jours, livraison par transporteur.`];
  let t = tries.find((x) => x.length >= 110 && x.length <= 158) || tries[tries.length - 1];
  if (t.length > 158) t = t.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  if (t.length < 110) t += ' Paiement par virement ou en crypto.';
  return t;
}

// ---------- page content
export interface FrSection { h2: string; blocks: { h3?: string; text: string }[] }
const wc = (s: string) => s.split(/\s+/).filter(Boolean).length;
const frames = (p: Product) => (p.options.frameSizes.length > 1 && p.options.frameSizes.every((x) => x.length < 25) ? `Il est disponible dans les tailles de cadre ${p.options.frameSizes.join(', ')}.` : 'La forme du cadre et la taille sont confirmées avec vous lors de la validation de la commande.');

export function buildFrContent(p: Product): { lead: string; sections: FrSection[]; faqs: { q: string; a: string }[]; words: number; specs: [string, string][] } {
  const e = frEntry(p);
  const isAcc = p.category === 'Zubehör';
  const noun = isAcc ? 'accessoire' : (CAT_NOUN[p.category] || 'vélo électrique');
  const focus = e.primary.source === 'bank' ? frDisplay(e.primary.keyword) : p.name;
  const specs = frSpecs(p);
  const price = fmt(p.price), crypto = fmt2(p.price * 0.9);
  const wh = p.batteryStandardWh;
  const motor = p.motor;
  const lead = isAcc
    ? `${p.name} de ${p.brand} : accessoire pour vélo électrique à ${price}. Livraison par transporteur, garantie de 2 ans et retour sous 30 jours.`
    : `${p.name} de ${p.brand} : ${noun} avec moteur ${motor}${wh ? ` et batterie de ${wh} Wh` : ''}${p.rangeKm > 0 ? `, autonomie annoncée par le fabricant jusqu’à ${p.rangeKm} km` : ''}. Prix : ${price}, livraison par transporteur, garantie de 2 ans.`;
  const peers = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
  const avg = peers.length ? peers.reduce((t, x) => t + x.price, 0) / peers.length : p.price;
  const cheaper = peers.filter((x) => x.price < p.price).length;
  const withWh = peers.filter((x) => x.batteryStandardWh > 0);
  const bigger = withWh.filter((x) => x.batteryStandardWh > wh).length;
  const sections: FrSection[] = [];
  sections.push({
    h2: `${p.name} : aperçu`,
    blocks: [
      { text: `${focus} chez ebikedirect.eu : ${isAcc ? `${p.name} de ${p.brand} est un accessoire pour vélo électrique à ${price}, livré par transporteur avec 2 ans de garantie.` : `ce ${noun} de ${p.brand} est équipé du moteur ${motor}${wh ? ` et d’une batterie de ${wh} Wh` : ''}. Il coûte ${price}, avec une garantie de 2 ans et un retour possible sous 30 jours.`}` },
      ...(isAcc ? [] : [{ text: FR_CATEGORY_TEXT[p.category] || '' }, { text: FR_WHO_TEXT[p.category] || '' }]),
    ].filter((b) => b.text),
  });
  if (specs.length) sections.push({ h2: 'Équipement en détail', blocks: specs.map(([k, v]) => ({ h3: k, text: `${k} : ${v}.` })) });
  if (!isAcc) {
    sections.push({
      h2: 'En un coup d’œil',
      blocks: [{ text: `Marque : ${p.brand}. Catégorie : ${FR_CATEGORY_LABEL[p.category] || p.category}. Moteur : ${motor}.${wh ? ` Batterie : ${wh} Wh.` : ''}${p.torqueNm > 0 ? ` Couple : jusqu’à ${p.torqueNm} Nm.` : ''}${p.weightKg > 0 ? ` Poids : ${p.weightKg} kg.` : ''} Prix : ${price}, garantie de 2 ans, livraison par transporteur sur rendez-vous. ${frames(p)}` }],
    });
  }
  const secs = e.secondary.slice(0, 5).map((s) => s.keyword);
  if (secs.length) {
    const facts = isAcc
      ? [`${p.name} coûte ${price}.`, `L’article vient de ${p.brand}.`, `Le paiement se fait par virement ou en crypto ; en crypto, le prix est de ${crypto} (10 % de remise).`, 'Garantie de 2 ans et droit de retour de 30 jours.', 'La livraison se fait par transporteur ; les frais et le délai sont indiqués lors de la commande.']
      : [`Il coûte ${price} ; le paiement se fait par virement ou en crypto (${crypto} avec 10 % de remise).`, `Le moteur est un ${motor}${p.torqueNm > 0 ? ` avec jusqu’à ${p.torqueNm} Nm de couple` : ''}.`, wh ? `La batterie a une capacité de ${wh} Wh${p.rangeKm > 0 ? `, le fabricant annonce jusqu’à ${p.rangeKm} km d’autonomie` : ''}.` : `La capacité de la batterie figure dans la fiche technique ci-dessus.`, frames(p), 'Livraison par transporteur avec hayon élévateur, garantie de 2 ans et droit de retour de 30 jours.'];
    sections.push({ h2: 'Prix, moteur, batterie et livraison', blocks: secs.map((s, i) => ({ h3: frDisplay(s), text: facts[i] })) });
  }
  if (!isAcc && peers.length >= 3) {
    const diff = ((p.price - avg) / avg) * 100;
    const pos = `Dans cette catégorie, la boutique propose ${peers.length} autres modèles. À ${price}, ce vélo est ${Math.abs(Math.round(diff)) < 3 ? 'proche de la moyenne' : diff > 0 ? `environ ${Math.round(diff)} % au-dessus de la moyenne` : `environ ${Math.abs(Math.round(diff))} % en dessous de la moyenne`} de ${fmt(avg)} ; ${cheaper} de ces modèles sont moins chers.`;
    const bat = wh > 0 && withWh.length >= 3 ? ` Sa batterie de ${wh} Wh est ${bigger === 0 ? 'la plus grande' : bigger < withWh.length / 3 ? 'l’une des plus grandes' : bigger < (withWh.length * 2) / 3 ? 'de taille moyenne' : 'plutôt compacte'} de la catégorie ; ${bigger} modèles ont une capacité supérieure.` : '';
    sections.push({ h2: 'Prix et batterie en comparaison', blocks: [{ text: pos + bat }] });
  }
  sections.push({
    h2: 'Prix, paiement, livraison et garantie',
    blocks: [{ text: `Le prix est de ${price}. En cas de paiement par virement, vous réglez ce montant ; en cas de paiement en crypto, le prix est de ${crypto} (10 % de remise). ${p.price < 10000 ? 'Un forfait transport de 49 € s’ajoute, la livraison est gratuite à partir de 10 000 € de commande.' : 'La livraison est gratuite pour ce montant de commande.'} L’article est livré par transporteur sur rendez-vous. Une garantie de 2 ans et un droit de retour de 30 jours s’appliquent.` }],
  });
  const faqKw = e.faq.slice(0, 5).map((f) => f.keyword);
  const base = isAcc
    ? [
      { q: `Combien coûte ${p.name} ?`, a: `${p.name} coûte ${price}. En cas de paiement en crypto, le prix est de ${crypto} (10 % de remise).` },
      { q: 'Cet article convient-il à tous les vélos électriques ?', a: `Cela dépend des cotes de montage. Vérifiez le diamètre, la fixation et la place disponible sur votre vélo avant de commander ; pour toute question, écrivez à sales@ebikedirect.eu.` },
      { q: 'De quelle marque est l’article ?', a: `L’article vient de ${p.brand}.` },
      { q: 'Quelles garanties et quel droit de retour s’appliquent ?', a: 'Une garantie de 2 ans et un droit de retour de 30 jours s’appliquent.' },
      { q: 'Comment payer l’article ?', a: `Vous payez par virement ou en crypto. En crypto, vous économisez 10 %, soit ${fmt2(p.price * 0.1)} sur cet article.` },
    ]
    : [
      { q: 'Combien coûte ce vélo ?', a: `${price}${p.price < 10000 ? ', plus le forfait transport de 49 € jusqu’à 10 000 € de commande' : ', livraison gratuite'}. En cas de paiement en crypto, le prix est de ${crypto}.` },
      { q: 'Quel moteur équipe ce vélo ?', a: `${motor}${p.torqueNm > 0 ? `, avec jusqu’à ${p.torqueNm} Nm de couple` : ''}. Le moteur équipe un ${noun}${wh ? ` avec batterie de ${wh} Wh` : ''} de la marque ${p.brand}.` },
      { q: 'Quelle est la capacité de la batterie ?', a: wh ? `La batterie a une capacité de ${wh} Wh${p.rangeKm > 0 ? `, le fabricant annonce jusqu’à ${p.rangeKm} km d’autonomie` : ''}.` : 'La capacité de la batterie figure dans la fiche technique.' },
      { q: 'Dans quelles tailles ce vélo est-il disponible ?', a: frames(p) },
      { q: 'Ce vélo est-il disponible immédiatement ?', a: 'Oui, il est disponible en stock. La livraison se fait par transporteur avec hayon élévateur, sur rendez-vous ; une garantie de 2 ans et un droit de retour de 30 jours s’appliquent.' },
    ];
  const faqs = base.map((f, i) => (faqKw[i] ? { q: `${frDisplay(faqKw[i])} : ${f.q}`, a: f.a } : f));
  const words = sections.reduce((t, s) => t + wc(s.h2) + s.blocks.reduce((b, bl) => b + wc(bl.text) + (bl.h3 ? wc(bl.h3) : 0), 0), 0) + faqs.reduce((t, f) => t + wc(f.q) + wc(f.a), 0);
  return { lead, sections, faqs, words, specs };
}

// final related lists: every product is linked from at least 3 others (donors in the same category get extra links)
let RELATED: Record<string, Product[]> | null = null;
function related(): Record<string, Product[]> {
  if (RELATED) return RELATED;
  const R: Record<string, Product[]> = {};
  const inbound: Record<string, number> = {};
  for (const p of PRODUCTS) R[p.slug] = baseRelated(p);
  for (const p of PRODUCTS) for (const x of R[p.slug]) inbound[x.slug] = (inbound[x.slug] || 0) + 1;
  for (const p of PRODUCTS) {
    while ((inbound[p.slug] || 0) < 3) {
      const donor = (byCat[p.category] || []).find((d) => d.slug !== p.slug && R[d.slug].length < 7 && !R[d.slug].some((x) => x.slug === p.slug));
      if (!donor) break;
      R[donor.slug].push(p); inbound[p.slug] = (inbound[p.slug] || 0) + 1;
    }
  }
  RELATED = R;
  return R;
}
export function frRelated(p: Product): Product[] { return related()[p.slug] || []; }
