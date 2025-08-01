export interface BOM {
  id: number;
  product_id: number;
  quantity: number;
  measurement_unit_id: number;
  conversion_factor: number;

  product?: {
    id: number;
    name: string;
  };

  measurement_unit?: {
    id: number;
    name: string;
  };

  items: BOMItem[];
}

export interface BOMItem {
  product_id: number;
  measurement_unit_id: number;
  quantity: number;
  conversion_factor: number;

  product?: {
    id: number;
    name: string;
  };

  measurement_unit?: {
    id: number;
    name: string;
  };

  alternatives?: BOMAlternative[];
}

export interface BOMAlternative {
  product_id: number;
  measurement_unit_id: number;
  quantity: number;
  conversion_factor: number;

  product?: {
    id: number;
    name: string;
  };

  measurement_unit?: {
    id: number;
    name: string;
  };
}

// Used in forms and POST/PUT requests
export interface AddOrUpdateBOMRequest {
  product_id: number;
  quantity: number;
  measurement_unit_id: number;
  conversion_factor: number;
  items: BOMItemInput[];
}

export interface BOMItemInput {
  product_id: number;
  measurement_unit_id: number;
  quantity: number;
  conversion_factor: number;
  alternatives?: BOMAlternativeInput[];
}

export interface BOMAlternativeInput {
  product_id: number;
  measurement_unit_id: number;
  quantity: number;
  conversion_factor: number;
}

// Response types (optional if you want to type responses)
export interface AddBOMResponse {
  message: string;
  data: BOM;
}

export interface UpdateBOMResponse {
  message: string;
  data: BOM;
}

export interface DeleteBOMResponse {
  message: string;
}

export interface PaginatedBOMResponse {
  data: BOM[];
  total: number;
}
