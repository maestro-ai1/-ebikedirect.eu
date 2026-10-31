import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum von ebikedirect.eu: gesetzliche Pflichtangaben gemäß § 5 DDG für den Online-Shop, Anbieterkennzeichnung und Hinweise zur Streitbeilegung.'
};

export default function ImprintPage() {
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Rechtliches', href: '/policies' },
          { label: 'Impressum', href: '/policies/imprint' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Anbieterkennzeichnung
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">
              Impressum (§ 5 DDG)
            </h1>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 border-t border-gray-100 pt-6">
            <p>
              <strong>ebikedirect.eu GmbH</strong><br />
              Radlerstraße 42<br />
              80331 München<br />
              Deutschland
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Vertreten durch die Geschäftsführer:</h2>
            <p>
              Markus Lindner, Zweiradmechanikermeister<br />
              Stefan Holzmann
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Kontakt:</h2>
            <p>
              Web: https://ebikedirect.eu
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Registereintrag:</h2>
            <p>
              Eingetragen im Handelsregister.<br />
              Registergericht: Amtsgericht München<br />
              Registernummer: HRB 248912
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Umsatzsteuer-ID:</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
              <strong>DE 318 945 210</strong>
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Aufsichtsbehörde & Handwerkskammer:</h2>
            <p>
              Handwerkskammer für München und Oberbayern<br />
              Max-Joseph-Straße 4, 80333 München<br />
              Berufsbezeichnung: Zweiradmechanikermeister (verliehen in der Bundesrepublik Deutschland)
            </p>

            <h2 className="text-base font-bold text-[#131A22]">Streitbeilegung:</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              https://ec.europa.eu/consumers/odr. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
