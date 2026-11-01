import type { Metadata } from 'next';
import React from 'react';
import { CatalogNav } from '@/components/shop/catalog-nav';

export const metadata: Metadata = {
  title: 'Sortiment: E-Bikes im Überblick',
  description: 'Das komplette E-Bike Sortiment von ebikedirect.eu: Modelle nach Kategorie, Marke und Preis filtern, Motor und Akku vergleichen und online bestellen.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CatalogNav current="/shop" />
      {children}
    </>
  );
}
