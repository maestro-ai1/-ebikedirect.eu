// Full-language leak scan: every /<lang>/ URL in the sitemap, visible text lines (scripts/styles stripped) that hold German words or German number formats.
// usage: node scripts/_en-leak-all.cjs <lang> [base] [limit]
const lang = process.argv[2] || 'en';
const base = process.argv[3] || 'https://ebikedirect.eu';
const limit = +process.argv[4] || 100000;
const GER = /\b(Zoll|Akku|Farbe|Fachhandel|Rahmen(?:größe|form)?|Größe|Gewicht|Reichweite|Lager|Uhr|laut|Abbildung|Verfügbarkeit|Grundpreis|enthalten|Lieferung|Versand|Warenkorb|Kontakt|Datenschutz|Pflichtangaben|Impressum|Deutschland|und|der|die|das|nicht|für|mit|ist|sind|oder|auch|wir|bei|von|zum|zur|nach|über|wird|kann|alle|mehr|jetzt|kaufen|Bremsen|Schaltung|Reifen|Motor-?leistung|Preis|inkl|zzgl|Stück|Jahre|Rückgabe|Garantie|Zahlung|Bestellung|Händler|Werkstatt|Meister|Zubehör|Ersatzteil|Fahrrad|Lastenrad|Damen|Herren|Kinder|Beleuchtung|Gepäckträger|Schloss|Helm|Tasche|Ständer|Schutzblech)\b/;
const ALLOW = /(^[a-z0-9-]+$|Müller|Kollwitzstraße|Berlin|ebikedirect|Trustpilot|sales@|Riese|Impressum & Pflichtangaben|Deutschland)/;
const STRICT = /(Zoll|Akku|Farbe|Fachhandel|Größe|Gewicht|Reichweite|Abbildung|Verfügbarkeit|Grundpreis|enthalten|Warenkorb|Datenschutz|Reifen|Uhr|laut|Lieferung|Versand|Zubehör|Rahmen|Gepäckträger|alle Modelle)/;
const DECIMAL = /\b\d+,\d+\s?(inch|in\b|kg|Zoll|Wh|Nm|km|mm|cm)/;
async function main() {
  const sm = await (await fetch(base + '/sitemap.xml')).text();
  let urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => base + m[1].replace(/^https?:\/\/[^/]+/, '')).filter((u) => u.startsWith(base + '/' + lang + '/') || u === base + '/' + lang);
  urls = urls.slice(0, limit);
  const seen = new Map(); let n = 0, i = 0;
  const work = async () => { while (i < urls.length) { const u = urls[i++]; try { const r = await fetch(u); if (r.status !== 200) { seen.set('STATUS ' + r.status, (seen.get('STATUS ' + r.status) || []).concat(u)); continue; } const h = await r.text(); n++;
    const body = h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head[\s\S]*?<\/head>/g, ' ').replace(/<[^>]+>/g, '\n');
    const meta = [(h.match(/<title>([^<]*)<\/title>/) || [])[1], (h.match(/<meta name="description" content="([^"]*)"/) || [])[1]].filter(Boolean);
    const lines = body.split('\n').concat(meta).map((x) => x.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim()).filter((x) => x.length > 2);
    for (const x of lines) { if (lang === 'fr' ? (STRICT.test(x) && !ALLOW.test(x)) : ((GER.test(x) || DECIMAL.test(x)) && !ALLOW.test(x))) { const k = x.slice(0, 90); (seen.get(k) || seen.set(k, []).get(k)).push(u); } }
  } catch (e) { seen.set('ERR', (seen.get('ERR') || []).concat(u + ' ' + e.message)); } } };
  await Promise.all(Array.from({ length: 8 }, work));
  console.log('pages scanned', n, 'of', urls.length);
  const out = [...seen.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [k, v] of out.slice(0, 80)) console.log(String(v.length).padStart(5), '"' + k + '"', v[0].replace(base, ''));
  console.log('distinct leaking lines:', out.length);
}
main();
