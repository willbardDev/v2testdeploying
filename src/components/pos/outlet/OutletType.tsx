import UsersSelector from "@/components/sharedComponents/UsersSelector";

/** Allowed outlet types */
export type OutletType = 'shop' | 'work center';

/** Option list for dropdowns/autocomplete (UI components) */
export const outletTypeOptions: { value: OutletType; name: string }[] = [
  { value: 'shop', name: 'Shop' },
  { value: 'work center', name: 'Work Center' },
];

/** Label map for rendering labels in UI (e.g., Chip, Text) */
export const outletTypeLabels: Record<OutletType, string> = {
  shop: 'Shop',
  'work center': 'Work Center',
};

/** Store structure used in outlet */

export interface Counter {
  name: string;
  ledger_ids: number[];
}

export interface Store {
  id: number;
  name: string;
  children?: any;
}

export interface user_ids {
  id: number;
  name: string;
}


export interface Outlet {
  id?: number;
  name: string;
  address?: string;
  type?: string;
  user_ids: number[];
  stores: Store[];
  counters: Counter[];
}

export interface AddOutletResponse {
  message: string;
  data?: any; // au structure ya data 
}
export interface DeleteOutletResponse {
  message: string;
}
export interface UpdateOutletResponse {
  message: string;
  data?: Outlet; // au structure ya data 
}
export interface PaginatedOutletResponse {
  data: Outlet[];
  current_page: number;
  total: number;
  last_page: number;
}
export interface OutletOption {
  id: number;
  name: string;
  type: OutletType;
}
