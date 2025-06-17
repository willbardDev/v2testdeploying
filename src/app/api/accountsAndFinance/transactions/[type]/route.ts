import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL!;

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  const { headers, response } = await getAuthHeaders(request);
  if (response) return response;

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  searchParams.set('type', params.type);

  const query = searchParams.toString();

  const res = await fetch(`${API_BASE}/accounts/${params.type}?${query}`, {
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
