import React from 'react';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { AuthOrganization } from '@/types/auth-types';

interface CollectionDistribution {
  name: string;
  amount: number;
}

interface CreditSale {
  name: string;
  credit_amount?: number;
  debit_amount?: number;
  balance: number;
}

interface Payment {
  paid: string;
  from: string;
  amount: number;
}

interface ReportData {
  revenue: number;
  collection_distribution: CollectionDistribution[];
  credit_sales: CreditSale[];
  payments: Payment[];
}

interface SalesAndCashSummaryOnScreenProps {
  reportData: ReportData;
  authOrganization: AuthOrganization;
}

const SalesAndCashSummaryOnScreen: React.FC<SalesAndCashSummaryOnScreenProps> = ({ 
  reportData, 
  authOrganization 
}) => {
  const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
  const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
  const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";

  // Calculate totals
  const totalCollectedAmount = reportData.collection_distribution.reduce(
    (acc, cd) => acc + (cd.amount || 0), 
    0
  );
  const totalCreditAmount = reportData.credit_sales.reduce(
    (acc, creditSale) => acc + (creditSale.credit_amount || 0), 
    0
  );
  const totalDebitAmount = reportData.credit_sales.reduce(
    (acc, creditSale) => acc + (creditSale.debit_amount || 0), 
    0
  );
  const totalBalance = reportData.credit_sales.reduce(
    (acc, creditSale) => acc + (creditSale.balance || 0), 
    0
  );
  const totalPaymentsAmount = reportData.payments.reduce(
    (acc, payment) => acc + (payment.amount || 0), 
    0
  );

  return (
    <div>
      {/* Sales Section */}
      <Typography variant="h5" sx={{ padding: 1, textAlign: 'right', marginTop: 2 }}>
        <span style={{ color: mainColor }}>Sales:</span>{" "}
        {reportData.revenue.toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
      </Typography>

      {/* Payments Collected Section */}
      {reportData.collection_distribution.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: mainColor,
              color: contrastText,
              padding: 1,
              textAlign: "center",
              marginTop: 2,
            }}
          >
            Payments Collected
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {reportData.collection_distribution.map((cd, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : lightColor,
                    }}
                  >
                    <TableCell>{cd.name}</TableCell>
                    <TableCell align="right">
                      {cd.amount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {totalCollectedAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Credits and Received Payments Section */}
      {reportData.credit_sales.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: mainColor,
              color: contrastText,
              padding: 1,
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Credits and Received Payments
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Paid</TableCell>
                  <TableCell align="right">Purchase</TableCell>
                  <TableCell align="right">Payment</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.credit_sales.map((creditSale, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : lightColor,
                    }}
                  >
                    <TableCell>{creditSale.name}</TableCell>
                    <TableCell align="right">
                      {creditSale.debit_amount
                        ? creditSale.debit_amount.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {creditSale.credit_amount
                        ? creditSale.credit_amount.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {creditSale.balance.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {totalDebitAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {totalCreditAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {totalBalance.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Payments Section */}
      {reportData.payments.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{
              backgroundColor: mainColor,
              color: contrastText,
              padding: 1,
              textAlign: "center",
              marginTop: 3,
            }}
          >
            Payments
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Paid</TableCell>
                  <TableCell align="left">Paid From</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.payments.map((payment, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : lightColor,
                    }}
                  >
                    <TableCell>{payment.paid}</TableCell>
                    <TableCell align="left">{payment.from}</TableCell>
                    <TableCell align="right">
                      {payment.amount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <strong>
                      {totalPaymentsAmount.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default SalesAndCashSummaryOnScreen;