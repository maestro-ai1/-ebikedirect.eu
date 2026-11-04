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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';
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
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
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
