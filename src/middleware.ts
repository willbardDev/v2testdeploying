import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, anonymousMiddleware } from '@/middleware/auth';
import { isPublicPath, isAnonymousPath } from '@/utilities/helpers/path';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Locale configuration
const headers = { 'accept-language': 'en-US,en;q=0.5' };
const locales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];
const defaultLocale = 'en-US';

export const activeLocale = match(
  new Negotiator({ headers }).languages(),
  locales,
  defaultLocale
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Locale Handling ---
  const localeResponse = handleLocalePrefix(request);
  if (localeResponse) return localeResponse;

  // --- Path Classification ---
  if (isPublicPath(pathname, activeLocale)) {
    return NextResponse.next();
  }

  if (isAnonymousPath(pathname, activeLocale)) {
    return anonymousMiddleware(request);
  }

  // --- Protected Routes ---
  return authMiddleware(request);
}

// Helper function for locale redirection
function handleLocalePrefix(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathLocale = pathname.split('/')[1];
  
  if (!locales.includes(pathLocale)) {
    const locale = activeLocale || defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  return null;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|locales).*)',
  ],
};