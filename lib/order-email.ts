// HTML order emails (shop notification and customer confirmation) in the site's colours. Table layout and inline styles only, so Gmail, Outlook,
// Apple Mail and phone clients all render it. A plain-text version is always sent next to it by the order route.
export interface MailLine { name: string; qty: number; unit: number; options: string; img: string; url: string }
export interface MailData {
  ref: string; placed: string; paymentLabel: string; lines: MailLine[];
  subtotal: number; discount: number; shipping: number; total: number;
  customer: { name: string; email: string; phone: string; address: string[]; note: string };
}

const SITE = 'https://ebikedirect.eu';
const C = { dark: '#131A22', orange: '#FF5722', green: '#00C853', bg: '#F8F9FA', line: '#E5E8EC', text: '#1F2933', muted: '#6B7785' };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

const row = (label: string, value: string, bold = false) =>
  `<tr><td style="padding:6px 0;font:${bold ? '700' : '400'} 14px ${FONT};color:${bold ? C.text : C.muted};">${label}</td><td align="right" style="padding:6px 0;font:${bold ? '700' : '600'} 14px ${FONT};color:${C.text};">${value}</td></tr>`;

function itemRow(l: MailLine): string {
  const img = l.img ? `<img src="${SITE}${esc(l.img)}" width="72" height="72" alt="${esc(l.name)}" style="display:block;width:72px;height:72px;border-radius:8px;border:1px solid ${C.line};background:#fff;object-fit:contain;">` : '';
  return `<tr>
    <td width="88" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};">${img}</td>
    <td valign="top" style="padding:14px 12px;border-bottom:1px solid ${C.line};font:400 14px ${FONT};color:${C.text};">
      <a href="${SITE}${esc(l.url)}" style="color:${C.text};text-decoration:none;font-weight:700;">${esc(l.name)}</a>
      ${l.options ? `<div style="margin-top:4px;font:400 12px ${FONT};color:${C.muted};">${esc(l.options)}</div>` : ''}
      <div style="margin-top:4px;font:400 12px ${FONT};color:${C.muted};">Menge: ${l.qty}</div>
    </td>
    <td valign="top" align="right" style="padding:14px 0;border-bottom:1px solid ${C.line};font:700 14px ${FONT};color:${C.text};white-space:nowrap;">${eur(l.unit * l.qty)}</td>
  </tr>`;
}

function shell(preheader: string, title: string, intro: string, body: string): string {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
  <tr><td style="background:${C.dark};padding:22px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font:900 22px ${FONT};color:#ffffff;letter-spacing:-0.5px;">ebike<span style="color:${C.orange};">direct</span><span style="color:${C.green};">.eu</span></td>
      <td align="right" style="font:600 12px ${FONT};color:#9AA5B1;">Premium-E-Bike-Fachhändler</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;line-height:4px;font-size:4px;background:${C.orange};">&nbsp;</td></tr>
  <tr><td style="padding:30px 28px 8px;">
    <div style="font:700 12px ${FONT};color:${C.orange};text-transform:uppercase;letter-spacing:1px;">${esc(title)}</div>
    <div style="margin-top:6px;font:800 26px ${FONT};color:${C.dark};">${intro}</div>
  </td></tr>
  ${body}
  <tr><td style="background:${C.bg};padding:22px 28px;border-top:1px solid ${C.line};font:400 12px/1.6 ${FONT};color:${C.muted};">
    ebikedirect.eu · Lieferung per Spedition mit Hebebühne, nach Terminabsprache · 2 Jahre Garantie · 30 Tage Rückgabe<br>
    Fragen? Antworten Sie einfach auf diese E-Mail oder schreiben Sie an <a href="mailto:sales@ebikedirect.eu" style="color:${C.dark};font-weight:600;">sales@ebikedirect.eu</a>.
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function orderBlock(d: MailData): string {
  const meta = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};border-radius:10px;"><tr><td style="padding:16px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Bestellnummer', `<span style="color:${C.orange};">${esc(d.ref)}</span>`, true)}
      ${row('Bestellt am', esc(d.placed))}
      ${row('Zahlungsart', esc(d.paymentLabel))}
    </table></td></tr></table>`;
  const items = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${d.lines.map(itemRow).join('')}</table>`;
  const totals = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    ${row('Warenwert', eur(d.subtotal))}
    ${d.discount ? row('Krypto-Rabatt (10 %)', `<span style="color:${C.green};">-${eur(d.discount)}</span>`) : ''}
    ${row('Versand', d.shipping ? eur(d.shipping) : 'kostenlos')}
    <tr><td colspan="2" style="border-top:2px solid ${C.dark};padding-top:10px;"></td></tr>
    ${row('Gesamt inkl. 19 % MwSt.', `<span style="font-size:18px;">${eur(d.total)}</span>`, true)}
  </table>`;
  return `<tr><td style="padding:18px 28px 6px;">${meta}</td></tr>
  <tr><td style="padding:10px 28px 0;">${items}${totals}</td></tr>`;
}

function addressBlock(d: MailData, shopView: boolean): string {
  const c = d.customer;
  const lines = [esc(c.name), ...c.address.map(esc)].join('<br>');
  const contact = `${esc(c.email)}<br>${esc(c.phone)}`;
  const note = c.note ? `<tr><td colspan="2" style="padding-top:14px;font:400 13px/1.5 ${FONT};color:${C.text};"><b>Hinweis zur Lieferung:</b> ${esc(c.note)}</td></tr>` : '';
  return `<tr><td style="padding:26px 28px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="50%" valign="top" style="padding-right:10px;font:400 14px/1.6 ${FONT};color:${C.text};"><div style="font:700 12px ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Lieferadresse</div>${lines}</td>
      <td width="50%" valign="top" style="padding-left:10px;font:400 14px/1.6 ${FONT};color:${C.text};"><div style="font:700 12px ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${shopView ? 'Kunde' : 'Ihre Kontaktdaten'}</div>${contact}</td>
    </tr>${note}</table></td></tr>`;
}

export function shopEmailHtml(d: MailData): string {
  const body = `${orderBlock(d)}${addressBlock(d, true)}
  <tr><td style="padding:22px 28px 30px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF4EF;border-left:4px solid ${C.orange};border-radius:6px;"><tr><td style="padding:14px 16px;font:400 14px/1.5 ${FONT};color:${C.text};">
    <b>Nächster Schritt:</b> Bestellung prüfen und dem Kunden die Zahlungsdaten per E-Mail senden. Ein Klick auf Antworten geht direkt an ${esc(d.customer.email)}.
  </td></tr></table></td></tr>`;
  return shell(`Neue Bestellung ${d.ref} über ${eur(d.total)}`, 'Neue Bestellung', `${esc(d.ref)} · ${eur(d.total)}`, body);
}

export function customerEmailHtml(d: MailData): string {
  const steps = [['1', 'Wir prüfen Ihre Bestellung', 'Verfügbarkeit und Lieferdaten werden von uns kontrolliert.'], ['2', 'Zahlungsdaten per E-Mail', 'Sie erhalten die Zahlungsdaten in einer separaten E-Mail.'], ['3', 'Lieferung per Spedition', 'Mit Hebebühne, nach Terminabsprache mit Ihnen.']]
    .map(([n, t, s]) => `<tr><td width="36" valign="top" style="padding:8px 0;"><div style="width:26px;height:26px;border-radius:13px;background:${C.dark};color:#fff;font:700 13px/26px ${FONT};text-align:center;">${n}</div></td><td valign="top" style="padding:8px 0;font:400 14px/1.5 ${FONT};color:${C.text};"><b>${t}</b><br><span style="color:${C.muted};">${s}</span></td></tr>`).join('');
  const body = `<tr><td style="padding:0 28px;font:400 15px/1.6 ${FONT};color:${C.text};">Vielen Dank für Ihre Bestellung bei ebikedirect.eu. Wir haben sie erhalten und melden uns in Kürze bei Ihnen.</td></tr>
  ${orderBlock(d)}${addressBlock(d, false)}
  <tr><td style="padding:22px 28px 30px;"><div style="font:700 12px ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">So geht es weiter</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table></td></tr>`;
  return shell(`Ihre Bestellung ${d.ref} ist bei uns eingegangen`, 'Bestellbestätigung', `Danke, ${esc(d.customer.name.split(' ')[0] || '')}!`, body);
}
