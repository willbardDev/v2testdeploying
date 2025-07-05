import axios from '@/lib/services/config';
import type {
  Outlet,
  AddOutletResponse,
  UpdateOutletResponse,
  DeleteOutletResponse,
  OutletOption,
  PaginatedOutletResponse,
} from './OutletType';

interface GetListParams {
  keyword?: string;
  page?: number;
  limit?: number;
}

const outletService = {
  // 🔹 Get paginated outlet list
  getList: async ({ keyword = '', page = 1, limit = 10 }: GetListParams): Promise<PaginatedOutletResponse> => {
    const response = await axios.get('/api/pos/outlet', {
      params: { keyword, page, limit },
    });
    return response.data;
  },

  getAllOutlets:  async() => {
      const {data} = await axios.get('/api/pos/outlet/all_outlet_options');
      return data;
  },
  

  // 🔹 Create new outlet
  add: async (outlet: Outlet): Promise<AddOutletResponse> => {
    await axios.get('/sanctum/csrf-cookie');
    const { data } = await axios.post('/api/pos/outlet/add', outlet);
    return data;
  },

  // 🔹 Update existing outlet
  update: async (outlet: Outlet & { id: number }): Promise<UpdateOutletResponse> => {
    await axios.get('/sanctum/csrf-cookie');
    const { data } = await axios.put(`/api/pos/outlet/${outlet.id}`, outlet);
    return data;
  },

  // 🔹 Delete outlet
  delete: async (outlet: { id: number }): Promise<DeleteOutletResponse> => {
    await axios.get('/sanctum/csrf-cookie');
    const { data } = await axios.delete(`/api/pos/outlet/${outlet.id}`);
    return data;
  },
};

export default outletService;
