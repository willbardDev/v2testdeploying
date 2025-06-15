import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function getAuthHeaders(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return {
      headers: null,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const getTimezoneOffset = (): string => {
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const sign = offset < 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0');
    const minutes = Math.abs(offset % 60).toString().padStart(2, '0');
    return `${sign}${hours}:${minutes}`;
  };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Timezone': getTimezoneOffset(),
    'X-OrganizationId': String(token.organizationId),
  };

  return { headers, response: null };
}

export async function handleJsonResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const text = await res.text();
    return NextResponse.json({ message: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
