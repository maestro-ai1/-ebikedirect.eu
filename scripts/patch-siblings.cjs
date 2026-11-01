// One-off: makes the "more brands" list on brand hub pages follow the catalogue instead of a fixed list.
const fs = require('fs');
const f = 'components/seo/mapped-page.tsx';
let s = fs.readFileSync(f, 'utf8');
const start = s.indexOf("def.type === 'brand' ? ['/marken/cube'");
if (start < 0) { console.log('start not found'); process.exit(1); }
const end = s.indexOf("] :", start);
if (end < 0) { console.log('end not found'); process.exit(1); }
s = s.slice(0, start) + "def.type === 'brand' ? MAPPED_PAGES.filter((m) => m.type === 'brand' && m.brand).map((m) => m.path" + s.slice(end + 1);
s = s.replace("import { getMappedPage } from '@/lib/mapped-pages';", "import { getMappedPage, MAPPED_PAGES } from '@/lib/mapped-pages';");
fs.writeFileSync(f, s);
console.log('patched');
