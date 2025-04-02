import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    authUser?: {
      id: string;
      name: string;
      email: string;
      // Add any other fields that exist in authUser
    };
    authOrganization?: any; // Adjust this type based on your API response
  }

  interface User {
    id: string;
    accessToken: string;
    authUser: {
      id: string;
      name: string;
      email: string;
    };
    authOrganization?: any;
  }

  interface JWT {
    accessToken?: string;
    authUser?: User["authUser"];
    authOrganization?: User["authOrganization"];
  }
}
