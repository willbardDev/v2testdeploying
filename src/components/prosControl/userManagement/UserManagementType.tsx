export type user = {
  id: number;
  name: string;
  email: string;
   phone: string; 
  is_verified: boolean;
  is_active: boolean;
};

export type AddUserResponse = {
  success: boolean;
  message: string;
  user: user;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  user: user;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export type PaginatedUserResponse = {
  total: number;
  data: user[];
};

export type User = {
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
  };
}

 export interface ErrorResponse {
  message: string;
}
 