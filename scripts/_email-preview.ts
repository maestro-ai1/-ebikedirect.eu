import fs from 'fs';
import { shopEmailHtml, customerEmailHtml, MailData, ORDER_LANGS, INTL } from '../lib/order-email';
import { PRODUCTS } from '../lib/products';
import { localName } from '../lib/l10n-names';
const p = PRODUCTS.find((x) => x.category !== 'Zubehör')!;
const q = PRODUCTS.find((x) => x.category === 'Zubehör')!;
const dir = 'C:/electric bikes europe/02-site-architecture/reports/';
for (const lang of ORDER_LANGS) {
  const nm = (n: string) => (lang === 'de' ? n : localName(lang, n));
  const lines = [{ name: nm(p.name), qty: 1, unit: p.price, options: 'L · 625 Wh', img: p.image, url: `/shop/${p.slug}` }, { name: nm(q.name), qty: 2, unit: q.price, options: '', img: q.image, url: `/shop/${q.slug}` }];
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const d: MailData = { lang, ref: '#003', placed: new Intl.DateTimeFormat(INTL[lang], { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date()), payment: lang === 'it' ? 'crypto' : 'bank', lines, subtotal, discount: lang === 'it' ? Math.round(subtotal * 10) / 100 : 0, shipping: 0, total: subtotal, customer: { name: 'Max Mustermann', email: 'max@example.com', phone: '+49 170 0000000', address: ['Musterstraße 12', '10115 Berlin'], country: lang === 'fr' ? 'Frankreich' : 'Deutschland', note: lang === 'de' ? 'Bitte vorher anrufen.' : '' } };
  fs.writeFileSync(dir + `email-preview-customer-${lang}.html`, customerEmailHtml(d));
  if (lang === 'fr' || lang === 'de') fs.writeFileSync(dir + `email-preview-shop-${lang}.html`, shopEmailHtml(d));
}
console.log('ok');
