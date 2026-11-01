// One-off: adds the "gravel" category label to every language file (home.cat.gravel).
const fs = require('fs');
const L = {
  de: 'E-Rennräder & Gravel',
  en: 'Road & gravel e-bikes',
  fr: 'Vélos électriques gravel et route',
  nl: 'Elektrische racefietsen & gravel',
  it: 'Bici elettriche gravel e corsa',
  es: 'Bicicletas eléctricas gravel y carretera',
  pt: 'Bicicletas elétricas gravel e estrada'
};
for (const [code, label] of Object.entries(L)) {
  const f = `messages/${code}.json`;
  const raw = fs.readFileSync(f, 'utf8');
  const j = JSON.parse(raw);
  j.home.cat.gravel = label;
  const indent = /^\{\n( +)"/.exec(raw)?.[1].length || 2;
  fs.writeFileSync(f, JSON.stringify(j, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
  console.log('ok', f);
}
