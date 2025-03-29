import NextAuth, { NextAuthOptions, User } from 'next-auth';
import api from '@/lib/axios'
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions =  {
  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'demo@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        // Simulate user validation (replace this with your real logic)

        const {data : authData} = await api.get('/sanctum/csrf-cookie').then(async response => {
            return await api.post('/login', credentials);
        })

        if (!!authData?.authUser?.user?.name && !!authData?.authUser?.user?.email) {
          console.log(authData.authUser);
          const user : User = {
            id: authData?.authUser?.user?.id,
            accessToken: authData?.token,
            authUser: authData?.authUser,
            authOrganization: authData?.authOrganization
          }
          return user;
        }

        // If validation fails, return null or throw an error
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token,user}) {
      // Persist the OAuth access_token to the token right after signin
      return token
    },

    async session({ session,token,user}) {
      // Send properties to the client, like an access_token from a provider.
      session.user = user
      return session
    },

  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
