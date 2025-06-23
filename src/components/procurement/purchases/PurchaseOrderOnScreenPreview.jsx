import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { useJumboAuth } from '@/app/providers/JumboAuthProvider';
import { PERMISSIONS } from '@/utilities/constants/permissions';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

function PurchaseOrderOnScreenPreview({ order }) {
    const currencyCode = order.currency.code;
    const {checkOrganizationPermission, authOrganization : {organization}} = useJumboAuth();
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";
    const withPrices = checkOrganizationPermission([PERMISSIONS.PURCHASES_CREATE,PERMISSIONS.ACCOUNTS_REPORTS]);

    const vatAmount = order.purchase_order_items.reduce((total, item) => {
        return total += item.rate * item.quantity * item.vat_percentage * 0.01;
    }, 0);

    return (
        <div>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid size={12} style={{ textAlign: 'center' }}>
                    <Typography variant="h4" color={mainColor}>PURCHASE ORDER</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{order.orderNo}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
                <Grid size={8}>
                    <Typography variant="body2" color={mainColor}>Order Date</Typography>
                    <Typography variant="body2">{readableDate(order.order_date)}</Typography>
                </Grid>
                {order?.date_required && (
                    <Grid size={4}>
                        <Typography variant="body2" color={mainColor}>Date Required</Typography>
                        <Typography variant="body2">{readableDate(order.date_required)}</Typography>
                    </Grid>
                )}
                {order?.cost_centers && (
                    <Grid size={8}>
                        <Typography variant="body2" color={mainColor}>Purchase For</Typography>
                        <Typography variant="body2">{order.cost_centers.map(cc => cc.name).join(',')}</Typography>
                    </Grid>
                )}
                <Grid size={8}>
                    <Typography variant="body2" color={mainColor}>Created By:</Typography>
                    <Typography variant="body2">{order?.creator.name}</Typography>
                </Grid>
                {(order?.reference || order?.requisitionNo) && (
                    <Grid size={4}>
                        <Typography variant="body2" color={mainColor}>Reference</Typography>
                        <Typography variant="body2">{order.reference}</Typography>
                        <Typography variant="body2">{order.requisitionNo}</Typography>
                    </Grid>
                )}
                {order?.currency_id > 1 && (
                    <Grid size={8}>
                        <Typography variant="body2" color={mainColor}>Exchange Rate</Typography>
                        <Typography variant="body2">{order.exchange_rate}</Typography>
                    </Grid>
                )}
            </Grid>

            <Grid container spacing={1} marginTop={2} marginBottom={3}>
                <Grid size={12} textAlign="center">
                    <Typography variant="body2" color={mainColor} style={{ padding: '5px' }}>SUPPLIER</Typography>
                    <Divider/>
                    <Typography variant="body1">{order.stakeholder.name}</Typography>
                    {order.stakeholder?.address && <Typography variant="body2">{order.stakeholder.address}</Typography>}
                    {order.stakeholder_id === null && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">Paid From:</Typography>
                            <Typography variant="body2">{order.paid_from.name}</Typography>
                        </Grid>
                    )}
                    {order.stakeholder?.tin && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">TIN:</Typography>
                            <Typography variant="body2">{order.stakeholder.tin}</Typography>
                        </Grid>
                    )}
                    {order.stakeholder?.vrn && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">VRN:</Typography>
                            <Typography variant="body2">{order.stakeholder.vrn}</Typography>
                        </Grid>
                    )}
                    {order.stakeholder?.phone && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">Phone:</Typography>
                            <Typography variant="body2">{order.stakeholder.phone}</Typography>
                        </Grid>
                    )}
                    {order.stakeholder?.email && (
                        <Grid container justifyContent="space-between">
                            <Typography variant="body2">Email:</Typography>
                            <Typography variant="body2">{order.stakeholder.email}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {
                <>
                    <Grid container spacing={1} paddingTop={2}>
                        <Grid size={12} textAlign={'center'}>
                            <Typography variant="h6" color={mainColor}>ITEMS</Typography>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Product/Service</TableCell>
                                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Unit</TableCell>
                                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Quantity</TableCell>
                                    {
                                        withPrices &&
                                        <>
                                            <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Price { vatAmount > 0 ? ' (Excl. )' : ''}</TableCell>
                                            {vatAmount > 0 &&
                                                <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>VAT</TableCell>
                                            }
                                            <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>Amount { vatAmount > 0 ? ' (Incl. )' : ''}</TableCell>
                                        </>
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.purchase_order_items.map((orderItem, index) => (
                                    <TableRow key={orderItem.id} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{orderItem.product.name}</TableCell>
                                        <TableCell>{orderItem.measurement_unit.symbol}</TableCell>
                                        <TableCell align="right">{orderItem.quantity}</TableCell>
                                        {
                                            withPrices &&
                                            <>
                                                <TableCell align="right">{orderItem.rate.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                                {vatAmount > 0 &&
                                                    <TableCell align="right">{(orderItem.rate * orderItem.vat_percentage*0.01).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                                }
                                                <TableCell align="right">{(orderItem.rate * orderItem.quantity * (1 + orderItem.vat_percentage*0.01)).toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2})}</TableCell>
                                            </>
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            {
                withPrices &&
                <>
                    <Grid container style={{ paddingTop: 15 }}>
                        <Grid size={7}>
                            <Typography variant="body2">Total</Typography>
                        </Grid>
                        <Grid size={5} style={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{order.amount.toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                        </Grid>
                    </Grid>
        
                    {vatAmount > 0 &&(
                        <>
                            <Grid container style={{ marginTop: 1 }}>
                                <Grid size={7}>
                                    <Typography variant="body2">VAT</Typography>
                                </Grid>
                                <Grid size={5} style={{ textAlign: 'right' }}>
                                    <Typography variant="body2" fontWeight="bold">{vatAmount.toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: 1 }}>
                                <Grid size={7}>
                                    <Typography variant="body2">Grand Total (VAT Incl.)</Typography>
                                </Grid>
                                <Grid size={5} style={{ textAlign: 'right' }}>
                                    <Typography variant="body2" fontWeight="bold">{(order.amount + vatAmount).toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </>
            }
        </div>
    );
}

export default PurchaseOrderOnScreenPreview;
