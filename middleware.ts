import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['de', 'fr', 'nl', 'it', 'es', 'pt', 'en'];
const DEFAULT_LOCALE = 'de';

// German is served without a prefix (/shop), every other language with one (/fr/shop).
// Unprefixed paths are rewritten to /de/... internally; /de/... is redirected to the clean URL
// so each page has exactly one German URL.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/de/, '') || '/';
    return NextResponse.redirect(url, 308);
  }

  if (LOCALES.includes(first)) {
    // Magazine, category and brand pages exist in German only: send other languages there with a real 308.
    const rest = pathname.slice(first.length + 1) || '/';
    if (/^\/(blog|e-bikes|marken|zubehoer)(\/|$)/.test(rest)) {
      const url = request.nextUrl.clone();
      url.pathname = rest;
      return NextResponse.redirect(url, 308);
    }
    const res = NextResponse.next();
    // Translated URLs of pages whose copy is still German are kept out of the index.
    if (rest !== '/') res.headers.set('X-Robots-Tag', 'noindex, follow');
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.svg|logo.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt|.*\\..*).*)',
  ],
};
