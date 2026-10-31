// Adds the "home" block (new homepage sections) to every messages/<locale>.json.
import fs from 'node:fs';

const home = {
  de: {
    catTitle: 'Nach Einsatz wählen', catSub: 'Sechs Typen, ein Ziel: das Rad, das zu Ihrem Alltag passt.', models: 'Modelle', viewCategory: 'Ansehen',
    cat: { mtb: 'E-Mountainbikes', trekking: 'Trekking E-Bikes', city: 'City E-Bikes', speed: 'S-Pedelecs', cargo: 'Cargo E-Bikes', all: 'Alle E-Bikes' },
    newTitle: 'Neu im Sortiment', newSub: 'Frisch aufgenommene Modelle mit geprüften Daten und Studiofotos.', viewAll: 'Alle Modelle ansehen', rrp: 'UVP', details: 'Details ansehen',
    brandsTitle: 'Marken im Sortiment', brandsSub: 'Jede Marke hat eine eigene Seite mit allen lieferbaren Modellen.',
    whyTitle: 'Warum ebikedirect.eu',
    why: [['Lieferung', 'Speditionsversand mit Hebebühne, kostenfrei ab 10.000 € Bestellwert.'], ['Zahlung', '10 % Rabatt bei Zahlung mit USDT oder Bitcoin.'], ['Garantie', '2 Jahre Garantie und 30 Tage Rückgaberecht.'], ['Beratung', 'Fachberatung zu Rahmengröße, Motor und Akku vor dem Kauf.']],
    guideTitle: 'Aus dem Ratgeber', guideSub: 'Verständlich erklärt: Technik, Recht und Kaufentscheidung.', guideAll: 'Alle Artikel lesen'
  },
  fr: {
    catTitle: 'Choisir selon l\'usage', catSub: 'Six types, un objectif : le vélo qui correspond à votre quotidien.', models: 'modèles', viewCategory: 'Voir',
    cat: { mtb: 'VTT électriques', trekking: 'Vélos électriques trekking', city: 'Vélos électriques urbains', speed: 'S-Pedelec', cargo: 'Vélos cargo électriques', all: 'Tous les vélos électriques' },
    newTitle: 'Nouveautés', newSub: 'Modèles récemment ajoutés, avec données vérifiées et photos de studio.', viewAll: 'Voir tous les modèles', rrp: 'PVC', details: 'Voir le détail',
    brandsTitle: 'Marques disponibles', brandsSub: 'Chaque marque a sa page avec tous les modèles livrables.',
    whyTitle: 'Pourquoi ebikedirect.eu',
    why: [['Livraison', 'Transport sur palette avec hayon, gratuit dès 10 000 € de commande.'], ['Paiement', '10 % de remise en cas de paiement en USDT ou Bitcoin.'], ['Garantie', 'Garantie de 2 ans et 30 jours pour retourner.'], ['Conseil', 'Conseil sur la taille de cadre, le moteur et la batterie avant l\'achat.']],
    guideTitle: 'Conseils', guideSub: 'Technique, droit et choix d\'achat expliqués simplement.', guideAll: 'Lire tous les articles'
  },
  nl: {
    catTitle: 'Kies op gebruik', catSub: 'Zes typen, één doel: de fiets die bij uw dagelijks leven past.', models: 'modellen', viewCategory: 'Bekijken',
    cat: { mtb: 'Elektrische mountainbikes', trekking: 'Trekking e-bikes', city: 'City e-bikes', speed: 'S-Pedelecs', cargo: 'Elektrische bakfietsen', all: 'Alle e-bikes' },
    newTitle: 'Nieuw in het assortiment', newSub: 'Recent toegevoegde modellen met gecontroleerde gegevens en studiofoto\'s.', viewAll: 'Alle modellen bekijken', rrp: 'Adviesprijs', details: 'Details bekijken',
    brandsTitle: 'Merken in het assortiment', brandsSub: 'Elk merk heeft een eigen pagina met alle leverbare modellen.',
    whyTitle: 'Waarom ebikedirect.eu',
    why: [['Levering', 'Pallettransport met laadklep, gratis vanaf 10.000 € bestelwaarde.'], ['Betaling', '10% korting bij betaling met USDT of Bitcoin.'], ['Garantie', '2 jaar garantie en 30 dagen retourrecht.'], ['Advies', 'Advies over framemaat, motor en accu vóór de aankoop.']],
    guideTitle: 'Uit de gids', guideSub: 'Techniek, regels en aankoopkeuze helder uitgelegd.', guideAll: 'Alle artikelen lezen'
  },
  it: {
    catTitle: 'Scegli per utilizzo', catSub: 'Sei tipi, un obiettivo: la bici adatta alla tua quotidianità.', models: 'modelli', viewCategory: 'Vedi',
    cat: { mtb: 'E-Mountain bike', trekking: 'E-bike trekking', city: 'E-bike city', speed: 'S-Pedelec', cargo: 'E-bike cargo', all: 'Tutte le e-bike' },
    newTitle: 'Novità', newSub: 'Modelli appena aggiunti con dati verificati e foto in studio.', viewAll: 'Vedi tutti i modelli', rrp: 'Prezzo di listino', details: 'Vedi dettagli',
    brandsTitle: 'Marchi disponibili', brandsSub: 'Ogni marchio ha una pagina con tutti i modelli consegnabili.',
    whyTitle: 'Perché ebikedirect.eu',
    why: [['Consegna', 'Spedizione su bancale con sponda idraulica, gratuita da 10.000 € di ordine.'], ['Pagamento', '10% di sconto pagando con USDT o Bitcoin.'], ['Garanzia', 'Garanzia di 2 anni e 30 giorni per il reso.'], ['Consulenza', 'Consulenza su taglia del telaio, motore e batteria prima dell\'acquisto.']],
    guideTitle: 'Dalla guida', guideSub: 'Tecnica, norme e scelta d\'acquisto spiegate bene.', guideAll: 'Leggi tutti gli articoli'
  },
  es: {
    catTitle: 'Elige según el uso', catSub: 'Seis tipos, un objetivo: la bicicleta que encaja con tu día a día.', models: 'modelos', viewCategory: 'Ver',
    cat: { mtb: 'Bicicletas eléctricas de montaña', trekking: 'Bicicletas eléctricas trekking', city: 'Bicicletas eléctricas urbanas', speed: 'S-Pedelec', cargo: 'Bicicletas eléctricas de carga', all: 'Todas las bicicletas eléctricas' },
    newTitle: 'Novedades', newSub: 'Modelos añadidos recientemente con datos verificados y fotos de estudio.', viewAll: 'Ver todos los modelos', rrp: 'PVP', details: 'Ver detalles',
    brandsTitle: 'Marcas disponibles', brandsSub: 'Cada marca tiene su página con todos los modelos disponibles.',
    whyTitle: 'Por qué ebikedirect.eu',
    why: [['Entrega', 'Envío en palé con plataforma elevadora, gratis desde 10.000 € de pedido.'], ['Pago', '10% de descuento al pagar con USDT o Bitcoin.'], ['Garantía', 'Garantía de 2 años y 30 días para devolver.'], ['Asesoramiento', 'Asesoramiento sobre talla, motor y batería antes de comprar.']],
    guideTitle: 'De la guía', guideSub: 'Técnica, normas y decisión de compra, bien explicadas.', guideAll: 'Leer todos los artículos'
  },
  pt: {
    catTitle: 'Escolher por utilização', catSub: 'Seis tipos, um objetivo: a bicicleta que combina com o seu dia a dia.', models: 'modelos', viewCategory: 'Ver',
    cat: { mtb: 'Bicicletas elétricas de montanha', trekking: 'Bicicletas elétricas trekking', city: 'Bicicletas elétricas urbanas', speed: 'S-Pedelec', cargo: 'Bicicletas elétricas de carga', all: 'Todas as bicicletas elétricas' },
    newTitle: 'Novidades', newSub: 'Modelos adicionados recentemente com dados verificados e fotos de estúdio.', viewAll: 'Ver todos os modelos', rrp: 'PVP', details: 'Ver detalhes',
    brandsTitle: 'Marcas disponíveis', brandsSub: 'Cada marca tem a sua página com todos os modelos disponíveis.',
    whyTitle: 'Porquê ebikedirect.eu',
    why: [['Entrega', 'Envio em palete com plataforma elevatória, gratuito a partir de 10 000 € de encomenda.'], ['Pagamento', '10% de desconto ao pagar com USDT ou Bitcoin.'], ['Garantia', 'Garantia de 2 anos e 30 dias para devolver.'], ['Aconselhamento', 'Aconselhamento sobre tamanho do quadro, motor e bateria antes da compra.']],
    guideTitle: 'Do guia', guideSub: 'Técnica, regras e decisão de compra bem explicadas.', guideAll: 'Ler todos os artigos'
  },
  en: {
    catTitle: 'Choose by use', catSub: 'Six types, one goal: the bike that fits your everyday life.', models: 'models', viewCategory: 'View',
    cat: { mtb: 'E-mountain bikes', trekking: 'Trekking e-bikes', city: 'City e-bikes', speed: 'S-Pedelecs', cargo: 'Cargo e-bikes', all: 'All e-bikes' },
    newTitle: 'New in the range', newSub: 'Recently added models with checked data and studio photos.', viewAll: 'View all models', rrp: 'RRP', details: 'View details',
    brandsTitle: 'Brands in the range', brandsSub: 'Each brand has its own page with every available model.',
    whyTitle: 'Why ebikedirect.eu',
    why: [['Delivery', 'Pallet delivery with tail lift, free from a €10,000 order value.'], ['Payment', '10% off when paying with USDT or Bitcoin.'], ['Warranty', '2-year warranty and 30 days to return.'], ['Advice', 'Advice on frame size, motor and battery before you buy.']],
    guideTitle: 'From the guide', guideSub: 'Technology, rules and buying decisions explained clearly.', guideAll: 'Read all articles'
  }
};

for (const [loc, block] of Object.entries(home)) {
  const f = `messages/${loc}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  j.home = block;
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log('home block added to', Object.keys(home).join(', '));
