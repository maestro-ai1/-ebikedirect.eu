// Option labels (battery, colour, frame size) and units of the German catalogue as shown on translated pages (fr, en).
// German stays untouched. Brand names, model names and manufacturer colour names (English already) are never changed.
type Lg = 'fr' | 'en';
const isLg = (l: string): l is Lg => l === 'fr' || l === 'en';

const EXACT: Record<Lg, Record<string, string>> = {
  en: {
    'Farbe laut Abbildung, weitere nach Verfügbarkeit': 'Colour as shown, others subject to availability', 'Farbe laut Abbildung': 'Colour as shown',
    'Schwarz': 'Black', 'Grau': 'Grey', 'Violett': 'Purple', 'Blau': 'Blue', 'Anthrazit': 'Anthracite', 'Standard': 'Standard', 'Beige': 'Beige',
    'Ohne Akku': 'Without battery', 'Akku laut Datenblatt': 'Battery as per data sheet', 'Integrierter Akku (Daten laut Hersteller)': 'Integrated battery (data from the manufacturer)',
    'Einheitsgröße': 'One size', 'Im Grundpreis enthalten': 'Included in the base price',
  },
  fr: {
    'Farbe laut Abbildung, weitere nach Verfügbarkeit': 'Couleur selon l’illustration, autres selon disponibilité', 'Farbe laut Abbildung': 'Couleur selon l’illustration',
    'Schwarz': 'Noir', 'Grau': 'Gris', 'Violett': 'Violet', 'Blau': 'Bleu', 'Anthrazit': 'Anthracite', 'Standard': 'Standard', 'Beige': 'Beige',
    'Ohne Akku': 'Sans batterie', 'Akku laut Datenblatt': 'Batterie selon la fiche technique', 'Integrierter Akku (Daten laut Hersteller)': 'Batterie intégrée (données du fabricant)',
    'Einheitsgröße': 'Taille unique', 'Im Grundpreis enthalten': 'Inclus dans le prix de base',
  },
};

/** 27,5 Zoll -> 27.5 inch (en) / 27,5 pouces (fr); 28 Zoll -> 28 inch / 28 pouces. */
export function unitsLocal(lg: string, s: string): string {
  if (!isLg(lg)) return s;
  const unit = lg === 'en' ? 'inch' : 'pouces';
  let o = s.replace(/(\d+),(\d+)\s*Zoll\b/g, (_m, a, b) => (lg === 'en' ? `${a}.${b}` : `${a},${b}`) + ' ' + unit).replace(/(\d+)\s*Zoll\b/g, '$1 ' + unit);
  if (lg === 'en') o = o.replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2');
  return o;
}

/** Label of a battery, colour or frame size option. */
export function optLabel(lg: string, s: string): string {
  if (!isLg(lg)) return s;
  const ex = EXACT[lg][s];
  if (ex) return ex;
  let o = s;
  const bat = lg === 'en' ? 'Battery' : 'Batterie';
  const swap = lg === 'en' ? 'Swappable battery' : 'Batterie amovible';
  o = o.replace(/^Wechselakku\b/, swap).replace(/^Akku\b/, bat);
  o = o.replace(/\bglänzend\b/g, lg === 'en' ? 'glossy' : 'brillant');
  return unitsLocal(lg, o);
}

/** Motor type words of the German catalogue (Hinterradmotor, Mittelmotor ...) as shown on translated pages. */
export function motorLocal(lg: string, s: string): string {
  if (!isLg(lg)) return s;
  const en = lg === 'en';
  return s
    .replace(/Hinterradnabenmotor|Hinterradmotor|Heckmotor/g, en ? 'rear hub motor' : 'moteur de roue arrière')
    .replace(/Vorderradnabenmotor|Vorderradmotor|Frontmotor/g, en ? 'front hub motor' : 'moteur de roue avant')
    .replace(/Mittelmotor/g, en ? 'mid-drive motor' : 'moteur central')
    .replace(/Nabenmotor/g, en ? 'hub motor' : 'moteur moyeu');
}
