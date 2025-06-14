import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.accessToken) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');
  const keyword = searchParams.get('keyword');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const query = new URLSearchParams({
    ...(type && { type }),
    ...(keyword && { keyword }),
    ...(page && { page }),
    ...(limit && { limit }),
  }).toString();

  const res = await fetch(`${API_BASE}/organizations/${params.id}/users/?${query}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
