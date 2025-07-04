import axios from '@/lib/services/config';

const outletService: any = {};

// Get paginated list with keyword filtering
outletService.getList = async ({ keyword = '', page = 1, limit = 10 }) => {
  const response = await axios.get('/api/pos/outlet', {
    params: { keyword, page, limit },
  });
  return response.data;
};

// Options for dropdowns or parent selections (if needed)
outletService.getOutletOptions = async () => {
  const { data } = await axios.get('/api/pos/outlet/all_outlet_options');
  return data;
};

// Create new outlet
outletService.add = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/pos/outlet/add', outlet);
  return data;
};

// Update existing outlet
outletService.update = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/pos/outlet${outlet.id}`, outlet);
  return data;
};

// Delete outlet
outletService.delete = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/pos/outlet${outlet.id}`);
  return data;
};

export default outletService;
