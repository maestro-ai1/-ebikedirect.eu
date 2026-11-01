// Copies every Nth product photo into .image-work/review for a visual contact-sheet check: node scripts/review-sample.cjs [step]
const fs = require('fs');
const path = require('path');
const step = Number(process.argv[2] || 8);
const products = JSON.parse(fs.readFileSync('.image-work/products-dump.json', 'utf8')).filter((p) => p.category !== 'Zubehör');
const before = fs.existsSync('.image-work/catalog-xxl.before.ts') ? fs.readFileSync('.image-work/catalog-xxl.before.ts', 'utf8') : '';
const fresh = products.filter((p) => !before.includes(`'${p.slug}'`) && !before.includes(`"${p.slug}"`));
const out = '.image-work/review';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
let n = 0;
fresh.forEach((p, i) => {
  if (i % step) return;
  const f = path.join('public', p.image.replace(/^\//, ''));
  if (fs.existsSync(f)) { fs.copyFileSync(f, path.join(out, p.brand.replace(/[^A-Za-z]/g, '') + '-' + p.slug.slice(0, 28) + '.webp')); n++; }
});
console.log('new bikes:', fresh.length, 'sampled:', n);
