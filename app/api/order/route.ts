import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/lib/products';
import { shopEmailHtml, customerEmailHtml, MailData } from '@/lib/order-email';

// Order endpoint (WebForge pattern): validates the request, prices every line from the catalogue (the browser's prices are never trusted)
// and sends the order by SMTP to the shop and a confirmation to the customer. It never reports success unless the mail really went out.
// Needed once: EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_SECURE, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM, ORDER_TO_EMAIL
// and the nodemailer package (a package.json change the owner has to approve).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIN_ORDER = 500;
const FREE_SHIPPING = 1000;
const SHIPPING = 49;
const NOT_READY = 'Die Online-Bestellung ist noch nicht freigeschaltet. Bitte versuchen Sie es später erneut.';

const mailConfigured = () =>
  Boolean(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD && process.env.EMAIL_FROM && process.env.ORDER_TO_EMAIL);

// Sequential order numbers (#001, #002 ...). The counter lives in Upstash Redis (Vercel Marketplace; the REST variables are set when it is connected).
// Without the counter, or if it is unreachable, the order still goes through with a date-based number so no order is lost.
async function nextOrderRef(): Promise<string> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/incr/ebikedirect:order-number`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const j: any = await r.json();
      const n = Number(j?.result);
      if (r.ok && Number.isInteger(n) && n > 0) return `#${String(n).padStart(3, '0')}`;
    } catch { /* fall through to the date-based number */ }
  }
  return `EBD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function GET() {
  return NextResponse.json({ enabled: mailConfigured() });
}

interface InLine { slug: string; quantity: number; frame?: string; batteryWh?: number; color?: string }
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const eur = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 }); }

  const c = body?.customer || {};
  const customer = {
    firstName: str(c.firstName, 80), lastName: str(c.lastName, 80), email: str(c.email, 160), phone: str(c.phone, 40),
    street: str(c.street, 120), houseNumber: str(c.houseNumber, 20), zip: str(c.zip, 12), city: str(c.city, 80), country: str(c.country, 60), note: str(c.deliveryNote, 500)
  };
  if (!customer.firstName || !customer.lastName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email) || !customer.phone || !customer.street || !customer.houseNumber || !customer.zip || !customer.city) {
    return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus und prüfen Sie die E-Mail-Adresse.' }, { status: 400 });
  }
  const payment = body?.payment === 'crypto' ? 'crypto' : body?.payment === 'bank' ? 'bank' : '';
  if (!payment) return NextResponse.json({ error: 'Bitte wählen Sie eine Zahlungsart.' }, { status: 400 });

  const lines: { name: string; slug: string; qty: number; unit: number; frame: string; wh: number; color: string; img: string }[] = [];
  const input: InLine[] = Array.isArray(body?.items) ? body.items.slice(0, 30) : [];
  for (const it of input) {
    const p = PRODUCTS.find((x) => x.slug === str(it.slug, 200));
    const qty = Math.round(Number(it.quantity));
    if (!p || !Number.isFinite(qty) || qty < 1 || qty > 10) return NextResponse.json({ error: 'Ein Artikel im Warenkorb ist nicht mehr verfügbar. Bitte prüfen Sie den Warenkorb.' }, { status: 400 });
    const bat = p.options.batteries.find((b) => b.capacityWh === Number(it.batteryWh)) || p.options.batteries[0];
    lines.push({ name: p.name, slug: p.slug, qty, unit: p.price + (bat.priceDelta || 0), frame: str(it.frame, 60), wh: bat.capacityWh, color: str(it.color, 60), img: p.image || '' });
  }
  if (!lines.length) return NextResponse.json({ error: 'Ihr Warenkorb ist leer.' }, { status: 400 });

  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  if (subtotal < MIN_ORDER) return NextResponse.json({ error: `Der Mindestbestellwert beträgt ${eur(MIN_ORDER)}.` }, { status: 400 });
  const discount = payment === 'crypto' ? Math.round(subtotal * 10) / 100 : 0; // 10 % on goods, only when crypto is chosen
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING;
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;

  if (!mailConfigured()) return NextResponse.json({ error: NOT_READY }, { status: 503 });

  const ref = await nextOrderRef();
  const placed = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Europe/Berlin' }).format(new Date());
  const itemText = lines.map((l) => `- ${l.qty} x ${l.name} (${[l.frame, `${l.wh} Wh`, l.color].filter(Boolean).join(', ')}): ${eur(l.unit * l.qty)}`).join('\n');
  const summary = `Bestellnummer: ${ref}\nBestellt am: ${placed}\nZahlungsart: ${payment === 'crypto' ? 'Kryptowährung (10 % Rabatt)' : 'Banküberweisung (Vorkasse)'}\n\n${itemText}\n\nWarenwert: ${eur(subtotal)}${discount ? `\nKrypto-Rabatt: -${eur(discount)}` : ''}\nVersand: ${eur(shipping)}\nGesamt inkl. 19 % MwSt.: ${eur(total)}`;
  const addr = `${customer.firstName} ${customer.lastName}\n${customer.street} ${customer.houseNumber}\n${customer.zip} ${customer.city}\n${customer.country}\nTelefon: ${customer.phone}\nE-Mail: ${customer.email}${customer.note ? `\nHinweis: ${customer.note}` : ''}`;

  const mail: MailData = {
    ref, placed, paymentLabel: payment === 'crypto' ? 'Kryptowährung (10 % Rabatt)' : 'Banküberweisung (Vorkasse)',
    lines: lines.map((l) => ({ name: l.name, qty: l.qty, unit: l.unit, options: [l.frame, `${l.wh} Wh`, l.color].filter(Boolean).join(' · '), img: l.img, url: `/shop/${l.slug}` })),
    subtotal, discount, shipping, total,
    customer: { name: `${customer.firstName} ${customer.lastName}`, email: customer.email, phone: customer.phone, address: [`${customer.street} ${customer.houseNumber}`, `${customer.zip} ${customer.city}`, customer.country].filter(Boolean), note: customer.note },
  };
  try {
    // @ts-ignore nodemailer ships no type declarations
    const nm: any = (await import('nodemailer')).default;
    const transport = nm.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 587),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
    });
    await transport.sendMail({ from: process.env.EMAIL_FROM, to: process.env.ORDER_TO_EMAIL, replyTo: customer.email, subject: `Neue Bestellung ${ref} · ${eur(total)}`, html: shopEmailHtml(mail), text: `${summary}\n\nKunde:\n${addr}` });
    await transport.sendMail({
      from: process.env.EMAIL_FROM, to: customer.email, subject: `Bestellung eingegangen: ${ref}`,
      html: customerEmailHtml(mail), text: `Vielen Dank für Ihre Bestellung bei ebikedirect.eu.\n\n${summary}\n\nLieferadresse:\n${addr}\n\nWir prüfen Ihre Bestellung und senden Ihnen die Zahlungsdaten in einer separaten E-Mail. Die Lieferung erfolgt per Spedition mit Hebebühne.`
    });
  } catch {
    return NextResponse.json({ error: NOT_READY }, { status: 503 });
  }
  return NextResponse.json({ ok: true, ref, total });
}
