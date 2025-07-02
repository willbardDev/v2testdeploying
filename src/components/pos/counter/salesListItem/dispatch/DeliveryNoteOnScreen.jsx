import React from 'react';
import { Grid, Typography, Paper, Box, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

function DeliveryNoteOnScreen({ delivery, organization }) {
    const mainColor = organization.settings?.main_color || "#2113AD";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";
    const lightColor = organization.settings?.light_color || "#bec5da";

  return (
    <Box style={{ padding: 5 }}>
        <Grid container spacing={1}>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Typography variant="h4" color={mainColor}>DELIVERY NOTE</Typography>
                    <Typography variant="subtitle1">{delivery.deliveryNo}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Dispatch Date:</Typography>
                    <Typography variant="body2">{readableDate(delivery.dispatch_date)}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Dispatched By:</Typography>
                    <Typography variant="body2">{delivery.creator.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Dispatch From:</Typography>
                    <Typography variant="body2">{delivery.dispatch_from}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Destination:</Typography>
                    <Typography variant="body2">{delivery.destination}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={1} marginTop={2}>
                <Grid item xs={12} textAlign="center">
                    <Typography variant="body2" color={mainColor} style={{ padding: '5px' }}>To</Typography>
                    <Divider/>
                    <Typography variant="body1">{delivery.sale.stakeholder.name}</Typography>
                    {delivery.sale.stakeholder?.address && <Typography variant="body2">{delivery.sale.stakeholder.address}</Typography>}
                    {delivery.sale.stakeholder?.tin && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">TIN:</Typography>
                            <Typography variant="body2">{delivery.sale.stakeholder.tin}</Typography>
                        </Grid>
                    )}
                    {delivery.sale.stakeholder?.vrn && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">VRN:</Typography>
                            <Typography variant="body2">{delivery.sale.stakeholder.vrn}</Typography>
                        </Grid>
                    )}
                    {delivery.sale.stakeholder?.phone && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">Phone:</Typography>
                            <Typography variant="body2">{delivery.sale.stakeholder.phone}</Typography>
                        </Grid>
                    )}
                    {delivery.sale.stakeholder?.email && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">Email:</Typography>
                            <Typography variant="body2">{delivery.sale.stakeholder.email}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Product/Service</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Unit</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Quantity</TableCell>
                                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Store</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {delivery.items.map((deliveryItem, index) => (
                                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{deliveryItem.product.name}</TableCell>
                                    <TableCell>{deliveryItem.sale_item.measurement_unit?.symbol}</TableCell>
                                    <TableCell align="right">{deliveryItem.quantity}</TableCell>
                                    <TableCell>{deliveryItem.store.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            <Grid item xs={12} container spacing={2}>
                {delivery.vehicle_information && (
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" style={{ color: mainColor }}>Vehicle Information</Typography>
                        <Typography variant="body2">{delivery.vehicle_information}</Typography>
                    </Grid>
                )}
                {delivery.driver_information && (
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" style={{ color: mainColor }}>Driver Information</Typography>
                        <Typography variant="body2">{delivery.driver_information}</Typography>
                    </Grid>
                )}
                {delivery.remarks && (
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" style={{ color: mainColor }}>Remarks</Typography>
                        <Typography variant="body2">{delivery.remarks}</Typography>
                    </Grid>
                )}
            </Grid>
        </Grid>
    </Box>
  );
}

export default DeliveryNoteOnScreen;
