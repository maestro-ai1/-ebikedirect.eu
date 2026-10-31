import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakt zu ebikedirect.eu: Fragen zu Modellen, Lieferung und Rückgabe per Formular an das Team senden. Wir antworten so schnell wie möglich.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
