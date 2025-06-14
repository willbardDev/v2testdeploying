import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const roleData = await req.json(); // receives { name: string, permission_ids: [...] }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations/${params.id}/new-role`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
