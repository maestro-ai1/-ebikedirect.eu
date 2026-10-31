import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Häufige Fragen zu Lieferung und Rückgabe',
  description: 'Antworten auf häufige Fragen zu Bestellung, Lieferung per Spedition, Zahlung, Garantie und Rückgabe bei ebikedirect.eu. Jetzt Antworten lesen und bestellen.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
