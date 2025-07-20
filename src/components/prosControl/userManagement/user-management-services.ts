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

const verify = async (payload: VerifyUserPayload): Promise<VerifyUserResponse> => {
  const response = await axios.post('/users/verify', payload);
  return response.data;
};

const deactivate = async (id: number): Promise<DeactivateUserResponse> => {
  const response = await axios.post(`/deactivate-user/${id}`);
  return response.data;
};

const reactivate = async (id: number): Promise<ReactivateUserResponse> => {
  const response = await axios.post(`/reactivate-user/${id}`);
  return response.data;
};

// ✅ Renamed from getUsers to getList
const getList = async (): Promise<PaginatedUserResponse> => {
  const response = await axios.get('/api/prosControl/userManagement');
  return response.data;
};

const userManagementServices = {
  verify,
  deactivate,
  reactivate,
  getList, // 👈 unified naming
};

export default userManagementServices;
