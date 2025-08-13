import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest, context: any) {
const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/reactivate-user/${params.id}`, {
  method: 'POST',
  headers,
});


  return handleJsonResponse(res);
}
