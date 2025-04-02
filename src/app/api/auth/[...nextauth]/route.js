import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/axios';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
      
        const { data: authData } = await api.get('/sanctum/csrf-cookie').then(async () => {
          return await api.post('/login', credentials);
        });

        if (authData?.authUser?.user?.id) {
          return {
            authUser: {
              id: authData.authUser.user.id,
              name: authData.authUser.user.name,
              email: authData.authUser.user.email,
              phone: authData.authUser.user.phone,
              roles: authData.authUser.user.roles,
              organization_roles: authData.authUser.organization_roles,
              permissions: authData.authUser.permissions,
            },
            accessToken: authData.token,
          };
        }

        return null; // If validation fails
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.authUser = user.authUser;
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token.authUser) {
        session.user = {
          id: token.authUser.id,
          name: token.authUser.name,
          email: token.authUser.email,
          roles: token.authUser.roles,
          permissions: token.authUser.permissions,
        };
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every day
    strategy: 'jwt', // Use JWT instead of database sessions
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
