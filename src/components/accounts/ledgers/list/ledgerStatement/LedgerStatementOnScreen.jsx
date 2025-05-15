import React from 'react';
import { Typography, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

const LedgerStatementOnScreen = ({ transactionsData, authOrganization, ledger }) => {
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";

    const totalCredits = transactionsData.transactions.reduce((total, transaction) => total + transaction.credit, 0);
    const totalDebits = transactionsData.transactions.reduce((total, transaction) => total + transaction.debit, 0);
    let cumulativeBalance = 0;

    // Function to format balance and handle -0.00 case
    const formatBalance = (balance) => {
        const formatted = balance.toLocaleString('en-US', { 
            maximumFractionDigits: 2, 
            minimumFractionDigits: 2 
        });
        return formatted === "-0.00" ? "0.00" : formatted;
    };

    return transactionsData ? (
        <Box>
            {/* Summary Section */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" style={{ color: mainColor }}>Total Credits</Typography>
                    <Typography variant="body2">{totalCredits.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" style={{ color: mainColor }}>Total Debits</Typography>
                    <Typography variant="body2">{totalDebits.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                </Grid>
            </Grid>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Date</TableCell>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Reference</TableCell>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Description</TableCell>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Debit</TableCell>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Credit</TableCell>
                        <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Balance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactionsData.transactions.map((transaction, index) => {
                        cumulativeBalance +=
                            ledger?.increasesWith === 'DR'
                                ? transaction.debit - transaction.credit
                                : transaction.credit - transaction.debit;

                        return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                <TableCell>{readableDate(transaction.transactionDate)}</TableCell>
                                <TableCell>{transaction.voucherNo || ''} {transaction.reference || ''}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell align="right">
                                    {transaction.debit !== 0 && formatBalance(transaction.debit)}
                                </TableCell>
                                <TableCell align="right">
                                    {transaction.credit !== 0 && formatBalance(transaction.credit)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatBalance(cumulativeBalance)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    ) : null;
};

export default LedgerStatementOnScreen;