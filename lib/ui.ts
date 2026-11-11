import type { Locale } from '@/lib/i18n';
import { PAGES } from '@/lib/ui-pages';

// UI strings of the shopping flow (cart toast, catalog navigation, shop filters, checkout, footer and header leftovers) in every language.
// Order of each row: de, fr, nl, it, es, pt, en. German is the fallback. {name} placeholders are filled by ui().
// No VAT wording outside German (owner: leave VAT out where other countries do not need it).
const ORDER: Locale[] = ['de', 'fr', 'nl', 'it', 'es', 'pt', 'en'];
type Row = [string, string, string, string, string, string, string];

const T: Record<string, Row> = {
  // ---- cart toast
  'toast.added': ['Zum Warenkorb hinzugefügt', 'Ajouté au panier', 'Toegevoegd aan winkelwagen', 'Aggiunto al carrello', 'Añadido a la cesta', 'Adicionado ao carrinho', 'Added to cart'],
  'toast.checkout': ['Zur Kasse', 'Passer commande', 'Naar de kassa', 'Vai alla cassa', 'Ir a la caja', 'Ir para o checkout', 'Checkout'],
  'toast.continue': ['Weiter einkaufen', 'Continuer mes achats', 'Verder winkelen', 'Continua gli acquisti', 'Seguir comprando', 'Continuar a comprar', 'Continue shopping'],
  'toast.close': ['Hinweis schließen', 'Fermer la notification', 'Melding sluiten', 'Chiudi la notifica', 'Cerrar el aviso', 'Fechar o aviso', 'Close notice'],
  // ---- catalog navigation
  'nav.label': ['Kategorien und Marken', 'Catégories et marques', 'Categorieën en merken', 'Categorie e marchi', 'Categorías y marcas', 'Categorias e marcas', 'Categories and brands'],
  'nav.cats': ['Kategorien', 'Catégories', 'Categorieën', 'Categorie', 'Categorías', 'Categorias', 'Categories'],
  'nav.brands': ['Marken', 'Marques', 'Merken', 'Marchi', 'Marcas', 'Marcas', 'Brands'],
  'nav.motors': ['Motoren', 'Moteurs', 'Motoren', 'Motori', 'Motores', 'Motores', 'Motors'],
  'nav.acc': ['Zubehör', 'Accessoires', 'Accessoires', 'Accessori', 'Accesorios', 'Acessórios', 'Accessories'],
  'nav.allAcc': ['Alles Zubehör', 'Tous les accessoires', 'Alle accessoires', 'Tutti gli accessori', 'Todos los accesorios', 'Todos os acessórios', 'All accessories'],
  'nav.filter': ['Sortiment filtern', 'Filtrer la gamme', 'Assortiment filteren', 'Filtra l’assortimento', 'Filtrar el catálogo', 'Filtrar o catálogo', 'Filter the range'],
  'nav.all': ['Alle E-Bikes', 'Tous les vélos électriques', 'Alle e-bikes', 'Tutte le e-bike', 'Todas las e-bikes', 'Todas as e-bikes', 'All e-bikes'],
  'nav.mtb': ['E-Mountainbikes', 'VTT électriques', 'E-mountainbikes', 'E-mountain bike', 'E-bikes de montaña', 'E-bikes de montanha', 'Electric mountain bikes'],
  'nav.trekking': ['Trekking-E-Bikes', 'Vélos trekking électriques', 'Trekking e-bikes', 'E-bike da trekking', 'E-bikes de trekking', 'E-bikes de trekking', 'Electric trekking bikes'],
  'nav.city': ['City-E-Bikes', 'Vélos de ville électriques', 'Stads e-bikes', 'E-bike da città', 'E-bikes urbanas', 'E-bikes urbanas', 'Electric city bikes'],
  'nav.speed': ['S-Pedelecs (45 km/h)', 'Speed pedelecs (45 km/h)', 'Speed pedelecs (45 km/u)', 'S-pedelec (45 km/h)', 'S-pedelecs (45 km/h)', 'S-pedelecs (45 km/h)', 'Speed pedelecs (45 km/h)'],
  'nav.cargo': ['Cargo-E-Bikes', 'Vélos cargo électriques', 'Elektrische bakfietsen', 'E-bike cargo', 'E-bikes de carga', 'E-bikes de carga', 'Electric cargo bikes'],
  'nav.fold': ['Falt-E-Bikes', 'Vélos pliants électriques', 'Opvouwbare e-bikes', 'E-bike pieghevoli', 'E-bikes plegables', 'E-bikes dobráveis', 'Folding electric bikes'],
  'nav.gravel': ['E-Rennrad & Gravel', 'Vélos de route et gravel électriques', 'E-racefietsen en gravel', 'E-bike da corsa e gravel', 'E-bikes de carretera y gravel', 'E-bikes de estrada e gravel', 'Electric road and gravel bikes'],
  'nav.kids': ['Kinder- & Jugend-E-Bikes', 'Vélos électriques enfants et ados', 'E-bikes voor kinderen en jongeren', 'E-bike per bambini e ragazzi', 'E-bikes infantiles y juveniles', 'E-bikes para crianças e jovens', 'Electric bikes for kids and teens'],
  'nav.women': ['Damen-E-Bikes', 'Vélos électriques femme', 'Dames e-bikes', 'E-bike donna', 'E-bikes de mujer', 'E-bikes de senhora', 'Women’s electric bikes'],
  'nav.men': ['Herren-E-Bikes', 'Vélos électriques homme', 'Heren e-bikes', 'E-bike uomo', 'E-bikes de hombre', 'E-bikes de homem', 'Men’s electric bikes'],
  'nav.light': ['Leichte & Carbon E-Bikes', 'Vélos électriques légers et carbone', 'Lichte en carbon e-bikes', 'E-bike leggere e in carbonio', 'E-bikes ligeras y de carbono', 'E-bikes leves e de carbono', 'Light and carbon electric bikes'],
  'nav.wheel': ['E-Bikes nach Radgröße', 'Vélos électriques par taille de roue', 'E-bikes per wielmaat', 'E-bike per misura delle ruote', 'E-bikes por tamaño de rueda', 'E-bikes por tamanho de roda', 'Electric bikes by wheel size'],
  'nav.motor': ['Motor & Antrieb', 'Moteur et entraînement', 'Motor en aandrijving', 'Motore e trasmissione', 'Motor y transmisión', 'Motor e transmissão', 'Motor and drive'],
  // ---- shop page
  'shop.title': ['Premium E-Bikes & Pedelecs Katalog', 'Catalogue de vélos électriques et pedelecs premium', 'Catalogus premium e-bikes en pedelecs', 'Catalogo e-bike e pedelec premium', 'Catálogo de e-bikes y pedelecs premium', 'Catálogo de e-bikes e pedelecs premium', 'Premium e-bike and pedelec catalogue'],
  'shop.found': ['{n} Modelle gefunden · Mindestbestellwert 500 € · Kostenloser Speditionsversand ab 10.000 €', '{n} modèles trouvés · Commande minimum 500 € · Livraison gratuite par transporteur dès 10 000 €', '{n} modellen gevonden · Minimumbestelling 500 € · Gratis expeditielevering vanaf 10.000 €', '{n} modelli trovati · Ordine minimo 500 € · Spedizione gratuita via corriere da 10.000 €', '{n} modelos encontrados · Pedido mínimo 500 € · Envío gratuito por transportista desde 10.000 €', '{n} modelos encontrados · Encomenda mínima 500 € · Envio gratuito por transportadora a partir de 10.000 €', '{n} models found · Minimum order €500 · Free freight delivery from €10,000'],
  'shop.crypto': ['10% Skonto mit Krypto (USDT / BTC)', '10 % de remise en crypto (USDT / BTC)', '10% korting met crypto (USDT / BTC)', '10% di sconto con crypto (USDT / BTC)', '10 % de descuento con cripto (USDT / BTC)', '10 % de desconto com cripto (USDT / BTC)', '10% discount with crypto (USDT / BTC)'],
  'shop.filter': ['Filter', 'Filtres', 'Filters', 'Filtri', 'Filtros', 'Filtros', 'Filters'],
  'shop.reset': ['Zurücksetzen', 'Réinitialiser', 'Wissen', 'Reimposta', 'Restablecer', 'Repor', 'Reset'],
  'shop.category': ['Kategorie', 'Catégorie', 'Categorie', 'Categoria', 'Categoría', 'Categoria', 'Category'],
  'shop.allCats': ['Alle Kategorien', 'Toutes les catégories', 'Alle categorieën', 'Tutte le categorie', 'Todas las categorías', 'Todas as categorias', 'All categories'],
  'shop.maker': ['Hersteller', 'Fabricant', 'Fabrikant', 'Produttore', 'Fabricante', 'Fabricante', 'Manufacturer'],
  'shop.allBrands': ['Alle Marken', 'Toutes les marques', 'Alle merken', 'Tutti i marchi', 'Todas las marcas', 'Todas as marcas', 'All brands'],
  'shop.motorMaker': ['Motorenhersteller', 'Fabricant de moteur', 'Motorfabrikant', 'Produttore del motore', 'Fabricante del motor', 'Fabricante do motor', 'Motor manufacturer'],
  'shop.allMotors': ['Alle Motoren', 'Tous les moteurs', 'Alle motoren', 'Tutti i motori', 'Todos los motores', 'Todos os motores', 'All motors'],
  'shop.maxPrice': ['Max. Preis:', 'Prix max. :', 'Max. prijs:', 'Prezzo max.:', 'Precio máx.:', 'Preço máx.:', 'Max. price:'],
  'shop.inStock': ['Nur sofort lieferbar', 'Uniquement disponible immédiatement', 'Alleen direct leverbaar', 'Solo disponibili subito', 'Solo disponibles de inmediato', 'Apenas disponíveis de imediato', 'Only available now'],
  'shop.showing': ['Zeige {a} von {b} E-Bikes', 'Affichage de {a} sur {b} vélos électriques', '{a} van {b} e-bikes getoond', 'Mostro {a} di {b} e-bike', 'Mostrando {a} de {b} e-bikes', 'A mostrar {a} de {b} e-bikes', 'Showing {a} of {b} e-bikes'],
  'shop.sort': ['Sortieren nach:', 'Trier par :', 'Sorteren op:', 'Ordina per:', 'Ordenar por:', 'Ordenar por:', 'Sort by:'],
  'shop.sortFeatured': ['Empfehlung / Beliebtheit', 'Recommandés / popularité', 'Aanbevolen / populariteit', 'Consigliati / popolarità', 'Recomendados / popularidad', 'Recomendados / popularidade', 'Recommended / popularity'],
  'shop.sortAsc': ['Preis: aufsteigend', 'Prix : croissant', 'Prijs: oplopend', 'Prezzo: crescente', 'Precio: ascendente', 'Preço: crescente', 'Price: low to high'],
  'shop.sortDesc': ['Preis: absteigend', 'Prix : décroissant', 'Prijs: aflopend', 'Prezzo: decrescente', 'Precio: descendente', 'Preço: decrescente', 'Price: high to low'],
  'shop.sortRating': ['Beste Bewertung', 'Mieux notés', 'Beste beoordeling', 'Migliori recensioni', 'Mejor valorados', 'Melhor avaliação', 'Best rated'],
  'shop.noneTitle': ['Keine E-Bikes für diese Filterkriterien gefunden', 'Aucun vélo électrique ne correspond à ces filtres', 'Geen e-bikes gevonden voor deze filters', 'Nessuna e-bike trovata con questi filtri', 'No se han encontrado e-bikes con estos filtros', 'Não foram encontradas e-bikes com estes filtros', 'No e-bikes found for these filters'],
  'shop.noneText': ['Bitte passen Sie Ihre Filterauswahl an oder setzen Sie die Filter zurück.', 'Modifiez vos filtres ou réinitialisez-les.', 'Pas je filters aan of wis ze.', 'Modifica i filtri o reimpostali.', 'Ajusta los filtros o restablécelos.', 'Ajuste os filtros ou reponha-os.', 'Adjust your filters or reset them.'],
  'shop.resetFilters': ['Filter zurücksetzen', 'Réinitialiser les filtres', 'Filters wissen', 'Reimposta i filtri', 'Restablecer filtros', 'Repor filtros', 'Reset filters'],
  'shop.prev': ['Zurück', 'Précédent', 'Vorige', 'Indietro', 'Anterior', 'Anterior', 'Previous'],
  'shop.next': ['Weiter', 'Suivant', 'Volgende', 'Avanti', 'Siguiente', 'Seguinte', 'Next'],
  // ---- checkout (cart and checkout are one page)
  'co.title': ['Warenkorb und Kasse', 'Panier et commande', 'Winkelwagen en kassa', 'Carrello e cassa', 'Cesta y caja', 'Carrinho e checkout', 'Cart and checkout'],
  'co.empty': ['Ihr Warenkorb ist leer.', 'Votre panier est vide.', 'Je winkelwagen is leeg.', 'Il tuo carrello è vuoto.', 'Tu cesta está vacía.', 'O seu carrinho está vazio.', 'Your cart is empty.'],
  'co.emptyText': ['Wählen Sie ein E-Bike aus unserem Sortiment, es landet hier mit Preis und Lieferdetails.', 'Choisissez un vélo électrique dans notre gamme : il apparaît ici avec son prix et les détails de livraison.', 'Kies een e-bike uit ons assortiment: hij verschijnt hier met prijs en leveringsgegevens.', 'Scegli un’e-bike dal nostro assortimento: comparirà qui con prezzo e dettagli di consegna.', 'Elige una e-bike de nuestro catálogo: aparecerá aquí con su precio y los detalles de entrega.', 'Escolha uma e-bike do nosso catálogo: aparece aqui com o preço e os detalhes de entrega.', 'Choose an e-bike from our range: it appears here with price and delivery details.'],
  'co.seeAll': ['Alle E-Bikes ansehen', 'Voir tous les vélos électriques', 'Bekijk alle e-bikes', 'Vedi tutte le e-bike', 'Ver todas las e-bikes', 'Ver todas as e-bikes', 'View all e-bikes'],
  'co.thanks': ['Vielen Dank für Ihre Bestellung!', 'Merci pour votre commande !', 'Bedankt voor je bestelling!', 'Grazie per il tuo ordine!', '¡Gracias por tu pedido!', 'Obrigado pela sua encomenda!', 'Thank you for your order!'],
  'co.orderNo': ['Ihre Bestellnummer lautet {ref}. Eine Bestätigung wurde an {email} gesendet.', 'Votre numéro de commande est {ref}. Une confirmation a été envoyée à {email}.', 'Je bestelnummer is {ref}. Een bevestiging is verzonden naar {email}.', 'Il tuo numero d’ordine è {ref}. Una conferma è stata inviata a {email}.', 'Tu número de pedido es {ref}. Se ha enviado una confirmación a {email}.', 'O número da sua encomenda é {ref}. Foi enviada uma confirmação para {email}.', 'Your order number is {ref}. A confirmation was sent to {email}.'],
  'co.payData': ['Die Zahlungsdaten erhalten Sie in einer separaten E-Mail.', 'Vous recevrez les données de paiement dans un e-mail séparé.', 'De betaalgegevens ontvang je in een aparte e-mail.', 'I dati di pagamento li riceverai in una e-mail separata.', 'Recibirás los datos de pago en un correo aparte.', 'Receberá os dados de pagamento num e-mail separado.', 'You will receive the payment details in a separate email.'],
  'co.continue': ['Weiter im Shop', 'Retour à la boutique', 'Verder in de shop', 'Torna al negozio', 'Seguir en la tienda', 'Voltar à loja', 'Continue in the shop'],
  'co.disabledB': ['Die Online-Bestellung wird gerade eingerichtet.', 'La commande en ligne est en cours de mise en place.', 'Online bestellen wordt momenteel ingericht.', 'L’ordine online è in fase di attivazione.', 'El pedido en línea se está configurando.', 'A encomenda online está a ser configurada.', 'Online ordering is being set up.'],
  'co.disabledT': ['Sie können den Warenkorb vorbereiten, die Bestellung lässt sich erst nach der Freischaltung abschicken.', 'Vous pouvez préparer votre panier ; la commande ne pourra être envoyée qu’après l’activation.', 'Je kunt de winkelwagen alvast klaarmaken; bestellen kan pas na de activering.', 'Puoi preparare il carrello; l’ordine potrà essere inviato solo dopo l’attivazione.', 'Puedes preparar la cesta; el pedido solo podrá enviarse tras la activación.', 'Pode preparar o carrinho; a encomenda só poderá ser enviada após a ativação.', 'You can prepare your cart; the order can only be sent once ordering is enabled.'],
  'co.minB': ['Mindestbestellwert {min}:', 'Commande minimum {min} :', 'Minimumbestelling {min}:', 'Ordine minimo {min}:', 'Pedido mínimo {min}:', 'Encomenda mínima {min}:', 'Minimum order {min}:'],
  'co.minT': ['Es fehlen noch {missing}.', 'Il manque encore {missing}.', 'Er ontbreekt nog {missing}.', 'Mancano ancora {missing}.', 'Faltan {missing}.', 'Faltam {missing}.', '{missing} still missing.'],
  'co.toShop': ['Zum Sortiment', 'Vers la gamme', 'Naar het assortiment', 'All’assortimento', 'Al catálogo', 'Ao catálogo', 'To the range'],
  'co.h1items': ['1. Ihr Warenkorb ({n} Artikel)', '1. Votre panier ({n} article(s))', '1. Je winkelwagen ({n} artikel(en))', '1. Il tuo carrello ({n} articolo/i)', '1. Tu cesta ({n} artículo(s))', '1. O seu carrinho ({n} artigo(s))', '1. Your cart ({n} item(s))'],
  'co.remove': ['{name} entfernen', 'Retirer {name}', '{name} verwijderen', 'Rimuovi {name}', 'Quitar {name}', 'Remover {name}', 'Remove {name}'],
  'co.qtyDown': ['Menge verringern', 'Diminuer la quantité', 'Aantal verlagen', 'Diminuisci la quantità', 'Reducir la cantidad', 'Diminuir a quantidade', 'Decrease quantity'],
  'co.qtyUp': ['Menge erhöhen', 'Augmenter la quantité', 'Aantal verhogen', 'Aumenta la quantità', 'Aumentar la cantidad', 'Aumentar a quantidade', 'Increase quantity'],
  'co.vatIncl': ['inkl. 19 % MwSt.', '', '', '', '', '', ''],
  'co.h2delivery': ['2. Lieferadresse', '2. Adresse de livraison', '2. Bezorgadres', '2. Indirizzo di consegna', '2. Dirección de entrega', '2. Morada de entrega', '2. Delivery address'],
  'co.first': ['Vorname *', 'Prénom *', 'Voornaam *', 'Nome *', 'Nombre *', 'Nome próprio *', 'First name *'],
  'co.last': ['Nachname *', 'Nom *', 'Achternaam *', 'Cognome *', 'Apellidos *', 'Apelido *', 'Last name *'],
  'co.email': ['E-Mail-Adresse *', 'Adresse e-mail *', 'E-mailadres *', 'Indirizzo e-mail *', 'Correo electrónico *', 'Endereço de e-mail *', 'Email address *'],
  'co.phone': ['Telefon für die Spedition *', 'Téléphone pour le transporteur *', 'Telefoon voor de expeditie *', 'Telefono per il corriere *', 'Teléfono para el transportista *', 'Telefone para a transportadora *', 'Phone for the carrier *'],
  'co.street': ['Straße *', 'Rue *', 'Straat *', 'Via *', 'Calle *', 'Rua *', 'Street *'],
  'co.house': ['Hausnr. *', 'N° *', 'Huisnr. *', 'N. civico *', 'N.º *', 'N.º *', 'No. *'],
  'co.zip': ['PLZ *', 'Code postal *', 'Postcode *', 'CAP *', 'Código postal *', 'Código postal *', 'Postcode *'],
  'co.city': ['Stadt *', 'Ville *', 'Plaats *', 'Città *', 'Ciudad *', 'Cidade *', 'City *'],
  'co.country': ['Land *', 'Pays *', 'Land *', 'Paese *', 'País *', 'País *', 'Country *'],
  'co.note': ['Hinweis für die Zustellung (optional)', 'Remarque pour la livraison (facultatif)', 'Opmerking voor de bezorging (optioneel)', 'Note per la consegna (facoltativo)', 'Nota para la entrega (opcional)', 'Nota para a entrega (opcional)', 'Delivery note (optional)'],
  'co.h2pay': ['3. Zahlungsart', '3. Mode de paiement', '3. Betaalmethode', '3. Metodo di pagamento', '3. Forma de pago', '3. Forma de pagamento', '3. Payment method'],
  'co.bank': ['Banküberweisung (Vorkasse)', 'Virement bancaire (paiement à l’avance)', 'Bankoverschrijving (vooruitbetaling)', 'Bonifico bancario (pagamento anticipato)', 'Transferencia bancaria (pago anticipado)', 'Transferência bancária (pagamento antecipado)', 'Bank transfer (prepayment)'],
  'co.bankText': ['Die Bankdaten erhalten Sie nach der Bestellung per E-Mail.', 'Vous recevrez les coordonnées bancaires par e-mail après la commande.', 'De bankgegevens ontvang je na de bestelling per e-mail.', 'Riceverai i dati bancari via e-mail dopo l’ordine.', 'Recibirás los datos bancarios por correo tras el pedido.', 'Receberá os dados bancários por e-mail após a encomenda.', 'You will receive the bank details by email after ordering.'],
  'co.crypto': ['Kryptowährung (USDT oder Bitcoin), 10 % Rabatt', 'Cryptomonnaie (USDT ou Bitcoin), 10 % de remise', 'Cryptovaluta (USDT of Bitcoin), 10% korting', 'Criptovaluta (USDT o Bitcoin), sconto del 10%', 'Criptomoneda (USDT o Bitcoin), 10 % de descuento', 'Criptomoeda (USDT ou Bitcoin), 10 % de desconto', 'Cryptocurrency (USDT or Bitcoin), 10% discount'],
  'co.cryptoText': ['Der Rabatt gilt nur bei dieser Zahlungsart. Die Empfangsadresse und den Betrag erhalten Sie nach der Bestellung per E-Mail.', 'La remise ne s’applique qu’à ce mode de paiement. Vous recevrez l’adresse de réception et le montant par e-mail après la commande.', 'De korting geldt alleen bij deze betaalmethode. Het ontvangstadres en het bedrag ontvang je na de bestelling per e-mail.', 'Lo sconto vale solo con questo metodo di pagamento. Indirizzo di ricezione e importo li riceverai via e-mail dopo l’ordine.', 'El descuento solo se aplica con esta forma de pago. La dirección de recepción y el importe los recibirás por correo tras el pedido.', 'O desconto aplica-se apenas a esta forma de pagamento. O endereço de receção e o montante serão enviados por e-mail após a encomenda.', 'The discount applies only to this payment method. You will receive the receiving address and amount by email after ordering.'],
  'co.summary': ['Bestellübersicht', 'Récapitulatif de la commande', 'Besteloverzicht', 'Riepilogo dell’ordine', 'Resumen del pedido', 'Resumo da encomenda', 'Order summary'],
  'co.goods': ['Warenwert', 'Valeur des articles', 'Waarde van de artikelen', 'Valore della merce', 'Valor de los artículos', 'Valor dos artigos', 'Items subtotal'],
  'co.cryptoDisc': ['Krypto-Rabatt (10 %)', 'Remise crypto (10 %)', 'Cryptokorting (10%)', 'Sconto crypto (10%)', 'Descuento cripto (10 %)', 'Desconto cripto (10 %)', 'Crypto discount (10%)'],
  'co.shipping': ['Versand per Spedition', 'Livraison par transporteur', 'Verzending per expeditie', 'Spedizione via corriere', 'Envío por transportista', 'Envio por transportadora', 'Freight delivery'],
  'co.free': ['kostenlos', 'gratuite', 'gratis', 'gratuita', 'gratis', 'gratuito', 'free'],
  'co.vatIn': ['darin 19 % MwSt.', '', '', '', '', '', ''],
  'co.total': ['Gesamt', 'Total', 'Totaal', 'Totale', 'Total', 'Total', 'Total'],
  'co.shipFree': ['Der Speditionsversand ist kostenfrei.', 'La livraison par transporteur est gratuite.', 'De expeditielevering is gratis.', 'La spedizione via corriere è gratuita.', 'El envío por transportista es gratuito.', 'O envio por transportadora é gratuito.', 'Freight delivery is free.'],
  'co.shipLeft': ['Noch {left} bis zum kostenlosen Speditionsversand ab {limit}.', 'Encore {left} pour la livraison gratuite par transporteur dès {limit}.', 'Nog {left} tot gratis expeditielevering vanaf {limit}.', 'Ancora {left} per la spedizione gratuita via corriere da {limit}.', 'Faltan {left} para el envío gratuito por transportista desde {limit}.', 'Faltam {left} para o envio gratuito por transportadora a partir de {limit}.', '{left} more for free freight delivery from {limit}.'],
  'co.sending': ['Wird gesendet …', 'Envoi en cours …', 'Wordt verzonden …', 'Invio in corso …', 'Enviando …', 'A enviar …', 'Sending …'],
  'co.order': ['Zahlungspflichtig bestellen', 'Commander avec obligation de paiement', 'Bestellen met betalingsverplichting', 'Ordina con obbligo di pagamento', 'Pedir con obligación de pago', 'Encomendar com obrigação de pagamento', 'Place order with obligation to pay'],
  'co.warranty': ['2 Jahre Garantie und 30 Tage Rückgaberecht', 'Garantie de 2 ans et retour sous 30 jours', '2 jaar garantie en 30 dagen retourrecht', 'Garanzia di 2 anni e reso entro 30 giorni', 'Garantía de 2 años y devolución en 30 días', 'Garantia de 2 anos e devolução em 30 dias', '2-year warranty and 30-day returns'],
  'co.delivery': ['Lieferung per Spedition mit Hebebühne', 'Livraison par transporteur avec hayon élévateur', 'Levering per expeditie met laadklep', 'Consegna via corriere con sponda idraulica', 'Entrega por transportista con plataforma elevadora', 'Entrega por transportadora com plataforma elevatória', 'Freight delivery with lift gate'],
  'co.accept': ['Mit der Bestellung akzeptieren Sie die', 'En commandant, vous acceptez les', 'Met je bestelling accepteer je de', 'Ordinando accetti le', 'Al pedir aceptas las', 'Ao encomendar, aceita as', 'By ordering you accept the'],
  'co.returnsTerms': ['Rückgabe- und Garantiebedingungen', 'conditions de retour et de garantie', 'retour- en garantievoorwaarden', 'condizioni di reso e garanzia', 'condiciones de devolución y garantía', 'condições de devolução e garantia', 'returns and warranty terms'],
  'co.and': ['und die', 'et les', 'en de', 'e le', 'y las', 'e as', 'and the'],
  'co.deliveryTerms': ['Lieferbedingungen', 'conditions de livraison', 'leveringsvoorwaarden', 'condizioni di consegna', 'condiciones de entrega', 'condições de entrega', 'delivery terms'],
  'co.errServer': ['Die Bestellung konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.', 'La commande n’a pas pu être transmise. Veuillez réessayer.', 'De bestelling kon niet worden verzonden. Probeer het opnieuw.', 'Non è stato possibile inviare l’ordine. Riprova.', 'No se ha podido enviar el pedido. Inténtalo de nuevo.', 'Não foi possível enviar a encomenda. Tente novamente.', 'The order could not be submitted. Please try again.'],
  'co.errNet': ['Die Bestellung konnte nicht übermittelt werden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.', 'La commande n’a pas pu être transmise. Vérifiez votre connexion et réessayez.', 'De bestelling kon niet worden verzonden. Controleer je verbinding en probeer het opnieuw.', 'Non è stato possibile inviare l’ordine. Controlla la connessione e riprova.', 'No se ha podido enviar el pedido. Comprueba tu conexión e inténtalo de nuevo.', 'Não foi possível enviar a encomenda. Verifique a ligação e tente novamente.', 'The order could not be submitted. Check your connection and try again.'],
  'meta.cartTitle': ['Warenkorb', 'Panier', 'Winkelwagen', 'Carrello', 'Cesta', 'Carrinho', 'Cart'],
  'meta.cartDesc': ['Ihr Warenkorb bei ebikedirect.eu: Auswahl prüfen, Lieferung per Spedition und Zahlungsarten wählen und die Bestellung sicher abschließen.', 'Votre panier chez ebikedirect.eu : vérifiez votre sélection, choisissez la livraison par transporteur et le mode de paiement, puis finalisez votre commande.', 'Je winkelwagen bij ebikedirect.eu: controleer je keuze, kies levering per expeditie en betaalmethode en rond je bestelling af.', 'Il tuo carrello su ebikedirect.eu: controlla la selezione, scegli la consegna via corriere e il pagamento e concludi l’ordine.', 'Tu cesta en ebikedirect.eu: revisa la selección, elige la entrega por transportista y la forma de pago y completa el pedido.', 'O seu carrinho na ebikedirect.eu: reveja a seleção, escolha a entrega por transportadora e a forma de pagamento e conclua a encomenda.', 'Your cart at ebikedirect.eu: check your selection, choose freight delivery and payment method, and complete your order.'],
  'meta.checkoutTitle': ['Kasse', 'Commande', 'Kassa', 'Cassa', 'Caja', 'Checkout', 'Checkout'],
  'meta.checkoutDesc': ['Bestellung abschließen bei ebikedirect.eu: Lieferadresse eingeben, Zahlungsart wählen und Ihr E-Bike sicher per Spedition nach Hause bestellen.', 'Finalisez votre commande chez ebikedirect.eu : saisissez l’adresse de livraison, choisissez le mode de paiement et commandez votre vélo électrique livré chez vous par transporteur.', 'Rond je bestelling af bij ebikedirect.eu: vul het bezorgadres in, kies de betaalmethode en bestel je e-bike veilig per expeditie.', 'Concludi l’ordine su ebikedirect.eu: inserisci l’indirizzo di consegna, scegli il pagamento e ordina la tua e-bike con consegna via corriere.', 'Completa tu pedido en ebikedirect.eu: introduce la dirección de entrega, elige la forma de pago y pide tu e-bike con entrega por transportista.', 'Conclua a encomenda na ebikedirect.eu: indique a morada de entrega, escolha a forma de pagamento e encomende a sua e-bike com entrega por transportadora.', 'Complete your order at ebikedirect.eu: enter the delivery address, choose the payment method and order your e-bike with freight delivery.'],
  'meta.shopTitle': ['Sortiment: E-Bikes im Überblick', 'Gamme : les vélos électriques en un coup d’œil', 'Assortiment: e-bikes in overzicht', 'Assortimento: le e-bike in sintesi', 'Catálogo: las e-bikes de un vistazo', 'Catálogo: as e-bikes num relance', 'Range: e-bikes at a glance'],
  'meta.shopDesc': ['Das komplette E-Bike Sortiment von ebikedirect.eu: Modelle nach Kategorie, Marke und Preis filtern, Motor und Akku vergleichen und online bestellen.', 'Toute la gamme de vélos électriques d’ebikedirect.eu : filtrez par catégorie, marque et prix, comparez moteur et batterie et commandez en ligne.', 'Het complete e-bike-assortiment van ebikedirect.eu: filter op categorie, merk en prijs, vergelijk motor en accu en bestel online.', 'Tutto l’assortimento di e-bike di ebikedirect.eu: filtra per categoria, marchio e prezzo, confronta motore e batteria e ordina online.', 'Todo el catálogo de e-bikes de ebikedirect.eu: filtra por categoría, marca y precio, compara motor y batería y pide en línea.', 'Todo o catálogo de e-bikes da ebikedirect.eu: filtre por categoria, marca e preço, compare motor e bateria e encomende online.', 'The full e-bike range of ebikedirect.eu: filter by category, brand and price, compare motor and battery and order online.'],
  // ---- header, footer, switcher
  'hdr.menuOpen': ['Menü öffnen', 'Ouvrir le menu', 'Menu openen', 'Apri il menu', 'Abrir el menú', 'Abrir o menu', 'Open menu'],
  'hdr.menuClose': ['Menü schließen', 'Fermer le menu', 'Menu sluiten', 'Chiudi il menu', 'Cerrar el menú', 'Fechar o menu', 'Close menu'],
  'hdr.main': ['Hauptnavigation', 'Navigation principale', 'Hoofdnavigatie', 'Navigazione principale', 'Navegación principal', 'Navegação principal', 'Main navigation'],
  'hdr.home': ['ebikedirect.eu Startseite', 'ebikedirect.eu page d’accueil', 'ebikedirect.eu startpagina', 'ebikedirect.eu pagina iniziale', 'ebikedirect.eu página de inicio', 'ebikedirect.eu página inicial', 'ebikedirect.eu home page'],
  'ft.mtb': ['E-Mountainbikes (E-MTB)', 'VTT électriques', 'E-mountainbikes (E-MTB)', 'E-mountain bike (E-MTB)', 'E-bikes de montaña (E-MTB)', 'E-bikes de montanha (E-MTB)', 'Electric mountain bikes (E-MTB)'],
  'ft.trekking': ['E-Trekking & Reiseräder', 'Vélos trekking et de voyage électriques', 'E-trekking en reisfietsen', 'E-trekking e bici da viaggio', 'E-trekking y bicicletas de viaje', 'E-trekking e bicicletas de viagem', 'Electric trekking and touring bikes'],
  'ft.city': ['City E-Bikes & Riemenantrieb', 'Vélos de ville électriques et transmission par courroie', 'Stads e-bikes en riemaandrijving', 'E-bike da città e trasmissione a cinghia', 'E-bikes urbanas y transmisión por correa', 'E-bikes urbanas e transmissão por correia', 'Electric city bikes and belt drive'],
  'ft.speed': ['Speed-Pedelecs (45 km/h)', 'Speed pedelecs (45 km/h)', 'Speed pedelecs (45 km/u)', 'Speed pedelec (45 km/h)', 'Speed pedelecs (45 km/h)', 'Speed pedelecs (45 km/h)', 'Speed pedelecs (45 km/h)'],
  'ft.cargo': ['Lastenräder & Cargo-Bikes', 'Vélos cargo électriques', 'Bakfietsen en cargo-bikes', 'Bici cargo e a pedalata assistita', 'Bicicletas de carga y cargo bikes', 'Bicicletas de carga e cargo bikes', 'Cargo bikes'],
  'ft.warranty': ['Widerruf & 2 Jahre Garantie', 'Rétractation et garantie de 2 ans', 'Herroeping en 2 jaar garantie', 'Recesso e garanzia di 2 anni', 'Desistimiento y garantía de 2 años', 'Livre resolução e garantia de 2 anos', 'Withdrawal and 2-year warranty'],
  'ft.delivery': ['Versand- & Lieferbedingungen', 'Conditions d’expédition et de livraison', 'Verzend- en leveringsvoorwaarden', 'Condizioni di spedizione e consegna', 'Condiciones de envío y entrega', 'Condições de envio e entrega', 'Shipping and delivery terms'],
  'ft.privacy': ['Datenschutzerklärung', 'Politique de confidentialité', 'Privacyverklaring', 'Informativa sulla privacy', 'Política de privacidad', 'Política de privacidade', 'Privacy policy'],
  'sw.label': ['Sprache wählen', 'Choisir la langue', 'Taal kiezen', 'Scegli la lingua', 'Elegir idioma', 'Escolher idioma', 'Choose language'],
  'sw.title': ['Markt und Sprache wählen', 'Choisir le marché et la langue', 'Kies markt en taal', 'Scegli mercato e lingua', 'Elige mercado e idioma', 'Escolha mercado e idioma', 'Select market and language'],
  // ---- product card
  'pc.frameNote': ['Rahmenform und Größe werden bei der Bestellbestätigung abgestimmt', 'Forme et taille du cadre confirmées lors de la validation de la commande', 'Framevorm en maat worden bij de orderbevestiging afgestemd', 'Forma e taglia del telaio vengono concordate alla conferma dell’ordine', 'La forma y la talla del cuadro se acuerdan al confirmar el pedido', 'A forma e o tamanho do quadro são acordados na confirmação da encomenda', 'Frame shape and size are agreed when the order is confirmed'],
};

Object.assign(T, PAGES);

/** Languages whose FAQ, About and Contact copy exists. Other languages are sent to the German page until their batch is built. */
export const hasPages = (l: Locale) => l === 'de' || l === 'fr';

const IDX: Record<string, number> = Object.fromEntries(ORDER.map((l, i) => [l, i]));

export type UiKey = keyof typeof T;

/** Translated UI string; {placeholders} are replaced from vars. Unknown language or key falls back to German. */
export function ui(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const row = T[key];
  if (!row) return key;
  const cell = row[IDX[locale] ?? 0];
  let s = cell === undefined || cell === '=' ? row[0] : cell; // '=' means: not translated yet, use German; '' means: intentionally empty
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** Country names shown in the checkout list (the value sent to the order API stays the German name). */
const COUNTRIES: Record<string, Row> = {
  Deutschland: ['Deutschland', 'Allemagne', 'Duitsland', 'Germania', 'Alemania', 'Alemanha', 'Germany'],
  'Österreich': ['Österreich', 'Autriche', 'Oostenrijk', 'Austria', 'Austria', 'Áustria', 'Austria'],
  Schweiz: ['Schweiz', 'Suisse', 'Zwitserland', 'Svizzera', 'Suiza', 'Suíça', 'Switzerland'],
  Niederlande: ['Niederlande', 'Pays-Bas', 'Nederland', 'Paesi Bassi', 'Países Bajos', 'Países Baixos', 'Netherlands'],
  Frankreich: ['Frankreich', 'France', 'Frankrijk', 'Francia', 'Francia', 'França', 'France'],
  Italien: ['Italien', 'Italie', 'Italië', 'Italia', 'Italia', 'Itália', 'Italy'],
  Spanien: ['Spanien', 'Espagne', 'Spanje', 'Spagna', 'España', 'Espanha', 'Spain'],
  Portugal: ['Portugal', 'Portugal', 'Portugal', 'Portogallo', 'Portugal', 'Portugal', 'Portugal'],
};
export const COUNTRY_VALUES = Object.keys(COUNTRIES);
export const countryLabel = (locale: Locale, de: string) => (COUNTRIES[de] ? COUNTRIES[de][IDX[locale] ?? 0] : de);
