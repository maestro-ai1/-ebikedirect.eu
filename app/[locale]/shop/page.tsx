import React from 'react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import ShopClient from './shop-client';

// Server wrapper: the breadcrumb trail and its BreadcrumbList markup are in the HTML that crawlers receive; the filterable catalogue is the client component.
export default function ShopPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'E-Bike Sortiment', href: '/shop' }]} />
      <ShopClient />
    </>
  );
}
