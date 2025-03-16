import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = `/auth/login`;
    return NextResponse.redirect(url);
  }

  //do we need to verify the token?
  //if not verified then redirect to /auth/login-1
  return NextResponse.next();
}

export function anonymousMiddleware(req: NextRequest) {
  const accessToken = req.cookies.get('next-auth.session-token');

  if (accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = `/dashboards/crypto`; // Redirect logged-in users to dashboard
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
