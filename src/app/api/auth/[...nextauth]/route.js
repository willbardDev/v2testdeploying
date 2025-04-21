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
            organization_website: data.authOrganization.organization.website,
            permissions: data.authUser.permissions,
            auth_permissions: data.authOrganization.permissions,
            organization_roles: data.authUser.user.organization_roles,
            active_subscriptions: data.authOrganization.organization.active_subscriptions
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
          organization_name: user.organization_name,
          permissions: user.permissions,
          auth_permissions: user.auth_permissions,
          // organization_roles: user.organization_roles,
          // active_subscriptions: user.active_subscriptions
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken,
      session.permissions = token.permissions,
      session.organization_roles = token.organization_roles,
      session.organization_id = token.organization_id;
      session.organization_name = token.organization_name,
      session.active_subscriptions = token.active_subscriptions,
      session.auth_permissions = token.auth_permissions
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
  cookies: {
    sessionToken: {
      name: 
        process.env.NODE_ENV === 'production' 
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };