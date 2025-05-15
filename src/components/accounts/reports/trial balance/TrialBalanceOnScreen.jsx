import { Grid, Typography, Divider, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

const TrialBalanceOnScreen = ({ reportData, authOrganization, user }) => {
  if (!reportData) return null;

  const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
  const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
  const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";

  return (
    <div>
      <Divider style={{ margin: '20px 0' }} />

      {/* Cost Centers and Printed Information */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" style={{ color: mainColor }}>
            Printed On
          </Typography>
          <Typography variant="body2">
            {readableDate(undefined, true)}
          </Typography>
        </Grid>
      </Grid>


      {/* Ledger Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
              <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Ledger Name</TableCell>
              <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right' }}>Debit</TableCell>
              <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right' }}>Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.ledgers
              .filter((ledger) => ledger.balance.amount !== 0)
              .map((ledger, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{ledger.name}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {ledger.balance.side === 'DR' &&
                      ledger.balance.amount.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {ledger.balance.side === 'CR' &&
                      ledger.balance.amount.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                  </TableCell>
                </TableRow>
              ))}
            {/* Total Row */}
            <TableRow>
              <TableCell colSpan={2} sx={{backgroundColor: mainColor, color: contrastText}}>TOTAL</TableCell>
              <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right' }}>
                {reportData.ledgers
                  .filter((ledger) => ledger.balance.side === 'DR')
                  .reduce((totalDebits, ledger) => totalDebits + ledger.balance.amount, 0)
                  .toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
              </TableCell>
              <TableCell sx={{ backgroundColor: mainColor, color: contrastText, textAlign: 'right' }}>
                {reportData.ledgers
                  .filter((ledger) => ledger.balance.side === 'CR')
                  .reduce((totalCredits, ledger) => totalCredits + ledger.balance.amount, 0)
                  .toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TrialBalanceOnScreen;
