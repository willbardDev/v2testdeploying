import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL!;

export async function POST(req: NextRequest) {
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const res = await fetch(`${API_BASE}/attachments`, {
    method: 'POST',
    body: req.body,
    headers: { ...headers }, // Let fetch forward raw headers + multipart
    credentials: 'include'
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers
  });
}
