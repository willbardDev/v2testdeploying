import { getAuthHeaders } from '@/lib/utils/apiUtils';
import { NextRequest } from 'next/server';

const API_BASE = process.env.API_BASE_URL;

export async function POST(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const body = await req.json();
  const res = await fetch(`${API_BASE}/stores/${params.id}/stock_list_excel`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  // If backend returns Excel, forward it as a Blob
  const arrayBuffer = await res.arrayBuffer();

  return new Response(arrayBuffer, {
    status: res.status,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="stock_list.xlsx"', // optional
    },
  });
}
