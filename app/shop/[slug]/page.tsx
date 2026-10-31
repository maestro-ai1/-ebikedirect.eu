import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { ProductJsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ProductDetailClient } from './product-client';

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

  return {
    title: `${product.name} | ebikedirect.eu`,
    description: `${product.shortDescription} Preis: ${product.price} € inkl. 19% MwSt. 10% Rabatt bei Krypto-Zahlung.`,
    openGraph: {
      title: `${product.name} | ebikedirect.eu`,
      description: product.shortDescription,
      images: [{ url: product.image }],
      url: `${siteUrl}/shop/${product.slug}`
    },
    alternates: {
      canonical: `${siteUrl}/shop/${product.slug}`
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
      <ProductDetailClient product={product} />
    </>
  );
}
