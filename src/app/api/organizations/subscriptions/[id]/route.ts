import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`${API_BASE_URL}/subscriptions/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${API_BASE_URL}/subscriptions/${params.id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
