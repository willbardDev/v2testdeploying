import axios from '@/lib/services/config';
import {
  AddUserResponse,
  UpdateUserResponse,
  PaginatedUserResponse,
  DeactivateUserResponse,
  ReactivateUserResponse,
} from './UserManagementType';

const userManagementServices: any = {};

// 🔹 Get paginated list of users
userManagementServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedUserResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/prosControl/userManagement', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// 🔹 Add a new user
userManagementServices.add = async (user: {
  name: string;
  email: string;
  is_verified?: boolean;
}): Promise<AddUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/users', user);
  return data;
};

// 🔹 Update existing user
userManagementServices.update = async (user: {
  id: number;
  name: string;
  email: string;
  is_verified?: boolean;
}): Promise<UpdateUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/users/${user.id}`, user);
  return data;
};

userManagementServices.deactivate = async (id: number): Promise<DeactivateUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post(`/api/users/${id}/deactivate`);
  return data;
};


userManagementServices.reactivate = async (id: number): Promise<ReactivateUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post(`/api/users/${id}/reactivate`);
  return data;
};


// ✅ Verify user by email
userManagementServices.verify = async (email: string): Promise<any> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/users/verify', { email });
  return data;
};

export default userManagementServices;

export type {
  AddUserResponse,
  UpdateUserResponse,
  PaginatedUserResponse,
};
