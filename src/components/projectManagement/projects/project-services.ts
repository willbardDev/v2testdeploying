import axios from '@/lib/services/config';
import {
  AddProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  PaginatedProjectResponse,
} from './ProjectTypes';

const projectsServices: any = {};

// Get paginated list of projects
projectsServices.getList = async (
  params: { keyword?: string; page?: number; limit?: number } = {}
): Promise<PaginatedProjectResponse> => {
  const { page = 1, limit = 10, ...queryParams } = params;
  const { data } = await axios.get('/api/projectManagement/project', {
    params: { page, limit, ...queryParams },
  });
  return data;
};

// ✅ Rename to `create`
projectsServices.create = async (project: {
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
projectsServices.update = async (
  project: { id: number; name: string; description?: string; category_id?: number; client_id?: number }
): Promise<UpdateProjectResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.put(`/api/projectManagement/project/${project.id}/update`,
    project
  );
  return data;
};

// Delete a project
projectsServices.delete = async (
  params: { id: number }
): Promise<DeleteProjectResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const { data } = await axios.delete(`/api/projectManagement/project/${params.id}/delete`
  );
  return data;
};

export default projectsServices;
export type {
  AddProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  PaginatedProjectResponse,
};
