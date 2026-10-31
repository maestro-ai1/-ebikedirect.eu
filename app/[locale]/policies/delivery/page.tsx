import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Truck, ShieldCheck, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Versand und Lieferbedingungen',
  description: 'Informationen zu Speditionsversand mit Hebebühne, 10.000 € Frei-Haus-Grenze, 500 € Mindestbestellwert und telefonischer Avisierung.'
};

export default function DeliveryPolicyPage() {
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Rechtliches', href: '/policies' },
          { label: 'Liefer- & Versandbedingungen', href: '/policies/delivery' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-3">
              <Truck className="w-3.5 h-3.5" />
              <span>Sicherer E-Bike Transport per Spezialspedition</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Liefer- & Versandbedingungen
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Transparente Frachttarife, Frei-Haus-Regelungen und Ablauf der Palettenzustellung.
            </p>
          </div>

          {/* Key Rule Badges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-xs">
              <div className="font-extrabold text-[#FF5722] text-sm mb-1">500,00 €</div>
              <div className="font-bold text-gray-900">Mindestbestellwert</div>
              <p className="text-gray-600 text-[11px] mt-1">
                Gilt für alle Bestellungen im Shop zur Gewährleistung sicherer Palettenlogistik.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#E8F8F0] border border-[#00C853]/40 text-xs">
              <div className="font-extrabold text-[#009624] text-sm mb-1">10.000,00 €</div>
              <div className="font-bold text-gray-900">Frei-Haus-Grenze</div>
              <p className="text-gray-600 text-[11px] mt-1">
                Ab 10.000 € Bestellwert entfallen die Speditionskosten vollständig (0,00 €).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
              <div className="font-extrabold text-gray-900 text-sm mb-1">49,00 €</div>
              <div className="font-bold text-gray-900">Speditions-Pauschale</div>
              <p className="text-gray-600 text-[11px] mt-1">
                Für versicherten Transport mit Hebebühne bei Bestellwerten unter 10.000 €.
              </p>
            </div>
          </div>

          {/* Spedition Details */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#131A22] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#FF5722]" />
              Zustellung mit Hebebühne & telefonischer Avisierung
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Jedes E-Bike wird in einem stabilen Spezialkarton auf einer Einwegpalette stehend transportiert. Ein Umfallen oder Verkratzen während des Transports ist ausgeschlossen.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                <div>
                  <strong>Telefonisches Avis 24 Stunden vorher:</strong> Der Spediteur ruft Sie vor der Auslieferung an, um das genaue Zeitfenster (z.B. Vormittag/Nachmittag) verbindlich mit Ihnen abzustimmen.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#00C853] shrink-0 mt-0.5" />
                <div>
                  <strong>Hebebühnen-Entladung frei Bordsteinkante:</strong> Der Fahrer lädt die Palette ebenerdig mit dem Hubwagen ab.
                </div>
              </div>
            </div>
          </section>

          {/* Vormontage */}
          <section className="space-y-4 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#131A22] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
              95% fahrfertig montiert – Ihr E-Bike in 5 Minuten startklar
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              In unserer Münchner Meisterwerkstatt prüfen wir vor dem Versand:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700">
              <li>Alle sicherheitsrelevanten Schrauben und Drehmomente nach Herstellervorgaben.</li>
              <li>Präzise Einstellung von Schaltung und hydraulischen Scheibenbremsen.</li>
              <li>Aufspielen der neuesten Firmware-Updates für Bosch, Shimano oder Yamaha Antriebe.</li>
              <li>Akku-Funktionsprüfung und Teilladung auf ca. 60% für den sicheren Transport.</li>
            </ul>
            <p className="text-xs text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <strong>Alles was Sie noch tun müssen:</strong> Den Lenker gerade stellen, die Pedale mit dem mitgelieferten Werkzeug einschrauben – und die erste Ausfahrt genießen!
            </p>
          </section>

          {/* Delivery Times */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#131A22]">
              Regellaufzeiten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-900">Deutschland & Österreich:</div>
                <div>2 - 4 Werktage nach Zahlungseingang</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-900">Niederlande, Italien, Spanien:</div>
                <div>3 - 6 Werktage nach Zahlungseingang</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
