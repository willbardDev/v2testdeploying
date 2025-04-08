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
          await axios.get('/sanctum/csrf-cookie');
          const { data } = await axios.post('/login', credentials);
          
          if (!data?.token || !data?.authUser) return null;
          
          // Return only essential data
          return {
            user_id: data.authUser.user.id,
            name: data.authUser.user.name,
            email: data.authUser.user.email,
            token: data.token,
            organization_id: data.authOrganization?.organization.id,
            organization_name: data.authOrganization.organization.name,
            organization_website: data.authOrganization.organization.website
          };
        } catch (error) {
          console.error('Authentication error:', error);
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
          organization_name: user.organization_name
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.organization_id = token.organization_id;
      session.organization_name = token.organization_name
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };