// lib/types/api-types.ts
export interface PaginatedResponse<T> {
    data: T[]
    meta: {
      current_page: number
      per_page: number
      total: number
    }
  }
  
  export interface Organization {
    id: string
    name: string
    // other fields...
  }
  
  export interface User {
    id: string
    name: string
    // other fields...
  }