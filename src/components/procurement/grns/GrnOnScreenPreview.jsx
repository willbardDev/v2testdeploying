import React from 'react';
import { Grid, Typography, Divider, Box, Tooltip } from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';
import { PERMISSIONS } from 'app/utils/constants/permissions';

function GrnOnScreenPreview({ grn, baseCurrency, checkOrganizationPermission, organization }) {
    const currencySymbol = grn.currency.symbol;
    const base_Currency = baseCurrency.symbol;
    const mainColor = organization.settings?.main_color || "#2113AD";
    const displayAmounts = checkOrganizationPermission([PERMISSIONS.ACCOUNTS_REPORTS]);;

    const exchangeRate = grn.exchange_rate;
    const costFactor = grn.cost_factor;

    let totalAmountBaseCurrency = 0;
    grn.items.forEach((grnItem) => {
        totalAmountBaseCurrency += (costFactor * grnItem.rate * exchangeRate * grnItem.quantity);
    });

    let totalAmount = 0;
    grn.items.forEach((grnItem) => {
        totalAmount += (grnItem.rate * grnItem.quantity);
    });

    let totalAdditionalCosts = 0;
    grn.additional_costs.forEach((item) => {
        totalAdditionalCosts += (item.amount * item.exchange_rate);
    });

    return (
        <Box padding={1}>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Typography variant="h4" color={mainColor}>GOODS RECEIVED NOTE</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{grn.grnNo}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Date Received</Typography>
                    <Typography variant="body2">{readableDate(grn.date_received)}</Typography>
                </Grid>
                {grn?.reference && (
                    <Grid item xs={6}>
                        <Typography variant="body2" color={mainColor}>Reference</Typography>
                        <Typography variant="body2">{grn.reference}</Typography>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Currency</Typography>
                    <Typography variant="body2">{grn.currency.name}</Typography>
                </Grid>
                {grn?.currency.id > 1 && displayAmounts && (
                    <Grid item xs={6}>
                        <Typography variant="body2" color={mainColor}>Exchange Rate</Typography>
                        <Typography variant="body2">{exchangeRate}</Typography>
                    </Grid>
                )}
                {grn?.cost_factor > 1 && displayAmounts && (
                    <Grid item xs={6}>
                        <Typography variant="body2" color={mainColor}>Cost Factor</Typography>
                        <Typography variant="body2">{costFactor}</Typography>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Supplier</Typography>
                    <Typography variant="body2">{grn.order.stakeholder?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Receiving Store</Typography>
                    <Typography variant="body2">{grn.store.name}</Typography>
                </Grid>
                {grn?.cost_centers && (
                    <Grid item xs={6}>
                        <Typography variant="body2" color={mainColor}>Cost Center</Typography>
                        <Typography variant="body2">{grn.cost_centers.map((cc) => cc.name).join(', ')}</Typography>
                    </Grid>
                )}
                <Grid item xs={6}>
                    <Typography variant="body2" color={mainColor}>Received By</Typography>
                    <Typography variant="body2">{grn.creator?.name}</Typography>
                </Grid>
            </Grid>

            {/* Items Table */}
            <Grid container spacing={1} paddingTop={3}>
                <Grid item xs={12} textAlign={'center'}>
                    <Typography variant="h6" color={mainColor}>ITEMS</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Divider style={{ width: '100%', margin: '8px 0' }} />
                {grn.items.map((grnItem, index) => (
                    <Grid container key={index}>
                        <Grid item xs={1}><Typography variant="body2">{index + 1}.</Typography></Grid>
                        <Grid item xs={8} md={7}><Typography variant="body2">{grnItem.product.name}</Typography></Grid>
                        <Grid item xs={3} md={4} textAlign={'end'}><Typography variant="body2">{grnItem.quantity} {grnItem.measurement_unit?.symbol}</Typography></Grid>
                        {displayAmounts && (
                            <>
                                <Grid item xs={5} md={6}>
                                    <Tooltip title={`Unit Price`}>
                                        <Typography variant="body2" align="right">{currencySymbol} {grnItem.rate.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={7} md={6}>
                                    <Tooltip title={`Amount`}>
                                        <Typography variant="body2" align="right">{currencySymbol} {(grnItem.quantity * grnItem.rate).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                    </Tooltip>
                                </Grid>
                                {grn.additional_costs.length > 0 && (
                                    <>
                                        <Grid item xs={5}>
                                            <Tooltip title={`Cost Per Unit in ${base_Currency}`}>
                                                <Typography variant="body2" align="right">{base_Currency} {(costFactor * grnItem.rate * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Tooltip title={`Amount in ${base_Currency}`}>
                                                <Typography variant="body2" align="right">{base_Currency} {(costFactor * grnItem.rate * exchangeRate * grnItem.quantity).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                            </Tooltip>
                                        </Grid>
                                    </>
                                )}
                            </>
                        )}
                        <Divider style={{ width: '100%', margin: '8px 0' }} />
                    </Grid>
                ))}
                {
                    displayAmounts &&
                    <Grid container>
                        <Grid item xs={4}><Typography variant="body2">TOTAL</Typography></Grid>
                        <Grid item xs={8} style={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{currencySymbol} {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                        </Grid>
                    </Grid>
                }
            </Grid>

            {/* Additional Costs Title */}
            {displayAmounts && grn.additional_costs.length > 0 && (
                <Grid container spacing={1} paddingTop={5}>
                    <Grid item xs={12} textAlign={'center'}>
                        <Typography variant="h6" color={mainColor}>ADDITIONAL COSTS</Typography>
                    </Grid>
                </Grid>
            )}

            {/* Additional Costs Section */}
            {displayAmounts && grn.additional_costs.length > 0 && (
                <Grid container spacing={1} paddingTop={1}>
                    <Divider style={{ width: '100%', margin: '8px 0' }} />
                    {grn.additional_costs.map((item, index) => (
                        <Grid container key={index}>
                            <Grid item xs={7}><Typography variant="body2">{item.name}</Typography></Grid>
                            <Grid item xs={5}>  
                                <Tooltip title={`Amount in ${item.currency?.symbol}`}>
                                    <Typography variant="body2">{item.currency?.symbol} {item.amount?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                </Tooltip>
                                <Typography variant="body2">Exchange Rate: {item.exchange_rate}</Typography>
                            </Grid>
                            <Divider style={{ width: '100%', margin: '8px 0' }} />
                        </Grid>
                    ))}
                    {displayAmounts && (
                        <Grid container key="total-additional-costs">
                            <Grid item xs={8}>
                                <Typography variant="body2">TOTAL Additional Costs ({base_Currency})</Typography>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: 'right' }}>
                                <Tooltip title={`Total Additional Costs in ${base_Currency}`}>
                                    <Typography variant="body2" fontWeight="bold">{totalAdditionalCosts?.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Typography>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Totals Section */}
            {displayAmounts && (
                <Grid container spacing={1} paddingTop={3}>
                    <Divider style={{ width: '100%', margin: '8px 0' }} />
                    <Grid container>
                        <Grid item xs={8}><Typography variant="body2" fontWeight={'bold'}>Total Value of Goods ({base_Currency})</Typography></Grid>
                        <Grid item xs={4} style={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{totalAmountBaseCurrency?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {grn.remarks &&
                <Grid container spacing={2} style={{ marginTop: 20 }}>
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Typography variant="h4" color={mainColor}>Remarks</Typography>
                        <Typography variant="subtitle1">{grn.remarks}</Typography>
                    </Grid>
                </Grid>
            }
        </Box>
    );
}

export default GrnOnScreenPreview;
