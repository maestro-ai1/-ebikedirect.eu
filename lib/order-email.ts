// HTML order emails in the site's colours. Table layout and inline styles only, so Gmail, Outlook, Apple Mail and phone clients all render it.
// The customer confirmation is written in the language the customer ordered in (de, fr, nl, it, es, pt, en).
// The shop notification stays German and says which market the order came from (website language and delivery country).
export type OrderLang = 'de' | 'fr' | 'nl' | 'it' | 'es' | 'pt' | 'en';
export const ORDER_LANGS: OrderLang[] = ['de', 'fr', 'nl', 'it', 'es', 'pt', 'en'];
export const asOrderLang = (v: unknown): OrderLang => (ORDER_LANGS.includes(v as OrderLang) ? (v as OrderLang) : 'de');
export const INTL: Record<OrderLang, string> = { de: 'de-DE', fr: 'fr-FR', nl: 'nl-NL', it: 'it-IT', es: 'es-ES', pt: 'pt-PT', en: 'en-IE' };
// Shown to the shop owner in German: where the order came from.
export const MARKET: Record<OrderLang, { code: string; name: string; site: string }> = {
  de: { code: 'DE', name: 'Deutschland, Österreich, Schweiz', site: 'Deutsch' },
  fr: { code: 'FR', name: 'Frankreich, Belgien', site: 'Français' },
  nl: { code: 'NL', name: 'Niederlande, Belgien', site: 'Nederlands' },
  it: { code: 'IT', name: 'Italien', site: 'Italiano' },
  es: { code: 'ES', name: 'Spanien', site: 'Español' },
  pt: { code: 'PT', name: 'Portugal', site: 'Português' },
  en: { code: 'EN', name: 'Englischsprachige Kunden (Europa)', site: 'English' },
};

export interface MailLine { name: string; qty: number; unit: number; options: string; img: string; url: string }
export interface MailData {
  lang: OrderLang; ref: string; placed: string; payment: 'bank' | 'crypto'; lines: MailLine[];
  subtotal: number; discount: number; shipping: number; total: number;
  customer: { name: string; email: string; phone: string; address: string[]; country: string; note: string };
}

interface Strings {
  tag: string; eyebrow: string; hello: string; intro: string; ordNo: string; placedOn: string; payment: string; payBank: string; payCrypto: string; qty: string;
  goods: string; cryptoDisc: string; shipping: string; free: string; total: string; addr: string; contact: string; note: string; next: string;
  s: [string, string][]; footer1: string; footer2: string; pre: string; subject: string;
}
const T: Record<OrderLang, Strings> = {
  de: { tag: 'Premium-E-Bike-Fachhändler', eyebrow: 'Bestellbestätigung', hello: 'Danke, {n}!', intro: 'Vielen Dank für Ihre Bestellung bei ebikedirect.eu. Wir haben sie erhalten und melden uns in Kürze bei Ihnen.', ordNo: 'Bestellnummer', placedOn: 'Bestellt am', payment: 'Zahlungsart', payBank: 'Banküberweisung (Vorkasse)', payCrypto: 'Kryptowährung (10 % Rabatt)', qty: 'Menge', goods: 'Warenwert', cryptoDisc: 'Krypto-Rabatt (10 %)', shipping: 'Versand', free: 'kostenlos', total: 'Gesamt inkl. 19 % MwSt.', addr: 'Lieferadresse', contact: 'Ihre Kontaktdaten', note: 'Hinweis zur Lieferung', next: 'So geht es weiter',
    s: [['Wir prüfen Ihre Bestellung', 'Verfügbarkeit und Lieferdaten werden von uns kontrolliert.'], ['Zahlungsdaten per E-Mail', 'Sie erhalten die Zahlungsdaten in einer separaten E-Mail.'], ['Lieferung per Spedition', 'Mit Hebebühne, nach Terminabsprache mit Ihnen.']],
    footer1: 'Lieferung per Spedition mit Hebebühne, nach Terminabsprache · 2 Jahre Garantie · 30 Tage Rückgabe', footer2: 'Fragen? Antworten Sie einfach auf diese E-Mail oder schreiben Sie an', pre: 'Ihre Bestellung {ref} ist bei uns eingegangen', subject: 'Bestellung eingegangen: {ref}' },
  fr: { tag: 'Spécialiste premium du vélo électrique', eyebrow: 'Confirmation de commande', hello: 'Merci, {n} !', intro: 'Merci pour votre commande sur ebikedirect.eu. Nous l’avons bien reçue et reviendrons vers vous très prochainement.', ordNo: 'Numéro de commande', placedOn: 'Commande passée le', payment: 'Mode de paiement', payBank: 'Virement bancaire (paiement à l’avance)', payCrypto: 'Cryptomonnaie (10 % de remise)', qty: 'Quantité', goods: 'Montant des articles', cryptoDisc: 'Remise crypto (10 %)', shipping: 'Livraison', free: 'gratuite', total: 'Total TTC (TVA 19 % incluse)', addr: 'Adresse de livraison', contact: 'Vos coordonnées', note: 'Remarque pour la livraison', next: 'Et ensuite ?',
    s: [['Nous vérifions votre commande', 'Nous contrôlons la disponibilité et les données de livraison.'], ['Coordonnées de paiement par e-mail', 'Vous recevrez les coordonnées de paiement dans un e-mail séparé.'], ['Livraison par transporteur', 'Avec hayon élévateur, sur rendez-vous avec vous.']],
    footer1: 'Livraison par transporteur avec hayon élévateur, sur rendez-vous · Garantie 2 ans · Retour sous 30 jours', footer2: 'Une question ? Répondez simplement à cet e-mail ou écrivez à', pre: 'Votre commande {ref} est bien enregistrée', subject: 'Commande reçue : {ref}' },
  nl: { tag: 'Premium e-bikespecialist', eyebrow: 'Orderbevestiging', hello: 'Bedankt, {n}!', intro: 'Bedankt voor uw bestelling bij ebikedirect.eu. Wij hebben deze ontvangen en nemen binnenkort contact met u op.', ordNo: 'Ordernummer', placedOn: 'Besteld op', payment: 'Betaalmethode', payBank: 'Bankoverschrijving (vooruitbetaling)', payCrypto: 'Cryptovaluta (10 % korting)', qty: 'Aantal', goods: 'Waarde van de artikelen', cryptoDisc: 'Cryptokorting (10 %)', shipping: 'Verzending', free: 'gratis', total: 'Totaal incl. 19 % btw', addr: 'Bezorgadres', contact: 'Uw contactgegevens', note: 'Opmerking bij de levering', next: 'Hoe gaat het verder?',
    s: [['Wij controleren uw bestelling', 'Wij controleren de beschikbaarheid en de leveringsgegevens.'], ['Betaalgegevens per e-mail', 'U ontvangt de betaalgegevens in een aparte e-mail.'], ['Levering per expeditie', 'Met laadklep, in overleg met u.']],
    footer1: 'Levering per expeditie met laadklep, op afspraak · 2 jaar garantie · 30 dagen retour', footer2: 'Vragen? Beantwoord gewoon deze e-mail of schrijf naar', pre: 'Uw bestelling {ref} is ontvangen', subject: 'Bestelling ontvangen: {ref}' },
  it: { tag: 'Specialista premium di e-bike', eyebrow: 'Conferma d’ordine', hello: 'Grazie, {n}!', intro: 'Grazie per il Suo ordine su ebikedirect.eu. Lo abbiamo ricevuto e La contatteremo a breve.', ordNo: 'Numero d’ordine', placedOn: 'Ordinato il', payment: 'Metodo di pagamento', payBank: 'Bonifico bancario (pagamento anticipato)', payCrypto: 'Criptovaluta (sconto del 10 %)', qty: 'Quantità', goods: 'Valore della merce', cryptoDisc: 'Sconto cripto (10 %)', shipping: 'Spedizione', free: 'gratuita', total: 'Totale IVA 19 % inclusa', addr: 'Indirizzo di consegna', contact: 'I Suoi recapiti', note: 'Nota per la consegna', next: 'Cosa succede ora',
    s: [['Verifichiamo il Suo ordine', 'Controlliamo disponibilità e dati di consegna.'], ['Dati di pagamento via e-mail', 'Riceverà i dati di pagamento in una e-mail separata.'], ['Consegna con spedizioniere', 'Con sponda idraulica, su appuntamento con Lei.']],
    footer1: 'Consegna con spedizioniere e sponda idraulica, su appuntamento · Garanzia di 2 anni · Reso entro 30 giorni', footer2: 'Domande? Risponda semplicemente a questa e-mail o scriva a', pre: 'Il Suo ordine {ref} è stato ricevuto', subject: 'Ordine ricevuto: {ref}' },
  es: { tag: 'Especialista premium en bicicletas eléctricas', eyebrow: 'Confirmación del pedido', hello: '¡Gracias, {n}!', intro: 'Gracias por su pedido en ebikedirect.eu. Lo hemos recibido y nos pondremos en contacto con usted en breve.', ordNo: 'Número de pedido', placedOn: 'Pedido realizado el', payment: 'Forma de pago', payBank: 'Transferencia bancaria (pago por adelantado)', payCrypto: 'Criptomoneda (10 % de descuento)', qty: 'Cantidad', goods: 'Importe de los artículos', cryptoDisc: 'Descuento cripto (10 %)', shipping: 'Envío', free: 'gratis', total: 'Total con 19 % de IVA incluido', addr: 'Dirección de entrega', contact: 'Sus datos de contacto', note: 'Nota para la entrega', next: 'Qué sucede ahora',
    s: [['Revisamos su pedido', 'Comprobamos la disponibilidad y los datos de entrega.'], ['Datos de pago por correo', 'Recibirá los datos de pago en un correo aparte.'], ['Entrega por transporte de carga', 'Con plataforma elevadora, previa cita con usted.']],
    footer1: 'Entrega por transporte de carga con plataforma elevadora, previa cita · 2 años de garantía · 30 días para devoluciones', footer2: '¿Preguntas? Responda a este correo o escriba a', pre: 'Hemos recibido su pedido {ref}', subject: 'Pedido recibido: {ref}' },
  pt: { tag: 'Especialista premium em bicicletas elétricas', eyebrow: 'Confirmação da encomenda', hello: 'Obrigado, {n}!', intro: 'Obrigado pela sua encomenda na ebikedirect.eu. Recebemo-la e entraremos em contacto consigo brevemente.', ordNo: 'Número da encomenda', placedOn: 'Encomendado em', payment: 'Forma de pagamento', payBank: 'Transferência bancária (pagamento antecipado)', payCrypto: 'Criptomoeda (10 % de desconto)', qty: 'Quantidade', goods: 'Valor dos artigos', cryptoDisc: 'Desconto cripto (10 %)', shipping: 'Envio', free: 'grátis', total: 'Total com 19 % de IVA incluído', addr: 'Morada de entrega', contact: 'Os seus dados de contacto', note: 'Nota para a entrega', next: 'O que acontece a seguir',
    s: [['Verificamos a sua encomenda', 'Confirmamos a disponibilidade e os dados de entrega.'], ['Dados de pagamento por e-mail', 'Receberá os dados de pagamento num e-mail separado.'], ['Entrega por transportadora', 'Com plataforma elevatória, mediante marcação consigo.']],
    footer1: 'Entrega por transportadora com plataforma elevatória, mediante marcação · 2 anos de garantia · 30 dias para devolução', footer2: 'Dúvidas? Responda simplesmente a este e-mail ou escreva para', pre: 'A sua encomenda {ref} foi recebida', subject: 'Encomenda recebida: {ref}' },
  en: { tag: 'Premium e-bike specialist', eyebrow: 'Order confirmation', hello: 'Thank you, {n}!', intro: 'Thank you for your order at ebikedirect.eu. We have received it and will get back to you shortly.', ordNo: 'Order number', placedOn: 'Ordered on', payment: 'Payment method', payBank: 'Bank transfer (prepayment)', payCrypto: 'Cryptocurrency (10 % discount)', qty: 'Quantity', goods: 'Goods value', cryptoDisc: 'Crypto discount (10 %)', shipping: 'Shipping', free: 'free', total: 'Total incl. 19 % VAT', addr: 'Delivery address', contact: 'Your contact details', note: 'Delivery note', next: 'What happens next',
    s: [['We check your order', 'We verify availability and delivery details.'], ['Payment details by email', 'You will receive the payment details in a separate email.'], ['Delivery by freight carrier', 'With a lift gate, by appointment with you.']],
    footer1: 'Delivery by freight carrier with lift gate, by appointment · 2-year warranty · 30-day returns', footer2: 'Questions? Simply reply to this email or write to', pre: 'Your order {ref} has been received', subject: 'Order received: {ref}' },
};
export const customerSubject = (lang: OrderLang, ref: string) => T[lang].subject.replace('{ref}', ref);
export const paymentLabel = (lang: OrderLang, p: 'bank' | 'crypto') => (p === 'crypto' ? T[lang].payCrypto : T[lang].payBank);

const SITE = 'https://ebikedirect.eu';
const C = { dark: '#131A22', orange: '#FF5722', green: '#00C853', bg: '#F8F9FA', line: '#E5E8EC', text: '#1F2933', muted: '#6B7785' };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n: number, lang: OrderLang) => new Intl.NumberFormat(INTL[lang], { style: 'currency', currency: 'EUR' }).format(n);

const row = (label: string, value: string, bold = false) =>
  `<tr><td style="padding:6px 0;font:${bold ? '700' : '400'} 14px ${FONT};color:${bold ? C.text : C.muted};">${label}</td><td align="right" style="padding:6px 0;font:${bold ? '700' : '600'} 14px ${FONT};color:${C.text};">${value}</td></tr>`;

function itemRow(l: MailLine, t: Strings, lang: OrderLang): string {
  const img = l.img ? `<img src="${SITE}${esc(l.img)}" width="72" height="72" alt="${esc(l.name)}" style="display:block;width:72px;height:72px;border-radius:8px;border:1px solid ${C.line};background:#fff;object-fit:contain;">` : '';
  return `<tr>
    <td width="88" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};">${img}</td>
    <td valign="top" style="padding:14px 12px;border-bottom:1px solid ${C.line};font:400 14px ${FONT};color:${C.text};">
      <a href="${SITE}${esc(l.url)}" style="color:${C.text};text-decoration:none;font-weight:700;">${esc(l.name)}</a>
      ${l.options ? `<div style="margin-top:4px;font:400 12px ${FONT};color:${C.muted};">${esc(l.options)}</div>` : ''}
      <div style="margin-top:4px;font:400 12px ${FONT};color:${C.muted};">${t.qty}: ${l.qty}</div>
    </td>
    <td valign="top" align="right" style="padding:14px 0;border-bottom:1px solid ${C.line};font:700 14px ${FONT};color:${C.text};white-space:nowrap;">${money(l.unit * l.qty, lang)}</td>
  </tr>`;
}

function shell(lang: OrderLang, t: Strings, preheader: string, title: string, intro: string, body: string, topBadge = ''): string {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
  <tr><td style="background:${C.dark};padding:22px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font:900 22px ${FONT};color:#ffffff;letter-spacing:-0.5px;">ebike<span style="color:${C.orange};">direct</span><span style="color:${C.green};">.eu</span></td>
      <td align="right" style="font:600 12px ${FONT};color:#9AA5B1;">${esc(t.tag)}</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;line-height:4px;font-size:4px;background:${C.orange};">&nbsp;</td></tr>
  ${topBadge}
  <tr><td style="padding:30px 28px 8px;">
    <div style="font:700 12px ${FONT};color:${C.orange};text-transform:uppercase;letter-spacing:1px;">${esc(title)}</div>
    <div style="margin-top:6px;font:800 26px ${FONT};color:${C.dark};">${intro}</div>
  </td></tr>
  ${body}
  <tr><td style="background:${C.bg};padding:22px 28px;border-top:1px solid ${C.line};font:400 12px/1.6 ${FONT};color:${C.muted};">
    ebikedirect.eu · ${esc(t.footer1)}<br>
    ${esc(t.footer2)} <a href="mailto:sales@ebikedirect.eu" style="color:${C.dark};font-weight:600;">sales@ebikedirect.eu</a>.
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function orderBlock(d: MailData, t: Strings, lang: OrderLang, extraMeta = ''): string {
  const meta = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};border-radius:10px;"><tr><td style="padding:16px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row(t.ordNo, `<span style="color:${C.orange};">${esc(d.ref)}</span>`, true)}
      ${row(t.placedOn, esc(d.placed))}
      ${row(t.payment, esc(paymentLabel(lang, d.payment)))}
      ${extraMeta}
    </table></td></tr></table>`;
  const items = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${d.lines.map((l) => itemRow(l, t, lang)).join('')}</table>`;
  const totals = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    ${row(t.goods, money(d.subtotal, lang))}
    ${d.discount ? row(t.cryptoDisc, `<span style="color:${C.green};">-${money(d.discount, lang)}</span>`) : ''}
    ${row(t.shipping, d.shipping ? money(d.shipping, lang) : t.free)}
    <tr><td colspan="2" style="border-top:2px solid ${C.dark};padding-top:10px;"></td></tr>
    ${row(t.total, `<span style="font-size:18px;">${money(d.total, lang)}</span>`, true)}
  </table>`;
  return `<tr><td style="padding:18px 28px 6px;">${meta}</td></tr>
  <tr><td style="padding:10px 28px 0;">${items}${totals}</td></tr>`;
}

function addressBlock(d: MailData, t: Strings, contactTitle: string, addrTitle: string, noteTitle: string): string {
  const c = d.customer;
  const lines = [esc(c.name), ...c.address.map(esc)].join('<br>');
  const contact = `${esc(c.email)}<br>${esc(c.phone)}`;
  const note = c.note ? `<tr><td colspan="2" style="padding-top:14px;font:400 13px/1.5 ${FONT};color:${C.text};"><b>${noteTitle}:</b> ${esc(c.note)}</td></tr>` : '';
  const head = (s: string) => `<div style="font:700 12px ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${s}</div>`;
  return `<tr><td style="padding:26px 28px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="50%" valign="top" style="padding-right:10px;font:400 14px/1.6 ${FONT};color:${C.text};">${head(addrTitle)}${lines}</td>
      <td width="50%" valign="top" style="padding-left:10px;font:400 14px/1.6 ${FONT};color:${C.text};">${head(contactTitle)}${contact}</td>
    </tr>${note}</table></td></tr>`;
}

// Shop notification: German, with the market the order came from (website language and delivery country) at the top and in the order box.
export function shopEmailHtml(d: MailData): string {
  const de = T.de; const m = MARKET[d.lang];
  const badge = `<tr><td style="padding:18px 28px 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:${C.dark};border-radius:6px 0 0 6px;padding:8px 12px;font:800 13px ${FONT};color:#ffffff;letter-spacing:1px;">${m.code}</td>
    <td style="background:#EAF9F0;border:1px solid #BFE9D0;border-left:0;border-radius:0 6px 6px 0;padding:8px 14px;font:700 13px ${FONT};color:${C.dark};">Bestellung aus: ${esc(m.name)} · Website: ${esc(m.site)}</td>
  </tr></table></td></tr>`;
  const extra = row('Website-Sprache', `${esc(m.site)} (${m.code})`) + row('Lieferland', esc(d.customer.country));
  const body = `${orderBlock(d, de, 'de', extra)}${addressBlock(d, de, 'Kunde', 'Lieferadresse', 'Hinweis zur Lieferung')}
  <tr><td style="padding:22px 28px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF4EF;border-left:4px solid ${C.orange};border-radius:6px;"><tr><td style="padding:14px 16px;font:400 14px/1.5 ${FONT};color:${C.text};">
    <b>Nächster Schritt:</b> Bestellung prüfen und dem Kunden die Zahlungsdaten per E-Mail senden${d.lang === 'de' ? '' : ` (Kundensprache: ${esc(m.site)})`}. Ein Klick auf Antworten geht direkt an ${esc(d.customer.email)}.
  </td></tr></table></td></tr>`;
  return shell('de', de, `Neue Bestellung ${d.ref} aus ${m.code} über ${money(d.total, 'de')}`, 'Neue Bestellung', `${esc(d.ref)} · ${money(d.total, 'de')}`, body, badge);
}

export function customerEmailHtml(d: MailData): string {
  const lang = d.lang; const t = T[lang];
  const steps = t.s.map(([title, sub], i) => `<tr><td width="36" valign="top" style="padding:8px 0;"><div style="width:26px;height:26px;border-radius:13px;background:${C.dark};color:#fff;font:700 13px/26px ${FONT};text-align:center;">${i + 1}</div></td><td valign="top" style="padding:8px 0;font:400 14px/1.5 ${FONT};color:${C.text};"><b>${esc(title)}</b><br><span style="color:${C.muted};">${esc(sub)}</span></td></tr>`).join('');
  const body = `<tr><td style="padding:0 28px;font:400 15px/1.6 ${FONT};color:${C.text};">${esc(t.intro)}</td></tr>
  ${orderBlock(d, t, lang)}${addressBlock(d, t, t.contact, t.addr, t.note)}
  <tr><td style="padding:22px 28px 30px;"><div style="font:700 12px ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${esc(t.next)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table></td></tr>`;
  const first = d.customer.name.split(' ')[0] || '';
  return shell(lang, t, t.pre.replace('{ref}', d.ref), t.eyebrow, esc(t.hello.replace('{n}', first)), body);
}

// Plain-text version of the customer confirmation (every mail carries one next to the HTML).
export function customerEmailText(d: MailData): string {
  const t = T[d.lang]; const L = d.lang;
  const items = d.lines.map((l) => `- ${l.qty} x ${l.name}${l.options ? ` (${l.options})` : ''}: ${money(l.unit * l.qty, L)}`).join('\n');
  return `${t.hello.replace('{n}', d.customer.name.split(' ')[0] || '')}\n\n${t.intro}\n\n${t.ordNo}: ${d.ref}\n${t.placedOn}: ${d.placed}\n${t.payment}: ${paymentLabel(L, d.payment)}\n\n${items}\n\n${t.goods}: ${money(d.subtotal, L)}${d.discount ? `\n${t.cryptoDisc}: -${money(d.discount, L)}` : ''}\n${t.shipping}: ${d.shipping ? money(d.shipping, L) : t.free}\n${t.total}: ${money(d.total, L)}\n\n${t.addr}:\n${d.customer.name}\n${d.customer.address.join('\n')}\n\n${t.next}:\n${t.s.map(([a, b], i) => `${i + 1}. ${a}: ${b}`).join('\n')}\n\n${t.footer2} sales@ebikedirect.eu`;
}

// Error messages the checkout shows, in the customer's language.
const E: Record<OrderLang, { fields: string; payment: string; gone: string; empty: string; min: string; notReady: string; bad: string }> = {
  de: { fields: 'Bitte füllen Sie alle Pflichtfelder aus und prüfen Sie die E-Mail-Adresse.', payment: 'Bitte wählen Sie eine Zahlungsart.', gone: 'Ein Artikel im Warenkorb ist nicht mehr verfügbar. Bitte prüfen Sie den Warenkorb.', empty: 'Ihr Warenkorb ist leer.', min: 'Der Mindestbestellwert beträgt {x}.', notReady: 'Die Online-Bestellung ist noch nicht freigeschaltet. Bitte versuchen Sie es später erneut.', bad: 'Ungültige Anfrage.' },
  fr: { fields: 'Veuillez remplir tous les champs obligatoires et vérifier l’adresse e-mail.', payment: 'Veuillez choisir un mode de paiement.', gone: 'Un article du panier n’est plus disponible. Veuillez vérifier votre panier.', empty: 'Votre panier est vide.', min: 'Le montant minimum de commande est de {x}.', notReady: 'La commande en ligne n’est pas encore activée. Veuillez réessayer plus tard.', bad: 'Requête invalide.' },
  nl: { fields: 'Vul alle verplichte velden in en controleer het e-mailadres.', payment: 'Kies een betaalmethode.', gone: 'Een artikel in uw winkelwagen is niet meer beschikbaar. Controleer uw winkelwagen.', empty: 'Uw winkelwagen is leeg.', min: 'Het minimale bestelbedrag is {x}.', notReady: 'Online bestellen is nog niet beschikbaar. Probeer het later opnieuw.', bad: 'Ongeldig verzoek.' },
  it: { fields: 'Compili tutti i campi obbligatori e controlli l’indirizzo e-mail.', payment: 'Scelga un metodo di pagamento.', gone: 'Un articolo nel carrello non è più disponibile. Controlli il carrello.', empty: 'Il Suo carrello è vuoto.', min: 'L’importo minimo dell’ordine è di {x}.', notReady: 'L’ordine online non è ancora attivo. Riprovi più tardi.', bad: 'Richiesta non valida.' },
  es: { fields: 'Rellene todos los campos obligatorios y compruebe el correo electrónico.', payment: 'Elija una forma de pago.', gone: 'Un artículo del carrito ya no está disponible. Revise su carrito.', empty: 'Su carrito está vacío.', min: 'El importe mínimo del pedido es de {x}.', notReady: 'El pedido en línea aún no está activado. Inténtelo de nuevo más tarde.', bad: 'Solicitud no válida.' },
  pt: { fields: 'Preencha todos os campos obrigatórios e verifique o endereço de e-mail.', payment: 'Escolha uma forma de pagamento.', gone: 'Um artigo do carrinho já não está disponível. Verifique o carrinho.', empty: 'O seu carrinho está vazio.', min: 'O valor mínimo da encomenda é de {x}.', notReady: 'A encomenda online ainda não está ativa. Tente novamente mais tarde.', bad: 'Pedido inválido.' },
  en: { fields: 'Please fill in all required fields and check the email address.', payment: 'Please choose a payment method.', gone: 'An item in your cart is no longer available. Please check your cart.', empty: 'Your cart is empty.', min: 'The minimum order value is {x}.', notReady: 'Online ordering is not available yet. Please try again later.', bad: 'Invalid request.' },
};
export const orderError = (lang: OrderLang, key: keyof (typeof E)['de'], x = '') => E[lang][key].replace('{x}', x);
export const placedAt = (lang: OrderLang) => new Intl.DateTimeFormat(INTL[lang], { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Europe/Berlin' }).format(new Date());
