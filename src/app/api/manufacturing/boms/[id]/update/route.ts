// app/api/manufacturing/boms/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders, handleJsonResponse } from '@/lib/utils/apiUtils';

const API_BASE = process.env.API_BASE_URL;

export async function GET(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const { id } = params;
  
  // Call your backend API to get a single BOM
  const res = await fetch(`${API_BASE}/boms/${id}`, { // Note: no /api/manufacturing prefix
    method: 'GET',
    headers,
  });

  return handleJsonResponse(res);
}

export async function PUT(req: NextRequest, context: any) {
  const { params } = context as { params: { id: string } };
  const { headers, response } = await getAuthHeaders(req);
  if (response) return response;

  const { id } = params;
  const body = await req.json();
  
  // Call your backend API to update a BOM
  const res = await fetch(`${API_BASE}/boms/${id}`, { // Note: no /api/manufacturing prefix
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  return handleJsonResponse(res);
}