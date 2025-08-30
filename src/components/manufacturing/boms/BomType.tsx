import { Product } from "@/components/productAndServices/products/ProductType";

export interface MeasurementUnit {
  id: number;
  name: string;
  symbol?: string | null; 
  conversion_factor?: number;
}

export interface BOM {
  id: number;
  product?: Product | null;
  product_id: number | null;
  quantity: number | null ;
  measurement_unit_id?: number | null;
  conversion_factor?: number | null;
  measurement_unit?: MeasurementUnit | null;
  symbol?: string | null ;
  items: BOMItem[];
  alternatives?: BOMItem[];
  bomNo?: string;
}

export interface BomFormValues {
  product_id?: number | null;
  quantity?: number | null;
  measurement_unit_id?: number | null;
  measurement_unit?: MeasurementUnit | null;
  symbol:string | null;
  conversion_factor: number;
  items: BOMItem[];
  alternatives?: BOMItem[];
}

export interface BomAlternative {
  product_id?: number | null;
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

export interface BOMItem {
  id?: number;
  product?: Product | null;
  bom_id?: number;
  product_id: number | null;
  quantity: number | null;
  measurement_unit_id: number | null;
  measurement_unit?: MeasurementUnit | null;
  symbol?:string | null;
  conversion_factor: number;
  alternatives?: BOMItem[];
}

export interface BOMPayload {
  id?:number;
  product_id: number | null;
  product?: Product | null;
  quantity: number |null;
  measurement_unit?: MeasurementUnit | null;
  measurement_unit_id?: number | null;
  symbol?:string | null;
  conversion_factor?: number | null;
  items: BOMItem[];
  alternatives?: BOMItem[]
  bomNo?: string;
}

