const fs = require('fs');
const files = [
  ['app/[locale]/policies/page.tsx', 'PoliciesIndexPage', '/policies'],
  ['app/[locale]/policies/delivery/page.tsx', 'DeliveryPolicyPage', '/policies/delivery'],
  ['app/[locale]/policies/returns/page.tsx', 'ReturnsPolicyPage', '/policies/returns'],
  ['app/[locale]/policies/privacy/page.tsx', 'PrivacyPolicyPage', '/policies/privacy'],
  ['app/[locale]/policies/imprint/page.tsx', 'ImprintPage', '/policies/imprint'],
  ['app/[locale]/sitemap/page.tsx', 'SitemapPage', '/sitemap'],
];
for (const [f, name, path] of files) {
  let t = fs.readFileSync(f, 'utf8');
  if (t.includes('redirect(')) { console.log('already', f); continue; }
  t = t.replace(`export default function ${name}() {`, `export default async function ${name}({ params }: { params: Promise<{ locale: string }> }) {\n  const { locale } = await params;\n  if (locale !== 'de') redirect('${path}'); // legal and utility pages exist in German only until the owner approves translations`);
  if (!/from 'next\/navigation'/.test(t)) t = "import { redirect } from 'next/navigation';\n" + t;
  else t = t.replace(/import \{([^}]*)\} from 'next\/navigation';/, (m, a) => (/redirect/.test(a) ? m : `import {${a.trimEnd()}, redirect } from 'next/navigation';`));
  fs.writeFileSync(f, t);
  console.log('patched', f, t.includes('redirect('));
}
