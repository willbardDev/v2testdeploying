import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login-1', // Custom sign-in page
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

        const { email, password } = credentials;
        // Simulate user validation (replace this with your real logic)
        if (email === 'demo@example.com' && password === 'zab#723') {
          const user: User = {
            id: 1,
            name: 'David Tim',
            email,
            role: 'admin',
            accessToken: 'replace-your-token',
          };
          return user;
        }

        // If validation fails, return null or throw an error
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
