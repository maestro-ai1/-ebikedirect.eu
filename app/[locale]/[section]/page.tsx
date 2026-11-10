import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { L10nCategoryPage } from '@/components/seo/l10n-category-page';
import { L10N_LOCALES, l10nByUrl, l10nPages } from '@/lib/l10n-pages';
import { isLocale } from '@/lib/i18n';
import { buildTitle } from '@/lib/seo';
import { l10nDescription } from '@/lib/l10n-strings';

// Top-level translated pages (for example /fr/accessoires).
export function generateStaticParams() {
  return L10N_LOCALES.flatMap((locale) =>
    l10nPages(locale).filter((p) => p.url.split('/').filter(Boolean).length === 1).map((p) => ({ locale, section: p.url.split('/').filter(Boolean)[0] }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }): Promise<Metadata> {
  const { locale, section } = await params;
  if (!isLocale(locale)) return {};
  const page = l10nByUrl(locale, `/${section}`);
  if (!page) return { title: 'Not found' };
  return { title: { absolute: buildTitle(locale, page.display) }, description: l10nDescription(locale, page.type, page.display, page.name) };
}

export default async function L10nTopPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section } = await params;
  if (!isLocale(locale)) notFound();
  return <L10nCategoryPage locale={locale} url={`/${section}`} />;
}
