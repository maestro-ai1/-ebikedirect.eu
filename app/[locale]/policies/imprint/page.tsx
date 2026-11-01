import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum von ebikedirect.eu: Anbieter LEKKER Bikes Germany GmbH, Berlin, Registergericht, Kontakt, Umsatzsteuer, Streitbeilegung und rechtliche Hinweise.'
};

const H2 = 'text-base font-bold text-[#131A22]';

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
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Anbieterkennzeichnung</span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#131A22] tracking-tight">Impressum</h1>
            <p className="text-sm text-gray-600">Pflichtangaben zur Anbieterkennzeichnung für ebikedirect.eu nach den geltenden deutschen und europäischen Vorschriften für Telemedien und den elektronischen Geschäftsverkehr.</p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 border-t border-gray-100 pt-6">
            <h2 className={H2}>1. Anbieter und Firmensitz</h2>
            <p>
              <strong>LEKKER Bikes Germany GmbH</strong><br />
              Kollwitzstraße 47<br />
              10405 Berlin<br />
              Deutschland
            </p>

            <h2 className={H2}>2. Kontakt</h2>
            <p>
              E-Mail für Kontakt, Bestellungen, Anfragen, Großhandelsanfragen und Richtlinien: <a href="mailto:sales@ebikedirect.eu" className="text-[#FF5722] font-semibold">sales@ebikedirect.eu</a><br />
              Internet: https://www.ebikedirect.eu<br />
              Erreichbarkeit: Montag bis Freitag über unser Online-Ticket- und Live-Support-Portal.
            </p>

            <h2 className={H2}>3. Handelsregister</h2>
            <p>
              Registergericht: Amtsgericht Berlin (Charlottenburg)<br />
              Registernummer: HRB 245535 (Handelsregister B, Gesellschaft mit beschränkter Haftung)<br />
              Sitzland: Bundesrepublik Deutschland
            </p>

            <h2 className={H2}>4. Umsatzsteuer</h2>
            <p>
              Wir sind für den Fernabsatz von Waren an Verbraucher in Deutschland, den Niederlanden, Italien, Spanien und weiteren EU-Ländern im europäischen OSS-Verfahren (One-Stop-Shop) registriert.
            </p>

            <h2 className={H2}>5. Produktstandards</h2>
            <p>
              Elektrofahrräder (Pedelecs, S-Pedelecs) und das zugehörige Zubehör erfüllen die europäischen harmonisierten Normen (EN 15194), die Vorgaben der Maschinenrichtlinie sowie, wo für die Nutzung im öffentlichen Straßenverkehr erforderlich, die StVZO.
            </p>

            <h2 className={H2}>6. Online-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" rel="noopener noreferrer" target="_blank" className="text-[#FF5722] font-semibold">https://ec.europa.eu/consumers/odr</a>.
              Wir sind weder gesetzlich verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Unser Kundenservice klärt Anfragen und Fälle nach dem Kauf gerne direkt und einvernehmlich.
            </p>

            <h2 className={H2}>7. Haftung für Inhalte</h2>
            <p>
              Die Inhalte dieser Seiten wurden mit großer Sorgfalt und laufender redaktioneller Prüfung erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir nach den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen dauerhaft zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben unberührt.
            </p>

            <h2 className={H2}>8. Haftung für Links</h2>
            <p>
              Unser Angebot kann Links zu externen Websites Dritter enthalten, etwa von Herstellern, Logistikpartnern oder Zahlungsdienstleistern, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr; verantwortlich ist stets der jeweilige Anbieter oder Betreiber der verlinkten Seite. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Eine dauerhafte inhaltliche Kontrolle ohne konkrete Anhaltspunkte einer Rechtsverletzung ist nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir solche Links umgehend.
            </p>

            <h2 className={H2}>9. Urheberrecht und geistiges Eigentum</h2>
            <p>
              Layout, Produktsystematik, Grafiken, Oberflächengestaltung, Fotos, Marken- und Kennzeichnungen sowie die auf diesen Seiten veröffentlichten Texte unterliegen dem deutschen und europäischen Urheber- und Schutzrecht. Jede Vervielfältigung, Bearbeitung, Übersetzung, Speicherung, Verbreitung oder gewerbliche Verwertung außerhalb der gesetzlichen Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der LEKKER Bikes Germany GmbH oder des jeweiligen Rechteinhabers. Das unbefugte Kopieren oder automatisierte Auslesen unserer Produktdaten, Katalogtexte oder Code-Strukturen zu gewerblichen oder Wettbewerbszwecken ist untersagt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
