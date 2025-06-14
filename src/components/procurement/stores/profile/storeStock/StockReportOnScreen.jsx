import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as TablePaper } from '@mui/material';

const StockReportOnScreen = ({ stockData, authObject, hasPermissionToView}) => {
    const { authOrganization } = authObject;
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";

    //Total amount
    const totalAmount = stockData.reduce((total, stock) => total + (stock.latest_rate * stock.balance),0)

    return stockData ? (
        <Box sx={{ marginTop: 3 }}>
            {
                <TableContainer component={TablePaper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Product Name</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Unit</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Balance</TableCell>
                                { hasPermissionToView &&
                                    <>
                                        <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Latest Rate</TableCell>
                                        <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Amount</TableCell>
                                    </>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockData.map((stock, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor}}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{stock.name}</TableCell>
                                    <TableCell>{stock.measurement_unit.symbol}</TableCell>
                                    <TableCell align="right">{stock.balance.toLocaleString()}</TableCell>
                                    { hasPermissionToView &&
                                        <>
                                            <TableCell align="right">{stock.latest_rate.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                            <TableCell align="right">{(stock.balance * stock.latest_rate).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                        </>
                                    }
                                </TableRow>
                            ))}
                            {hasPermissionToView &&
                                <TableRow>
                                    <TableCell colSpan={5} align='center' style={{backgroundColor: mainColor, color: contrastText}}>Total</TableCell>
                                    <TableCell align="right" style={{backgroundColor: mainColor, color: contrastText}}>{totalAmount.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </Box>
    ) : null;
};

export default StockReportOnScreen;
