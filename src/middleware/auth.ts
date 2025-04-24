import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const COOKIE_NAME = process.env.NODE_ENV === 'production'
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

export async function authMiddleware(request: NextRequest) {
  // 1. Get token from secure HTTP-only cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
  });

  // 2. Handle unauthenticated requests
  if (!token) {
    return createAuthRedirect(request);
  }

  // 3. Check token expiration (if using JWT)
  if (token.exp && Math.floor(Date.now() / 1000) > token.exp) {
    return createAuthRedirect(request, 'SessionExpired');
  }

  return NextResponse.next();
}

export async function anonymousMiddleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
    cookieName: COOKIE_NAME
  });

  // Redirect authenticated users away from auth pages
  if (token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// --- Helpers ---
function createAuthRedirect(request: NextRequest, error?: string) {
  const callbackPath = request.nextUrl.pathname;

  if (callbackPath.includes('/auth/signin')) {
    return NextResponse.next(); // 🛑 avoid redirect loop
  }

  const url = new URL('/auth/signin', request.url);
  url.searchParams.set('callbackUrl', callbackPath);
  if (error) url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}