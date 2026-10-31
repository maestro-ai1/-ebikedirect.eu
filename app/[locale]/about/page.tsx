import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ShieldCheck, Wrench, Award, CheckCircle2, ArrowRight, Bitcoin, Users } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Über uns und unsere Werkstatt',
  description: 'Lernen Sie das Team hinter ebikedirect.eu kennen: Zertifizierte Zweiradmechaniker-Meister, E-Bike Enthusiasten und Spezialisten für moderne Mikromobilität.'
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: 'Über Uns', href: '/about' }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Tradition & Innovation seit 2018</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#131A22] tracking-tight">
              Deutschlands leidenschaftlicher Fachhandel für High-End E-Bikes
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Willkommen bei ebikedirect.eu. Wir verbinden traditionelles deutsches Handwerk mit zukunftsweisender Elektromobilität. Vom leichten Carbon E-MTB für alpine Trails bis zum robusten Lastenrad für Familien: Bei uns finden Sie ausschließlich renommierte Spitzenmarken.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-[#FF5722]">5.000+</div>
              <div className="text-xs text-gray-600 font-medium">Gelieferte E-Bikes</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-[#00C853]">4.9 / 5.0</div>
              <div className="text-xs text-gray-600 font-medium">Trustpilot Bewertung</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-blue-600">100%</div>
              <div className="text-xs text-gray-600 font-medium">Meister-geprüft</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-amber-600">-10%</div>
              <div className="text-xs text-gray-600 font-medium">Krypto-Skonto</div>
            </div>
          </div>
        </div>

        {/* Our Workshop Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
              Werkstatt & Prüfstand
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#131A22]">
              Kein Fahrrad verlässt unseren Hof ungeprüft
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Jedes bei uns bestellte E-Bike durchläuft vor dem Verpacken einen 42-Punkte-Sicherheitscheck auf unserem digitalen Rollenprüfstand. Bremsen werden entlüftet, Schaltungen unter Last justiert und der Bordcomputer auf den neuesten Firmware-Stand aktualisiert.
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>Bosch eBike Systems zertifizierter Fachbetrieb</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>Shimano Service Center mit Original-Ersatzteilen</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>Geschultes Personal für Gates Carbon Drive Riemenantriebe</span>
              </li>
            </ul>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80"
              alt="E-Bike Meisterwerkstatt"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Sustainability & Modern Payment */}
        <div className="bg-[#131A22] text-white rounded-2xl p-8 sm:p-10 space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00C853]/20 border border-[#00C853]/40 text-[#00C853] text-xs font-bold">
              <Bitcoin className="w-3.5 h-3.5" />
              <span>Moderne Zahlungsphilosophie</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Warum wir 10% Rabatt auf Krypto-Zahlungen bieten
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Traditionelle Kreditkartenunternehmen und Zahlungsdienstleister erheben bei hochwertigen E-Bike-Käufen zwischen 2% und 4% Gebühren plus tagelange Verzögerungen. Durch die direkte Abwicklung auf der Blockchain (USDT über TRC-20 / ERC-20 oder Bitcoin) eliminieren wir Zwischenhändler und geben diese Ersparnis zu 100% als 10%-Skonto an unsere Kunden weiter.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-colors"
            >
              E-Bike Sortiment erkunden
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Showroom in München besuchen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
