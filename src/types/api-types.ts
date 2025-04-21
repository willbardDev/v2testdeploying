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
  }
  
  export interface User {
    id: string
    name: string
  }