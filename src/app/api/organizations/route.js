import axios from '@/lib/services/config';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const { data } = await axios.get('/organizations', {
      params,
      headers: {
        Authorization: request.headers.get('Authorization')
      }
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch organizations' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const { data } = await axios.post('/organizations', formData, {
      headers: {
        Authorization: request.headers.get('Authorization'),
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create organization' },
      { status: error.response?.status || 500 }
    );
  }
}