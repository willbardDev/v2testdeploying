import axios from '@/lib/services/config';
import {
  AddProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  PaginatedProjectResponse,
} from './ProjectTypes';

const projectServices: any = {};

// Get paginated list of projects
projectServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedProjectResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/projectManagement/project/', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// Add a new project
projectServices.add = async (project: {
  name: string;
  description?: string;
  category_id?: number;
  client_id?: number;
}) => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.post('/api/projectManagement/project/add', project);
  return data;
};

// Update an existing project
projectServices.update = async (
  project: { id: number; name: string; description?: string; category_id?: number; client_id?: number }
): Promise<UpdateProjectResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/projectManagement/project/${project.id}/update`,
    project
  );
  return data;
};

// Delete a project
projectServices.delete = async (
  params: { id: number }
): Promise<DeleteProjectResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/projectManagement/project/${params.id}/delete`
  );
  return data;
};

export default projectServices;
export type {
  AddProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  PaginatedProjectResponse,
};
