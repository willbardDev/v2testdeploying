import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as TablePaper } from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

const ItemMovementOnScreen = ({ movementsData, authObject }) => {
    const { authOrganization } = authObject;
    const mainColor = authOrganization.organization.settings?.main_color || "#2113AD";
    const contrastText = authOrganization.organization.settings?.contrast_text || "#FFFFFF";
    const lightColor = authOrganization.organization.settings?.light_color || "#bec5da";
    
    let cumulativeBalance = 0;
    const { movements } = movementsData;

    const cellStyle = {
        padding: '16px 24px',  
        minWidth: 150         
    };

    return (
        <TableContainer component={TablePaper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }}>Date</TableCell>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }}>Description</TableCell>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }}>Reference</TableCell>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }} align="right">In</TableCell>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }} align="right">Out</TableCell>
                        <TableCell style={{ ...cellStyle, backgroundColor: mainColor, color: contrastText }} align="right">Balance</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.map((movement, index) => {
                        const balance = movement.quantity_in - movement.quantity_out;
                        cumulativeBalance += balance;
                        return (
                            <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                <TableCell style={cellStyle}>{readableDate(movement.movement_date)}</TableCell>
                                <TableCell style={cellStyle}>{movement.description}</TableCell>
                                <TableCell style={cellStyle}>{movement.reference}</TableCell>
                                <TableCell style={cellStyle} align="right">{movement.quantity_in !== 0 && movement.quantity_in.toLocaleString('en-US', { maximumFractionDigits: 5 })}</TableCell>
                                <TableCell style={cellStyle} align="right">{movement.quantity_out !== 0 && movement.quantity_out.toLocaleString('en-US', { maximumFractionDigits: 5 })}</TableCell>
                                <TableCell style={cellStyle} align="right">{cumulativeBalance.toLocaleString('en-US', { maximumFractionDigits: 5 })}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ItemMovementOnScreen;
