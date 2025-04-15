import { NextResponse } from 'next/server';
import axios from '@/lib/config/axios';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    const { data } = await axios.post(`/organizations/update/${id}`, formData, {
      headers: {
        Authorization: request.headers.get('Authorization'),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Update failed' },
      { status: error.response?.status || 500 }
    );
  }
}