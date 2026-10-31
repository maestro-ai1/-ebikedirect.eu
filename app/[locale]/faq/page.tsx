'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { FaqJsonLd } from '@/components/seo/json-ld';
import { ChevronDown, HelpCircle, Search, ShieldCheck, Truck, Bitcoin, Wrench } from '@/components/ui/icons';

interface FaqItem {
  question: string;
  answer: string;
  category: 'logistik' | 'krypto' | 'technik' | 'garantie';
}

const FAQS: FaqItem[] = [
  {
    category: 'logistik',
    question: 'Warum gibt es einen Mindestbestellwert von 500 €?',
    answer: 'Als spezialisierter E-Bike Fachhandel transportieren wir unsere Räder ausschließlich stehend auf Spezialpaletten per Spedition mit Hebebühne. Um diese aufwändige Logistik, den 42-Punkte-Werkstatt-Sicherheitscheck und die fachgerechte Verpackung wirtschaftlich zu ermöglichen, gilt ein Mindestbestellwert von 500,00 € pro Auftrag.'
  },
  {
    category: 'logistik',
    question: 'Ab welchem Betrag ist der Speditionsversand kostenlos?',
    answer: 'Ab einem Gesamtbestellwert von 10.000,00 € brutto versenden wir innerhalb Deutschlands und Österreichs vollkommen versandkostenfrei (Frei Haus). Bei Bestellwerten unter 10.000 € berechnen wir eine faire Speditionspauschale von lediglich 49,00 € für die versicherte Hebebühnenzustellung.'
  },
  {
    category: 'logistik',
    question: 'Wie läuft die Lieferung per Spedition genau ab?',
    answer: 'Sobald Ihr E-Bike unsere Werkstatt verlässt, übergibt unser Team die Sendung an die Spedition (z.B. Dachser). Der Spediteur kontaktiert Sie 24 Stunden vor der Auslieferung telefonisch oder per SMS, um ein verbindliches Zustellzeitfenster zu vereinbaren. Die Palette wird mit Hebebühne bis zur Bordsteinkante entladen.'
  },
  {
    category: 'logistik',
    question: 'Ist das E-Bike bereits fahrfertig montiert?',
    answer: 'Ja, zu 95%. Schaltung, Bremsen, Motorfirmware und Drehmomente aller Schrauben werden in unserer Meisterwerkstatt vorab geprüft und eingestellt. Sie müssen lediglich den Lenker gerade ausrichten und festziehen sowie die mitgelieferten Pedale einschrauben.'
  },
  {
    category: 'krypto',
    question: 'Wie funktioniert der 10% Krypto-Rabatt?',
    answer: 'Wählen Sie im Warenkorb oder an der Kasse die Zahlungsart "Kryptowährung" oder geben Sie den Code CRYPTO10 ein. Unser System zieht automatisch 10% vom gesamten Warenkorb-Wert ab. Sie können die Zahlung wahlweise mit USDT über das TRON-Netzwerk (TRC-20, extrem geringe Gebühren), USDT über Ethereum (ERC-20) oder mit Bitcoin (BTC) begleichen.'
  },
  {
    category: 'krypto',
    question: 'Wie lange ist der Krypto-Wechselkurs reserviert?',
    answer: 'Ab dem Öffnen der Krypto-Kasse ist der angezeigte Kurs für 15 Minuten fest garantiert. Sobald Ihre Transaktion im Mempool der Blockchain erkannt wird, wechselt die Statusanzeige automatisch und Ihre Bestellung wird ohne Verzögerung bestätigt.'
  },
  {
    category: 'garantie',
    question: 'Welche Garantie und Rückgaberechte gelten?',
    answer: 'Sie genießen bei uns ein erweitertes 30-tägiges Rückgaberecht (bis zu 30 km Testfahrt) sowie die volle gesetzliche 2-jährige Gewährleistung auf Rahmen, Motor, Elektronik und Akku. Zudem unterstützen wir Sie bei der Garantieabwicklung direkt mit den Herstellern wie Bosch, Cube oder Specialized.'
  },
  {
    category: 'technik',
    question: 'Welche Reichweite kann ich realistisch von einem 750 Wh Akku erwarten?',
    answer: 'Unter Alltagsbedingungen mit moderaten Steigungen und Fahrergewicht um 80 kg liegt die Reichweite eines 750 Wh Bosch PowerTube Akkus im Tour+/eMTB-Modus bei ca. 90 bis 130 km. Mit DualBattery-Systemen (1.000 Wh bei Riese & Müller) sind problemlos über 180 bis 220 km erreichbar.'
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'logistik' | 'krypto' | 'technik' | 'garantie'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 4]); // open first few by default

  const toggleAccordion = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <FaqJsonLd faqs={FAQS} />
      <Breadcrumbs items={[{ label: 'Häufige Fragen (FAQ)', href: '/faq' }]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hilfe & Wissensdatenbank</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#131A22] tracking-tight">
            Häufig gestellte Fragen (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Hier finden Sie Antworten zu Mindestbestellwert, Speditionsversand, 10% Krypto-Rabatt und technischer Garantie.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchbegriff eingeben (z.B. Mindestbestellwert, Krypto, Spedition)..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#131A22] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'Alle Fragen' },
            { id: 'logistik', label: 'Spedition & Mindestbestellwert' },
            { id: 'krypto', label: '10% Krypto-Zahlung' },
            { id: 'technik', label: 'E-Bike Technik & Akku' },
            { id: 'garantie', label: 'Garantie & Rückgabe' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#131A22] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              Keine passenden Fragen zu diesem Suchbegriff gefunden.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              return (
                <div key={idx} className="transition-colors">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50/70 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#131A22]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF5722]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
