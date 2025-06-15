import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/masters/exchange-rates-updates/${params.id}`, {
    method: 'DELETE',
    headers
  });

  return handleJsonResponse(res);
}
