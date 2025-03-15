import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    accessToken: string;
  }

  interface Session extends DefaultSession {
    user: User;
    expires: string;
    error: string;
  }
}
