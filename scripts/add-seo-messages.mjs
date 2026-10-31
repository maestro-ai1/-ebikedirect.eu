// Adds the "seo" block (title tail and meta sentences) to every messages/<locale>.json.
import fs from 'node:fs';

const seo = {
  de: { titleTail: 'online bestellen', s1: 'Premium E-Bikes von Cube, Specialized, Riese & Müller und mehr.', s2: 'Speditionsversand in ganz Europa.', s3: 'Modelle vergleichen und online bestellen.', home: 'E-Bikes und Pedelecs für Europa', breadcrumbHome: 'Startseite' },
  fr: { titleTail: 'commander en ligne', s1: 'Vélos électriques premium de Cube, Specialized, Riese & Müller et plus.', s2: 'Livraison sur palette dans toute l\'Europe.', s3: 'Comparez les modèles et commandez en ligne.', home: 'Vélos électriques pour l\'Europe', breadcrumbHome: 'Accueil' },
  nl: { titleTail: 'online bestellen', s1: 'Premium e-bikes van Cube, Specialized, Riese & Müller en meer.', s2: 'Pallettransport door heel Europa.', s3: 'Vergelijk modellen en bestel online.', home: 'E-bikes en pedelecs voor Europa', breadcrumbHome: 'Home' },
  it: { titleTail: 'ordina online', s1: 'Bici elettriche premium di Cube, Specialized, Riese & Müller e altri.', s2: 'Spedizione su bancale in tutta Europa.', s3: 'Confronta i modelli e ordina online.', home: 'Bici elettriche per l\'Europa', breadcrumbHome: 'Home' },
  es: { titleTail: 'pedir online', s1: 'Bicicletas eléctricas premium de Cube, Specialized, Riese & Müller y más.', s2: 'Envío en palé a toda Europa.', s3: 'Compara modelos y pide online.', home: 'Bicicletas eléctricas para Europa', breadcrumbHome: 'Inicio' },
  pt: { titleTail: 'encomendar online', s1: 'Bicicletas elétricas premium da Cube, Specialized, Riese & Müller e outras.', s2: 'Envio em palete para toda a Europa.', s3: 'Compare modelos e encomende online.', home: 'Bicicletas elétricas para a Europa', breadcrumbHome: 'Início' },
  en: { titleTail: 'order online', s1: 'Premium e-bikes from Cube, Specialized, Riese & Müller and more.', s2: 'Pallet delivery across Europe.', s3: 'Compare models and order online.', home: 'E-bikes and pedelecs for Europe', breadcrumbHome: 'Home' },
};

for (const [loc, block] of Object.entries(seo)) {
  const f = `messages/${loc}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.seo = block;
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log('seo block added to', Object.keys(seo).join(', '));
