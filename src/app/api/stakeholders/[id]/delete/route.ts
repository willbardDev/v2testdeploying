import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${API_BASE}/stakeholders/${params.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token.accessToken}`, Accept: 'application/json' },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
