const fs = require('fs');
let t = fs.readFileSync('scripts/_lang-plan-en.cjs', 'utf8');
const B = String.fromCharCode(92);
t = t.replace(/  elec: '[^\n]*\n/, "  elec: '(?<![a-z])(electric|e[ -]?bikes?|ebikes?|e[ -]?mtb|emtb|e[ -]?cycles?|pedelecs?|e[ -]?trike|power assist)',\n");
t = t.replace("|tesco)',", "|tesco|" + B + B + "b(stem|saddles?|helmets?|shorts|shoes|baskets?|bags?|gloves|locks?|lights?|pumps?|racks?|trailers?|tyres?|tires?|brakes?|pedals?|jerseys?|clothing|exercise|stationary|orange|seats?|chains?|wheels?|frames?|bibs?|jackets?|bells?|mudguards?|stands?)" + B + B + "b)',");
t = t.replace("rel: '(" + B + B + "bmen" + B + B + "b|mens|gents|male)'", "rel: '((?<![a-z])(men|mens|gents|male)(?![a-z]))'");
fs.writeFileSync('scripts/_lang-plan-en.cjs', t);
const p = require('./_lang-plan-en.cjs');
console.log(p.elec); console.log(p.guard.slice(-200)); console.log(p.batches.batch1[9].rel);
