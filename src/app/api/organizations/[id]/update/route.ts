import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest, { params }: { params: { id: number } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations/update/${params.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  return NextResponse.json(data, { status: res.status });
}
