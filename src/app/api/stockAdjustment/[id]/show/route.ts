import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL!;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/stock_adjustments/${params.id}`, {
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
