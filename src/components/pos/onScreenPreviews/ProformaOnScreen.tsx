import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';
import { MeasurementUnit } from '@/components/masters/measurementUnits/MeasurementUnitType';
import { Currency } from '@/components/masters/Currencies/CurrencyType';
import { Organization } from '@/types/auth-types';

interface Product {
  name: string;
  vat_exempted?: boolean;
}

interface ProformaItem {
  id: number;
  product: Product;
  measurement_unit: MeasurementUnit;
  quantity: number;
  rate: number;
}

interface Proforma {
  proformaNo: string;
  proforma_date: string;
  expiry_date?: string;
  items: ProformaItem[];
  amount: number;
  vat_amount: number;
  vat_percentage: number;
  currency: Currency;
  remarks?: string | null;
}

interface ProformaOnScreenProps {
  proforma: Proforma;
  organization: Organization;
}

function ProformaOnScreen({ proforma, organization }: ProformaOnScreenProps) {
    const currencyCode = proforma.currency?.code;
    const mainColor = organization.settings?.main_color || "#2113AD";
    const lightColor = organization.settings?.light_color || "#bec5da";
    const contrastText = organization.settings?.contrast_text || "#FFFFFF";

    return (
        <div>
            <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid size={{ xs: 12 }} style={{ textAlign: 'center' }}>
                    <Typography variant="h4" style={{ color: mainColor }}>PROFORMA INVOICE</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{proforma.proformaNo}</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
                <Grid size={{ xs: 8 }}>
                    <Typography variant="body2" style={{ color: mainColor }}>Proforma Date</Typography>
                    <Typography variant="body2">{readableDate(proforma.proforma_date)}</Typography>
                </Grid>
                {proforma?.expiry_date && (
                    <Grid size={{ xs: 4 }} textAlign={'center'}>
                        <Typography variant="body2" style={{ color: mainColor }}>Valid Until</Typography>
                        <Typography variant="body2">{readableDate(proforma.expiry_date)}</Typography>
                    </Grid>
                )}
            </Grid>

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>S/N</TableCell>
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Product/Service</TableCell>
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }}>Unit</TableCell>
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }} align="right">Quantity</TableCell>
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }} align="right">Price {proforma?.vat_percentage ? '(Excl.)' : ''}</TableCell>
                            {proforma?.vat_percentage > 0 && (
                                <TableCell sx={{ backgroundColor: mainColor, color: contrastText }} align="right">VAT</TableCell>
                            )}
                            <TableCell sx={{ backgroundColor: mainColor, color: contrastText }} align="right">Amount {proforma?.vat_percentage ? '(Incl.)' : ''}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proforma.items.map((proformaItem, index) => (
                            <TableRow key={proformaItem.id} sx={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{proformaItem.product.name}</TableCell>
                                <TableCell>{proformaItem.measurement_unit.symbol}</TableCell>
                                <TableCell align="right">{proformaItem.quantity}</TableCell>
                                <TableCell align="right">{proformaItem.rate.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</TableCell>
                                {proforma?.vat_percentage > 0 && (
                                    <TableCell align="right">
                                        {(!proformaItem.product?.vat_exempted
                                            ? (proforma.vat_percentage * proformaItem.rate * 0.01).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                                            : 0
                                        )}
                                    </TableCell>
                                )}
                                <TableCell align="right">
                                    {(proformaItem.quantity * proformaItem.rate * (!proformaItem.product?.vat_exempted ? (100 + proforma.vat_percentage) * 0.01 : 1))
                                        .toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container style={{ paddingTop: 50 }}>
                <Grid size={{ xs: 7 }}>
                    <Typography variant="body2">Total</Typography>
                </Grid>
                <Grid size={{ xs: 5 }} style={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight="bold">{proforma.amount.toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                </Grid>
            </Grid>

            {proforma.vat_percentage > 0 && (
                <>
                    <Grid container style={{ marginTop: 1 }}>
                        <Grid size={{ xs: 7 }}>
                            <Typography variant="body2">VAT</Typography>
                        </Grid>
                        <Grid size={{ xs: 5 }} style={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{proforma.vat_amount.toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: 1 }}>
                        <Grid size={{ xs: 7 }}>
                            <Typography variant="body2">Grand Total (VAT Incl.)</Typography>
                        </Grid>
                        <Grid size={{ xs: 5 }} style={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">{(proforma.amount + proforma.vat_amount).toLocaleString("en-US", { style: "currency", currency: currencyCode })}</Typography>
                        </Grid>
                    </Grid> 
                </>
            )}

            {proforma?.remarks && (
                <Grid container style={{ marginTop: 20 }}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" style={{ color: mainColor }}>Remarks</Typography>
                        <Typography variant="body2">{proforma.remarks}</Typography>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}

export default ProformaOnScreen;