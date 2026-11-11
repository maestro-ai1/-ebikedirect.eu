const fs = require('fs');
const edit = (file, pairs) => {
  let t = fs.readFileSync(file, 'utf8');
  for (const [a, b, all] of pairs) { if (!t.includes(a)) { console.log('MISSING', file, a.slice(0, 70)); continue; } t = all ? t.split(a).join(b) : t.replace(a, b); }
  fs.writeFileSync(file, t);
};
edit('lib/ui.ts', [
  ["  let s = row[IDX[locale] ?? 0] || row[0];", "  const cell = row[IDX[locale] ?? 0];\n  let s = cell === undefined || cell === '=' ? row[0] : cell; // '=' means: not translated yet, use German; '' means: intentionally empty"],
  ["'co.vatIncl': ['inkl. 19 % MwSt.', 'TVA incluse', 'btw inbegrepen', 'IVA inclusa', 'IVA incluido', 'IVA incluído', 'VAT included'],", "'co.vatIncl': ['inkl. 19 % MwSt.', '', '', '', '', '', ''],"],
  ["// No VAT rate is named outside German: the other languages say \"VAT included\" only (owner decision on VAT wording is pending).", "// No VAT wording outside German (owner: leave VAT out where other countries do not need it)."],
]);
edit('app/[locale]/checkout/page.tsx', [
  ["<div className=\"text-[11px] text-gray-500\">{u('co.vatIncl')}</div>", "{u('co.vatIncl') && <div className=\"text-[11px] text-gray-500\">{u('co.vatIncl')}</div>}"],
]);
edit('app/[locale]/shop/[slug]/product-client.tsx', [
  ["'TVA incluse, expédition assurée par transporteur, port gratuit dès 10 000 €'", "'Expédition assurée par transporteur, port gratuit dès 10 000 €'"],
]);
edit('lib/l10n-product.ts', [
  ["Le prix est de ${price}, TVA incluse. En cas", "Le prix est de ${price}. En cas"],
  ["coûte ${price}, TVA incluse. En cas", "coûte ${price}. En cas"],
  ["`${price}, TVA incluse${p.price < 10000", "`${price}${p.price < 10000"],
  ["No VAT rate is named.", "No VAT wording."],
]);
edit('lib/l10n-strings.ts', [["No VAT rate is named.", "No VAT wording."]]);
console.log('code scrubbed');
