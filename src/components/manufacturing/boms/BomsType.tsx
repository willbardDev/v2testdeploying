import { Product } from "@/components/productAndServices/products/ProductType";

export interface BOM {
  id: number;
  product_id: number;
  quantity: number;

  product?: {
    id: number;
    name: string;
  };

  items: BOMItem[];
}

export interface BOMItem {
  product_id: number;
  product?: Product;
  quantity: number;
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
