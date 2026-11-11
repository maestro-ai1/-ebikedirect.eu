// Scans rendered pages of one language for German text that should have been translated (visible text only, scripts/styles stripped).
// usage: node scripts/_lang-leak.cjs <lang> [base=https://ebikedirect.eu] [paths...]
const lang = process.argv[2] || 'fr';
const base = process.argv[3] || 'https://ebikedirect.eu';
const paths = process.argv.slice(4).length ? process.argv.slice(4) : ['', '/shop', '/cart', '/checkout', '/faq', '/about', '/contact', '/policies', '/policies/delivery', '/policies/returns', '/policies/privacy', '/policies/imprint', '/blog', '/sitemap', '/marken', '/e-bikes', '/zubehoer', '/shop/gazelle-paris-c7plus', '/shop/abus-faltschloss', '/velos-electriques/vtt-electrique', '/marques/cube', '/accessoires/antivols'];
const GER = /\b(und|der|die|das|nicht|für|mit|ist|sind|Sie|Ihre|Ihr|oder|auch|wir|unser|unsere|bei|von|zum|zur|nach|über|wird|werden|kann|können|alle|mehr|jetzt|kaufen|Warenkorb|Lieferung|Rückgabe|Versand|Garantie|Zahlung|Bestellung|Datenschutz|Impressum|Kontakt|Startseite|Marken|Zubehör|Rahmengröße|Kategorien|Fragen|Antworten)\b|[äöüß]/g;
const ALLOW = /(Müller|Bosch|Zubehör: |ebikedirect|Trustpilot|sales@)/;
(async () => {
  let total = 0;
  for (const p of paths) {
    const url = base + (lang === 'de' ? '' : '/' + lang) + p;
    const r = await fetch(url, { redirect: 'follow' });
    if (r.status !== 200) { console.log(String(r.status).padEnd(4), p || '/', '(not 200)'); continue; }
    const h = await r.text();
    const body = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head[\s\S]*?<\/head>/g, ' ').replace(/<[^>]+>/g, '\n');
    const lines = body.split('\n').map((x) => x.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim()).filter((x) => x.length > 3);
    const bad = lines.filter((x) => { const m = x.match(GER); return m && m.length >= 2 && !ALLOW.test(x); });
    total += bad.length;
    console.log(String(bad.length).padStart(4), '/' + lang + p, bad.slice(0, 3).map((x) => '"' + x.slice(0, 70) + '"').join(' | '));
  }
  console.log('total German-looking lines:', total);
})();
