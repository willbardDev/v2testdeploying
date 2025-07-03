import axios from '@/lib/services/config';

const outletService: any = {};

// Get paginated list with keyword filtering
outletService.getList = async ({ keyword = '', page = 1, limit = 10 }) => {
  const response = await axios.get('/sales_outlet', {
    params: { keyword, page, limit },
  });
  return response.data;
};

// Options for dropdowns or parent selections (if needed)
outletService.getOutletOptions = async () => {
  const { data } = await axios.get('/sales_outlet');
  return data;
};

// Create new outlet
outletService.add = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/sales_outlet', outlet);
  return data;
};

// Update existing outlet
outletService.update = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/sales_outlet/${outlet.id}`, outlet);
  return data;
};

// Delete outlet
outletService.delete = async (outlet: any) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/sales_outlet/${outlet.id}`);
  return data;
};

export default outletService;
