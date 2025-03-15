import { anonymousMiddleware, authMiddleware } from '@/middleware/auth';
import { prefixLocale } from '@/middleware/locale';
import { isAnonymousPath, isPublicPath } from '@/utilities/helpers/path';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

let headers = { 'accept-language': 'en-US,en;q=0.5' };
let languages = new Negotiator({ headers }).languages();
let locales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];
let defaultLocale = 'en-US';

match(languages, locales, defaultLocale);

export let activeLocale = defaultLocale;

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  const localeResponse = prefixLocale(request);
  if (localeResponse) {
    return NextResponse.redirect(localeResponse);
  }

  if (isPublicPath(pathname, activeLocale)) {
    return NextResponse.next();
  }

  if (isAnonymousPath(pathname, activeLocale)) {
    return anonymousMiddleware(request);
  }

  return authMiddleware(request);
}
