// Floating WhatsApp chat button, bottom right on every page. Opens a WhatsApp chat with the shop (+49 177 9354855).
const LABELS: Record<string, string> = {
  de: 'Per WhatsApp schreiben',
  fr: 'Écrire sur WhatsApp',
  nl: 'Chat via WhatsApp',
  it: 'Scrivici su WhatsApp',
  es: 'Escríbenos por WhatsApp',
  pt: 'Fale connosco no WhatsApp',
  en: 'Chat on WhatsApp',
};

export function WhatsAppChat({ locale }: { locale: string }) {
  const label = LABELS[locale] || LABELS.en;
  return (
    <a
      href="https://wa.me/491779354855"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#00C853] text-white shadow-xl ring-2 ring-white transition-transform hover:scale-105 hover:bg-[#00B84A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5722]"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.18 1.6 6L4 28l7.12-1.87a12.02 12.02 0 0 0 4.92 1.05h.01C22.68 27.18 28 21.78 28 15.14 28 8.5 22.68 3 16.04 3zm0 22.1h-.01a10.1 10.1 0 0 1-5.15-1.41l-.37-.22-3.8 1 1.02-3.7-.24-.38a10.07 10.07 0 0 1-1.55-5.36c0-5.58 4.55-10.12 10.15-10.12 2.7 0 5.25 1.05 7.15 2.96a10.05 10.05 0 0 1 2.96 7.16c0 5.58-4.55 10.07-10.16 10.07zm5.57-7.58c-.3-.15-1.8-.89-2.08-.99-.28-.1-.48-.15-.68.15-.2.3-.78.99-.96 1.19-.18.2-.35.22-.65.07-.3-.15-1.29-.47-2.45-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.46.13-.6.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.5.71.3 1.26.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.8-.74 2.05-1.45.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z" />
      </svg>
    </a>
  );
}
