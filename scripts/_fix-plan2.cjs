const fs = require('fs');
let p = fs.readFileSync('scripts/_lang-plan.cjs', 'utf8');
const D = {
  'vtt-electrique': "Prix d'un VTT électrique", 'velo-cargo-electrique': 'Vélo cargo pas cher', 'velo-electrique-ville': 'VTC électrique',
  'velo-electrique-pliant': 'Vélo électrique pliable pas cher', 'speed-pedelec': 'Vélo électrique 45 km/h', 'velo-electrique-gravel-route': 'Vélo électrique pour route',
  'velo-electrique-enfant': 'Vélo électrique pour enfant', 'velo-electrique-femme': 'Vélo à assistance électrique femme', 'velo-electrique-homme': 'Meilleur vélo électrique homme', 'moteur-batterie': 'Moteur de vélo électrique',
};
for (const [k, v] of Object.entries(D)) p = p.replace("{ url: '/velos-electriques/" + k + "/',", "{ display: " + JSON.stringify(v) + ", url: '/velos-electriques/" + k + "/',");
fs.writeFileSync('scripts/_lang-plan.cjs', p);
let t = fs.readFileSync('scripts/_lang-pages.cjs', 'utf8');
t = t.replace("out.push({ url: t.url,", "out.push({ display: t.display, url: t.url,");
fs.writeFileSync('scripts/_lang-pages.cjs', t);
