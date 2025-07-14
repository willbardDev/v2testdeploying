import React from 'react';


export type projectCategory = {
  id: number;
  name: string;
  description: string;
}
export type AddprojectCategoryResponse = {
  message: string;
  data?: projectCategory;
}
export type UpdateprojectCategoryResponse = {
  message: string;
  data?: projectCategory;
}
export type DeleteprojectCategoryResponse = {
  message: string;
}
export type PaginatedprojectCategoryResponse = {
  data: projectCategory[];
  current_page: number;
  total: number;
  last_page: number;
} 