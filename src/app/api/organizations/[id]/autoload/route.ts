import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const cookies = req.headers.get('cookie');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Parse the request body
  const body = await req.json();
  const { autoload } = body;

  if (typeof autoload !== 'boolean') {
    return NextResponse.json({ message: 'Invalid autoload value' }, { status: 400 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations/${params.id}/toggle_autoload`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: cookies || '',
    },
    body: JSON.stringify({ autoload }), // ✅ Correctly send the boolean value
    credentials: 'include',
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
