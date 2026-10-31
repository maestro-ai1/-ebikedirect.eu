import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO bei ebikedirect.eu: Zwecke, Rechtsgrundlagen, Speicherdauer und Ihre Rechte.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Rechtliches', href: '/policies' },
          { label: 'Datenschutz', href: '/policies/privacy' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-[#009624] text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DSGVO Konformität</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Datenschutzerklärung
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO).
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 border-t border-gray-100 pt-6">
            <h2 className="text-base font-bold text-[#131A22]">1. Verantwortlicher</h2>
            <p>
              ebikedirect.eu GmbH<br />
              Radlerstraße 42, 80331 München, Deutschland<br />
            </p>

            <h2 className="text-base font-bold text-[#131A22]">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>
              Wenn Sie in unserem Webshop eine Bestellung aufgeben, erheben wir folgende Daten:
              Vorname, Nachname, Lieferanschrift, Telefonnummer (zur telefonischen Avisierung durch die Spedition),
              E-Mail-Adresse und bei Krypto-Zahlung die öffentliche Transaktions-Hash-ID zur Verifikation auf der Blockchain.
            </p>

            <h2 className="text-base font-bold text-[#131A22]">3. Weitergabe von Daten an Speditionen</h2>
            <p>
              Zur Vertragserfüllung übermitteln wir Name, Lieferadresse und Telefonnummer an von uns beauftragte Logistikunternehmen (z.B. Dachser, DB Schenker). Die Weitergabe dient ausschließlich der telefonischen Terminabsprache und ebenerdigen Entladung per Hebebühne.
            </p>

            <h2 className="text-base font-bold text-[#131A22]">4. Blockchain & Krypto-Zahlungen</h2>
            <p>
              Bei Zahlung mit USDT (TRC-20/ERC-20) oder Bitcoin verarbeiten wir keine privaten Schlüssel. Transaktionsdaten auf öffentlichen Blockchains sind technisch bedingt öffentlich einsehbar, enthalten jedoch keine direkten Klarnamen oder postalischen Anschriften.
            </p>

            <h2 className="text-base font-bold text-[#131A22]">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Berichtigung, Sperrung oder Löschung gemäß Art. 15–21 DSGVO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
