const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-brands.cjs', 'utf8');
t = t.replace("const map = require(", "live.pages = live.pages.filter((p) => !/^\/(marques|accessoires)\//.test(p.url));\nconst map = require(");
fs.writeFileSync('scripts/_lang-brands.cjs', t);
