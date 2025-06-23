import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

function InventoryTransferTrnOnScreen({ trn, organization }) {
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";
    
    return (
        <div>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Grid size={12} textAlign="center">
                    <Typography variant="h4" sx={{ color: mainColor }}>TRN</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{trn.trnNo}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={4}>
                    <Typography variant="subtitle2" sx={{ color: mainColor }}>Transfer No</Typography>
                    <Typography>{trn.transfer.transferNo}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="subtitle2" sx={{ color: mainColor }}>Date Received</Typography>
                    <Typography>{readableDate(trn.date_received)}</Typography>
                </Grid>
                <Grid size={4}>
                    <Typography variant="subtitle2" sx={{ color: mainColor }}>Received by</Typography>
                    <Typography>{trn.creator.name}</Typography>
                </Grid>
            </Grid>

            <Paper elevation={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                            <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Product</TableCell>
                            <TableCell sx={{backgroundColor: mainColor, color: contrastText}} align="right">Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trn.items.map((item, index) => (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell align="right">{item.quantity} {item.measurement_unit?.symbol}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Grid container sx={{ mt: 3 }}>
                <Grid size={12}>
                    <Typography variant="subtitle2" sx={{ color: mainColor }}>Remarks</Typography>
                    <Typography>{trn.remarks}</Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export default InventoryTransferTrnOnScreen;
