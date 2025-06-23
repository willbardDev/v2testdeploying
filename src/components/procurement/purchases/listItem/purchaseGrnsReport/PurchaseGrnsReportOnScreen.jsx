import React from 'react';
import { Typography, Table, TableHead, TableBody, TableCell, TableRow, Grid } from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

function PurchaseGrnsReportOnScreen({ organization, purchaseGrnsReport }) {
  const mainColor = organization.settings?.main_color || "#2113AD";
  const lightColor = organization.settings?.light_color || "#bec5da";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF"

  const groupedGrnsItems = purchaseGrnsReport.purchase_order_items.reduce((acc, item) => {
    item.received_items.forEach((receivedItems) => {
      const key = receivedItems.grnNo;
      if (!acc[key]) {
        acc[key] = {
          grnNo: key,
          date_received: receivedItems.date_received,
          products: [],
        };
      }
      acc[key].products.push({
        ...receivedItems,
        productId: item.id,
        measurement_unit: item.measurement_unit,
      });
    });
    return acc;
  }, {});

  const receivedItems = Object.values(groupedGrnsItems);

  return (
    <div>
        <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
            <Grid size={12} style={{ textAlign: 'center' }}>
                <Typography variant="h4" color={mainColor}>PURCHASE ORDER GRNS REPORT</Typography>
                <Typography variant="subtitle1" fontWeight="bold">{purchaseGrnsReport.orderNo}</Typography>
                <Typography variant="body2">{`As at: ${readableDate(undefined, true)}`}</Typography>
            </Grid>
        </Grid>

        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1}}>S/N</TableCell>
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1, textAlign: 'center'}}>Products</TableCell>
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1}}>Unit</TableCell>
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1}}>Ordered</TableCell>
                    {receivedItems.map(item => (
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1}} key={item.grnNo}>{`${item.grnNo} (${readableDate(item.date_received)})`}</TableCell>
                    ))}
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>{`Pending (${readableDate()})`}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {purchaseGrnsReport.purchase_order_items.map((item, index) => {
                    const totalReceivedQuantity = receivedItems.reduce((total, receivedItems) => {
                    const product = receivedItems.products.find(p => p.productId === item.id);
                    return total + (product ? product.quantity : 0);
                    }, 0);

                    const unReceivedQuantity = item.quantity - totalReceivedQuantity;

                    return (
                    <TableRow key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.measurement_unit.symbol}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        {receivedItems.map(receivedItems => {
                        const product = receivedItems.products.find(p => p.productId === item.id);
                        return (
                            <TableCell key={receivedItems.grnNo} align="right">
                            {product ? product.quantity.toLocaleString('en-US',{maximumFractionDigits:3,minimumFractionDigits:3}) : 0}
                            </TableCell>
                        );
                        })}
                        <TableCell align="right">{unReceivedQuantity.toLocaleString('en-US',{maximumFractionDigits:3,minimumFractionDigits:3}) || 0}</TableCell>
                    </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  );
}

export default PurchaseGrnsReportOnScreen;
