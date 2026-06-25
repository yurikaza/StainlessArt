import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Set locale hint for RSC consumption
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const locale = acceptLanguage.startsWith('en') ? 'en' : 'tr';
  response.headers.set('x-locale', locale);

  // Prevent edge caching of mutation routes
  if (request.nextUrl.pathname.startsWith('/api/sync') ||
      request.nextUrl.pathname.startsWith('/api/checkout')) {
    response.headers.set('Cache-Control', 'no-store');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
