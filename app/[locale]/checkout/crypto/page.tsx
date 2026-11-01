import { redirect } from 'next/navigation';

// The earlier crypto page was a simulation with placeholder wallet addresses. Crypto is now a payment choice in the checkout:
// the payment address is sent by e-mail after the order, so this route only forwards to the checkout.
export default async function CryptoCheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(locale === 'de' ? '/checkout' : `/${locale}/checkout`);
}
