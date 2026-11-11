const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-brands-en.cjs', 'utf8');
t = t.replace("rel: '(saddle|handlebars?|grips|bike bell|seat post)'", "rel: '(saddle|handlebar (grips|tape)|bike grips|bike bell|seat post)'");
fs.writeFileSync('scripts/_lang-brands-en.cjs', t);
