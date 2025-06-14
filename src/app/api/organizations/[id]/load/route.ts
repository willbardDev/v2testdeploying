// /app/api/auth/load-organization/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { encode, getToken, JWT } from 'next-auth/jwt';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { organization_id } = body;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const cookies = req.headers.get('cookie') || '';

  if (!token?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/organizations/${organization_id}/load`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: cookies,
    },
    body: JSON.stringify({ organization_id }),
    credentials: 'include',
  });

  const data = await res.json();

if (data?.token && data?.authUser?.user) {
  const jwtPayload: JWT = {
    user: {
      id: data.authUser.user.id,
      name: data.authUser.user.name,
      email: data.authUser.user.email,
    },
    accessToken: data.token,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
  };

  const sessionToken = await encode({
    token: jwtPayload,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const response = NextResponse.json({
    message: 'Organization switched',
    data: {
      authUser: data.authUser,
      authOrganization: data.authOrganization,
    },
  });

  response.cookies.set('next-auth.session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  return response;
}

  return NextResponse.json({ status: res.status });
}
