
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
export interface Store {
  id: number;
  name: string;
  children: Store[];
}

/** Counter structure used in outlet */
export interface Counter {
  name: string;
  ledger_ids: number[];
}

/** Full Outlet structure for typing and forms */
export interface Outlet {
  id?: number; // optional if creating new
  name: string;
  address: string;
  type: OutletType;
  stores: Store[];
  user_ids: number[];
  counters: Counter[];
}
