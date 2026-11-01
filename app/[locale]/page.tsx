import React from 'react';
import { HeroSlideshow, HeroSlide } from '@/components/home/hero-slideshow';
import { BestProducts } from '@/components/home/best-products';
import { TrustpilotWidget } from '@/components/home/trustpilot-widget';
import { BrandStrip } from '@/components/home/brand-strip';
import { CategoryTiles } from '@/components/home/category-tiles';
import { ServiceBand } from '@/components/home/service-band';
import { GuideTeaser } from '@/components/home/guide-teaser';
import { HomeFaq } from '@/components/home/home-faq';
import { isLocale, DEFAULT_LOCALE, MESSAGES, getLocalizedPath } from '@/lib/i18n';
import { PRODUCTS } from '@/lib/products';
import { getKeywordPage, buildTitle } from '@/lib/seo';

// Hero slides: one bright studio photo per top category, each linking to that category's landing page (with breadcrumbs).
const SLIDES = [
  { key: 'mtb', path: '/e-bikes/e-mountainbikes', slug: 'haibike-allmtn-6-800-wh-29' },
  { key: 'trekking', path: '/e-bikes/trekking-e-bikes', slug: 'kalkhoff-endeavour-5-advance-plus' },
  { key: 'city', path: '/e-bikes/city-e-bikes', slug: 'gazelle-avignon-c380-600-wh-28-zoll' },
  { key: 'cargo', path: '/e-bikes/cargo-bikes', slug: 'urban-arrow-familynext-advanced-belt-800-wh-26-zoll' }
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = MESSAGES[locale];
  const home = getKeywordPage(locale, '/');
  const primary = home?.primary?.keyword || m.seo.home;
  // H1 carries the homepage primary keyword: it is the approved title without the brand suffix
  const h1 = (home?.metaTitle || buildTitle(locale, primary)).replace(/\s*\|\s*ebikedirect\.eu$/, '');
  const slides: HeroSlide[] = SLIDES.flatMap((s) => {
    const p = PRODUCTS.find((x) => x.slug === s.slug);
    if (!p) return [];
    const label = (m.home.cat as Record<string, string>)[s.key];
    return [{ id: s.key, label, productName: p.name, image: p.image, alt: `${primary}: ${p.name}`, href: getLocalizedPath(s.path, locale), cta: label }];
  });
  const why = m.home.why as string[][];

  return (
    <>
      <HeroSlideshow h1={h1} sub={`${m.seo.s1} ${m.seo.s3}`} allText={m.hero.explore} allHref={getLocalizedPath('/e-bikes', locale)} slides={slides} bullets={[why[0][1], why[2][1]]} />
      <CategoryTiles locale={locale} />
      <BestProducts locale={locale} />
      <ServiceBand locale={locale} />
      <TrustpilotWidget />
      <GuideTeaser locale={locale} />
      <BrandStrip locale={locale} />
      {locale === 'de' && <HomeFaq />}
    </>
  );
}
