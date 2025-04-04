import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/config';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          await axios.get('/sanctum/csrf-cookie');
          const { data } = await axios.post('/login', credentials);
          
          if (!data?.token || !data?.authUser) return null;
          
          // Store all auth data in a server session
          return {
            token: data.token,
            authUser: data.authUser,
            organization: data.authOrganization,
            permissions: data.authUser.permissions
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store ONLY the essential references in JWT
        return {
          ...token,
          accessToken: user.token,
          userId: user.authUser.id,
          orgId: user.organization?.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Client-side will get the full data from initial login
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          id: token.userId,
        }
      };
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };