import React from 'react';
import { Typography, Table, TableHead, TableBody, TableCell, TableRow, Grid } from '@mui/material';
import { readableDate } from 'app/helpers/input-sanitization-helpers';

function DispatchReportOnScreen({ organization, dispatchReport }) {
  const mainColor = organization.settings?.main_color || "#2113AD";
  const lightColor = organization.settings?.light_color || "#bec5da";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF"

  const groupedDispatchedItems = dispatchReport.items.reduce((acc, item) => {
    item.dispatched_items.forEach((dispatchedItem) => {
      const key = dispatchedItem.deliveryNo;
      if (!acc[key]) {
        acc[key] = {
          deliveryNo: key,
          dispatch_date: dispatchedItem.dispatch_date,
          products: [],
        };
      }
      acc[key].products.push({
        ...dispatchedItem,
        productId: item.id,
        measurement_unit: item.measurement_unit,
      });
    });
    return acc;
  }, {});

  const dispatchedItem = Object.values(groupedDispatchedItems);

  return (
    <div>
        <Grid container spacing={2} style={{ marginTop: 5, marginBottom: 10 }}>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Typography variant="h4" color={mainColor}>SALES DISPATCH REPORT</Typography>
                <Typography variant="subtitle1" fontWeight="bold">{dispatchReport.saleNo}</Typography>
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
                    {dispatchedItem.map(item => (
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText, borderRight: 0.1}} key={item.deliveryNo}>{`${item.deliveryNo} (${readableDate(item.dispatch_date)})`}</TableCell>
                    ))}
                    <TableCell sx={{backgroundColor: mainColor, color: contrastText}}>{`Balance (${readableDate()})`}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {dispatchReport.items.map((item, index) => {
                    const totalDispatchedQuantity = dispatchedItem.reduce((total, dispatchedItem) => {
                    const product = dispatchedItem.products.find(p => p.productId === item.id);
                    return total + (product ? product.quantity : 0);
                    }, 0);

                    const undispatchedQuantity = item.quantity - totalDispatchedQuantity;

                    return (
                    <TableRow key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.measurement_unit.symbol}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        {dispatchedItem.map(dispatchedItem => {
                        const product = dispatchedItem.products.find(p => p.productId === item.id);
                        return (
                            <TableCell key={dispatchedItem.deliveryNo} align="right">
                            {product ? Math.floor(product.quantity) : 0}
                            </TableCell>
                        );
                        })}
                        <TableCell align="right">{undispatchedQuantity || 0}</TableCell>
                    </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  );
}

export default DispatchReportOnScreen;
