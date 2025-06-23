import React from 'react';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { readableDate } from '@/app/helpers/input-sanitization-helpers';

function InventoryConsumptionsOnScreen({ inventoryConsumption, authObject }) {
  const {authOrganization: {organization}} = authObject;
  const mainColor = organization.settings?.main_color || "#2113AD";
  const contrastText = organization.settings?.contrast_text || "#FFFFFF";
  const lightColor = organization.settings?.light_color || "#bec5da";

  const transformedItems = inventoryConsumption.items.map((item, index) => {
    const journal = inventoryConsumption.journals[index];
    return {
      ...item,
      ledger: journal?.debit_ledger ,
    };
  });

  return (
    <div>
      <Grid container spacing={2} marginBottom={2} paddingTop={2}>
        <Grid size={12} textAlign="center">
          <Typography variant="h4" color={mainColor}>INVENTORY CONSUMPTION</Typography>
          <Typography variant="subtitle1" fontWeight="bold">{inventoryConsumption.consumptionNo}</Typography>
          {inventoryConsumption.reference && <Typography variant="body2">Ref: {inventoryConsumption.reference}</Typography>}
        </Grid>
      </Grid>

      <Grid container spacing={1} marginBottom={2}>
        <Grid size={6}>
          <Typography variant="body2" color={mainColor}>Consumption Date:</Typography>
          <Typography variant="body2">{readableDate(inventoryConsumption.consumption_date)}</Typography>
        </Grid>
        <Grid size={6}>
            <Typography variant="body2" color={mainColor}>Cost Center:</Typography>
            <Typography variant="body2">{inventoryConsumption.cost_center.name}</Typography>
        </Grid>
      </Grid>

      {(
        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>S/N</TableCell>
                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Product</TableCell>
                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Expense Ledger</TableCell>
                <TableCell style={{backgroundColor: mainColor, color: contrastText}}>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transformedItems.map((item, index) => (
                <TableRow key={index} sx={{backgroundColor: index % 2 === 0 ? '#FFFFFF' : lightColor}}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                      <div>
                          {item.product.name}
                      </div>
                      {item.description && (
                        <div>
                            {`(${item.description})`}
                        </div>
                      )}
                  </TableCell>
                  <TableCell>{item.ledger.name}</TableCell>
                  <TableCell align="right">{item.quantity.toLocaleString()} {item.measurement_unit.symbol}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default InventoryConsumptionsOnScreen;
