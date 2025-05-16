interface CostCenterable {
  id: number;
  name: string;
  address?: string | null;
  status: string;
  type: string;
}

export interface CostCenter {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  status: string;
  type: string;
  created_by?: number;
  cost_centerable_id?: number;
  cost_centerable?: CostCenterable;
}