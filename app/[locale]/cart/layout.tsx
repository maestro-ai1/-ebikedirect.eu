import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Warenkorb',
  description: 'Ihr Warenkorb bei ebikedirect.eu: Auswahl prüfen, Lieferung per Spedition und Zahlungsarten wählen und die Bestellung sicher abschließen.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
