const fs = require('fs');
let t = fs.readFileSync('lib/l10n-strings.ts', 'utf8');
t = t.replace("  const kind: PageKind = kind0 === 'hub' ? 'brand' : kind0;", "  if (kind0 === 'hub') return `${display} : toutes les marques de vélos électriques de la boutique avec le nombre de modèles. Comparez et commandez en ligne, garantie de 2 ans.`;\n  const kind: PageKind = kind0;");
fs.writeFileSync('lib/l10n-strings.ts', t);
