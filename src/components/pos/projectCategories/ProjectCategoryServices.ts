import axios from '@/lib/services/config';
import {
  AddprojectCategoryResponse,
  UpdateprojectCategoryResponse,
  DeleteprojectCategoryResponse,
  PaginatedprojectCategoryResponse,
} from './ProjectCategoriesType';

const projectCategoryServices: any = {};

projectCategoryServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedprojectCategoryResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/pos/projectCategories', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

projectCategoryServices.add = async (
    category: { name: string; description?: string }
): Promise<AddprojectCategoryResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/pos/projectCategories', category);
  return data;
};

projectCategoryServices.update = async (
    category: { id: number; name: string; description?: string }
): Promise<UpdateprojectCategoryResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/pos/projectCategories/${category.id}`, category);
  return data;
};

projectCategoryServices.delete = async (
  params: { id: number }
): Promise<DeleteprojectCategoryResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/pos/projectCategories/${params.id}`);
  return data;
};

export default projectCategoryServices;
export type {
  AddprojectCategoryResponse,
  UpdateprojectCategoryResponse,
  DeleteprojectCategoryResponse,
  PaginatedprojectCategoryResponse, 
} 
