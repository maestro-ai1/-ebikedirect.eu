// One-off: build-xxl keeps road and gravel e-bikes as category E-Gravel instead of dropping them.
const fs = require('fs');
const f = 'scripts/build-xxl.mjs';
let s = fs.readFileSync(f, 'utf8');
function must(c, m) { if (!c) { console.log('FAILED', m); process.exit(1); } }

// 1. replace the exclusion filter line
const a = s.indexOf('items = items.filter((m) => !/gravel|solace');
must(a > 0, 'exclusion line');
const b = s.indexOf('\n', a);
s = s.slice(0, a) + "// ordinary bikes that the road listing also shows are not road or gravel bikes\nitems = items.filter((m) => !(m._catrun && m.cat === 'E-Gravel' && /urbanator|endeavour|touring/i.test(m.name)));" + s.slice(b);

// 2. category inference
s = s.replace("  if (CARGO_BRANDS.has(m.brand) || CARGO.test(t)) return 'Cargo-E-Bike';", "  if (m._catrun && m.cat === 'E-Gravel') return 'E-Gravel';\n  if (ROAD.test(t)) return 'E-Gravel';\n  if (CARGO_BRANDS.has(m.brand) || CARGO.test(t)) return 'Cargo-E-Bike';");
must(s.includes("return 'E-Gravel'"), 'inferCat');
s = s.replace("const CARGO_BRANDS =", "const ROAD = /gravel|solace|esilex|topstone|synapse|addict|speedster|\\borca\\b|\\bgain\\b|creo|defy|denna|norza|checkpoint|revolt|contend|nuroad|domane|endurace|\\bavail\\b|e-astr|kanzo|e-?gravel/i;\nconst CARGO_BRANDS =");
must(s.includes('const ROAD ='), 'ROAD');

// 3. German label
s = s.replace("'Speed-Pedelec': 'S-Pedelec',", "'Speed-Pedelec': 'S-Pedelec', 'E-Gravel': 'E-Gravel-Bike',");
must(s.includes("'E-Gravel': 'E-Gravel-Bike'"), 'CAT_DE');
fs.writeFileSync(f, s);
console.log('build-xxl patched');
