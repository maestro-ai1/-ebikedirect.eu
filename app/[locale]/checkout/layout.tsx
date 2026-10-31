import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kasse',
  description: 'Bestellung abschließen bei ebikedirect.eu: Lieferadresse eingeben, Zahlungsart wählen und Ihr E-Bike sicher per Spedition nach Hause bestellen.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
