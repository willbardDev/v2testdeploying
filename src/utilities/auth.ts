import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const getTimezoneOffset = (): string => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes < 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(timezoneOffsetMinutes / 60)).toString().padStart(2, '0');
  const minutes = Math.abs(timezoneOffsetMinutes % 60).toString().padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

export async function buildAuthHeaders(request: NextRequest): Promise<{
  headers: Record<string, string>;
  errorResponse?: Response;
}> {
  const token = await getToken({ req: request });

  if (!token?.accessToken) {
    return {
      headers: {},
      errorResponse: new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.accessToken}`,
    Accept: 'application/json',
    'X-Timezone': getTimezoneOffset(),
  };

  if (token.organizationId) {
    headers['X-OrganizationId'] = token.organizationId as string;
  }

  return { headers };
}
