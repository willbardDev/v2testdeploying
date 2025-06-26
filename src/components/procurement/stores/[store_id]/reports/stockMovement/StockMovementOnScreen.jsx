import React from 'react';
import { Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PERMISSIONS } from '@/utilities/constants/permissions';

const StockMovementOnScreen = ({ movementsData, authOrganization, checkOrganizationPermission }) => {
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";

    if (!movementsData) return null;

    const renderHeader = () => (
        <>
                {checkOrganizationPermission(PERMISSIONS.ACCOUNTS_REPORTS) && (
                    <Grid item xs={12} marginBottom={2}>
                        <Box>
                            <Typography variant="body2" style={{ color: mainColor }}>
                                Estimated Closing Value
                            </Typography>
                            <Typography variant="body2">
                                {movementsData.movements.reduce((total, movement) => total + movement.latest_rate*(
                                    parseFloat(movement.opening_balance)+parseFloat(movement.quantity_received)-parseFloat(movement.quantity_sold)-parseFloat(movement.quantity_consumed)-parseFloat(movement.quantity_transferred_out)+parseFloat(movement.quantity_transferred_in)+parseFloat(movement.stock_gain)-parseFloat(movement.stock_loss)
                                ), 0).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                )}
        </>
    );

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Product</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Unit</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Opening Balance</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Purchase Received</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Transfer In</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Transfer Out</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Stock Gain</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Stock Loss</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Consumed</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Sold</TableCell>
                        <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Closing Balance</TableCell>
                        {checkOrganizationPermission(PERMISSIONS.ACCOUNTS_REPORTS) && (
                            <>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Latest Rate</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}} align="right">Estimated Closing Value</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movementsData.movements.map((movement, index) => {
                        const closing_balance = Math.round((parseFloat(movement.opening_balance)+parseFloat(movement.quantity_received)-parseFloat(movement.quantity_sold)-parseFloat(movement.quantity_consumed)-parseFloat(movement.quantity_transferred_out)+parseFloat(movement.quantity_transferred_in)+parseFloat(movement.stock_gain)-parseFloat(movement.stock_loss))*10000)/10000;
    
                        return (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{movement.name}</TableCell>
                                <TableCell>{movement.unit_symbol}</TableCell>
                                <TableCell align="right">{parseFloat(movement.opening_balance).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.quantity_received).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.quantity_transferred_in).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.quantity_transferred_out).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.stock_gain).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.stock_loss).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.quantity_consumed).toLocaleString()}</TableCell>
                                <TableCell align="right">{parseFloat(movement.quantity_sold).toLocaleString()}</TableCell>
                                <TableCell align="right">{closing_balance.toLocaleString()}</TableCell>
                                {checkOrganizationPermission(PERMISSIONS.ACCOUNTS_REPORTS) && (
                                    <>
                                        <TableCell align="right">{parseFloat(movement.latest_rate).toLocaleString('en-US',{ minimumFractionsDigits: 2,maximumFractionDigits:2})}</TableCell>
                                        <TableCell align="right">{(closing_balance * parseFloat(movement.latest_rate)).toLocaleString('en-US',{ minimumFractionsDigits: 2,maximumFractionDigits:2})}</TableCell>
                                    </>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    ); 

    return (
        <div padding={2}>
            {renderHeader()}
            {renderTable()}
        </div>
    );
};

export default StockMovementOnScreen;
