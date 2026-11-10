const fs = require('fs');
// 1. product-links.tsx: export BRAND_SITES
let f = 'components/seo/product-links.tsx';
let t = fs.readFileSync(f, 'utf8');
t = t.replace('const BRAND_SITES: Record', 'export const BRAND_SITES: Record');
fs.writeFileSync(f, t);

// 2. l10n-pages.ts: product pages are translated pairs (every product exists in French)
f = 'lib/l10n-pages.ts';
t = fs.readFileSync(f, 'utf8');
if (!t.includes('isFrProduct')) {
  t = t.replace("const norm = (u: string)", "import { PRODUCTS } from '@/lib/products';\nconst PRODUCT_SLUGS = new Set(PRODUCTS.map((p) => p.slug));\nconst isFrProduct = (path: string) => /^\\/shop\\/[^/]+$/.test(norm0(path)) && PRODUCT_SLUGS.has(norm0(path).slice(6));\nconst norm0 = (u: string) => (u.length > 1 ? u.replace(/\\/$/, '') : u);\nconst norm = (u: string)");
  t = t.replace("  let dePath: string | null = null;\n  if (locale === 'de') {\n    dePath = norm(strippedPath);\n    if (!L10N_LOCALES.some((l) => l10nByDePath(l, dePath!))) return null;\n  } else {\n    const p = l10nByUrl(locale, strippedPath);\n    if (!p) return null;\n    dePath = norm(p.dePath);\n  }",
    "  let dePath: string | null = null;\n  if (isFrProduct(strippedPath) && (locale === 'de' || locale === 'fr')) {\n    dePath = norm(strippedPath);\n    const out: { hreflang: string; url: string }[] = [];\n    for (const r of ['de', 'de-DE', 'de-AT', 'de-CH']) out.push({ hreflang: r, url: `${baseUrl}${dePath}` });\n    for (const r of ['fr', 'fr-FR', 'fr-BE']) out.push({ hreflang: r, url: `${baseUrl}/fr${dePath}` });\n    out.push({ hreflang: 'x-default', url: `${baseUrl}${dePath}` });\n    return out;\n  }\n  if (locale === 'de') {\n    dePath = norm(strippedPath);\n    if (!L10N_LOCALES.some((l) => l10nByDePath(l, dePath!))) return null;\n  } else {\n    const p = l10nByUrl(locale, strippedPath);\n    if (!p) return null;\n    dePath = norm(p.dePath);\n  }");
  t = t.replace("export function isL10nPath(locale: Locale, strippedPath: string): boolean {\n  return !!l10nByUrl(locale, strippedPath);", "export function isL10nPath(locale: Locale, strippedPath: string): boolean {\n  if (locale === 'fr' && isFrProduct(strippedPath)) return true;\n  return !!l10nByUrl(locale, strippedPath);");
}
fs.writeFileSync(f, t);

// 3. json-ld: optional description / url / language overrides
f = 'components/seo/json-ld.tsx';
t = fs.readFileSync(f, 'utf8');
t = t.replace("export function ProductJsonLd({ product }: { product: Product }) {", "export function ProductJsonLd({ product, description, urlPrefix = '' }: { product: Product; description?: string; urlPrefix?: string }) {");
t = t.replace("    'description': product.description,\n    'sku': product.id,", "    'description': description || product.description,\n    'sku': product.id,");
t = t.replace("      'url': `${baseUrl}/shop/${product.slug}`,\n      'priceCurrency'", "      'url': `${baseUrl}${urlPrefix}/shop/${product.slug}`,\n      'priceCurrency'");
fs.writeFileSync(f, t);

// 4. product page route
f = 'app/[locale]/shop/[slug]/page.tsx';
t = fs.readFileSync(f, 'utf8');
if (!t.includes('l10n-product')) {
  t = t.replace("import { productFocusKeyword } from '@/lib/product-keywords';", "import { productFocusKeyword } from '@/lib/product-keywords';\nimport { L10nProductContent } from '@/components/seo/l10n-product-content';\nimport { frTitle, frDescription, frEntry, frDisplay, buildFrContent, FR_CATEGORY_LABEL } from '@/lib/l10n-product';");
  t = t.replace("interface Props {\n  params: Promise<{ slug: string }>;\n}", "interface Props {\n  params: Promise<{ locale: string; slug: string }>;\n}");
  t = t.replace("  const { slug } = await params;\n  const product = PRODUCTS.find((p) => p.slug === slug);\n  if (!product) {\n    return { title: 'Produkt nicht gefunden' };\n  }\n\n  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';", "  const { locale, slug } = await params;\n  const product = PRODUCTS.find((p) => p.slug === slug);\n  if (!product) {\n    return { title: 'Produkt nicht gefunden' };\n  }\n\n  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';\n  if (locale === 'fr') {\n    const frT = frTitle(product), frD = frDescription(product);\n    return { title: { absolute: frT }, description: frD, openGraph: { title: frT, description: frD, images: [{ url: product.image }], url: `${siteUrl}/fr/shop/${product.slug}` } };\n  }");
  t = t.replace("  const { slug } = await params;\n  const product = PRODUCTS.find((p) => p.slug === slug);\n\n  if (!product) {\n    notFound();\n  }\n\n  return (", "  const { locale, slug } = await params;\n  const product = PRODUCTS.find((p) => p.slug === slug);\n\n  if (!product) {\n    notFound();\n  }\n\n  if (locale === 'fr') {\n    const built = buildFrContent(product);\n    const e = frEntry(product);\n    const focus = e.primary.source === 'bank' ? e.primary.keyword : product.name;\n    return (\n      <>\n        <ProductJsonLd product={product} description={built.lead} urlPrefix=\"/fr\" />\n        <Breadcrumbs items={[{ label: 'Boutique', href: '/fr/shop' }, { label: FR_CATEGORY_LABEL[product.category] || product.category, href: '/fr/shop' }, { label: product.name, href: `/fr/shop/${product.slug}` }]} />\n        <ProductDetailClient product={product} focusKeyword={focus} frView={{ lead: built.lead, specs: built.specs, category: FR_CATEGORY_LABEL[product.category] || product.category }} />\n        <L10nProductContent product={product} />\n      </>\n    );\n  }\n\n  return (");
}
fs.writeFileSync(f, t);
console.log('ok', t.includes("locale === 'fr'"), fs.readFileSync('lib/l10n-pages.ts', 'utf8').includes('isFrProduct'));
