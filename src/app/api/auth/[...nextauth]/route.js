import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/services/config';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 1. Get cookies properly in an async context
          const { cookies } = await import('next/headers');
          const cookieStore = cookies();
          const cookieString = cookieStore.getAll()
            .map(c => `${c.name}=${c.value}`)
            .join('; ');

          // 2. Configure axios with proper timeout and error handling
          const axiosInstance = axios.create({
            timeout: 15000, // 15 seconds timeout
            headers: {
              Cookie: cookieString,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          // 3. Get CSRF token first
          await axiosInstance.get('/sanctum/csrf-cookie');

          // 4. Attempt login with credentials
          const { data } = await axiosInstance.post('/login', credentials, {
            validateStatus: (status) => status < 500 // Don't throw for 4xx errors
          });

          if (!data?.token || !data?.authUser) {
            console.error('Login failed - missing token or user data');
            return null;
          }

          return {
            user_id: data.authUser.user.id,
            name: data.authUser.user.name,
            email: data.authUser.user.email,
            token: data.token,
            organization_id: data.authOrganization?.organization?.id,
            organization_name: data.authOrganization?.organization?.name,
            permissions: data.authUser.permissions,
            auth_permissions: data.authOrganization?.permissions
          };
        } catch (error) {
          console.error('Authentication error:', {
            message: error.message,
            code: error.code,
            config: error.config,
            stack: error.stack
          });
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          user: {
            id: user.user_id,
            name: user.name,
            email: user.email
          },      
          organization_id: user.organization_id,
          organization_name: user.organization_name,
          permissions: user.permissions,
          auth_permissions: user.auth_permissions
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.permissions = token.permissions;
      session.organization_id = token.organization_id;
      session.organization_name = token.organization_name;
      session.auth_permissions = token.auth_permissions;
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login?error=1' // Custom error page
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? '.proserp.co.tz'
          : undefined,
        maxAge: 24 * 60 * 60,
      },
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: {
    error(code, metadata) {
      console.error({ code, metadata });
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug({ code, metadata });
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };