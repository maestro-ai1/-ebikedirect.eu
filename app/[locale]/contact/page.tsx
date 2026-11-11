'use client';

import React, { useState } from 'react';
import { useI18n } from '@/context/i18n-context';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { MapPin, Mail, Clock, Send, CheckCircle2, ShieldCheck, Wrench } from '@/components/ui/icons';

export default function ContactPage() {
  const { u, locale, getLocalizedHref } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Allgemeine Kaufberatung',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8F9FA] pb-16">
      <Breadcrumbs items={[{ label: u('contact.bc'), href: getLocalizedHref('/contact') }]} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5722]">
            {u('contact.tag')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#131A22] tracking-tight">
            {u('contact.h1')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {u('contact.intro')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 5 Cols: Store Information & Showroom */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-lg font-bold text-[#131A22] border-b border-gray-100 pb-3">
                {u('contact.hq')}
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100/60 text-[#FF5722] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-bold">{u('contact.seat')}</strong>
                    <span>LEKKER Bikes Germany GmbH, Kollwitzstraße 47, 10405 Berlin, Deutschland</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">

                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">

                    <Mail className="w-4 h-4" />

                  </div>

                  <div>

                    <strong className="block text-gray-900 font-bold">{u('contact.mail')}</strong>

                    <a href="mailto:sales@ebikedirect.eu" className="text-[#FF5722] font-semibold">sales@ebikedirect.eu</a>

                  </div>

                </div>


                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-bold">{u('contact.hours')}</strong>
                    <div>{u('contact.hMonFri')}</div>
                    <div>{u('contact.hSat')}</div>
                  </div>
                </div>
              </div>

              {/* Service Badges */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2 font-medium text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                  <span>{u('contact.bBosch')}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2 font-medium text-gray-700">
                  <Wrench className="w-4 h-4 text-[#FF5722]" />
                  <span>{u('contact.bShimano')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#E8F8F0] rounded-full flex items-center justify-center mx-auto text-[#00C853]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-[#131A22]">
                    {u('contact.thanks')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                    {u('contact.thanksText')}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    {u('contact.again')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-[#131A22] border-b border-gray-100 pb-3">
                    {u('contact.formH')}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {u('contact.name')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {u('contact.email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                        placeholder="ihre.adresse@mail.de"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {u('contact.phone')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                        placeholder="+49 ..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {u('contact.subject')}
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                      >
                        <option value="Allgemeine Kaufberatung">{u('contact.s1')}</option>
                        <option value="Frage zur Rahmengröße">{u('contact.s2')}</option>
                        <option value="Krypto-Zahlung & 10% Rabatt">{u('contact.s3')}</option>
                        <option value="Lieferstatus & Spedition">{u('contact.s4')}</option>
                        {locale === 'de' && <option value="Dienstrad / JobRad Leasing">Dienstrad / JobRad Leasing</option>}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {u('contact.msg')}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-[#FF5722] focus:outline-none"
                      placeholder={u('contact.msgPh')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5722]/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{u('contact.send')}</span>
                  </button>

                  <div className="text-[11px] text-gray-400 text-center">
                    {u('contact.privacy')}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
