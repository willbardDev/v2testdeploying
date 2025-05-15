import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as TablePaper } from '@mui/material';

const DebtorCreditorOnScreen = ({ reportData, authOrganization, user }) => {
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";

    return reportData ? (
        <Box sx={{ marginTop: 3 }}>
          <TableContainer component={TablePaper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ backgroundColor: mainColor, color: contrastText }}>S/N</TableCell>
                        <TableCell style={{ backgroundColor: mainColor, color: contrastText }}>Name</TableCell>
                        <TableCell style={{ backgroundColor: mainColor, color: contrastText }} align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(reportData.debtors || reportData.creditors).map((data, index) => (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell align="right">
                                {data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2} align="center" style={{ backgroundColor: mainColor, color: contrastText }}>
                            Total
                        </TableCell>
                        <TableCell align="right" style={{ backgroundColor: mainColor, color: contrastText }}>
                            {(Object.values(reportData.debtors || reportData.creditors).reduce((total, item) => total + item.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </TableContainer>
        </Box>
    ) : null;
};

export default DebtorCreditorOnScreen;
