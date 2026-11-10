const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-pages.cjs', 'utf8');
t = t.replace("let primary = own.primary && !bad(own.primary.keyword) && !used.has(nk(own.primary.keyword)) ? own.primary : null;", "let primary = own.primary && !bad(own.primary.keyword) && !used.has(nk(own.primary.keyword)) && (own.primary.intent === 'T' || own.primary.intent === 'C') ? own.primary : null;");
fs.writeFileSync('scripts/_lang-pages.cjs', t);
let p = fs.readFileSync('scripts/_lang-plan.cjs', 'utf8');
p = p.replace('Vélo à assistance électrique femme', 'Vélo assistance électrique femme');
fs.writeFileSync('scripts/_lang-plan.cjs', p);
