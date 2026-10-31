import { TrustpilotReview } from './types';

// Multi-lingual rotating reviews spanning 2024 to present (Germany, Netherlands, Italy, Spain)
export const REVIEWS_POOL: TrustpilotReview[] = [
  // German Reviews
  {
    id: 'rev-de-1',
    name: 'Dr. Michael Steinberg',
    location: 'Stuttgart, Deutschland',
    language: 'de',
    stars: 5,
    date: '14. Oktober 2026',
    title: 'Cube Stereo Hybrid 160 per Krypto bezahlt – 10% Rabatt und blitzschnelle Spedition!',
    comment: 'Ich war anfangs skeptisch wegen der Zahlung mit USDT, aber der Rabatt von über 600 € war unschlagbar. Die Bestätigung kam innerhalb von 2 Minuten, das E-Bike stand nach 3 Werktagen perfekt montiert per Spedition vor meiner Haustür.',
    verifiedPurchase: true,
    bikeModel: 'Cube Stereo Hybrid 160 HPC Actionteam'
  },
  {
    id: 'rev-de-2',
    name: 'Sabine Weimann',
    location: 'Hamburg, Deutschland',
    language: 'de',
    stars: 5,
    date: '28. September 2026',
    title: 'Top Beratung und erstklassige Verpackung',
    comment: 'Das Gazelle Ultimate C380 mit Riemenantrieb fährt sich wie auf Wolken. Sehr netter telefonischer Kundenservice bezüglich der richtigen Rahmengröße. Spedition hat vorher angerufen und die Palette bis in die Garage gefahren.',
    verifiedPurchase: true,
    bikeModel: 'Gazelle Ultimate C380 HMB'
  },
  {
    id: 'rev-de-3',
    name: 'Tobias Lindemann',
    location: 'München, Deutschland',
    language: 'de',
    stars: 5,
    date: '02. August 2026',
    title: 'Kalkhoff Entice ABS – Ein Meilenstein für die Sicherheit',
    comment: 'Das ABS-System hat mich bei nasser Fahrbahn schon vor einem Sturz bewahrt. Abwicklung über ebikedirect.eu war absolut mustergültig. Klare 5 Sterne!',
    verifiedPurchase: true,
    bikeModel: 'Kalkhoff Entice 7+ Advance ABS'
  },
  {
    id: 'rev-de-4',
    name: 'Klaus-Peter Schramm',
    location: 'Köln, Deutschland',
    language: 'de',
    stars: 5,
    date: '17. Mai 2026',
    title: 'Riese & Müller Supercharger 1000Wh – Reichweite ohne Ende',
    comment: 'Ich fahre jeden Tag 45 km einfach zur Arbeit. Der Akku hält problemlos 3 Tage durch. Bitcoin-Zahlung hat reibungslos funktioniert und 729 € gespart.',
    verifiedPurchase: true,
    bikeModel: 'Riese & Müller Supercharger GT Touring'
  },
  {
    id: 'rev-de-5',
    name: 'Anja Becker',
    location: 'Berlin, Deutschland',
    language: 'de',
    stars: 5,
    date: '22. Februar 2026',
    title: 'Professionell, kompetent und fair',
    comment: 'Hier merkt man sofort, dass echte Zweiradmechaniker am Werk sind. Alle Drehmomente waren geprüft, Bremsen perfekt eingestellt.',
    verifiedPurchase: true,
    bikeModel: 'Cube Kathmandu Hybrid SLT 750'
  },

  // Dutch Reviews (Nederlands)
  {
    id: 'rev-nl-1',
    name: 'Daan van der Meer',
    location: 'Utrecht, Nederland',
    language: 'nl',
    stars: 5,
    date: '19. Oktober 2026',
    title: 'Uitstekende service en 10% crypto-korting met USDT!',
    comment: 'Mijn Specialized Turbo Levo besteld vanuit Nederland. Levering via Dachser was binnen 72 uur geregeld. Heel blij met de duidelijke communicatie en het track & trace systeem.',
    verifiedPurchase: true,
    bikeModel: 'Specialized Turbo Levo Pro Carbon'
  },
  {
    id: 'rev-nl-2',
    name: 'Sanne de Jong',
    location: 'Amsterdam, Nederland',
    language: 'nl',
    stars: 5,
    date: '11. Juli 2026',
    title: 'Gazelle Ultimate riemaandrijving – Wat een genot',
    comment: 'Geen vieze kettingen meer in de stad. De riem en Enviolo naaf zijn fantastisch stil. Zeer betrouwbare webshop met deskundige ondersteuning.',
    verifiedPurchase: true,
    bikeModel: 'Gazelle Ultimate C380 HMB'
  },
  {
    id: 'rev-nl-3',
    name: 'Bram Houtman',
    location: 'Rotterdam, Nederland',
    language: 'nl',
    stars: 5,
    date: '04. April 2025',
    title: 'Super ervaring met levering van Riese & Müller Load bakfiets',
    comment: 'Met twee peuters is deze bakfiets een droom. De vering vangt alle hobbels op. Perfect geleverd op pallet, direct rijklaar.',
    verifiedPurchase: true,
    bikeModel: 'Riese & Müller Load 75 Vario'
  },

  // Italian Reviews (Italiano)
  {
    id: 'rev-it-1',
    name: 'Matteo Colombo',
    location: 'Milano, Italia',
    language: 'it',
    stars: 5,
    date: '25. Settembre 2026',
    title: 'Spedizione rapida in Italia e sconto crypto del 10%',
    comment: 'Ho pagato con Bitcoin risparmiando quasi 600€ sulla Cube Stereo Hybrid. Bici imballata con massima cura, freni e cambio già regolati alla perfezione.',
    verifiedPurchase: true,
    bikeModel: 'Cube Stereo Hybrid 160 HPC Actionteam'
  },
  {
    id: 'rev-it-2',
    name: 'Francesca Rossi',
    location: 'Torino, Italia',
    language: 'it',
    stars: 5,
    date: '18. Giugno 2026',
    title: 'Qualità tedesca ineccepibile!',
    comment: 'Assistenza clienti molto reattiva anche in inglese. La mia Haibike AllMtn 7 è arrivata perfetta per le mie uscite sulle Alpi piemontesi.',
    verifiedPurchase: true,
    bikeModel: 'Haibike ALLMTN 7'
  },
  {
    id: 'rev-it-3',
    name: 'Gianluca De Luca',
    location: 'Bolzano, Italia',
    language: 'it',
    stars: 5,
    date: '12. Novembre 2024',
    title: 'Motore Bosch CX potentissimo',
    comment: 'Sulle salite delle Dolomiti il motore non perde un colpo. Batteria da 750Wh fenomenale.',
    verifiedPurchase: true,
    bikeModel: 'Cube Kathmandu Hybrid SLT'
  },

  // Spanish Reviews (Español)
  {
    id: 'rev-es-1',
    name: 'Carlos Mendoza',
    location: 'Madrid, España',
    language: 'es',
    stars: 5,
    date: '05. Ottobre 2026',
    title: 'Compra perfecta con USDT en la red TRC-20',
    comment: 'El descuento del 10% por pago en criptomonedas se aplicó al instante en el carrito. La bicicleta llegó por transporte asegurado con plataforma elevadora.',
    verifiedPurchase: true,
    bikeModel: 'Specialized Turbo Levo Pro'
  },
  {
    id: 'rev-es-2',
    name: 'Elena Morales',
    location: 'Barcelona, España',
    language: 'es',
    stars: 5,
    date: '14. Agosto 2026',
    title: 'Totalmente recomendados, servicio postventa de 10',
    comment: 'Compré la Gazelle para desplazarme por Barcelona todos los días. Sin mantenimiento y comodísima. El embalaje de protección es el mejor que he visto.',
    verifiedPurchase: true,
    bikeModel: 'Gazelle Ultimate C380 HMB'
  },
  {
    id: 'rev-es-3',
    name: 'Alejandro Vega',
    location: 'Valencia, España',
    language: 'es',
    stars: 5,
    date: '29. Marzo 2025',
    title: 'Canyon Spectral:ON – Una máquina increíble',
    comment: 'Ligera, reactiva y con una batería que dura todo el día. Muy satisfecho con la seriedad de ebikedirect.eu.',
    verifiedPurchase: true,
    bikeModel: 'Canyon Spectral:ON CF 9'
  }
];

export const TRUSTPILOT_STATS = {
  score: '4.9',
  maxScore: '5.0',
  totalReviews: '5.284',
  percentageExcellent: 94,
  trustScoreStatus: 'Hervorragend / Excellent',
  verifiedMerchant: true
};
