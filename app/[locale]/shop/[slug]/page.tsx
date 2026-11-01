import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { ProductJsonLd } from '@/components/seo/json-ld';
import { ProductLinks } from '@/components/seo/product-links';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ProductDetailClient } from './product-client';

interface Props {
  params: Promise<{ slug: string }>;
}

// Product Rule: title starts with the product name (focus keyword) and fits 60 characters;
// meta description 110 to 158 characters with price and a call to action.
function productTitle(name: string): string {
  const full = `${name} kaufen | ebikedirect.eu`;
  if (full.length <= 60) return full;
  const short = `${name} | ebikedirect.eu`;
  return short.length <= 60 ? short : name.slice(0, 60);
}

function productDescription(p: { name: string; price: number; motor: string; batteryStandardWh: number; rangeKm: number }): string {
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p.price);
  const spec = `${p.motor}${p.batteryStandardWh > 0 ? `, ${p.batteryStandardWh} Wh` : ''}${p.rangeKm > 0 ? `, bis ${p.rangeKm} km Reichweite` : ''}.`;
  const parts = [`${p.name} kaufen:`, spec, `Preis ${price}.`, 'Lieferung per Spedition. Jetzt online bestellen.'];
  let text = parts.join(' ');
  if (text.length > 158) text = [parts[0], `${p.motor}, ${p.batteryStandardWh} Wh.`, parts[2], parts[3]].join(' ');
  if (text.length > 158) text = [parts[0], `${p.batteryStandardWh} Wh Akku.`, parts[2], parts[3]].join(' ');
  if (text.length < 110) text = `${text} Alle Preise inklusive Mehrwertsteuer.`;
  if (text.length > 158) text = text.slice(0, 157).replace(/\s+\S*$/, '') + '.';
  return text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return { title: 'Produkt nicht gefunden' };
  }

  const siteUrl = process.env.APP_URL || 'https://ebikedirect.eu';

  return {
    title: { absolute: productTitle(product.name) },
    description: productDescription(product),
    openGraph: {
      title: productTitle(product.name),
      description: productDescription(product),
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
      <ProductDetailClient product={product} />
      {product.category !== 'Zubehör' && <ProductLinks brand={product.brand} category={product.category} motor={product.motor} />}
    </>
  );
}
