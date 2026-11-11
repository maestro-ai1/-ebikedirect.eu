import { redirect } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const metadata: Metadata = {
  title: 'Rechtliches und Richtlinien',
  description: 'Alle Richtlinien von ebikedirect.eu auf einen Blick: Rückgabe und 2 Jahre Garantie, Versand und Lieferung, Datenschutz sowie das Impressum.'
};

const POLICIES = [
  { href: '/policies/returns', title: 'Rückgabe und Garantie', text: 'Widerruf, Rücksendung und die 2 Jahre Garantie auf Ihr E-Bike.' },
  { href: '/policies/delivery', title: 'Liefer- und Versandbedingungen', text: 'Speditionsversand, Frei-Haus-Grenze und Ablauf der Zustellung.' },
  { href: '/policies/privacy', title: 'Datenschutz', text: 'Welche Daten wir erheben und wie wir sie verwenden.' },
  { href: '/policies/imprint', title: 'Impressum', text: 'Anbieterkennzeichnung und Kontaktangaben.' }
];

export default async function PoliciesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'de') redirect('/policies'); // legal and utility pages exist in German only until the owner approves translations
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Rechtliches', href: '/policies' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">Rechtliches und Richtlinien</h1>
            <p className="text-sm text-gray-600 mt-2">Hier finden Sie alle Regeln zu Bestellung, Lieferung, Rückgabe und Datenschutz.</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICIES.map((p) => (
              <li key={p.href} className="rounded-xl border border-gray-200 p-5">
                <h2 className="text-base font-bold text-[#131A22]">
                  <Link href={p.href} className="hover:text-[#FF5722]">{p.title}</Link>
                </h2>
                <p className="text-sm text-gray-600 mt-1">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
