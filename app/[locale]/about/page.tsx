import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ui, hasPages } from '@/lib/ui';
import { isLocale, type Locale } from '@/lib/i18n';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ShieldCheck, Wrench, Award, CheckCircle2, ArrowRight, Bitcoin, Users } from '@/components/ui/icons';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = (isLocale(locale) && hasPages(locale) ? locale : 'de') as Locale;
  return { title: ui(l, 'meta.aboutTitle'), description: ui(l, 'meta.aboutDesc') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (isLocale(locale) && !hasPages(locale)) redirect('/about');
  const l = (isLocale(locale) ? locale : 'de') as Locale;
  const u = (k: string) => ui(l, k);
  const pre = l === 'de' ? '' : '/' + l;
  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: u('about.bc'), href: pre + '/about' }]} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-[#FF5722] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{u('about.badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#131A22] tracking-tight">
              {u('about.h1')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {u('about.intro')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-[#FF5722]">{l === 'en' ? '5,000+' : l === 'fr' ? '5 000+' : '5.000+'}</div>
              <div className="text-xs text-gray-600 font-medium">{u('about.s1')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-[#00C853]">{l === 'fr' ? '4,9 / 5,0' : '4.9 / 5.0'}</div>
              <div className="text-xs text-gray-600 font-medium">{u('about.s2')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-blue-600">100%</div>
              <div className="text-xs text-gray-600 font-medium">{u('about.s3')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-black text-amber-600">-10%</div>
              <div className="text-xs text-gray-600 font-medium">{u('about.s4')}</div>
            </div>
          </div>
        </div>

        {/* Our Workshop Standards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
              {u('about.wsTag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#131A22]">
              {u('about.wsH')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {u('about.wsText')}
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>{u('about.b1')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>{u('about.b2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
                <span>{u('about.b3')}</span>
              </li>
            </ul>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80"
              alt={u('about.imgAlt')}
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
              <span>{u('about.payTag')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {u('about.payH')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {u('about.payText')}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href={pre + '/shop'}
              className="px-6 py-3 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-bold transition-colors"
            >
              {u('about.cta1')}
            </Link>
            <Link
              href={pre + '/contact'}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              {u('about.cta2')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
