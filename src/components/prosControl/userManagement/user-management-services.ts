import axios from '@/lib/services/config';
import {
  VerifyUserResponse,
  DeactivateUserResponse,
  ReactivateUserResponse,
  PaginatedUserResponse,
} from './UserManagementType';

export interface VerifyUserPayload {
  email: string;
}

const userManagementServices: any = {};

// ✅ Get user list (paginated)
userManagementServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedUserResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/prosControl/userManagement', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// ✅ Verify user
userManagementServices.verify = async (
  payload: VerifyUserPayload
): Promise<VerifyUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/users/verify', payload);
  return data;
};

// ✅ Deactivate user
userManagementServices.deactivate = async (
 params: { id: number }
): Promise<DeactivateUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post(`/api/prosControl/userManagement/${params.id}/deactivate`);
  return data;
};

// ✅ Reactivate user
userManagementServices.reactivate = async (
   params: { id: number }
): Promise<ReactivateUserResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post(`/api/prosControl/userManagement/${params.id}/reactivate`);
  return data;
};

export default userManagementServices;
