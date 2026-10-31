import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['de', 'en', 'nl', 'it', 'es'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with a supported locale prefix
  const pathLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathLocale) {
    // Strip the locale prefix for internal Next.js App Router resolution
    let newPathname = pathname.replace(`/${pathLocale}`, '');
    if (!newPathname.startsWith('/')) {
      newPathname = '/' + newPathname;
    }

    const rewriteUrl = new URL(newPathname, request.url);
    // Preserve query parameters
    rewriteUrl.search = request.nextUrl.search;

    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set('x-locale', pathLocale);
    response.cookies.set('NEXT_LOCALE', pathLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.svg, logo.svg, robots.txt, sitemap.xml, llms.txt, llms-full.txt
     * - public assets
     */
    '/((?!api|_next/static|_next/image|assets|favicon.svg|logo.svg|robots.txt|sitemap.xml|llms.txt|llms-full.txt|.*\\..*).*)',
  ],
};
