import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE

export async function PUT(req: NextRequest, context: any) {
const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const body = await req.json();
  const res = await fetch(`${API_BASE}/subscriptions/${params.id}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });

  return handleJsonResponse(res);
}

export async function DELETE(req: NextRequest, context: any) {
const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/subscriptions/${params.id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
