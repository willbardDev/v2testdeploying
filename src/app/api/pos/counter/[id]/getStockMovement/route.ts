import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const searchParams = req.nextUrl.searchParams;
  const isDormant = searchParams.get('dormant') === 'true';

  const type = isDormant ? 'dormant_stock' : 'stock_movement';
  const url = new URL(`${API_BASE}/stores/${params.id}/${type}`);

  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    headers,
    credentials: 'include',
  });

  return handleJsonResponse(res);
}
