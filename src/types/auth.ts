export interface Role {
    id: number;
    name: string;
  }
  
  export interface AuthUser {
    fcmTokens?: string[] | null; // Made optional since it's missing in authData.authUser
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      email_verified_at: string;
      created_at: string;
      updated_at: string;
      is_admin: boolean;
      roles: Role[] | null;
      organization_roles: Role[];
    };
    permissions: string[];
  }
  
  export interface AuthResponse {
    token: string;
    authUser: AuthUser;
    authOrganization?: any;
  }
  