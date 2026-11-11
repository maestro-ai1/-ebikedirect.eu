// The catalogue names of the 50 accessories contain German product words (Faltschloss, Gepäckträger ...). On translated pages these words are replaced;
// brand and model names are never touched. Longest phrases first.
const EN: [string, string][] = [
  ['Regenschutz für Cargo E-Bike', 'Rain cover for cargo e-bike'], ['Lenker- und Vorbau-Halterung', 'Handlebar and stem mount'], ['Reinigungs- und Schmierset', 'Cleaning and lube kit'],
  ['Wasserdichter Ladekopf', 'Waterproof charging head'], ['Elektrische Luftpumpe', 'Electric air pump'], ['Gepäckträger hinten', 'Rear rack'], ['Frontgepäckträger', 'Front rack'], ['Bürsten-Set 3 in 1', '3-in-1 brush set'],
  ['Schaumsprüher-Set', 'Foam sprayer set'], ['Out Front Halterung', 'Out Front mount'], ['Bike Kit für iPhone', 'Bike Kit for iPhone'], ['Pannenreparatur', 'puncture repair'], ['Vibrationsdämpfer', 'Vibration dampener'],
  ['Handyhalterung', 'Phone mount'], ['Gepäcktasche', 'Pannier bag'], ['Kettenschloss', 'Chain lock'], ['Rahmenschloss', 'Frame lock'], ['Faltschloss', 'Folding lock'], ['Gepäckträger', 'Rack'], ['Schutzbleche', 'Mudguards'],
  ['Seitenständer', 'Side stand'], ['Satteltasche', 'Saddle bag'], ['Fahrradklingel', 'Bicycle bell'], ['Reparaturset', 'Repair kit'], ['Flickzeug Set', 'Patch kit'], ['Kettenwachs', 'Chain wax'], ['Hüfttasche', 'Hip bag'],
  ['Bike Licht', 'Bike light'], ['Kindersitz', 'Child seat'], ['Minipumpe', 'Mini pump'], ['Messing', 'Brass'], ['Helm', 'Helmet'], ['Licht', 'Light'], ['(NL-Schloss)', '(Dutch frame lock)'],
];
const FR: [string, string][] = [
  ['Regenschutz für Cargo E-Bike', 'Protection pluie pour vélo cargo électrique'], ['Lenker- und Vorbau-Halterung', 'Support de guidon et de potence'], ['Reinigungs- und Schmierset', 'Kit de nettoyage et de lubrification'],
  ['Wasserdichter Ladekopf', 'Tête de charge étanche'], ['Elektrische Luftpumpe', 'Pompe à air électrique'], ['Gepäckträger hinten', 'Porte-bagages arrière'], ['Frontgepäckträger', 'Porte-bagages avant'], ['Bürsten-Set 3 in 1', 'Kit de brosses 3 en 1'],
  ['Schaumsprüher-Set', 'Kit de pulvérisateur de mousse'], ['Out Front Halterung', 'Support Out Front'], ['Bike Kit für iPhone', 'Bike Kit pour iPhone'], ['Pannenreparatur', 'réparation de crevaison'], ['Vibrationsdämpfer', 'Amortisseur de vibrations'],
  ['Handyhalterung', 'Support de téléphone'], ['Gepäcktasche', 'Sacoche de porte-bagages'], ['Kettenschloss', 'Antivol à chaîne'], ['Rahmenschloss', 'Antivol de cadre'], ['Faltschloss', 'Antivol pliant'], ['Gepäckträger', 'Porte-bagages'], ['Schutzbleche', 'Garde-boue'],
  ['Seitenständer', 'Béquille latérale'], ['Satteltasche', 'Sacoche de selle'], ['Fahrradklingel', 'Sonnette de vélo'], ['Reparaturset', 'Kit de réparation'], ['Flickzeug Set', 'Kit de rustines'], ['Kettenwachs', 'Cire pour chaîne'], ['Hüfttasche', 'Sac banane'],
  ['Bike Licht', 'Éclairage vélo'], ['Kindersitz', 'Siège enfant'], ['Minipumpe', 'Mini-pompe'], ['Messing', 'Laiton'], ['Helm', 'Casque'], ['Licht', 'Éclairage'], ['(NL-Schloss)', '(antivol néerlandais)'],
];
const TABLES: Record<string, [string, string][]> = { en: EN, fr: FR };

/** Product name as shown on a translated page. German names stay as they are on the German site. */
export function localName(locale: string, name: string): string {
  const t = TABLES[locale];
  if (!t) return name;
  let s = name;
  for (const [de, tr] of t) s = s.split(de).join(tr);
  return s;
}
