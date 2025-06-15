import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const url = new URL(`${API_BASE}/organizations/${params.id}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const res = await fetch(url.toString(), {
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}