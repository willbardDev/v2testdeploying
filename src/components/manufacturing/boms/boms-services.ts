import axios from '@/lib/services/config';
import {
  AddBOMResponse,
  UpdateBOMResponse,
  DeleteBOMResponse,
  PaginatedBOMResponse,
} from './BomsTypes';

const bomsServices: any = {};

// Get paginated list of BOMs
bomsServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedBOMResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/projectManagement/boms', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// ✅ Add a new BOM
bomsServices.add = async (bom: {
  name: string;
  description?: string;
  project_id?: number;
}) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/projectManagement/boms/add', bom);
  return data;
};

// Update an existing BOM
bomsServices.update = async (
  bom: { id: number; name: string; description?: string; project_id?: number }
): Promise<UpdateBOMResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/projectManagement/boms/${bom.id}/update`, bom);
  return data;
};

// Delete a BOM
bomsServices.delete = async (
  params: { id: number }
): Promise<DeleteBOMResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/projectManagement/boms/${params.id}/delete`);
  return data;
};

export default bomsServices;
export type {
  AddBOMResponse,
  UpdateBOMResponse,
  DeleteBOMResponse,
  PaginatedBOMResponse,
};
