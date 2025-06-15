import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  // ✅ Parse the request body
  const body = await req.json();
  const { autoload } = body;

  if (typeof autoload !== 'boolean') {
    return NextResponse.json({ message: 'Invalid autoload value' }, { status: 400 });
  }

  const res = await fetch(`${API_BASE}/organizations/${params.id}/toggle_autoload`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify({ autoload }), // ✅ Correctly send the boolean value
  });

  return handleJsonResponse(res);
}
