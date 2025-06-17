import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';

const API_BASE = process.env.API_BASE_URL;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/accounts/journal_vouchers/${params.id}`, {
    method: 'DELETE',
    headers
  });

  return handleJsonResponse(res);
}
