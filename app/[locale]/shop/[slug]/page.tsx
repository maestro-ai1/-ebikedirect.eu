import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { ProductJsonLd } from '@/components/seo/json-ld';
import { ProductLinks } from '@/components/seo/product-links';
import { ProductContent } from '@/components/seo/product-content';
import { AccessoryContent } from '@/components/seo/accessory-content';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ProductDetailClient } from './product-client';
import { productTitle, productDescription } from '@/lib/product-seo';
import { productFocusKeyword } from '@/lib/product-keywords';
import { L10nProductContent } from '@/components/seo/l10n-product-content';
import { productKit } from '@/lib/l10n-product-kit';
import { localName } from '@/lib/l10n-names';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';
  const K = productKit(locale);
  if (K) {
    const frT = K.title(product), frD = K.description(product);
    return { title: { absolute: frT }, description: frD, openGraph: { title: frT, description: frD, images: [{ url: product.image }], url: `${siteUrl}/${locale}/shop/${product.slug}` } };
  }
  const focus = productFocusKeyword(product.slug, product.name);
  const title = productTitle(product.name, focus);
  const description = productDescription(product, focus);

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image }],
      url: `${siteUrl}/shop/${product.slug}`
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const K = productKit(locale);
  if (K) {
    const built = K.build(product);
    const e = K.entry(product);
    const focus = e.primary.source === 'bank' ? e.primary.keyword : localName(locale, product.name);
    return (
      <>
        <ProductJsonLd product={product} description={built.lead} urlPrefix={`/${locale}`} name={localName(locale, product.name)} />
        <Breadcrumbs items={[{ label: K.ui.shop, href: `/${locale}/shop` }, { label: K.categoryLabel[product.category] || product.category, href: `/${locale}/shop` }, { label: localName(locale, product.name), href: `/${locale}/shop/${product.slug}` }]} />
        <ProductDetailClient product={product} focusKeyword={focus} frView={{ lead: built.lead, specs: built.specs, category: K.categoryLabel[product.category] || product.category, h1: K.h1(product) }} />
        <L10nProductContent product={product} locale={locale} />
      </>
    );
  }

  return (
    <>
      <ProductJsonLd product={product} />
      <Breadcrumbs
        items={[
          { label: 'E-Bike Sortiment', href: '/shop' },
          { label: product.category, href: `/shop?category=${product.category}` },
          { label: product.name, href: `/shop/${product.slug}` }
        ]}
      />
      <ProductDetailClient product={product} focusKeyword={productFocusKeyword(product.slug, product.name)} />
      {product.category !== 'Zubehör' && <ProductContent product={product} />}
      {product.category === 'Zubehör' && <AccessoryContent product={product} />}
      {product.category !== 'Zubehör' && <ProductLinks brand={product.brand} category={product.category} motor={product.motor} />}
    </>
  );
}
