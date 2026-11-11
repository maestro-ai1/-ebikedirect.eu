const fs = require('fs');
const f = 'app/[locale]/shop/shop-client.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace("export default function ShopClient() {\n  return (", "export default function ShopClient() {\n  const { u } = useI18n();\n  return (");
t = t.replace("Katalog wird geladen...", "...");
fs.writeFileSync(f, t);
