import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Widerruf, Rückgabe und Garantie',
  description: 'Erfahren Sie alles über unser 30-tägiges Rückgaberecht, die gesetzliche 2-jährige Gewährleistung sowie Herstellergarantien auf Rahmen, Akku und Motor.'
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Rechtliches', href: '/policies' },
          { label: 'Widerruf & 2 Jahre Garantie', href: '/policies/returns' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold mb-3">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Verbraucherschutz & Fachhändler-Sicherheit</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Rückgaberecht & 2 Jahre Garantie
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Stand: Oktober 2026 · Gültig für alle E-Bike Bestellungen über ebikedirect.eu
            </p>
          </div>

          {/* 30-Day Money-Back Guarantee Section */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-lg font-bold text-[#131A22]">
              <RotateCcw className="w-5 h-5 text-[#FF5722]" />
              <h2>1. Freiwilliges 30-Tage Rückgaberecht</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Über das gesetzliche 14-tägige Widerrufsrecht hinaus gewähren wir Ihnen ein erweitertes, freiwilliges Rückgaberecht von insgesamt <strong>30 Tagen</strong> ab Erhalt der Ware. Sie können das E-Bike in Ruhe begutachten und auf privatem Gelände probefahren.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2 text-gray-700">
              <div className="font-bold text-gray-900">Voraussetzungen für die Rückgabe:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Das E-Bike befindet sich im neuwertigen, unbeschädigten Zustand ohne Gebrauchsspuren im Gelände.</li>
                <li>Der Kilometerstand auf dem Bordcomputer beträgt maximal 30 km (Prüfung und Probefahrt).</li>
                <li>Originalzubehör (Ladegerät, Schlüssel, Akkupack, Handbücher) ist vollständig vorhanden.</li>
              </ul>
            </div>
          </section>

          {/* 2-Year Warranty Section */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-lg font-bold text-[#131A22]">
              <ShieldCheck className="w-5 h-5 text-[#00C853]" />
              <h2>2. Gesetzliche Gewährleistung & Herstellergarantie</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Auf alle bei uns erworbenen E-Bikes gilt die gesetzliche Gewährleistungsfrist von <strong>24 Monaten (2 Jahren)</strong> ab Lieferdatum. Wir decken sämtliche herstellungsbedingten Mängel an Rahmen, Antriebseinheit, Sensorik und Verkabelung ab.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#E8F8F0] border border-[#00C853]/40 text-xs space-y-1">
                <strong className="text-emerald-950 font-bold block">Akkugarantie (Bosch & Shimano):</strong>
                <p className="text-emerald-900">
                  Mindestens 60% Restkapazität innerhalb von 2 Jahren oder bis zu 500 vollen Ladezyklen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs space-y-1">
                <strong className="text-amber-950 font-bold block">Rahmengarantie der Hersteller:</strong>
                <p className="text-amber-900">
                  Cube, Specialized und Riese & Müller gewähren bei Online-Registrierung bis zu 5 Jahre Garantie auf Rahmenbruch.
                </p>
              </div>
            </div>
          </section>

          {/* Return logistics */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#131A22]">
              3. Ablauf der Speditionsrückholung
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Da unsere E-Bikes auf Spezialpaletten mit Hebebühne transportiert werden, organisieren wir die bequeme Abholung direkt an Ihrer Haustür:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-700">
              <li>Kontaktieren Sie unseren Kundenservice über das Kontaktformular unter Angabe Ihrer Bestellnummer.</li>
              <li>Wir senden Ihnen per E-Mail den Speditionsschein und stimmen den Wunschabholtag mit Dachser / DB Schenker ab.</li>
              <li>Nach Wareneingang und Prüfung in unserer Münchner Meisterwerkstatt erstatten wir den vollen Kaufbetrag innerhalb von 3 Werktagen auf Ihre ursprüngliche Zahlungsmethode (inkl. Krypto-Rückzahlung in USDT/BTC zum tagesaktuellen Gegenwert).</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
