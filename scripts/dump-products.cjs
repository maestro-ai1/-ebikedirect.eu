// Dumps the merged catalogue (lib/products.ts) to a JSON file so keyword scripts can read it without a TypeScript runner.
// node scripts/dump-products.cjs [out.json]
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

Module._extensions['.ts'] = (module, filename) => {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } });
  module._compile(out.outputText, filename);
};
const root = path.resolve(__dirname, '..');
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith('@/')) request = path.join(root, request.slice(2));
  return origResolve.call(this, request, parent, ...rest);
};

const { PRODUCTS } = require(path.join(root, 'lib', 'products.ts'));
const out = process.argv[2] || path.join(root, '.image-work', 'products-dump.json');
fs.writeFileSync(out, JSON.stringify(PRODUCTS.map((p) => ({ id: p.id, slug: p.slug, name: p.name, brand: p.brand, category: p.category, accessory: p.accessory || null, price: p.price, motor: p.motor, batteryStandardWh: p.batteryStandardWh, words: (p.description || '').split(/\s+/).filter(Boolean).length, specs: Object.keys(p.specs || {}).length, gallery: (p.gallery || []).length, image: p.image })), null, 1));
console.log('products dumped:', PRODUCTS.length, '->', out);
