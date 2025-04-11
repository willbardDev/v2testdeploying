import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { anonymousMiddleware, authMiddleware } from '@/middleware/auth';
import { prefixLocale } from '@/middleware/locale';
import { isAnonymousPath, isPublicPath } from '@/utilities/helpers/path';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Locale configuration
const headers = { 'accept-language': 'en-US,en;q=0.5' };
const languages = new Negotiator({ headers }).languages();
const locales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];
const defaultLocale = 'en-US';

match(languages, locales, defaultLocale);
export const activeLocale = defaultLocale;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale prefixing
  const localeResponse = prefixLocale(request);
  if (localeResponse) {
    return NextResponse.redirect(localeResponse);
  }

  // Public paths don't need authentication
  if (isPublicPath(pathname, activeLocale)) {
    return NextResponse.next();
  }

  // Get the JWT token securely
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Anonymous paths (like login page)
  if (isAnonymousPath(pathname, activeLocale)) {
    return anonymousMiddleware(request);
  }

  // Check authentication
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For API routes, inject the token into headers
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token.accessToken}`);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  // For pages, enrich the request with auth context
  const authedRequest = Object.assign(request, {
    auth: { token }
  });

  return authMiddleware(authedRequest);
}