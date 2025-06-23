import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL!;

export async function POST(req: NextRequest) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const formData = await req.formData();

  const res = await fetch(`${API_BASE}/stock_adjustments`, {
    method: 'POST',
    body: formData,
    headers: {
      ...headers,
      // Don't include Content-Type for FormData — the browser will set it automatically
    },
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
