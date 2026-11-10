import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { L10nCategoryPage } from '@/components/seo/l10n-category-page';
import { L10N_LOCALES, l10nByUrl, l10nPages } from '@/lib/l10n-pages';
import { isLocale, LOCALE_CODES } from '@/lib/i18n';
import { buildTitle, buildDescription } from '@/lib/seo';

// Public URLs of translated pages (for example /fr/velos-electriques/vtt-electrique). Only URLs listed in data/keywords/<lang>-live.json exist.
export function generateStaticParams() {
  return L10N_LOCALES.flatMap((locale) =>
    l10nPages(locale).filter((p) => p.url.split('/').filter(Boolean).length === 2).map((p) => {
      const [section, sub] = p.url.split('/').filter(Boolean);
      return { locale, section, sub };
    })
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string; sub: string }> }): Promise<Metadata> {
  const { locale, section, sub } = await params;
  if (!isLocale(locale)) return {};
  const page = l10nByUrl(locale, `/${section}/${sub}`);
  if (!page) return { title: 'Not found' };
  return {
    title: { absolute: buildTitle(locale, page.display) },
    description: buildDescription(locale, page.display),
  };
}

export default async function L10nSubPage({ params }: { params: Promise<{ locale: string; section: string; sub: string }> }) {
  const { locale, section, sub } = await params;
  if (!isLocale(locale) || !(LOCALE_CODES as string[]).includes(locale)) notFound();
  return <L10nCategoryPage locale={locale} url={`/${section}/${sub}`} />;
}
