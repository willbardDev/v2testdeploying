import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const roleData = await req.json();

  const res = await fetch(`${API_BASE}/organizations/${params.id}/new-role`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(roleData),
  });

  return handleJsonResponse(res);
}
