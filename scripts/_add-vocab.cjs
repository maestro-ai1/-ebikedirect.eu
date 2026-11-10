const fs = require('fs');
let p = fs.readFileSync('scripts/_lang-plan.cjs', 'utf8');
if (!p.includes('vocab:')) p = p.replace("    floor: 50,\n", "    floor: 50,\n    vocab: 'velo|velos|electrique|electriques|vtt|vtc|vae|e|bike|bikes|ebike|ebikes|assistance|femme|homme|enfant|enfants|pas|cher|prix|meilleur|meilleurs|acheter|achat|boutique|magasin|en|ligne|pour|de|du|des|d|la|le|les|un|une|et|ville|route|gravel|cargo|pliant|pliable|trekking|montagne|tout|terrain|suspendu|semi|rigide|moteur|batterie|autonomie|gamme|modele|modeles|collection|promo|soldes|comparatif|vente|catalogue|magasins|bicyclette|speed|pedelec|fat|cadre|bas',\n");
fs.writeFileSync('scripts/_lang-plan.cjs', p);
