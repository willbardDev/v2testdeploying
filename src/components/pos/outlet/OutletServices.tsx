import axios from '@/lib/services/config';
import type {
  Outlet,
  AddOutletResponse,
  UpdateOutletResponse,
  DeleteOutletResponse,
  PaginatedOutletResponse,
} from './OutletType';

const outletService: any = {}; // or define exact shape with types if needed

// 🔹 Get paginated outlet list
outletService.getList = async (params: { keyword?: string; page?: number; limit?: number } = {}): Promise<PaginatedOutletResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/pos/outlet', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// 🔹 Get all outlets (for dropdowns etc)
outletService.getAllOutlets = async (): Promise<Outlet[]> => {
  const { data } = await axios.get('/api/pos/outlet/all_outlets');
  return data;
};

// 🔹 Add new outlet
outletService.add = async (outlet: Outlet): Promise<AddOutletResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/pos/outlet/add', outlet);
  return data;
};

// 🔹 Update outlet
outletService.update = async (outlet: Outlet & { id: number }): Promise<UpdateOutletResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/pos/outlet/${outlet.id}/update`, outlet);
  return data;
};

// 🔹 Delete outlet
outletService.delete = async (id: number): Promise<DeleteOutletResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/pos/outlet/${id}/delete`);
  return data;
};

export default outletService;
export type { Outlet, AddOutletResponse, UpdateOutletResponse, DeleteOutletResponse, PaginatedOutletResponse };