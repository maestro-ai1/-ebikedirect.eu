import { redirect } from 'next/navigation';

// The cart is the full checkout page (no separate cart screen), so /cart forwards there.
export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(locale === 'de' ? '/checkout' : `/${locale}/checkout`);
}
