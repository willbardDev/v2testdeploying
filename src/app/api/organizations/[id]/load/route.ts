import { NextRequest, NextResponse } from 'next/server';
import { encode, JWT } from 'next-auth/jwt';
import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';

const API_BASE = process.env.API_BASE_URL

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { organization_id } = body;

  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/organizations/${organization_id}/load`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify({ organization_id }),
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
    organizationId: data.authOrganization?.organization.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
  };

  const sessionToken = await encode({
    token: jwtPayload,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const response = NextResponse.json({
    message: 'Organization is loaded to an active organization',
    data: {
      authUser: data.authUser,
      authOrganization: data.authOrganization,
    },
  });

  response.cookies.set(
      process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    domain: process.env.NODE_ENV === 'production' 
      ? '.proserp.co.tz'
      : undefined,
    maxAge: 60 * 60 * 24,
  });

  return response;
}

 return handleJsonResponse(res);
}
