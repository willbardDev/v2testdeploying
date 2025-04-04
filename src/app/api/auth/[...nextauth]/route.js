import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from '@/lib/config';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          // 1. Get CSRF token
          await axios.get('/sanctum/csrf-cookie');
          
          // 2. Authenticate (matches your existing login flow)
          const { data } = await axios.post('/login', credentials);
          console.log(data)
          
          if (!data?.token || !data?.authUser) return null;
          
          // 3. Return exactly what your configAuth expects
          return {
            token: data.token,
            user: data.authUser.user,
            organization: data.authOrganization,
            organization_roles: data.authUser.organization_roles,
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
      // Merge user data into token
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          authUser: user.user,
          authOrganization: user.organization,
          organization_roles: user.organization_roles,
          permissions: user.permissions
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Make available to client components
      return {
        ...session,
        user: {
          ...session.user,
          ...token.authUser,
          organization_roles: token.organization_roles,
          permissions: token.permissions
        },
        organization: token.authOrganization,
        accessToken: token.accessToken
      };
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
