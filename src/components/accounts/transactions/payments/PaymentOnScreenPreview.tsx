import React from 'react';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import { AuthObject } from '@/types/auth-types';
import { CostCenter } from '@/components/masters/costCenters/CostCenterType';
import { Currency } from '@/components/masters/Currencies/CurrencyType';

interface TransactionItem {
  debitLedgerName: string;
  description: string;
  amount: number;
}

interface Transaction {
  voucherNo: string;
  reference?: string;
  transactionDate: string;
  creditLedgerName: string;
  cost_centers: CostCenter[];
  requisitionNo?: string;
  items: TransactionItem[];
  narration: string;
  creator?: {
    name: string
  };
  currency: Currency;
}

interface PaymentOnScreenPreviewProps {
  transaction: Transaction;
  authObject: AuthObject;
}

const PaymentOnScreenPreview: React.FC<PaymentOnScreenPreviewProps> = ({ 
  transaction, 
  authObject 
}) => {
  const currencyCode = transaction.currency.code;
  const { authOrganization: { organization } } = authObject;
  const mainColor = organization.settings?.main_color || "#2113AD";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF";
  const lightColor = organization.settings?.light_color || "#bec5da";

  return (
    <div>
      <Grid container spacing={2} marginBottom={2} paddingTop={2}>
        <Grid size={12} textAlign="center">
          <Typography variant="h4" color={mainColor}>PAYMENT VOUCHER</Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {transaction.voucherNo}
          </Typography>
          {transaction.reference && (
            <Typography variant="body2">Ref: {transaction.reference}</Typography>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} marginBottom={2}>
        <Grid size={{xs: 6, md: 4}}>
          <Typography variant="body2" color={mainColor}>Transaction Date:</Typography>
          <Typography variant="body2">
            {readableDate(transaction.transactionDate)}
          </Typography>
        </Grid>
        <Grid size={{xs: 6, md: 4}}>
          <Typography variant="body2" color={mainColor}>From (Credit):</Typography>
          <Typography variant="body2">{transaction.creditLedgerName}</Typography>
        </Grid>
        {transaction.cost_centers.length > 0 && (
          <Grid size={{xs: 6, md: 4}}>
            <Typography variant="body2" color={mainColor}>Cost Center:</Typography>
            <Typography variant="body2">
              {transaction.cost_centers.map(cc => cc.name).join(', ')}
            </Typography>
          </Grid>
        )}
        {transaction.requisitionNo && (
          <Grid size={{xs: 6, md: 4}}>
            <Typography variant="body2" color={mainColor}>Reference</Typography>
            <Typography variant="body2">{transaction.requisitionNo}</Typography>
          </Grid>
        )}
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: mainColor, color: contrastText }}>
                S/N
              </TableCell>
              <TableCell style={{ backgroundColor: mainColor, color: contrastText }}>
                Account Paid (Debit)
              </TableCell>
              <TableCell style={{ backgroundColor: mainColor, color: contrastText }}>
                Description
              </TableCell>
              <TableCell 
                style={{ backgroundColor: mainColor, color: contrastText }} 
                align="right"
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.items.map((item, index) => (
              <TableRow 
                key={index} 
                sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.debitLedgerName}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Grid container paddingTop={5}>
        <Grid size={4}>
          <Typography variant="body2">TOTAL</Typography>
        </Grid>
        <Grid size={8} style={{ textAlign: 'right' }}>
          <Typography variant="body2" fontWeight="bold">
            {transaction.items
              .reduce((total, item) => total + item.amount, 0)
              .toLocaleString("en-US", { 
                style: "currency", 
                currency: currencyCode 
              })}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default PaymentOnScreenPreview;