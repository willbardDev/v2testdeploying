// lib/utils/getAuthAxios.ts
import baseAxios from 'axios';
import { getToken } from 'next-auth/jwt';

export async function getAuthAxios() {
  const { cookies } = await import('next/headers');
  const cookieString = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const token = await getToken({
    req: {
      headers: {
        cookie: cookieString,
      },
    } as any, // 👈 Force type compatibility (works on server)
    secret: process.env.NEXTAUTH_SECRET,
  });

  const instance = baseAxios.create(); // ✅ original axios

  if (token?.accessToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
  }

  return instance;
}
