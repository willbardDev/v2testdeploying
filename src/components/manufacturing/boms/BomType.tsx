import { Product } from "@/components/productAndServices/products/ProductType";

export interface MeasurementUnit {
  id: number;
  name: string;
  symbol: string ; 
  conversion_factor?: number;
}

export interface BOM {
  id: number;
  product?: Product | null;
  product_id: number | undefined;
  quantity: number;
  measurement_unit_id?: number | null;
  conversion_factor?: number | null;
  measurement_unit?: MeasurementUnit | null;
  symbol?: string | null;
  items: BOMItem[];
  alternatives?: BOMItem[];
}


export interface BomsFormValues {
  output_product_id?: number | null;
  output_quantity?: number | null;
  measurement_unit?: MeasurementUnit | null;
  unit_symbol:string | null;

  items: BomItem[];
  alternatives?: BOMItem[]
}

export interface BomAlternative {
  product_id?: number | undefined;
  quantity: number;
}

export interface BomItem {
  product_id?: number | undefined;
  quantity?: number;
  measurement_unit_id?: number;
  conversion_factor?: number;
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
  [x: string]: any;
  product_id: number | undefined;
  quantity: number | null;
  measurement_unit_id: number | null;
  measurement_unit?: MeasurementUnit | null;
  symbol:string | null;
  conversion_factor: number;
  alternatives?: BOMItem[]
}

export interface BOMPayload {
  product_id: number | undefined;
  quantity: number;
  measurement_unit?: MeasurementUnit | null;
  measurement_unit_id?: number | null;
  symbol:string | null;
  conversion_factor?: number | null;
  items: BOMItem[];
  alternatives?: BOMItem[]
}
