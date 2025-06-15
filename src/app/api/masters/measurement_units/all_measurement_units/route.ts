import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL

export async function GET(req: NextRequest) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const url = new URL(`${API_BASE}/all_measurement_units`);
  url.searchParams.set('type', req.nextUrl.searchParams.get('type') || 'all');

  const res = await fetch(url.toString(), {
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
