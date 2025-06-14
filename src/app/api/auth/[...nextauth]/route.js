import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/services/config';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const axiosInstance = axios.create({
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          // Step 1: Get CSRF cookie
          await axiosInstance.get('/sanctum/csrf-cookie');

          // Step 2: Attempt login
          const { data } = await axiosInstance.post('/login', credentials, {
            validateStatus: (status) => status < 500,
          });

          if (!data?.authUser?.user || !data?.authUser?.user?.id) {
            throw new Error('Invalid login credentials');
          }

          // Return user object with token
          return {
            id: data.authUser.user.id,
            name: data.authUser.user.name,
            email: data.authUser.user.email,
            token: data.token,
          };
        } catch (error) {
          console.error('Login failed:', error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      
      // Important: Don't expose the token to the client
      // It will be available in HTTP-only cookies
      
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },

  pages: {
    signIn: '/login',
  },

  cookies: {
    sessionToken: {
      name: 
        process.env.NODE_ENV === 'production' 
          ? '__Secure-next-auth.session-token' 
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? '.proserp.co.tz'
          : undefined,
        maxAge: 24 * 60 * 60,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === 'true',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };