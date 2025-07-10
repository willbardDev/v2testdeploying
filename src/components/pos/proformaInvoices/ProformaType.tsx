import { Currency } from "@/components/masters/Currencies/CurrencyType";
import { Stakeholder } from "@/components/masters/stakeholders/StakeholderType";

interface Creator {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Proforma {
  id: number;
  proformaNo: string;
  proforma_date: string;
  expiry_date: string;
  amount: number;
  vat_amount: number;
  vat_percentage: number;
  remarks: string | null;
  currency: Currency;
  creator: Creator;
  stakeholder: Stakeholder ;
  exchange_rate?: number;
}