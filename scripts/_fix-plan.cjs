const fs = require('fs');
let p = fs.readFileSync('scripts/_lang-plan.cjs', 'utf8');
p = p.replace(/elec: '[^\n]*\n/, "elec: '(é|e)lectri|assistance|\\bvae\\b|vtt ?ae|pedelec|e.?bike',\n    brands: '(cube|scott|ktm|giant|orbea|trek|haibike|specialized|kalkhoff|gazelle|bosch|shimano|yamaha|cannondale|focus|winora|flyer|hercules|brompton|\\bliv\\b|riese|stromer|kettler|conway|babboe|tenways|nakamura|granville|vespa|moustache|cowboy|btwin)',\n");
fs.writeFileSync('scripts/_lang-plan.cjs', p);
let t = fs.readFileSync('scripts/_lang-pages.cjs', 'utf8');
t = t.replace("(plan.notSold && new RegExp(plan.notSold, 'i').test(k))", "(plan.notSold && new RegExp(plan.notSold, 'i').test(k)) || (plan.brands && new RegExp(plan.brands, 'i').test(k))");
fs.writeFileSync('scripts/_lang-pages.cjs', t);
