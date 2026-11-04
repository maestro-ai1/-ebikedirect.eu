const k = require('../data/keywords/products.json').products;
const fs = require('fs');
const txt = fs.readFileSync('lib/catalog-cube.ts','utf8')+fs.readFileSync('lib/catalog-xxl.ts','utf8')+fs.readFileSync('lib/catalog-haibike.ts','utf8')+fs.readFileSync('lib/catalog-giant.ts','utf8');
const find = (re, n) => { const out = []; const rx = /"slug": "([^"]+)"[\s\S]*?"motor": "([^"]*)"[\s\S]*?"batteryStandardWh": (\d+)/g; let m; while ((m = rx.exec(txt))) if (re.test(m[2]) && k[m[1]]) out.push(m[1] + ' | ' + m[2] + ' | ' + m[3]); return out.slice(0, n); };
console.log(find(/Performance Line CX/i, 4)); console.log(find(/EP801/i, 4)); console.log(find(/Bosch/i, 3));
