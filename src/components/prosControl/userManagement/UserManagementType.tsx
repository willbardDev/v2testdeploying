export type userManager = {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  is_active: boolean;
};

export type AddUserResponse = {
  success: boolean;
  message: string;
  user: userManager;
};
export type UpdateUserResponse = {
  success: boolean;
  message: string;
  user: userManager;
};
export type DeleteUserResponse = {
  success: boolean;
  message: string;
};
export type PaginatedUserResponse = {
  total: number;
  data: userManager[];
};

export type UserManager = {
  id: number;
  email: string;
  name: string;
  is_verified: boolean;
  is_active: boolean;
};


export type DeactivateUserResponse = {
  message: string;
};

export type ReactivateUserResponse = {
  message: string;
};
export interface VerifyUserResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    // ...other fields
  };
}

