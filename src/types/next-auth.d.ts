import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
    interface JWT {
      accessToken: string;
      exp?: number;
      iat?: number;
      user_id?: string;
      permissions?: string[];
      organization_id?: string;
    }
  }

declare module 'next/server' {
  interface NextRequest {
    auth?: {
      token: JWT;
    };
  }
}