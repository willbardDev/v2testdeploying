import { Currency } from "../../masters/Currencies/CurrencyType";
import { StakeholderType } from "../../masters/stakeholders/StakeholderType";

interface DebitLedger {
  id: number;
  name: string;
  ledger_group_id: number;
}

export interface SalesOrder {
  id: number;
  transaction_date: string | Date;
  saleNo: string;
  reference: string | null;
  amount: number;
  created_at: string;
  currency: Currency;
  debit_ledger: DebitLedger;
  exchange_rate: number;
  has_receipts: boolean;
  is_fully_paid: boolean;
  is_instant_sale: boolean;
  is_invoiceable: boolean;
  is_invoiced: boolean;
  is_receiptable: boolean;
  payment_method: string;
  receiptable_amount: number;
  remarks: string | null;
  sales_person: string;
  stakeholder: StakeholderType;
  status: string;
  vat_amount: number;
  vat_percentage: number;
  vfd_receipt: null;
}
